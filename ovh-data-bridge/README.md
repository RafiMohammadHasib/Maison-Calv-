# MAISON CALVÉ — OVH CLOUD DATA BRIDGE (PHP + MySQL)

## 📁 OVH File Structure & Placement

In OVH Web Cloud Hosting (`uwenyoi.cluster131.hosting.ovh.net`), your root directory is `www/`.
Since you already have an API inside `www/`, **do NOT overwrite `www/`**.

Instead, inside the `www` folder in OVH File Manager, create a subfolder named:
```text
www/
└── maison-api/
    ├── config.php
    ├── db.php
    ├── index.php
    ├── test.php
    ├── schema.sql
    └── .htaccess
```

---

## 🚀 Setup Steps (Step-by-Step)

### Step 1: Open OVH File Manager
1. Go to your OVH Cloud Manager dashboard:
   `https://www.ovh.com/manager/`
2. In the left menu, click **Web Cloud** > **Hosting plans** > **`uwenyoi.cluster131.hosting.ovh.net`**.
3. Click the **FTP - SSH** tab.
4. Click **FTP Explorer** (Net2FTP) or connect via FileZilla using the FTP credentials shown in that tab.

### Step 2: Create `maison-api` Folder
1. Inside the file manager, open the `www` folder.
2. Click **New folder** / **Create Directory**.
3. Name it: `maison-api`
4. Enter the `maison-api` folder (`/www/maison-api`).

### Step 3: Upload the Bridge Files
Upload all files from the local `ovh-data-bridge/` folder into `/www/maison-api/`:
- `config.php`
- `db.php`
- `index.php`
- `test.php`
- `schema.sql`
- `.htaccess`

> **Note:** The database credentials are already configured in `config.php`:
> - Database: `uwenyoimaison`
> - User: `uwenyoimaison`
> - Host: `uwenyoimaison.mysql.db`
> - Password: `xMrLT9mvNUCecCn`

---

## 🔍 Verification & Testing

Once uploaded, open this URL in your web browser:
👉 **`https://uwenyoi.cluster131.hosting.ovh.net/maison-api/test.php`**

You will see the **Maison Calvé OVH Bridge Diagnostics** dashboard:
1. It will automatically connect to `uwenyoimaison.mysql.db`.
2. It will automatically create the required tables:
   - `mc_leads`
   - `mc_settings`
   - `mc_sync_logs`
3. A green badge `● Connected & Operational` will appear!

---

## 🔄 One-Click Lead Migration from Website Admin

1. Open your Maison Calvé Admin: `http://localhost:3000/admin` (or your live site).
2. Go to **Settings** (`/admin/settings`).
3. Click the **Base MySQL OVH** tab.
4. Click **Tester la Connexion OVH** to verify the handshake.
5. Click **Migrer tous les Leads vers OVH** — this will copy all your leads directly into the OVH MySQL database!

---

## 🛡️ Security Details

- The bridge is secured with an API Secret Key:
  `mc_sec_ovh_uwenyoimaison_2026`
- All requests sent from the Next.js server include the `X-API-KEY` header.
- External browsers cannot view or modify leads without the valid secret key.

