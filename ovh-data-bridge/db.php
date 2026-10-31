<?php
/**
 * Maison Calvé — Database Connection & Schema Management
 */

require_once __DIR__ . '/config.php';

function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        DB_HOST,
        DB_PORT,
        DB_NAME
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'error'   => 'Database connection failed: ' . $e->getMessage()
        ]);
        exit;
    }
}

/**
 * Automatically ensure required tables exist in uwenyoimaison database and seed if empty.
 */
function ensureTablesExist($pdo) {
    // 1. Leads Table (Opportunity Board & CRM Leads)
    $sqlLeads = "CREATE TABLE IF NOT EXISTS `mc_leads` (
        `id` VARCHAR(64) NOT NULL PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `phone` VARCHAR(64) NOT NULL,
        `company` VARCHAR(255) DEFAULT '',
        `type` VARCHAR(64) NOT NULL DEFAULT 'private-office',
        `office_size` VARCHAR(128) DEFAULT NULL,
        `workstation_count` INT DEFAULT 1,
        `open_space_plan` VARCHAR(32) DEFAULT NULL,
        `date` VARCHAR(64) DEFAULT NULL,
        `time_slot` VARCHAR(64) DEFAULT NULL,
        `attendees` INT DEFAULT NULL,
        `meeting_purpose` TEXT DEFAULT NULL,
        `visit_requested` TINYINT(1) DEFAULT 1,
        `source` VARCHAR(255) DEFAULT 'Website Space Enquiry',
        `status` VARCHAR(64) DEFAULT 'new',
        `priority` VARCHAR(32) DEFAULT 'normal',
        `message` TEXT DEFAULT NULL,
        `created_at` VARCHAR(64) NOT NULL,
        `updated_at` VARCHAR(64) NOT NULL,
        `notes` LONGTEXT DEFAULT NULL,
        INDEX idx_status (`status`),
        INDEX idx_type (`type`),
        INDEX idx_created (`created_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    // 2. Spaces Table (Spaces & Offices Inventory)
    $sqlSpaces = "CREATE TABLE IF NOT EXISTS `mc_spaces` (
        `id` VARCHAR(64) NOT NULL PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `category` VARCHAR(64) NOT NULL DEFAULT 'private',
        `area` VARCHAR(64) DEFAULT NULL,
        `capacity` VARCHAR(255) DEFAULT NULL,
        `price` VARCHAR(128) DEFAULT NULL,
        `period` VARCHAR(128) DEFAULT NULL,
        `status` VARCHAR(32) NOT NULL DEFAULT 'available',
        `status_text` VARCHAR(255) DEFAULT NULL,
        `image` VARCHAR(255) DEFAULT NULL,
        `parking_included` TINYINT(1) DEFAULT 0,
        `current_tenant` LONGTEXT DEFAULT NULL,
        `features` LONGTEXT DEFAULT NULL,
        `active_bookings` LONGTEXT DEFAULT NULL,
        `updated_at` VARCHAR(64) NOT NULL,
        INDEX idx_category (`category`),
        INDEX idx_status (`status`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    // 3. Tenants Table (Tenants & Residents Directory)
    $sqlTenants = "CREATE TABLE IF NOT EXISTS `mc_tenants` (
        `id` VARCHAR(64) NOT NULL PRIMARY KEY,
        `lead_id` VARCHAR(64) DEFAULT NULL,
        `name` VARCHAR(255) NOT NULL,
        `company` VARCHAR(255) NOT NULL,
        `role` VARCHAR(255) DEFAULT '',
        `email` VARCHAR(255) NOT NULL,
        `phone` VARCHAR(64) NOT NULL,
        `space_assigned` VARCHAR(255) NOT NULL,
        `workstations` INT DEFAULT 1,
        `parking_bays` VARCHAR(255) DEFAULT '',
        `badge_ids` LONGTEXT DEFAULT NULL,
        `lease_start` VARCHAR(64) DEFAULT NULL,
        `monthly_rent` VARCHAR(128) DEFAULT '',
        `status` VARCHAR(32) NOT NULL DEFAULT 'active',
        `is_from_won_lead` TINYINT(1) DEFAULT 0,
        `updated_at` VARCHAR(64) NOT NULL,
        INDEX idx_status (`status`),
        INDEX idx_lead (`lead_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    // 4. Settings & CMS Key-Value Store
    $sqlSettings = "CREATE TABLE IF NOT EXISTS `mc_settings` (
        `setting_key` VARCHAR(128) NOT NULL PRIMARY KEY,
        `setting_value` LONGTEXT NOT NULL,
        `updated_at` VARCHAR(64) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    // 5. Activity / Sync Logs
    $sqlLogs = "CREATE TABLE IF NOT EXISTS `mc_sync_logs` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `action` VARCHAR(64) NOT NULL,
        `details` TEXT DEFAULT NULL,
        `ip_address` VARCHAR(64) DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $pdo->exec($sqlLeads);
    $pdo->exec($sqlSpaces);
    $pdo->exec($sqlTenants);
    $pdo->exec($sqlSettings);
    $pdo->exec($sqlLogs);

    // Auto-seed if empty
    autoSeedIfEmpty($pdo);
}

function autoSeedIfEmpty($pdo) {
    // 1. Seed Spaces if empty
    $spaceCount = (int)$pdo->query("SELECT COUNT(*) FROM `mc_spaces`")->fetchColumn();
    if ($spaceCount === 0) {
        $now = date('c');
        $spacesSeed = [
            [
                'id' => 'office-17m',
                'name' => 'Bureau Privatif 17 m²',
                'category' => 'private',
                'area' => '17 m²',
                'capacity' => '3 à 4 postes de travail',
                'price' => '750 € HT',
                'period' => 'par mois',
                'status' => 'available',
                'status_text' => 'Disponible immédiatement',
                'image' => '/images/spaces/bureau-privatif-17m.png',
                'parking_included' => 1,
                'features' => json_encode([
                    "Ameublement personnalisé haut de gamme",
                    "Accès sécurisé 24h/24 et 7j/7 par badge",
                    "Domiciliation d'entreprise comprise (1ère année)",
                    "Accès illimité cuisine équipée & sanitaires",
                    "Boissons chaudes/froides & snacks inclus",
                    "Internet fibre ultra haut débit dédié"
                ], JSON_UNESCAPED_UNICODE)
            ],
            [
                'id' => 'office-25m',
                'name' => 'Bureau privatif 25m²',
                'category' => 'private',
                'area' => '25 m²',
                'capacity' => '5 à 6 postes de travail',
                'price' => '1 200 € HT',
                'period' => 'par mois',
                'status' => 'available',
                'status_text' => '1 bureau disponible',
                'image' => '/images/spaces/bureau-privatif-25m.png',
                'parking_included' => 1,
                'features' => json_encode([
                    "Ameublement personnalisé haut de gamme",
                    "Accès sécurisé 24h/24 et 7j/7 par badge",
                    "Domiciliation d'entreprise comprise (1ère année)",
                    "Accès illimité cuisine équipée & sanitaires",
                    "Boissons chaudes/froides & snacks inclus",
                    "Internet fibre ultra haut débit dédié"
                ], JSON_UNESCAPED_UNICODE)
            ],
            [
                'id' => 'open-fixe-a',
                'name' => 'Open Space — Espace A (Poste Fixe)',
                'category' => 'open',
                'area' => '35 m²',
                'capacity' => '5 postes résidents max (2 occupés / 3 libres)',
                'price' => '250 € HT',
                'period' => 'par mois par poste',
                'status' => 'available',
                'status_text' => '3 postes disponibles',
                'image' => '/images/spaces/open-space-fixe.jpg',
                'parking_included' => 0,
                'features' => json_encode([
                    "Bureau attitré avec caisson sécurisé",
                    "Accès 24/7 par badge RFID",
                    "Ambiance feutrée (< 42 dB)",
                    "Accès phonebox privative",
                    "Café barista & thés bio inclus"
                ], JSON_UNESCAPED_UNICODE)
            ],
            [
                'id' => 'open-fixe-b',
                'name' => 'Open Space — Espace B (Poste Fixe)',
                'category' => 'open',
                'area' => '35 m²',
                'capacity' => '5 postes résidents max (3 occupés / 2 libres)',
                'price' => '250 € HT',
                'period' => 'par mois par poste',
                'status' => 'available',
                'status_text' => '2 postes disponibles',
                'image' => '/images/spaces/real-open-space-fixe-4k.jpg',
                'parking_included' => 0,
                'features' => json_encode([
                    "Bureau attitré avec caisson sécurisé",
                    "Accès 24/7 par badge RFID",
                    "Ambiance feutrée (< 42 dB)",
                    "Accès phonebox privative",
                    "Café barista & thés bio inclus"
                ], JSON_UNESCAPED_UNICODE)
            ],
            [
                'id' => 'open-nomad',
                'name' => 'Open Space — Poste Flexible Nomade',
                'category' => 'open',
                'area' => 'Accès nomade',
                'capacity' => 'Sur réservation préalable',
                'price' => '20 € / 10 € HT',
                'period' => 'journée (20€) / demi-journée (10€)',
                'status' => 'available',
                'status_text' => 'Accessible en ligne',
                'image' => '/images/spaces/real-open-space-nomade-4k.jpg',
                'parking_included' => 0,
                'features' => json_encode([
                    "Fibre optique sécurisée",
                    "Accès phonebox acoustique",
                    "Accès libre cuisine équipée",
                    "Boissons chaudes & gourmandises incluses"
                ], JSON_UNESCAPED_UNICODE)
            ],
            [
                'id' => 'meeting-30m',
                'name' => 'Grande Salle de Réunion 30 m²',
                'category' => 'meeting',
                'area' => '30 m²',
                'capacity' => "Jusqu'à 14 participants",
                'price' => '120 € / 200 € HT',
                'period' => 'demi-journée (120€) / journée entière (200€)',
                'status' => 'occupied',
                'status_text' => 'Réservée (1 réservation confirmée)',
                'image' => '/images/spaces/real-meeting-room-30m-4k.jpg',
                'parking_included' => 1,
                'features' => json_encode([
                    "Écran 4K 75 pouces avec ClickShare & HDMI",
                    "Système de visioconférence Polycom HD",
                    "Machine barista espresso & sélection de thés",
                    "Table en chêne massif avec prises intégrées"
                ], JSON_UNESCAPED_UNICODE)
            ]
        ];

        $insSpace = $pdo->prepare("INSERT INTO `mc_spaces` (id, name, category, area, capacity, price, period, status, status_text, image, parking_included, features, active_bookings, updated_at) VALUES (:id, :name, :category, :area, :capacity, :price, :period, :status, :status_text, :image, :parking_included, :features, '[]', :updated_at)");
        foreach ($spacesSeed as $s) {
            $s['updated_at'] = $now;
            $insSpace->execute($s);
        }
    }

    // 2. Seed Tenants if empty
    $tenantCount = (int)$pdo->query("SELECT COUNT(*) FROM `mc_tenants`")->fetchColumn();
    if ($tenantCount === 0) {
        $now = date('c');
        $tenantsSeed = [
            [
                'id' => 'TEN-001',
                'lead_id' => null,
                'name' => 'Goizet Gestion SARL (Edgar Goizet)',
                'company' => 'Goizet Gestion SARL',
                'role' => 'Partenaire Résident & Gestion Immobilière',
                'email' => 'edgar@goizetgestion.fr',
                'phone' => '05 56 00 22 10',
                'space_assigned' => 'Bureau Privatif Résident (Aile Est)',
                'workstations' => 4,
                'parking_bays' => 'Places #1 & #2',
                'badge_ids' => json_encode(['BADGE-048-A', 'BADGE-048-B']),
                'lease_start' => '2024-01-15',
                'monthly_rent' => 'Convention Partenaire',
                'status' => 'active',
                'is_from_won_lead' => 0,
                'updated_at' => $now
            ],
            [
                'id' => 'TEN-086',
                'lead_id' => 'MC-2026-086',
                'name' => 'Bordeaux Strategy Consulting (Hélène Mercier)',
                'company' => 'Bordeaux Strategy Consulting',
                'role' => 'Client Salle de Réunion',
                'email' => 'hmercier@bordeaux-consulting.fr',
                'phone' => '06 50 11 29 84',
                'space_assigned' => 'Grande Salle de Réunion 30 m² (Réservée le 2026-10-24)',
                'workstations' => 12,
                'parking_bays' => 'Parking Visiteurs Réservé',
                'badge_ids' => json_encode(['BADGE-048-010']),
                'lease_start' => '2026-10-24',
                'monthly_rent' => '200 € HT (Journée)',
                'status' => 'active',
                'is_from_won_lead' => 1,
                'updated_at' => $now
            ]
        ];

        $insTenant = $pdo->prepare("INSERT INTO `mc_tenants` (id, lead_id, name, company, role, email, phone, space_assigned, workstations, parking_bays, badge_ids, lease_start, monthly_rent, status, is_from_won_lead, updated_at) VALUES (:id, :lead_id, :name, :company, :role, :email, :phone, :space_assigned, :workstations, :parking_bays, :badge_ids, :lease_start, :monthly_rent, :status, :is_from_won_lead, :updated_at)");
        foreach ($tenantsSeed as $t) {
            $insTenant->execute($t);
        }
    }
}
