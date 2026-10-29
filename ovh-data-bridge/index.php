<?php
/**
 * Maison Calvé — OVH Database REST API Bridge
 * Connects the Next.js frontend / server with OVH MySQL database (uwenyoimaison)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

// Authenticate Request
function authenticate() {
    $apiKey = '';

    if (isset($_SERVER['HTTP_X_API_KEY'])) {
        $apiKey = trim($_SERVER['HTTP_X_API_KEY']);
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = trim($_SERVER['HTTP_AUTHORIZATION']);
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $apiKey = $matches[1];
        }
    } elseif (isset($_GET['key'])) {
        $apiKey = trim($_GET['key']);
    } elseif (isset($_POST['key'])) {
        $apiKey = trim($_POST['key']);
    }

    if ($apiKey !== API_SECRET_KEY) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error'   => 'Unauthorized: Invalid or missing API key.'
        ]);
        exit;
    }
}

// Format DB Row into TypeScript Lead Interface
function formatLeadRow($row) {
    if (!$row) return null;

    $notes = [];
    if (!empty($row['notes'])) {
        $decoded = json_decode($row['notes'], true);
        if (is_array($decoded)) {
            $notes = $decoded;
        }
    }

    return [
        'id'               => $row['id'],
        'name'             => $row['name'],
        'email'            => $row['email'],
        'phone'            => $row['phone'],
        'company'          => $row['company'] ?? '',
        'type'             => $row['type'],
        'officeSize'       => $row['office_size'] ?? '',
        'workstationCount' => isset($row['workstation_count']) ? (int)$row['workstation_count'] : 1,
        'openSpacePlan'    => $row['open_space_plan'] ?? null,
        'date'             => $row['date'] ?? '',
        'timeSlot'         => $row['time_slot'] ?? '',
        'attendees'        => isset($row['attendees']) && $row['attendees'] !== null ? (int)$row['attendees'] : null,
        'meetingPurpose'   => $row['meeting_purpose'] ?? '',
        'visitRequested'   => (bool)$row['visit_requested'],
        'source'           => $row['source'] ?? 'Website Space Enquiry',
        'status'           => $row['status'] ?? 'new',
        'priority'         => $row['priority'] ?? 'normal',
        'message'          => $row['message'] ?? '',
        'createdAt'        => $row['created_at'],
        'updatedAt'        => $row['updated_at'],
        'notes'            => $notes
    ];
}

// Compute CRM Metrics from Leads
function computeCrmStats($pdo) {
    $stmt = $pdo->query("SELECT status, visit_requested, source FROM `mc_leads`");
    $all = $stmt->fetchAll();

    $totalLeads = count($all);
    $newLeads = 0;
    $tourRequests = 0;
    $toursScheduled = 0;
    $visited = 0;
    $won = 0;

    foreach ($all as $item) {
        $st = $item['status'];
        $src = strtolower($item['source'] ?? '');
        $vr = (bool)$item['visit_requested'];

        if ($st === 'new') $newLeads++;
        if ($vr || strpos($src, 'tour') !== false || strpos($src, 'visit') !== false) $tourRequests++;
        if ($st === 'tour_scheduled') $toursScheduled++;
        if ($st === 'visited') $visited++;
        if ($st === 'won') $won++;
    }

    $conversionRate = $totalLeads > 0 ? (int)round(($won / $totalLeads) * 100) : 0;

    return [
        'totalLeads'     => $totalLeads,
        'newLeads'       => $newLeads,
        'tourRequests'   => $tourRequests,
        'toursScheduled' => $toursScheduled,
        'visited'        => $visited,
        'won'            => $won,
        'conversionRate' => $conversionRate,
        'activeOffices'  => '2 disponibles / 5 total',
        'clientRating'   => '4.9 / 5',
        'retentionRate'  => '98%'
    ];
}

// Initialize Connection and Ensure Schema Exists
$pdo = getDbConnection();
ensureTablesExist($pdo);

// Extract Action & Input
$action = $_GET['action'] ?? $_POST['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Parse JSON Body for POST/PATCH/PUT
$inputData = [];
$rawInput = file_get_contents('php://input');
if (!empty($rawInput)) {
    $decoded = json_decode($rawInput, true);
    if (is_array($decoded)) {
        $inputData = $decoded;
    }
}
if (empty($inputData) && !empty($_POST)) {
    $inputData = $_POST;
}

// If action is inside JSON body
if (empty($action) && isset($inputData['action'])) {
    $action = $inputData['action'];
}

// -------------------------------------------------------------
// Action 1: Health Check (No strict auth needed or optional for diagnostics)
// -------------------------------------------------------------
if ($action === 'health' || $action === 'ping') {
    $leadCountStmt = $pdo->query("SELECT COUNT(*) AS cnt FROM `mc_leads`");
    $leadCount = (int)$leadCountStmt->fetchColumn();

    $settingsCountStmt = $pdo->query("SELECT COUNT(*) AS cnt FROM `mc_settings`");
    $settingsCount = (int)$settingsCountStmt->fetchColumn();

    echo json_encode([
        'success'        => true,
        'status'         => 'healthy',
        'database'       => DB_NAME,
        'host'           => DB_HOST,
        'php_version'    => PHP_VERSION,
        'server_time'    => date('c'),
        'total_leads'    => $leadCount,
        'total_settings' => $settingsCount,
        'message'        => 'OVH MySQL Data Bridge is online and ready.'
    ]);
    exit;
}

// All other endpoints require authentication
authenticate();

// -------------------------------------------------------------
// Action 2: GET Leads (with Search, Filter, & Stats)
// -------------------------------------------------------------
if ($action === 'leads' && ($method === 'GET' || $method === 'POST')) {
    $search = strtolower(trim($_GET['q'] ?? $inputData['q'] ?? ''));
    $status = trim($_GET['status'] ?? $inputData['status'] ?? '');
    $type   = trim($_GET['type'] ?? $inputData['type'] ?? '');
    $source = trim($_GET['source'] ?? $inputData['source'] ?? '');

    $where = [];
    $params = [];

    if ($search !== '') {
        $where[] = "(LOWER(name) LIKE :s1 OR LOWER(email) LIKE :s2 OR phone LIKE :s3 OR LOWER(company) LIKE :s4 OR LOWER(message) LIKE :s5 OR LOWER(id) LIKE :s6)";
        $wildcard = "%{$search}%";
        $params[':s1'] = $wildcard;
        $params[':s2'] = $wildcard;
        $params[':s3'] = $wildcard;
        $params[':s4'] = $wildcard;
        $params[':s5'] = $wildcard;
        $params[':s6'] = $wildcard;
    }

    if ($status !== '' && $status !== 'all') {
        $where[] = "status = :st";
        $params[':st'] = $status;
    }

    if ($type !== '' && $type !== 'all') {
        $where[] = "type = :tp";
        $params[':tp'] = $type;
    }

    if ($source !== '' && $source !== 'all') {
        $where[] = "LOWER(source) LIKE :src";
        $params[':src'] = "%" . strtolower($source) . "%";
    }

    $whereClause = count($where) > 0 ? "WHERE " . implode(" AND ", $where) : "";
    $sql = "SELECT * FROM `mc_leads` {$whereClause} ORDER BY created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $leads = array_map('formatLeadRow', $rows);
    $stats = computeCrmStats($pdo);

    echo json_encode([
        'success'   => true,
        'leads'     => $leads,
        'stats'     => $stats,
        'timestamp' => date('c')
    ]);
    exit;
}

// -------------------------------------------------------------
// Action 3: Add / Create Single Lead
// -------------------------------------------------------------
if ($action === 'lead' && $method === 'POST') {
    $name  = trim($inputData['name'] ?? '');
    $email = trim($inputData['email'] ?? '');
    $phone = trim($inputData['phone'] ?? '');

    if (empty($name) || empty($email) || empty($phone)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Le nom, email et téléphone sont obligatoires.'
        ]);
        exit;
    }

    // Auto-generate ID if not passed
    $id = trim($inputData['id'] ?? '');
    if (empty($id)) {
        $cntStmt = $pdo->query("SELECT COUNT(*) FROM `mc_leads`");
        $cnt = (int)$cntStmt->fetchColumn() + 90;
        $id = sprintf("MC-2026-%03d", $cnt);
    }

    $now = date('c');
    $company          = trim($inputData['company'] ?? '');
    $type             = trim($inputData['type'] ?? 'private-office');
    $officeSize       = trim($inputData['officeSize'] ?? $inputData['office_size'] ?? '');
    $workstationCount = isset($inputData['workstationCount']) ? (int)$inputData['workstationCount'] : (isset($inputData['workstation_count']) ? (int)$inputData['workstation_count'] : 1);
    $openSpacePlan    = $inputData['openSpacePlan'] ?? $inputData['open_space_plan'] ?? null;
    $date             = trim($inputData['date'] ?? '');
    $timeSlot         = trim($inputData['timeSlot'] ?? $inputData['time_slot'] ?? '');
    $attendees        = isset($inputData['attendees']) && $inputData['attendees'] !== null ? (int)$inputData['attendees'] : null;
    $meetingPurpose   = trim($inputData['meetingPurpose'] ?? $inputData['meeting_purpose'] ?? '');
    $visitRequested   = isset($inputData['visitRequested']) ? ($inputData['visitRequested'] ? 1 : 0) : 1;
    $source           = trim($inputData['source'] ?? 'Website Space Enquiry');
    $status           = trim($inputData['status'] ?? 'new');
    $priority         = trim($inputData['priority'] ?? 'high');
    $message          = trim($inputData['message'] ?? '');

    $notes = [];
    if (!empty($inputData['notes']) && is_array($inputData['notes'])) {
        $notes = $inputData['notes'];
    } elseif (!empty($inputData['initialNote'])) {
        $notes[] = [
            'id'        => 'note-' . time(),
            'author'    => 'Administrateur',
            'text'      => $inputData['initialNote'],
            'createdAt' => $now
        ];
    }
    $notesJson = json_encode($notes, JSON_UNESCAPED_UNICODE);

    $sql = "INSERT INTO `mc_leads` (
        id, name, email, phone, company, type, office_size, workstation_count,
        open_space_plan, date, time_slot, attendees, meeting_purpose,
        visit_requested, source, status, priority, message, created_at, updated_at, notes
    ) VALUES (
        :id, :name, :email, :phone, :company, :type, :office_size, :workstation_count,
        :open_space_plan, :date, :time_slot, :attendees, :meeting_purpose,
        :visit_requested, :source, :status, :priority, :message, :created_at, :updated_at, :notes
    ) ON DUPLICATE KEY UPDATE
        name = VALUES(name), email = VALUES(email), phone = VALUES(phone), company = VALUES(company),
        type = VALUES(type), office_size = VALUES(office_size), workstation_count = VALUES(workstation_count),
        status = VALUES(status), priority = VALUES(priority), updated_at = VALUES(updated_at);";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id'                => $id,
        ':name'              => $name,
        ':email'             => $email,
        ':phone'             => $phone,
        ':company'           => $company,
        ':type'              => $type,
        ':office_size'       => $officeSize,
        ':workstation_count' => $workstationCount,
        ':open_space_plan'   => $openSpacePlan,
        ':date'              => $date,
        ':time_slot'         => $timeSlot,
        ':attendees'         => $attendees,
        ':meeting_purpose'   => $meetingPurpose,
        ':visit_requested'   => $visitRequested,
        ':source'            => $source,
        ':status'            => $status,
        ':priority'          => $priority,
        ':message'           => $message,
        ':created_at'        => $now,
        ':updated_at'        => $now,
        ':notes'             => $notesJson
    ]);

    // Fetch newly saved lead
    $getStmt = $pdo->prepare("SELECT * FROM `mc_leads` WHERE id = :id");
    $getStmt->execute([':id' => $id]);
    $savedLead = formatLeadRow($getStmt->fetch());

    echo json_encode([
        'success' => true,
        'message' => 'Lead enregistré avec succès dans OVH MySQL.',
        'lead'    => $savedLead,
        'stats'   => computeCrmStats($pdo)
    ]);
    exit;
}

// -------------------------------------------------------------
// Action 4: Update Lead (Status, Priority, or Add Note)
// -------------------------------------------------------------
if ($action === 'update_lead' || ($action === 'lead' && ($method === 'PATCH' || $method === 'PUT'))) {
    $id = trim($inputData['id'] ?? $_GET['id'] ?? '');

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID manquant.']);
        exit;
    }

    $getStmt = $pdo->prepare("SELECT * FROM `mc_leads` WHERE id = :id");
    $getStmt->execute([':id' => $id]);
    $existing = $getStmt->fetch();

    if (!$existing) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Lead introuvable.']);
        exit;
    }

    $existingNotes = [];
    if (!empty($existing['notes'])) {
        $decoded = json_decode($existing['notes'], true);
        if (is_array($decoded)) $existingNotes = $decoded;
    }

    $now = date('c');

    // Handle new note
    if (!empty($inputData['newNote']) && !empty($inputData['newNote']['text'])) {
        $existingNotes[] = [
            'id'        => 'note-' . time(),
            'author'    => $inputData['newNote']['author'] ?? 'Administrateur',
            'text'      => $inputData['newNote']['text'],
            'createdAt' => $now
        ];
    }

    $newStatus   = $inputData['status'] ?? $existing['status'];
    $newPriority = $inputData['priority'] ?? $existing['priority'];
    $notesJson   = json_encode($existingNotes, JSON_UNESCAPED_UNICODE);

    $updateStmt = $pdo->prepare("UPDATE `mc_leads` SET 
        status = :st, 
        priority = :pr, 
        notes = :nt, 
        updated_at = :up 
        WHERE id = :id"
    );

    $updateStmt->execute([
        ':st' => $newStatus,
        ':pr' => $newPriority,
        ':nt' => $notesJson,
        ':up' => $now,
        ':id' => $id
    ]);

    $getStmt->execute([':id' => $id]);
    $updated = formatLeadRow($getStmt->fetch());

    echo json_encode([
        'success' => true,
        'message' => 'Lead mis à jour avec succès.',
        'lead'    => $updated,
        'stats'   => computeCrmStats($pdo)
    ]);
    exit;
}

// -------------------------------------------------------------
// Action 5: Delete Lead
// -------------------------------------------------------------
if ($action === 'delete_lead' || ($action === 'lead' && $method === 'DELETE')) {
    $id = trim($_GET['id'] ?? $inputData['id'] ?? '');

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID manquant.']);
        exit;
    }

    $delStmt = $pdo->prepare("DELETE FROM `mc_leads` WHERE id = :id");
    $delStmt->execute([':id' => $id]);

    echo json_encode([
        'success' => true,
        'message' => 'Lead supprimé avec succès.',
        'stats'   => computeCrmStats($pdo)
    ]);
    exit;
}

// -------------------------------------------------------------
// Action 6: Bulk Import / Sync from crm_leads.json
// -------------------------------------------------------------
if ($action === 'bulk_sync' && $method === 'POST') {
    $leads = $inputData['leads'] ?? [];

    if (!is_array($leads) || empty($leads)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No leads provided for bulk sync.']);
        exit;
    }

    $sql = "INSERT INTO `mc_leads` (
        id, name, email, phone, company, type, office_size, workstation_count,
        open_space_plan, date, time_slot, attendees, meeting_purpose,
        visit_requested, source, status, priority, message, created_at, updated_at, notes
    ) VALUES (
        :id, :name, :email, :phone, :company, :type, :office_size, :workstation_count,
        :open_space_plan, :date, :time_slot, :attendees, :meeting_purpose,
        :visit_requested, :source, :status, :priority, :message, :created_at, :updated_at, :notes
    ) ON DUPLICATE KEY UPDATE
        name = VALUES(name), email = VALUES(email), phone = VALUES(phone), company = VALUES(company),
        type = VALUES(type), office_size = VALUES(office_size), workstation_count = VALUES(workstation_count),
        open_space_plan = VALUES(open_space_plan), date = VALUES(date), time_slot = VALUES(time_slot),
        attendees = VALUES(attendees), meeting_purpose = VALUES(meeting_purpose),
        visit_requested = VALUES(visit_requested), source = VALUES(source), status = VALUES(status),
        priority = VALUES(priority), message = VALUES(message), updated_at = VALUES(updated_at),
        notes = VALUES(notes);";

    $stmt = $pdo->prepare($sql);
    $syncedCount = 0;

    foreach ($leads as $l) {
        if (empty($l['id']) || empty($l['name'])) continue;

        $notesJson = !empty($l['notes']) ? json_encode($l['notes'], JSON_UNESCAPED_UNICODE) : '[]';

        $stmt->execute([
            ':id'                => $l['id'],
            ':name'              => $l['name'],
            ':email'             => $l['email'] ?? '',
            ':phone'             => $l['phone'] ?? '',
            ':company'           => $l['company'] ?? '',
            ':type'              => $l['type'] ?? 'private-office',
            ':office_size'       => $l['officeSize'] ?? $l['office_size'] ?? '',
            ':workstation_count' => isset($l['workstationCount']) ? (int)$l['workstationCount'] : 1,
            ':open_space_plan'   => $l['openSpacePlan'] ?? null,
            ':date'              => $l['date'] ?? '',
            ':time_slot'         => $l['timeSlot'] ?? '',
            ':attendees'         => isset($l['attendees']) && $l['attendees'] !== null ? (int)$l['attendees'] : null,
            ':meeting_purpose'   => $l['meetingPurpose'] ?? '',
            ':visit_requested'   => isset($l['visitRequested']) ? ($l['visitRequested'] ? 1 : 0) : 1,
            ':source'            => $l['source'] ?? 'Direct Import',
            ':status'            => $l['status'] ?? 'new',
            ':priority'          => $l['priority'] ?? 'normal',
            ':message'           => $l['message'] ?? '',
            ':created_at'        => $l['createdAt'] ?? date('c'),
            ':updated_at'        => $l['updatedAt'] ?? date('c'),
            ':notes'             => $notesJson
        ]);
        $syncedCount++;
    }

    echo json_encode([
        'success'      => true,
        'message'      => "{$syncedCount} leads successfully synced to OVH MySQL.",
        'synced_count' => $syncedCount,
        'stats'        => computeCrmStats($pdo)
    ]);
    exit;
}

// -------------------------------------------------------------
// Action 7: Key-Value Settings Store
// -------------------------------------------------------------
if ($action === 'settings') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT setting_key, setting_value FROM `mc_settings`");
        $all = $stmt->fetchAll();
        $settings = [];
        foreach ($all as $item) {
            $val = json_decode($item['setting_value'], true);
            $settings[$item['setting_key']] = $val !== null ? $val : $item['setting_value'];
        }
        echo json_encode(['success' => true, 'settings' => $settings]);
        exit;
    }

    if ($method === 'POST') {
        $key = trim($inputData['key'] ?? '');
        $value = $inputData['value'] ?? null;

        if (empty($key)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Setting key required.']);
            exit;
        }

        $now = date('c');
        $valString = is_string($value) ? $value : json_encode($value, JSON_UNESCAPED_UNICODE);

        $stmt = $pdo->prepare("INSERT INTO `mc_settings` (setting_key, setting_value, updated_at) 
            VALUES (:k, :v, :u) 
            ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = VALUES(updated_at)");
        $stmt->execute([':k' => $key, ':v' => $valString, ':u' => $now]);

        echo json_encode(['success' => true, 'message' => "Setting '{$key}' saved."]);
        exit;
    }
}

// Fallback for unknown action
http_response_code(404);
echo json_encode([
    'success' => false,
    'message' => 'Action inconnue ou non supportée: ' . htmlspecialchars($action)
]);

