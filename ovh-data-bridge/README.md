# MAISON CALVÉ — OVH CLOUD DATA BRIDGE (PHP + MySQL)

## 📁 OVH File Structure & Placement

In OVH Web Cloud Hosting (`uwenyoi.cluster131.hosting.ovh.net`), your root directory is `www/`.
Since you already have an API inside `www/`, place the Maison Calvé API bridge in a dedicated subfolder:
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

## 🗄️ Database Tables Overview

| Table Name | Associated Admin Page | Description |
|------------|-----------------------|-------------|
| **`mc_leads`** | **Opportunity Board** (`/admin/pipeline`) | Stores all leads across stages (`New Leads`, `Contacted`, `Qualified`, `Viewing / Meeting`, `Won / Signed`, `Closed`). Drag & drop or status change immediately updates the database. |
| **`mc_spaces`** | **Spaces & Offices Inventory** (`/admin/spaces`) | Stores private suites, open space desks, meeting rooms, capacity, status, and pricing. Edits and toggles persist directly in MySQL. |
| **`mc_tenants`** | **Tenants & Residents Directory** (`/admin/tenants`) | Stores resident companies, badges, leases, desks and contacts. Full create, edit and delete functionality saved to MySQL. |
| **`mc_settings`** | **Global Settings** (`/admin/settings`) | Key-value store for agency configuration and legal notices. |
| **`mc_sync_logs`** | System Audit | Logs system actions and sync events. |

---

## 🚀 Setup Steps (Step-by-Step)

### Step 1: Execute SQL Schema in phpMyAdmin
1. Log in to your OVH Web Cloud dashboard:
   `https://www.ovh.com/manager/`
2. Go to **Web Cloud** > **Hosting plans** > **`uwenyoi.cluster131.hosting.ovh.net`** > **Databases**.
3. Next to `uwenyoimaison`, click the `...` menu and select **Access phpMyAdmin**.
4. Log in with:
   - User: `uwenyoimaison`
   - Password: `xMrLT9mvNUCecCn`
5. Click on the database `uwenyoimaison` in the left sidebar.
6. Click the **SQL** tab.
7. Open `schema.sql` (from the `ovh-data-bridge/` folder), copy all SQL, paste it into the phpMyAdmin SQL box, and click **Go** (Exécuter).

> **Done!** All tables are created and seeded with the 18 current leads, all workspace inventory, and all tenants.

---

### Step 2: Upload the Bridge Files to OVH File Manager
1. In OVH Manager, go to **FTP - SSH** > **FTP Explorer** (or connect via FileZilla).
2. Inside the **`www`** folder, create a new folder named: **`maison-api`**.
3. Upload all files from the `ovh-data-bridge/` folder into `/www/maison-api/`:
   - `config.php`
   - `db.php`
   - `index.php`
   - `test.php`
   - `.htaccess`
   - `schema.sql`

---

### Step 3: Verification
Open in your browser:
👉 **`https://uwenyoi.cluster131.hosting.ovh.net/maison-api/test.php`**

You should see:
- `● Connected & Operational` (Green badge)
- `mc_leads`: 18 rows
- `mc_spaces`: 6 rows
- `mc_tenants`: 2 rows
