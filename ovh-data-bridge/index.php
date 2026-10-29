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

// -------------------------------------------------------------
// Formatters for TypeScript Compatibility
// -------------------------------------------------------------

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

function formatSpaceRow($row) {
    if (!$row) return null;

    $currentTenant = null;
    if (!empty($row['current_tenant'])) {
        $currentTenant = json_decode($row['current_tenant'], true);
    }

    $features = [];
    if (!empty($row['features'])) {
        $features = json_decode($row['features'], true) ?: [];
    }

    $activeBookings = [];
    if (!empty($row['active_bookings'])) {
        $activeBookings = json_decode($row['active_bookings'], true) ?: [];
    }

    return [
        'id'              => $row['id'],
        'name'            => $row['name'],
        'category'        => $row['category'],
        'area'            => $row['area'] ?? '',
        'capacity'        => $row['capacity'] ?? '',
        'price'           => $row['price'] ?? '',
        'period'          => $row['period'] ?? '',
        'status'          => $row['status'] ?? 'available',
        'statusText'      => $row['status_text'] ?? '',
        'image'           => $row['image'] ?? '',
        'parkingIncluded' => (bool)$row['parking_included'],
        'currentTenant'   => $currentTenant,
        'features'        => $features,
        'activeBookings'  => $activeBookings
    ];
}

function formatTenantRow($row) {
    if (!$row) return null;

    $badgeIds = [];
    if (!empty($row['badge_ids'])) {
        $decoded = json_decode($row['badge_ids'], true);
        $badgeIds = is_array($decoded) ? $decoded : [$row['badge_ids']];
    }

    return [
        'id'            => $row['id'],
        'leadId'        => $row['lead_id'] ?? null,
        'name'          => $row['name'],
        'company'       => $row['company'],
        'role'          => $row['role'] ?? '',
        'email'         => $row['email'],
        'phone'         => $row['phone'],
        'spaceAssigned' => $row['space_assigned'],
        'workstations'  => (int)($row['workstations'] ?? 1),
        'parkingBays'   => $row['parking_bays'] ?? '',
        'badgeIds'      => $badgeIds,
        'leaseStart'    => $row['lease_start'] ?? '',
        'monthlyRent'   => $row['monthly_rent'] ?? '',
        'status'        => $row['status'] ?? 'active',
        'isFromWonLead' => (bool)$row['is_from_won_lead']
    ];
}

// Compute Metrics
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

function computeSpaceMetrics($pdo) {
    $spaces = $pdo->query("SELECT * FROM `mc_spaces`")->fetchAll();
    $tenants = $pdo->query("SELECT * FROM `mc_tenants`")->fetchAll();

    $availOffices = 0;
    $totalOffices = 0;
    foreach ($spaces as $s) {
        if ($s['category'] === 'private') {
            $totalOffices++;
            if ($s['status'] === 'available') $availOffices++;
        }
    }
    if ($totalOffices === 0) $totalOffices = 5;

    $assignedDesks = 0;
    foreach ($tenants as $t) {
        $assignedDesks += (int)($t['workstations'] ?? 1);
    }
    if ($assignedDesks < 4) $assignedDesks = 4;

    return [
        'availablePrivateOffices' => $availOffices,
        'totalPrivateOffices'     => $totalOffices,
        'occupiedDesks'           => $assignedDesks,
        'totalDesks'              => 10,
        'assignedParkingBays'     => 2,
        'totalParkingBays'        => 9
    ];
}

function computeTenantMetrics($pdo) {
    $tenants = $pdo->query("SELECT * FROM `mc_tenants`")->fetchAll();
    $uniqueCompanies = [];
    $assignedDesks = 0;
    $badgeCount = 0;

    foreach ($tenants as $t) {
        $uniqueCompanies[$t['company']] = true;
        $assignedDesks += (int)($t['workstations'] ?? 1);
        if (!empty($t['badge_ids'])) {
            $b = json_decode($t['badge_ids'], true);
            $badgeCount += is_array($b) ? count($b) : 1;
        }
    }

    return [
        'activeCompanies'     => count($uniqueCompanies) ?: 2,
        'assignedDesks'       => $assignedDesks ?: 4,
        'parkingBaysAssigned' => 2,
        'totalParkingBays'    => 9,
        'activeBadges'        => $badgeCount ?: 3
    ];
}

// Initialize Connection and Ensure Schema Exists
$pdo = getDbConnection();
ensureTablesExist($pdo);

// Extract Action & Input
$action = $_GET['action'] ?? $_POST['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Parse JSON Body
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
if (empty($action) && isset($inputData['action'])) {
    $action = $inputData['action'];
}

// -------------------------------------------------------------
// Endpoint 1: Health Check (Public diagnostics)
// -------------------------------------------------------------
if ($action === 'health' || $action === 'ping') {
    $leadCount = (int)$pdo->query("SELECT COUNT(*) FROM `mc_leads`")->fetchColumn();
    $spaceCount = (int)$pdo->query("SELECT COUNT(*) FROM `mc_spaces`")->fetchColumn();
    $tenantCount = (int)$pdo->query("SELECT COUNT(*) FROM `mc_tenants`")->fetchColumn();
    $settingsCount = (int)$pdo->query("SELECT COUNT(*) FROM `mc_settings`")->fetchColumn();

    echo json_encode([
        'success'        => true,
        'status'         => 'healthy',
        'database'       => DB_NAME,
        'host'           => DB_HOST,
        'php_version'    => PHP_VERSION,
        'server_time'    => date('c'),
        'total_leads'    => $leadCount,
        'total_spaces'   => $spaceCount,
        'total_tenants'  => $tenantCount,
        'total_settings' => $settingsCount,
        'message'        => 'OVH MySQL Data Bridge is online and ready.'
    ]);
    exit;
}

// All subsequent actions require authentication
authenticate();

// =============================================================
// SECTION 1: OPPORTUNITY BOARD & CRM LEADS (mc_leads)
// =============================================================

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

if ($action === 'lead' && $method === 'POST') {
    $name  = trim($inputData['name'] ?? '');
    $email = trim($inputData['email'] ?? '');
    $phone = trim($inputData['phone'] ?? '');

    if (empty($name) || empty($email) || empty($phone)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Le nom, email et téléphone sont obligatoires.']);
        exit;
    }

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

    // If marked as Won, synchronize with Tenants Directory & Spaces Inventory
    if ($newStatus === 'won') {
        $tenantId = 'TEN-' . preg_replace('/[^0-9]/', '', $id);
        $companyName = !empty($existing['company']) ? $existing['company'] : $existing['name'];
        $spaceName = 'Bureau Privatif Maison Calvé';
        $rentStr = '750 € HT / mois';
        $ws = (int)($existing['workstation_count'] ?? 1);
        $parking = 'Places #3 & #4';

        if ($existing['type'] === 'private-office') {
            if (strpos($existing['office_size'], '25') !== false) {
                $spaceName = 'Bureau Privatif 25m² (RDC Cour)';
                $rentStr = '1 000 € HT / mois';
                $ws = 5;
            } else {
                $spaceName = 'Bureau Privatif 17 m² (Aile Ouest)';
                $rentStr = '750 € HT / mois';
                $ws = 3;
            }
        } elseif ($existing['type'] === 'open-space') {
            $spaceName = "Open Space — Espace A ({$ws} postes fixes)";
            $rentStr = ($ws * 250) . ' € HT / mois';
            $parking = 'Place #7';
        } elseif ($existing['type'] === 'meeting-room') {
            $spaceName = 'Grande Salle de Réunion 30 m²';
            $rentStr = '200 € HT (Journée)';
            $parking = 'Parking Visiteurs Réservé';
        }

        $insTenant = $pdo->prepare("INSERT INTO `mc_tenants` (
            id, lead_id, name, company, role, email, phone, space_assigned, workstations,
            parking_bays, badge_ids, lease_start, monthly_rent, status, is_from_won_lead, updated_at
        ) VALUES (
            :tid, :lid, :tname, :comp, 'Résident Partenaire', :em, :ph, :sp, :ws,
            :pb, :badges, :ls, :mr, 'active', 1, :up
        ) ON DUPLICATE KEY UPDATE
            name=VALUES(name), company=VALUES(company), space_assigned=VALUES(space_assigned), updated_at=VALUES(updated_at)");

        $insTenant->execute([
            ':tid'    => $tenantId,
            ':lid'    => $id,
            ':tname'  => "{$companyName} ({$existing['name']})",
            ':comp'   => $companyName,
            ':em'     => $existing['email'],
            ':ph'     => $existing['phone'],
            ':sp'     => $spaceName,
            ':ws'     => $ws,
            ':pb'     => $parking,
            ':badges' => json_encode(["BADGE-048-" . substr($id, -3)]),
            ':ls'     => !empty($existing['date']) ? $existing['date'] : substr($now, 0, 10),
            ':mr'     => $rentStr,
            ':up'     => $now
        ]);
    }

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

if ($action === 'bulk_sync' && $method === 'POST') {
    $leads = $inputData['leads'] ?? [];

    if (!is_array($leads) || empty($leads)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No leads provided.']);
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

// =============================================================
// SECTION 2: SPACES & OFFICES INVENTORY (mc_spaces)
// =============================================================

if ($action === 'spaces' && ($method === 'GET' || $method === 'POST')) {
    $rows = $pdo->query("SELECT * FROM `mc_spaces` ORDER BY category ASC, id ASC")->fetchAll();
    $spaces = array_map('formatSpaceRow', $rows);
    $metrics = computeSpaceMetrics($pdo);

    echo json_encode([
        'success'   => true,
        'spaces'    => $spaces,
        'metrics'   => $metrics,
        'timestamp' => date('c')
    ]);
    exit;
}

if ($action === 'space' && $method === 'POST') {
    $id = trim($inputData['id'] ?? '');
    $name = trim($inputData['name'] ?? '');

    if (empty($id) || empty($name)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID et nom requis pour l\'espace.']);
        exit;
    }

    $now = date('c');
    $category        = trim($inputData['category'] ?? 'private');
    $area            = trim($inputData['area'] ?? '');
    $capacity        = trim($inputData['capacity'] ?? '');
    $price           = trim($inputData['price'] ?? '');
    $period          = trim($inputData['period'] ?? 'par mois');
    $status          = trim($inputData['status'] ?? 'available');
    $statusText      = trim($inputData['statusText'] ?? $inputData['status_text'] ?? 'Disponible immédiatement');
    $image           = trim($inputData['image'] ?? '/images/spaces/bureau-privatif-17m.png');
    $parkingIncluded = isset($inputData['parkingIncluded']) ? ($inputData['parkingIncluded'] ? 1 : 0) : 0;
    $currentTenant   = !empty($inputData['currentTenant']) ? json_encode($inputData['currentTenant'], JSON_UNESCAPED_UNICODE) : null;
    $features        = !empty($inputData['features']) ? json_encode($inputData['features'], JSON_UNESCAPED_UNICODE) : '[]';
    $activeBookings  = !empty($inputData['activeBookings']) ? json_encode($inputData['activeBookings'], JSON_UNESCAPED_UNICODE) : '[]';

    $stmt = $pdo->prepare("INSERT INTO `mc_spaces` (
        id, name, category, area, capacity, price, period, status, status_text,
        image, parking_included, current_tenant, features, active_bookings, updated_at
    ) VALUES (
        :id, :name, :category, :area, :capacity, :price, :period, :status, :status_text,
        :image, :parking_included, :current_tenant, :features, :active_bookings, :updated_at
    ) ON DUPLICATE KEY UPDATE
        name=VALUES(name), category=VALUES(category), area=VALUES(area), capacity=VALUES(capacity),
        price=VALUES(price), period=VALUES(period), status=VALUES(status), status_text=VALUES(status_text),
        image=VALUES(image), parking_included=VALUES(parking_included), current_tenant=VALUES(current_tenant),
        features=VALUES(features), updated_at=VALUES(updated_at);");

    $stmt->execute([
        ':id'               => $id,
        ':name'             => $name,
        ':category'         => $category,
        ':area'             => $area,
        ':capacity'         => $capacity,
        ':price'            => $price,
        ':period'           => $period,
        ':status'           => $status,
        ':status_text'      => $statusText,
        ':image'            => $image,
        ':parking_included' => $parkingIncluded,
        ':current_tenant'   => $currentTenant,
        ':features'         => $features,
        ':active_bookings'  => $activeBookings,
        ':updated_at'       => $now
    ]);

    $getStmt = $pdo->prepare("SELECT * FROM `mc_spaces` WHERE id = :id");
    $getStmt->execute([':id' => $id]);
    $saved = formatSpaceRow($getStmt->fetch());

    echo json_encode([
        'success' => true,
        'message' => 'Espace enregistré avec succès dans OVH MySQL.',
        'space'   => $saved,
        'metrics' => computeSpaceMetrics($pdo)
    ]);
    exit;
}

if ($action === 'update_space' || ($action === 'space' && ($method === 'PATCH' || $method === 'PUT'))) {
    $id = trim($inputData['id'] ?? $_GET['id'] ?? '');

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID manquant pour l\'espace.']);
        exit;
    }

    $getStmt = $pdo->prepare("SELECT * FROM `mc_spaces` WHERE id = :id");
    $getStmt->execute([':id' => $id]);
    $existing = $getStmt->fetch();

    if (!$existing) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Espace introuvable.']);
        exit;
    }

    $now = date('c');
    $status     = $inputData['status'] ?? $existing['status'];
    $statusText = $inputData['statusText'] ?? $inputData['status_text'] ?? $existing['status_text'];
    $price      = $inputData['price'] ?? $existing['price'];
    $capacity   = $inputData['capacity'] ?? $existing['capacity'];

    $currentTenant = $existing['current_tenant'];
    if (array_key_exists('currentTenant', $inputData)) {
        $currentTenant = $inputData['currentTenant'] ? json_encode($inputData['currentTenant'], JSON_UNESCAPED_UNICODE) : null;
    }

    $stmt = $pdo->prepare("UPDATE `mc_spaces` SET 
        status = :st, status_text = :stx, price = :pr, capacity = :cp,
        current_tenant = :ct, updated_at = :up WHERE id = :id");
    $stmt->execute([
        ':st'  => $status,
        ':stx' => $statusText,
        ':pr'  => $price,
        ':cp'  => $capacity,
        ':ct'  => $currentTenant,
        ':up'  => $now,
        ':id'  => $id
    ]);

    $getStmt->execute([':id' => $id]);
    $updated = formatSpaceRow($getStmt->fetch());

    echo json_encode([
        'success' => true,
        'message' => 'Espace mis à jour avec succès.',
        'space'   => $updated,
        'metrics' => computeSpaceMetrics($pdo)
    ]);
    exit;
}

if ($action === 'delete_space' || ($action === 'space' && $method === 'DELETE')) {
    $id = trim($_GET['id'] ?? $inputData['id'] ?? '');
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID manquant.']);
        exit;
    }

    $delStmt = $pdo->prepare("DELETE FROM `mc_spaces` WHERE id = :id");
    $delStmt->execute([':id' => $id]);

    echo json_encode([
        'success' => true,
        'message' => 'Espace supprimé avec succès.',
        'metrics' => computeSpaceMetrics($pdo)
    ]);
    exit;
}

// =============================================================
// SECTION 3: TENANTS & RESIDENTS DIRECTORY (mc_tenants)
// =============================================================

if ($action === 'tenants' && ($method === 'GET' || $method === 'POST')) {
    $search = strtolower(trim($_GET['q'] ?? $inputData['q'] ?? ''));
    $status = trim($_GET['status'] ?? $inputData['status'] ?? '');

    $where = [];
    $params = [];

    if ($search !== '') {
        $where[] = "(LOWER(name) LIKE :s1 OR LOWER(company) LIKE :s2 OR LOWER(email) LIKE :s3 OR LOWER(space_assigned) LIKE :s4 OR LOWER(id) LIKE :s5)";
        $wildcard = "%{$search}%";
        $params[':s1'] = $wildcard;
        $params[':s2'] = $wildcard;
        $params[':s3'] = $wildcard;
        $params[':s4'] = $wildcard;
        $params[':s5'] = $wildcard;
    }

    if ($status !== '' && $status !== 'all') {
        $where[] = "status = :st";
        $params[':st'] = $status;
    }

    $whereClause = count($where) > 0 ? "WHERE " . implode(" AND ", $where) : "";
    $sql = "SELECT * FROM `mc_tenants` {$whereClause} ORDER BY created_at DESC, id ASC";

    // Fallback if created_at column is not present in mc_tenants
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    } catch (Exception $e) {
        $stmt = $pdo->prepare("SELECT * FROM `mc_tenants` {$whereClause} ORDER BY id ASC");
        $stmt->execute($params);
    }

    $rows = $stmt->fetchAll();
    $tenants = array_map('formatTenantRow', $rows);
    $metrics = computeTenantMetrics($pdo);

    echo json_encode([
        'success'   => true,
        'tenants'   => $tenants,
        'metrics'   => $metrics,
        'timestamp' => date('c')
    ]);
    exit;
}

if ($action === 'tenant' && $method === 'POST') {
    $name    = trim($inputData['name'] ?? '');
    $company = trim($inputData['company'] ?? '');
    $email   = trim($inputData['email'] ?? '');
    $phone   = trim($inputData['phone'] ?? '');

    if (empty($name) || empty($company) || empty($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Nom, entreprise et email obligatoires.']);
        exit;
    }

    $id = trim($inputData['id'] ?? '');
    if (empty($id)) {
        $cnt = (int)$pdo->query("SELECT COUNT(*) FROM `mc_tenants`")->fetchColumn() + 1;
        $id = sprintf("TEN-%03d", $cnt);
    }

    $now = date('c');
    $leadId        = !empty($inputData['leadId']) ? trim($inputData['leadId']) : null;
    $role          = trim($inputData['role'] ?? 'Résident Partenaire');
    $spaceAssigned = trim($inputData['spaceAssigned'] ?? $inputData['space_assigned'] ?? 'Bureau Privatif Maison Calvé');
    $workstations  = (int)($inputData['workstations'] ?? 1);
    $parkingBays   = trim($inputData['parkingBays'] ?? $inputData['parking_bays'] ?? 'Places cour sécurisée');
    $leaseStart    = trim($inputData['leaseStart'] ?? $inputData['lease_start'] ?? substr($now, 0, 10));
    $monthlyRent   = trim($inputData['monthlyRent'] ?? $inputData['monthly_rent'] ?? '750 € HT / mois');
    $status        = trim($inputData['status'] ?? 'active');
    $isFromWon     = isset($inputData['isFromWonLead']) ? ($inputData['isFromWonLead'] ? 1 : 0) : 0;

    $badgeIds = !empty($inputData['badgeIds']) ? json_encode($inputData['badgeIds'], JSON_UNESCAPED_UNICODE) : json_encode(["BADGE-048-" . substr($id, -3)]);

    $stmt = $pdo->prepare("INSERT INTO `mc_tenants` (
        id, lead_id, name, company, role, email, phone, space_assigned, workstations,
        parking_bays, badge_ids, lease_start, monthly_rent, status, is_from_won_lead, updated_at
    ) VALUES (
        :id, :lid, :nm, :cp, :rl, :em, :ph, :sp, :ws,
        :pb, :bg, :ls, :mr, :st, :wf, :up
    ) ON DUPLICATE KEY UPDATE
        name=VALUES(name), company=VALUES(company), role=VALUES(role), email=VALUES(email),
        phone=VALUES(phone), space_assigned=VALUES(space_assigned), workstations=VALUES(workstations),
        parking_bays=VALUES(parking_bays), badge_ids=VALUES(badge_ids), monthly_rent=VALUES(monthly_rent),
        status=VALUES(status), updated_at=VALUES(updated_at);");

    $stmt->execute([
        ':id'  => $id,
        ':lid' => $leadId,
        ':nm'  => $name,
        ':cp'  => $company,
        ':rl'  => $role,
        ':em'  => $email,
        ':ph'  => $phone,
        ':sp'  => $spaceAssigned,
        ':ws'  => $workstations,
        ':pb'  => $parkingBays,
        ':bg'  => $badgeIds,
        ':ls'  => $leaseStart,
        ':mr'  => $monthlyRent,
        ':st'  => $status,
        ':wf'  => $isFromWon,
        ':up'  => $now
    ]);

    $getStmt = $pdo->prepare("SELECT * FROM `mc_tenants` WHERE id = :id");
    $getStmt->execute([':id' => $id]);
    $saved = formatTenantRow($getStmt->fetch());

    echo json_encode([
        'success' => true,
        'message' => 'Résident enregistré avec succès dans OVH MySQL.',
        'tenant'  => $saved,
        'metrics' => computeTenantMetrics($pdo)
    ]);
    exit;
}

if ($action === 'update_tenant' || ($action === 'tenant' && ($method === 'PATCH' || $method === 'PUT'))) {
    $id = trim($inputData['id'] ?? $_GET['id'] ?? '');

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID manquant.']);
        exit;
    }

    $getStmt = $pdo->prepare("SELECT * FROM `mc_tenants` WHERE id = :id");
    $getStmt->execute([':id' => $id]);
    $existing = $getStmt->fetch();

    if (!$existing) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Résident introuvable.']);
        exit;
    }

    $now = date('c');
    $name          = $inputData['name'] ?? $existing['name'];
    $company       = $inputData['company'] ?? $existing['company'];
    $role          = $inputData['role'] ?? $existing['role'];
    $email         = $inputData['email'] ?? $existing['email'];
    $phone         = $inputData['phone'] ?? $existing['phone'];
    $spaceAssigned = $inputData['spaceAssigned'] ?? $inputData['space_assigned'] ?? $existing['space_assigned'];
    $workstations  = isset($inputData['workstations']) ? (int)$inputData['workstations'] : (int)$existing['workstations'];
    $parkingBays   = $inputData['parkingBays'] ?? $inputData['parking_bays'] ?? $existing['parking_bays'];
    $monthlyRent   = $inputData['monthlyRent'] ?? $inputData['monthly_rent'] ?? $existing['monthly_rent'];
    $status        = $inputData['status'] ?? $existing['status'];
    $leaseStart    = $inputData['leaseStart'] ?? $inputData['lease_start'] ?? $existing['lease_start'];

    $badgeIds = $existing['badge_ids'];
    if (array_key_exists('badgeIds', $inputData)) {
        $badgeIds = is_array($inputData['badgeIds']) ? json_encode($inputData['badgeIds'], JSON_UNESCAPED_UNICODE) : $inputData['badgeIds'];
    }

    $stmt = $pdo->prepare("UPDATE `mc_tenants` SET 
        name = :nm, company = :cp, role = :rl, email = :em, phone = :ph,
        space_assigned = :sp, workstations = :ws, parking_bays = :pb, badge_ids = :bg,
        monthly_rent = :mr, status = :st, lease_start = :ls, updated_at = :up WHERE id = :id");

    $stmt->execute([
        ':nm' => $name,
        ':cp' => $company,
        ':rl' => $role,
        ':em' => $email,
        ':ph' => $phone,
        ':sp' => $spaceAssigned,
        ':ws' => $workstations,
        ':pb' => $parkingBays,
        ':bg' => $badgeIds,
        ':mr' => $monthlyRent,
        ':st' => $status,
        ':ls' => $leaseStart,
        ':up' => $now,
        ':id' => $id
    ]);

    $getStmt->execute([':id' => $id]);
    $updated = formatTenantRow($getStmt->fetch());

    echo json_encode([
        'success' => true,
        'message' => 'Résident mis à jour avec succès.',
        'tenant'  => $updated,
        'metrics' => computeTenantMetrics($pdo)
    ]);
    exit;
}

if ($action === 'delete_tenant' || ($action === 'tenant' && $method === 'DELETE')) {
    $id = trim($_GET['id'] ?? $inputData['id'] ?? '');
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID manquant.']);
        exit;
    }

    $delStmt = $pdo->prepare("DELETE FROM `mc_tenants` WHERE id = :id");
    $delStmt->execute([':id' => $id]);

    echo json_encode([
        'success' => true,
        'message' => 'Résident supprimé avec succès.',
        'metrics' => computeTenantMetrics($pdo)
    ]);
    exit;
}

// =============================================================
// SECTION 4: KEY-VALUE SETTINGS (mc_settings)
// =============================================================

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
