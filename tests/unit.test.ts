import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createSession, verifySession, revokeSession } from "../src/lib/session";
import { getAdminConfig, saveAdminConfig, verifyAdminPassword } from "../src/lib/adminConfig";
import { getLeads, addLead, updateLead, addLeadNote, deleteLead, getCRMStats } from "../src/lib/leads";
import { getUnifiedSpaces, getInventoryMetrics } from "../src/lib/inventorySync";

describe("1. Unit Tests: Session & Cryptographic Security", () => {
  it("creates a cryptographically signed token with 3 components (UUID, expiresAt, HMAC)", async () => {
    const session = await createSession(true);
    assert.ok(session.token, "Token should be defined");
    assert.ok(session.sessionId, "Session ID should be defined");
    assert.ok(session.expiresAt > Date.now(), "Expiration should be in the future");

    const parts = session.token.split(".");
    assert.equal(parts.length, 3, "Token must be composed of sessionId.expiresAt.signature");
    assert.equal(parts[0], session.sessionId, "First part must match sessionId");
  });

  it("verifies an untampered session token as valid", async () => {
    const session = await createSession(false);
    const result = await verifySession(session.token);
    assert.equal(result.valid, true, "Untampered token must be valid");
    assert.equal(result.sessionId, session.sessionId, "Session ID must match");
  });

  it("rejects token when signature is altered by 1 character (HMAC forgery defense)", async () => {
    const session = await createSession(true);
    const parts = session.token.split(".");
    const forgedSig = parts[2].slice(0, -1) + (parts[2].slice(-1) === "a" ? "b" : "a");
    const tamperedToken = `${parts[0]}.${parts[1]}.${forgedSig}`;

    const result = await verifySession(tamperedToken);
    assert.equal(result.valid, false, "Tampered signature must be rejected");
  });

  it("rejects token when expiration payload is extended (Timestamp tampering defense)", async () => {
    const session = await createSession(true);
    const parts = session.token.split(".");
    const extendedExpiry = (parseInt(parts[1], 10) + 1000000).toString();
    const tamperedToken = `${parts[0]}.${extendedExpiry}.${parts[2]}`;

    const result = await verifySession(tamperedToken);
    assert.equal(result.valid, false, "Tampered expiry must fail HMAC verification");
  });

  it("rejects expired session tokens", async () => {
    const expiredToken = "fake-uuid-1234.1000.abc123def456";
    const result = await verifySession(expiredToken);
    assert.equal(result.valid, false, "Expired token must be rejected");
  });

  it("immediately invalidates session after explicit revocation (Logout defense)", async () => {
    const session = await createSession(true);
    const initialVerify = await verifySession(session.token);
    assert.equal(initialVerify.valid, true, "Initially token should be valid");

    revokeSession(session.token);

    const postRevoke = await verifySession(session.token);
    assert.equal(postRevoke.valid, false, "Revoked token must immediately become invalid");
  });

  it("safely handles null, undefined, and non-string token inputs without crash", async () => {
    assert.equal((await verifySession(null)).valid, false);
    assert.equal((await verifySession(undefined)).valid, false);
    assert.equal((await verifySession("" as any)).valid, false);
    assert.equal((await verifySession("malformed")).valid, false);
  });
});

describe("2. Unit Tests: Admin Configuration & Credentials", () => {
  it("retrieves baseline admin configuration", () => {
    const config = getAdminConfig();
    assert.ok(config.email, "Admin email must be present");
    assert.ok(config.name, "Admin name must be present");
  });

  it("correctly verifies default password and rejects incorrect password", () => {
    assert.equal(verifyAdminPassword("admin123"), true, "admin123 must be accepted");
    assert.equal(verifyAdminPassword("wrong_password_999"), false, "Wrong password must be rejected");
    assert.equal(verifyAdminPassword(""), false, "Empty password must be rejected");
  });

  it("persists and reads back custom admin properties safely", () => {
    const original = getAdminConfig();
    const updated = saveAdminConfig({ name: "Paul (Directeur de Site)" });
    assert.equal(updated.name, "Paul (Directeur de Site)");

    // Restore original name
    saveAdminConfig({ name: original.name });
    const restored = getAdminConfig();
    assert.equal(restored.name, original.name);
  });
});

describe("3. Unit Tests: Leads CRM Engine", () => {
  it("reads baseline leads array and computes CRM stats", () => {
    const leads = getLeads();
    assert.ok(Array.isArray(leads), "Leads must be an array");
    assert.ok(leads.length > 0, "Initial seed leads must be present");

    const stats = getCRMStats();
    assert.ok(typeof stats.totalLeads === "number", "Total leads must be a number");
    assert.ok(typeof stats.newLeads === "number", "New leads must be a number");
    assert.ok(typeof stats.conversionRate === "number", "Conversion rate must be a number");
    assert.ok(stats.totalLeads >= 0, "Total leads must be >= 0");
  });

  it("adds, updates, appends notes, and deletes a test lead cleanly", () => {
    const newLead = addLead({
      name: "Unit Test Candidate",
      email: "unit.test@maisoncalve.fr",
      phone: "+33 6 00 00 00 01",
      company: "Calve QA Labs",
      type: "private-office",
      officeSize: "21 m² (3-4 postes)",
      visitRequested: true,
      source: "Automated Unit Test",
      status: "new",
      priority: "high"
    });

    assert.ok(newLead.id.startsWith("MC-"), "Lead ID must have MC- prefix");
    assert.equal(newLead.name, "Unit Test Candidate");
    assert.equal(newLead.status, "new");

    // Update status to tour_scheduled
    const updated = updateLead(newLead.id, { status: "tour_scheduled", priority: "urgent" });
    assert.ok(updated, "Updated lead should exist");
    assert.equal(updated?.status, "tour_scheduled");
    assert.equal(updated?.priority, "urgent");

    // Add note: signature is (leadId, author, text)
    const withNote = addLeadNote(newLead.id, "Admin QA", "Visite programmée mardi 14h");
    assert.ok(withNote, "Lead with note should exist");
    assert.equal(withNote?.notes.length, 1);
    assert.equal(withNote?.notes[0].author, "Admin QA");
    assert.equal(withNote?.notes[0].text, "Visite programmée mardi 14h");

    // Clean up
    const deleted = deleteLead(newLead.id);
    assert.equal(deleted, true, "Lead must be deleted");

    const allLeads = getLeads();
    assert.ok(!allLeads.some((l) => l.id === newLead.id), "Deleted lead must not exist in list");
  });
});

describe("4. Unit Tests: Spaces & Real-Time Inventory Sync", () => {
  it("calculates unified space records and inventory occupancy metrics", () => {
    const leads = getLeads();
    const spaces = getUnifiedSpaces(leads);
    assert.ok(Array.isArray(spaces), "Unified spaces must be an array");
    assert.ok(spaces.length >= 6, "Must contain all operational inventory categories");

    const privateOffices = spaces.filter((s) => s.category === "private");
    assert.ok(privateOffices.length >= 2, "Private office groups must be present");

    const metrics = getInventoryMetrics(leads);
    assert.equal(metrics.totalSuitesCount, 5, "Total suites count must be 5");
    assert.ok(typeof metrics.availableSuitesCount === "number", "Available suites must be a number");
    assert.equal(metrics.totalCourtyardBays, 9, "Total courtyard bays must be 9");
    assert.ok(typeof metrics.assignedCourtyardBays === "number", "Assigned bays must be a number");
  });
});
