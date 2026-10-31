import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { getLeads, addLead, updateLead, deleteLead } from "../src/lib/leads";
import { getAdminConfig, saveAdminConfig } from "../src/lib/adminConfig";

const CRM_FILE = path.join(process.cwd(), "src", "data", "crm_leads.json");
const CONFIG_FILE = path.join(process.cwd(), "src", "data", "admin_config.json");

describe("Database CRUD: Read, Write, Show, Update & Delete Persistence", () => {
  const TEST_LEAD_EMAIL = `db.test.${Date.now()}@bordeaux-audit.fr`;
  let testLeadId = "";

  it("DATABASE READ: verifies JSON database file exists and contains valid JSON", () => {
    assert.ok(fs.existsSync(CRM_FILE), "src/data/crm_leads.json must exist");
    const raw = fs.readFileSync(CRM_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    assert.ok(Array.isArray(parsed), "CRM leads file must contain an array");
    assert.ok(parsed.length > 0, "Must contain seed leads");
  });

  it("DATABASE WRITE: writes a new lead record and confirms persistence on disk", () => {
    const lead = addLead({
      name: "Marcus Aurelius Audit",
      email: TEST_LEAD_EMAIL,
      phone: "+33 6 99 88 77 66",
      company: "Aurelius Advisory Bordeaux",
      type: "private-office",
      officeSize: "28 m² (5-6 postes)",
      visitRequested: true,
      source: "Database Integrity Test",
      status: "new",
      priority: "high"
    });

    assert.ok(lead.id, "Must generate lead ID");
    testLeadId = lead.id;

    // Verify raw file on disk immediately contains the new record
    const rawOnDisk = fs.readFileSync(CRM_FILE, "utf-8");
    assert.ok(rawOnDisk.includes(TEST_LEAD_EMAIL), "File on disk must contain the written email");
    assert.ok(rawOnDisk.includes(testLeadId), "File on disk must contain the new lead ID");
  });

  it("DATABASE SHOW & QUERY: retrieves and parses written record through engine queries", () => {
    const allLeads = getLeads();
    const found = allLeads.find((l) => l.id === testLeadId);
    assert.ok(found, "Record must be retrievable from getLeads()");
    assert.equal(found?.name, "Marcus Aurelius Audit");
    assert.equal(found?.email, TEST_LEAD_EMAIL);
    assert.equal(found?.status, "new");
  });

  it("DATABASE UPDATE: mutates record status to 'won' and confirms updated timestamps on disk", () => {
    const updated = updateLead(testLeadId, {
      status: "won",
      notes: [{ id: "n-1", author: "DB Admin", text: "Bail signé 1200€ HT", createdAt: new Date().toISOString() }]
    });

    assert.equal(updated?.status, "won");

    // Read directly from disk
    const raw = fs.readFileSync(CRM_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    const diskRecord = parsed.find((l: any) => l.id === testLeadId);
    assert.equal(diskRecord.status, "won", "Disk record status must be 'won'");
    assert.ok(diskRecord.updatedAt, "Disk record must have updatedAt timestamp");
  });

  it("DATABASE DELETE & CLEANUP: deletes record and confirms removal from disk", () => {
    const deleted = deleteLead(testLeadId);
    assert.equal(deleted, true);

    const raw = fs.readFileSync(CRM_FILE, "utf-8");
    assert.ok(!raw.includes(TEST_LEAD_EMAIL), "Disk file must no longer contain deleted test lead");
  });

  it("DATABASE CONFIG READ/WRITE: tests persistence and integrity of admin_config.json", () => {
    assert.ok(fs.existsSync(CONFIG_FILE), "admin_config.json must exist");
    const originalConfig = getAdminConfig();

    const testName = `Paul (Directeur QA - ${Date.now()})`;
    saveAdminConfig({ name: testName });

    const updatedRaw = fs.readFileSync(CONFIG_FILE, "utf-8");
    const updatedJson = JSON.parse(updatedRaw);
    assert.equal(updatedJson.name, testName, "Config file must persist updated name");

    // Restore original config
    saveAdminConfig(originalConfig);
    const restored = getAdminConfig();
    assert.equal(restored.name, originalConfig.name);
  });
});
