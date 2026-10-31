import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { deleteLead } from "../src/lib/leads";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

describe("Functional & API Workflow Tests", () => {
  let authCookie = "";
  let createdLeadId = "";

  after(() => {
    if (createdLeadId) {
      try {
        deleteLead(createdLeadId);
      } catch {}
    }
  });

  it("POST /api/enquiry: creates a new public tour enquiry with valid payload", async () => {
    const res = await fetch(`${BASE_URL}/api/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "private-office",
        name: "Claire de Villeneuve",
        email: "claire.villeneuve@bordeaux-capital.fr",
        phone: "+33 6 12 34 56 78",
        company: "Bordeaux Capital Partners",
        message: "Demande de visite pour bureau 28m²",
        officeSize: "28 m²",
        visitRequested: true,
        language: "fr"
      })
    });

    assert.equal(res.status, 200, "Must return HTTP 200 OK");
    const json = await res.json();
    assert.equal(json.success, true, "Response must indicate success");
    assert.ok(json.lead?.id, "Response must contain created lead id");
    createdLeadId = json.lead.id;
  });

  it("POST /api/enquiry: rejects invalid payload missing required fields (Zod validation)", async () => {
    const res = await fetch(`${BASE_URL}/api/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "private-office",
        name: "A", // too short (min 2)
        email: "not-an-email",
        phone: "123" // too short (min 6)
      })
    });

    assert.equal(res.status, 400, "Must return HTTP 400 Bad Request");
    const json = await res.json();
    assert.equal(json.success, false);
    assert.ok(json.errors?.name, "Must flag name error");
    assert.ok(json.errors?.email, "Must flag email error");
  });

  it("POST /api/admin/auth: rejects login with invalid password", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@maisoncalve.fr",
        password: "wrong_password_test",
        rememberMe: true
      })
    });

    assert.equal(res.status, 401, "Must return 401 Unauthorized");
    const json = await res.json();
    assert.equal(json.success, false);
  });

  it("POST /api/admin/auth: logs in successfully with valid credentials and issues HttpOnly cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@maisoncalve.fr",
        password: "admin123",
        rememberMe: true
      })
    });

    assert.equal(res.status, 200, "Must return HTTP 200 OK");
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.user?.email, "Must return user profile");

    const setCookieHeader = res.headers.get("set-cookie") || "";
    assert.ok(setCookieHeader.includes("mc_admin_session"), "Must issue mc_admin_session cookie");
    assert.ok(setCookieHeader.toLowerCase().includes("httponly"), "Cookie must have HttpOnly flag");

    // Extract cookie value for subsequent authenticated calls
    const match = setCookieHeader.match(/mc_admin_session=([^;]+)/);
    if (match) {
      authCookie = `mc_admin_session=${match[1]}`;
    }
  });

  it("POST /api/admin/auth: logs in successfully with Super Admin credentials (euroitofficial@gmail.com)", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "euroitofficial@gmail.com",
        password: "3uro!t2026",
        rememberMe: true
      })
    });

    assert.equal(res.status, 200, "Super Admin login must return HTTP 200 OK");
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.user?.email, "euroitofficial@gmail.com");
    assert.equal(json.user?.role, "Super Admin");
  });

  it("GET /api/admin/leads: lists all leads and CRM statistics", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/leads`, {
      headers: { Cookie: authCookie }
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.leads), "Must return leads array");
    assert.ok(json.stats?.totalLeads >= 1, "Must contain CRM stats");
  });

  it("GET /api/admin/leads: filters leads by search query", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/leads?q=Villeneuve`, {
      headers: { Cookie: authCookie }
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.leads.some((l: any) => l.name.includes("Villeneuve")), "Must find Claire de Villeneuve");
  });

  it("GET /api/admin/spaces: returns unified spaces inventory and occupancy telemetry", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/spaces`, {
      headers: { Cookie: authCookie }
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.spaces), "Must return spaces array");
    assert.ok(json.metrics, "Must return inventory metrics");
  });

  it("GET /api/admin/tenants: returns active tenants list", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/tenants`, {
      headers: { Cookie: authCookie }
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.tenants), "Must return tenants array");
  });

  it("DELETE /api/admin/auth: logs out admin and revokes session cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: "DELETE",
      headers: { Cookie: authCookie }
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);

    const setCookie = res.headers.get("set-cookie") || "";
    assert.ok(setCookie.includes("Max-Age=0") || setCookie.includes("1970"), "Cookie must be expired on logout");
  });
});
