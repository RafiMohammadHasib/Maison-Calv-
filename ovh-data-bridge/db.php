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

    // 3. Seed Leads if empty
    $leadCount = (int)$pdo->query("SELECT COUNT(*) FROM `mc_leads`")->fetchColumn();
    if ($leadCount === 0) {
        $sqlIns = "INSERT INTO `mc_leads` (id, name, email, phone, company, type, office_size, workstation_count, open_space_plan, date, time_slot, attendees, meeting_purpose, visit_requested, source, status, priority, message, created_at, updated_at, notes) VALUES (:id, :name, :email, :phone, :company, :type, :office_size, :workstation_count, :open_space_plan, :date, :time_slot, :attendees, :meeting_purpose, :visit_requested, :source, :status, :priority, :message, :created_at, :updated_at, :notes)";
        $insLead = $pdo->prepare($sqlIns);
        $leadsSeed = [
            [
                'id' => "MC-2026-107",
                'name' => "Rafi",
                'email' => "hello@gta.com",
                'phone' => "+33 6 015211123",
                'company' => "Studio",
                'type' => "private-office",
                'office_size' => "28 m² (5-6 postes)",
                'workstation_count' => 5,
                'open_space_plan' => null,
                'date' => null,
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Private Tour (Hero)",
                'status' => "contacted",
                'priority' => "urgent",
                'message' => "",
                'created_at' => "2026-10-28T11:25:53.300Z",
                'updated_at' => "2026-10-28T12:00:13.222Z",
                'notes' => "[]"
            ],
            [
                'id' => "MC-2026-098",
                'name' => "Sophie Desgranges",
                'email' => "sophie@desgranges-archi.fr",
                'phone' => "06 33 44 55 66",
                'company' => "Desgranges Architecture & Patrimoine",
                'type' => "private-office",
                'office_size' => "21 m² (3-4 postes)",
                'workstation_count' => 3,
                'open_space_plan' => null,
                'date' => null,
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Private Tour (Hero)",
                'status' => "tour_scheduled",
                'priority' => "urgent",
                'message' => "Bonjour, nous souhaitons visiter le bureau de 21 m² jeudi matin vers 10h. Merci !",
                'created_at' => "2026-10-28T07:38:46.213Z",
                'updated_at' => "2026-10-28T11:46:48.229Z",
                'notes' => "[{\"id\":\"note-1793173203823\",\"author\":\"Paul (Directeur)\",\"text\":\"Visite confirmée pour jeudi 10h avec Paul (accueil café offert)\",\"createdAt\":\"2026-10-28T07:40:03.823Z\"}]"
            ],
            [
                'id' => "MC-2026-097",
                'name' => "Rafi",
                'email' => "rafi.euroit@gmail.com",
                'phone' => "01521112363",
                'company' => "Grand Trend Agency",
                'type' => "open-space",
                'office_size' => null,
                'workstation_count' => 1,
                'open_space_plan' => "fixe",
                'date' => null,
                'time_slot' => "full-day",
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Visit (Header)",
                'status' => "qualified",
                'priority' => "high",
                'message' => "",
                'created_at' => "2026-10-28T06:33:53.448Z",
                'updated_at' => "2026-10-28T09:33:37.363Z",
                'notes' => "[]"
            ],
            [
                'id' => "MC-2026-096",
                'name' => "Julien Mercier",
                'email' => "j.mercier@gironde-tech.fr",
                'phone' => "06 77 12 34 56",
                'company' => "Gironde Tech Studio",
                'type' => "open-space",
                'office_size' => null,
                'workstation_count' => 2,
                'open_space_plan' => "fixe",
                'date' => "2026-11-08",
                'time_slot' => "morning",
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Visit (Header)",
                'status' => "closed",
                'priority' => "high",
                'message' => "Demande de visite pour tester l'ambiance calme et le wifi avant engagement résident.",
                'created_at' => "2026-10-28T06:05:43.892Z",
                'updated_at' => "2026-10-28T11:39:19.999Z",
                'notes' => "[{\"id\":\"note-1793180002753\",\"author\":\"Paul (Directeur)\",\"text\":\"📞 Phone call completed: high interest\",\"createdAt\":\"2026-10-28T09:33:22.753Z\"}]"
            ],
            [
                'id' => "MC-2026-095",
                'name' => "Claire Delaunay",
                'email' => "claire.delaunay@bordeaux-notaires.fr",
                'phone' => "06 99 44 22 11",
                'company' => "Étude Notariale Delaunay & Co",
                'type' => "private-office",
                'office_size' => "28 m² (5-6 postes)",
                'workstation_count' => 5,
                'open_space_plan' => null,
                'date' => "2026-11-04",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Private Tour (Hero)",
                'status' => "tour_scheduled",
                'priority' => "urgent",
                'message' => "Bonjour, nous souhaitons réserver une visite privée pour le bureau de 28 m². Équipe de 5 personnes avec besoin de 2 places de parking.",
                'created_at' => "2026-10-28T06:05:31.913Z",
                'updated_at' => "2026-10-28T06:06:44.541Z",
                'notes' => "[]"
            ],
            [
                'id' => "MC-2026-089",
                'name' => "Edouard de Montalembert",
                'email' => "e.montalembert@cabinet-avocats33.fr",
                'phone' => "06 42 18 90 22",
                'company' => "Montalembert & Associés (Avocats d'affaires)",
                'type' => "private-office",
                'office_size' => "28 m² (5-6 postes)",
                'workstation_count' => 5,
                'open_space_plan' => null,
                'date' => "2026-11-05",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Private Tour (Hero)",
                'status' => "tour_scheduled",
                'priority' => "urgent",
                'message' => "Recherche un bureau de prestige et standing pour notre équipe de 5 associés. Besoin impératif de 2 places de parking dans la cour privée.",
                'created_at' => "2026-10-28T02:03:14.761Z",
                'updated_at' => "2026-10-28T04:03:14.761Z",
                'notes' => "[{\"id\":\"note-1\",\"author\":\"Paul (Directeur)\",\"text\":\"Visite privée confirmée pour jeudi 5 nov à 14h30 avec dégustation café.\",\"createdAt\":\"2026-10-28T04:03:14.761Z\"}]"
            ],
            [
                'id' => "MC-2026-088",
                'name' => "Camille Vasseur",
                'email' => "c.vasseur@aquitaine-capital.com",
                'phone' => "07 88 55 12 34",
                'company' => "Aquitaine Venture Capital",
                'type' => "private-office",
                'office_size' => "21 m² (3-4 postes)",
                'workstation_count' => 3,
                'open_space_plan' => null,
                'date' => "2026-11-03",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Visit (Header)",
                'status' => "new",
                'priority' => "high",
                'message' => "Installation prévue début décembre. Nous souhaitons découvrir le bureau de 21 m² et tester l'insonorisation.",
                'created_at' => "2026-10-20T19:03:14.761Z",
                'updated_at' => "2026-10-20T19:03:14.761Z",
                'notes' => "[]"
            ],
            [
                'id' => "MC-2026-087",
                'name' => "Alexandre Bonnet",
                'email' => "alexandre@studio-archibordeaux.fr",
                'phone' => "06 19 82 43 00",
                'company' => "Studio Bonnet Architectes",
                'type' => "open-space",
                'office_size' => null,
                'workstation_count' => 2,
                'open_space_plan' => "fixe",
                'date' => "2026-10-27",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Visit (Header)",
                'status' => "visited",
                'priority' => "normal",
                'message' => "Deux postes fixes souhaités dans le premier open space de 5 postes. Avons visité lundi matin.",
                'created_at' => "2026-10-20T14:30:00.000Z",
                'updated_at' => "2026-10-21T09:00:00.000Z",
                'notes' => "[{\"id\":\"note-2\",\"author\":\"Paul\",\"text\":\"Visite très positive. Contrat de bail en cours de préparation.\",\"createdAt\":\"2026-10-21T09:00:00.000Z\"}]"
            ],
            [
                'id' => "MC-2026-086",
                'name' => "Hélène Mercier",
                'email' => "hmercier@bordeaux-consulting.fr",
                'phone' => "06 50 11 29 84",
                'company' => "Bordeaux Strategy Consulting",
                'type' => "meeting-room",
                'office_size' => null,
                'workstation_count' => 1,
                'open_space_plan' => null,
                'date' => "2026-10-24",
                'time_slot' => "full-day",
                'attendees' => 12,
                'meeting_purpose' => "Comité de direction trimestriel",
                'visit_requested' => 0,
                'source' => "Meeting Room Booking",
                'status' => "won",
                'priority' => "normal",
                'message' => "Journée complète avec formule café barista et accueil 12 personnes avec projection 4K.",
                'created_at' => "2026-10-19T10:15:00.000Z",
                'updated_at' => "2026-10-20T11:00:00.000Z",
                'notes' => "[{\"id\":\"note-3\",\"author\":\"Équipe\",\"text\":\"Paiement 200€ HT validé. Clés et code d'accès envoyés.\",\"createdAt\":\"2026-10-20T11:00:00.000Z\"}]"
            ],
            [
                'id' => "MC-2026-085",
                'name' => "Thomas Laroche",
                'email' => "thomas.laroche@fintech-gironde.io",
                'phone' => "07 62 90 01 15",
                'company' => "PayGironde SAS",
                'type' => "private-office",
                'office_size' => "21 m² (3-4 postes)",
                'workstation_count' => 4,
                'open_space_plan' => null,
                'date' => "2026-10-23",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Private Tour (Hero)",
                'status' => "qualified",
                'priority' => "high",
                'message' => "Intéressé par le forfait 750€ HT avec domiciliation d'entreprise.",
                'created_at' => "2026-10-18T16:20:00.000Z",
                'updated_at' => "2026-10-19T08:30:00.000Z",
                'notes' => "[{\"id\":\"note-4\",\"author\":\"Paul\",\"text\":\"En attente de signature Kbis.\",\"createdAt\":\"2026-10-19T08:30:00.000Z\"}]"
            ],
            [
                'id' => "MC-2026-084",
                'name' => "Duverger Mathilde",
                'email' => "m.duverger@bordeaux-notariat.fr",
                'phone' => "06 95 66 54 71",
                'company' => "Étude Notariale Duverger",
                'type' => "private-office",
                'office_size' => "28 m² (5-6 postes)",
                'workstation_count' => 5,
                'open_space_plan' => null,
                'date' => "2026-10-21",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Private Tour (Hero)",
                'status' => "contacted",
                'priority' => "high",
                'message' => "Demande d'information pour le bureau de 28 m². Échange téléphonique positif ce matin.",
                'created_at' => "2026-10-17T09:15:00.000Z",
                'updated_at' => "2026-10-18T10:30:00.000Z",
                'notes' => "[{\"id\":\"note-5\",\"author\":\"Paul (Directeur)\",\"text\":\"Premier contact établi. Documentation tarifaire envoyée.\",\"createdAt\":\"2026-10-18T10:30:00.000Z\"}]"
            ],
            [
                'id' => "MC-2026-083",
                'name' => "Inès Akkouche",
                'email' => "ines.akkouche@design-aquitaine.com",
                'phone' => "06 59 87 91 68",
                'company' => "Studio Inès Design",
                'type' => "open-space",
                'office_size' => "Poste Fixe (250€ HT)",
                'workstation_count' => 2,
                'open_space_plan' => "fixe",
                'date' => "2026-10-23",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Visit (Header)",
                'status' => "tour_scheduled",
                'priority' => "high",
                'message' => "Visite du premier open space de 5 postes prévue ce vendredi à 14h.",
                'created_at' => "2026-10-16T14:20:00.000Z",
                'updated_at' => "2026-10-17T08:00:00.000Z",
                'notes' => "[]"
            ],
            [
                'id' => "MC-2026-082",
                'name' => "Goizet Paul",
                'email' => "paul@goizetgestion.fr",
                'phone' => "05 56 00 22 10",
                'company' => "Goizet Gestion SARL",
                'type' => "private-office",
                'office_size' => "Bureau Résident Aile Est",
                'workstation_count' => 4,
                'open_space_plan' => null,
                'date' => "2026-10-22",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 0,
                'source' => "Owner / Resident Enquiry",
                'status' => "closed",
                'priority' => "normal",
                'message' => "Gestion courante convention partenaire.",
                'created_at' => "2026-10-15T11:00:00.000Z",
                'updated_at' => "2026-10-15T11:00:00.000Z",
                'notes' => "[]"
            ],
            [
                'id' => "MC-2026-081",
                'name' => "Marc de La Tour",
                'email' => "m.delatour@vignobles-conseil.fr",
                'phone' => "06 21 44 88 90",
                'company' => "Château & Vignobles Conseil",
                'type' => "private-office",
                'office_size' => "21 m² (3-4 postes)",
                'workstation_count' => 3,
                'open_space_plan' => null,
                'date' => "2026-10-15",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Private Tour (Hero)",
                'status' => "visited",
                'priority' => "high",
                'message' => "Recherche un bureau privatif au calme pour conseil en acquisitions viticoles.",
                'created_at' => "2026-10-13T10:15:00.000Z",
                'updated_at' => "2026-10-14T14:00:00.000Z",
                'notes' => "[{\"id\":\"note-081\",\"author\":\"Paul (Directeur)\",\"text\":\"Visite réalisée avec succès. Offre commerciale 750€ HT envoyée.\",\"createdAt\":\"2026-10-14T14:00:00.000Z\"}]"
            ],
            [
                'id' => "MC-2026-080",
                'name' => "Sandrine Vasseur",
                'email' => "s.vasseur@bma-audit.fr",
                'phone' => "06 78 90 12 34",
                'company' => "BMA Audit & Commissariat",
                'type' => "private-office",
                'office_size' => "28 m² (5-6 postes)",
                'workstation_count' => 5,
                'open_space_plan' => null,
                'date' => "2026-10-14",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Private Tour (Hero)",
                'status' => "negotiating",
                'priority' => "urgent",
                'message' => "Audit de comptes annuels. Besoin de 5 postes et accès salle de réunion.",
                'created_at' => "2026-10-11T15:30:00.000Z",
                'updated_at' => "2026-10-12T09:00:00.000Z",
                'notes' => "[{\"id\":\"note-080\",\"author\":\"Paul (Directeur)\",\"text\":\"Contrat bail dérogatoire en relecture par leur expert-comptable.\",\"createdAt\":\"2026-10-12T09:00:00.000Z\"}]"
            ],
            [
                'id' => "MC-2026-079",
                'name' => "Lucas Fontaine",
                'email' => "lucas@alpha-design.studio",
                'phone' => "07 45 12 39 88",
                'company' => "Studio Alpha UX",
                'type' => "open-space",
                'office_size' => null,
                'workstation_count' => 2,
                'open_space_plan' => "fixe",
                'date' => "2026-10-12",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Visit (Header)",
                'status' => "visited",
                'priority' => "normal",
                'message' => "Recherche 2 postes résidents permanents avec fibre très haut débit.",
                'created_at' => "2026-10-09T09:00:00.000Z",
                'updated_at' => "2026-10-10T18:00:00.000Z",
                'notes' => "[{\"id\":\"note-079\",\"author\":\"Paul (Directeur)\",\"text\":\"Essai d'une journée effectué. Très satisfait de l'ambiance.\",\"createdAt\":\"2026-10-10T18:00:00.000Z\"}]"
            ],
            [
                'id' => "MC-2026-078",
                'name' => "Élise Beaumont",
                'email' => "elise.beaumont@capdigital-aquitaine.org",
                'phone' => "06 33 21 77 40",
                'company' => "Cap Digital Aquitaine",
                'type' => "meeting-room",
                'office_size' => null,
                'workstation_count' => 1,
                'open_space_plan' => null,
                'date' => "2026-10-06",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 0,
                'source' => "Meeting Room Booking",
                'status' => "tour_scheduled",
                'priority' => "normal",
                'message' => "Réservation salle de réunion 30m² pour assemblée générale régionale.",
                'created_at' => "2026-10-05T11:20:00.000Z",
                'updated_at' => "2026-10-28T12:00:01.394Z",
                'notes' => "[{\"id\":\"note-078\",\"author\":\"Paul\",\"text\":\"Prestation facturée et réglée.\",\"createdAt\":\"2026-10-06T17:00:00.000Z\"}]"
            ],
            [
                'id' => "MC-2026-077",
                'name' => "Antoine Roche",
                'email' => "a.roche@roche-partners.eu",
                'phone' => "06 89 54 12 00",
                'company' => "Roche & Partners M&A",
                'type' => "private-office",
                'office_size' => "28 m² (5-6 postes)",
                'workstation_count' => 4,
                'open_space_plan' => null,
                'date' => "2026-10-05",
                'time_slot' => null,
                'attendees' => null,
                'meeting_purpose' => null,
                'visit_requested' => 1,
                'source' => "Book a Private Tour (Hero)",
                'status' => "contacted",
                'priority' => "high",
                'message' => "Recherche bureau de standing secteur Fondaudège / Jardin Public.",
                'created_at' => "2026-10-03T16:45:00.000Z",
                'updated_at' => "2026-10-04T10:00:00.000Z",
                'notes' => "[{\"id\":\"note-077\",\"author\":\"Paul (Directeur)\",\"text\":\"Dossier de présentation transmis par email.\",\"createdAt\":\"2026-10-04T10:00:00.000Z\"}]"
            ],
        ];
        foreach ($leadsSeed as $ld) {
            $insLead->execute($ld);
        }
    }
}

