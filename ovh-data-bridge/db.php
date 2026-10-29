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
 * Automatically ensure required tables exist in uwenyoimaison database.
 */
function ensureTablesExist($pdo) {
    // 1. Leads Table (CRM & Enquiries)
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

    // 2. Settings & CMS Key-Value Store
    $sqlSettings = "CREATE TABLE IF NOT EXISTS `mc_settings` (
        `setting_key` VARCHAR(128) NOT NULL PRIMARY KEY,
        `setting_value` LONGTEXT NOT NULL,
        `updated_at` VARCHAR(64) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    // 3. Activity / Sync Logs
    $sqlLogs = "CREATE TABLE IF NOT EXISTS `mc_sync_logs` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `action` VARCHAR(64) NOT NULL,
        `details` TEXT DEFAULT NULL,
        `ip_address` VARCHAR(64) DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $pdo->exec($sqlLeads);
    $pdo->exec($sqlSettings);
    $pdo->exec($sqlLogs);
}

