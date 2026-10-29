<?php
/**
 * Maison Calvé — OVH Database Bridge Visual Diagnostic Tool
 * Open this file in your browser after uploading to OVH:
 * e.g., https://uwenyoi.cluster131.hosting.ovh.net/maison-api/test.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$pdoError = null;
$pdo = null;
$tablesStatus = [];
$leadCount = 0;
$spaceCount = 0;
$tenantCount = 0;
$settingsCount = 0;

try {
    $pdo = getDbConnection();
    ensureTablesExist($pdo);

    // Test tables
    $tables = ['mc_leads', 'mc_spaces', 'mc_tenants', 'mc_settings', 'mc_sync_logs'];
    foreach ($tables as $t) {
        $stmt = $pdo->query("SHOW TABLES LIKE '{$t}'");
        $tablesStatus[$t] = ($stmt->rowCount() > 0);
    }

    $leadCount = (int)$pdo->query("SELECT COUNT(*) FROM `mc_leads`")->fetchColumn();
    $spaceCount = (int)$pdo->query("SELECT COUNT(*) FROM `mc_spaces`")->fetchColumn();
    $tenantCount = (int)$pdo->query("SELECT COUNT(*) FROM `mc_tenants`")->fetchColumn();
    $settingsCount = (int)$pdo->query("SELECT COUNT(*) FROM `mc_settings`")->fetchColumn();

} catch (Exception $e) {
    $pdoError = $e->getMessage();
}

$currentUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$apiUrl = str_replace('test.php', 'index.php', $currentUrl);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maison Calvé — OVH Bridge Diagnostics</title>
    <style>
        :root {
            --bg: #0f172a;
            --card-bg: #1e293b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent: #38bdf8;
            --success: #10b981;
            --error: #ef4444;
            --border: #334155;
            --gold: #d4af37;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        body { background-color: var(--bg); color: var(--text-main); min-height: 100vh; padding: 40px 20px; display: flex; justify-content: center; align-items: flex-start; }
        .container { max-width: 860px; width: 100%; background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; }
        .header { padding: 32px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .header h1 { font-size: 20px; font-weight: 700; letter-spacing: 0.05em; color: var(--gold); }
        .header p { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
        .badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
        .badge-success { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        .badge-error { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
        .content { padding: 32px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .card { background: #0f172a; border: 1px solid var(--border); border-radius: 12px; padding: 18px; }
        .card-label { font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em; margin-bottom: 6px; }
        .card-value { font-size: 15px; font-weight: 600; color: #fff; word-break: break-all; }
        .metric-value { font-size: 24px; font-weight: 800; color: #34d399; }
        .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 12px; margin-top: 24px; }
        .list-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #0f172a; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; font-size: 14px; }
        .code-box { background: #0a0f1d; border: 1px solid var(--border); border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; color: #38bdf8; word-break: break-all; margin-top: 8px; }
        .btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; cursor: pointer; transition: background 0.2s; margin-top: 16px; margin-right: 10px; }
        .btn:hover { background: #1d4ed8; }
        .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-main); }
        .btn-outline:hover { background: #334155; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>MAISON CALVÉ</h1>
                <p>OVH Web Cloud MySQL Data Bridge Diagnostics</p>
            </div>
            <div>
                <?php if ($pdo && !$pdoError): ?>
                    <span class="badge badge-success">● Connected &amp; Operational</span>
                <?php else: ?>
                    <span class="badge badge-error">● Connection Error</span>
                <?php endif; ?>
            </div>
        </div>

        <div class="content">
            <div class="grid">
                <div class="card">
                    <div class="card-label">Database Host</div>
                    <div class="card-value"><?php echo htmlspecialchars(DB_HOST); ?></div>
                </div>
                <div class="card">
                    <div class="card-label">Database Name</div>
                    <div class="card-value"><?php echo htmlspecialchars(DB_NAME); ?></div>
                </div>
                <div class="card">
                    <div class="card-label">PHP Version</div>
                    <div class="card-value"><?php echo PHP_VERSION; ?></div>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <div class="card-label">1. Opportunities (Leads)</div>
                    <div class="metric-value"><?php echo $leadCount; ?></div>
                    <span style="font-size: 11px; color: var(--text-muted);">Table `mc_leads`</span>
                </div>
                <div class="card">
                    <div class="card-label">2. Spaces &amp; Offices</div>
                    <div class="metric-value"><?php echo $spaceCount; ?></div>
                    <span style="font-size: 11px; color: var(--text-muted);">Table `mc_spaces`</span>
                </div>
                <div class="card">
                    <div class="card-label">3. Tenants &amp; Residents</div>
                    <div class="metric-value"><?php echo $tenantCount; ?></div>
                    <span style="font-size: 11px; color: var(--text-muted);">Table `mc_tenants`</span>
                </div>
            </div>

            <?php if ($pdoError): ?>
                <div style="padding: 16px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; color: #f87171; margin-bottom: 20px;">
                    <strong>Connection Failed:</strong><br>
                    <?php echo htmlspecialchars($pdoError); ?>
                </div>
            <?php endif; ?>

            <div class="section-title">Database Tables Status (OVH MySQL)</div>
            <div class="list-item">
                <span>1. Opportunity Board &amp; Leads (<code>mc_leads</code>)</span>
                <?php if (!empty($tablesStatus['mc_leads'])): ?>
                    <span style="color: #34d399; font-weight: 600;">✓ Ready (<?php echo $leadCount; ?> rows)</span>
                <?php else: ?>
                    <span style="color: #f87171; font-weight: 600;">✗ Missing</span>
                <?php endif; ?>
            </div>
            <div class="list-item">
                <span>2. Spaces &amp; Offices Inventory (<code>mc_spaces</code>)</span>
                <?php if (!empty($tablesStatus['mc_spaces'])): ?>
                    <span style="color: #34d399; font-weight: 600;">✓ Ready (<?php echo $spaceCount; ?> rows)</span>
                <?php else: ?>
                    <span style="color: #f87171; font-weight: 600;">✗ Missing</span>
                <?php endif; ?>
            </div>
            <div class="list-item">
                <span>3. Tenants &amp; Residents Directory (<code>mc_tenants</code>)</span>
                <?php if (!empty($tablesStatus['mc_tenants'])): ?>
                    <span style="color: #34d399; font-weight: 600;">✓ Ready (<?php echo $tenantCount; ?> rows)</span>
                <?php else: ?>
                    <span style="color: #f87171; font-weight: 600;">✗ Missing</span>
                <?php endif; ?>
            </div>
            <div class="list-item">
                <span>4. Settings Store (<code>mc_settings</code>)</span>
                <?php if (!empty($tablesStatus['mc_settings'])): ?>
                    <span style="color: #34d399; font-weight: 600;">✓ Ready (<?php echo $settingsCount; ?> rows)</span>
                <?php else: ?>
                    <span style="color: #f87171; font-weight: 600;">✗ Missing</span>
                <?php endif; ?>
            </div>
            <div class="list-item">
                <span>5. Audit / Sync Logs (<code>mc_sync_logs</code>)</span>
                <?php if (!empty($tablesStatus['mc_sync_logs'])): ?>
                    <span style="color: #34d399; font-weight: 600;">✓ Ready</span>
                <?php else: ?>
                    <span style="color: #f87171; font-weight: 600;">✗ Missing</span>
                <?php endif; ?>
            </div>

            <div class="section-title">API Endpoint for Next.js Website</div>
            <div class="code-box"><?php echo htmlspecialchars($apiUrl); ?></div>

            <div class="section-title">Secret API Key</div>
            <div class="code-box"><?php echo htmlspecialchars(API_SECRET_KEY); ?></div>

            <div style="margin-top: 20px;">
                <a href="index.php?action=health" target="_blank" class="btn">Health Check (JSON)</a>
                <a href="index.php?action=leads&key=<?php echo urlencode(API_SECRET_KEY); ?>" target="_blank" class="btn btn-outline">Leads API</a>
                <a href="index.php?action=spaces&key=<?php echo urlencode(API_SECRET_KEY); ?>" target="_blank" class="btn btn-outline">Spaces API</a>
                <a href="index.php?action=tenants&key=<?php echo urlencode(API_SECRET_KEY); ?>" target="_blank" class="btn btn-outline">Tenants API</a>
            </div>
        </div>
    </div>
</body>
</html>
