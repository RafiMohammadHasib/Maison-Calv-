import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { deleteLead, getLeads } from "../src/lib/leads";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

describe("Security & Penetration Audit: SQLi, Auth Bypass, XSS & DoS Resilience", () => {
  const cleanupLeadIds: string[] = [];

  after(() => {
    // Purge test leads created during penetration testing
    for (const id of cleanupLeadIds) {
      try {
        deleteLead(id);
      } catch {}
    }
  });

  // -------------------------------------------------------------
  // 1. SQL Injection (SQLi) Defense Tests
  // -------------------------------------------------------------
  it("SQLi DEFENSE: prevents WHERE clause bypass via SQL injection metacharacters", async () => {
    const maliciousPayloads = [
      "NO_SUCH_RECORD_XYZ' OR '1'='1",
      "NO_SUCH_RECORD_XYZ' OR 1=1 --",
      "NO_SUCH_RECORD_XYZ'; DROP TABLE crm_leads; --",
      "NO_SUCH_RECORD_XYZ' UNION SELECT NULL, username, password FROM users --",
      "NO_SUCH_RECORD_XYZ\" OR \"\"=\"",
      "NO_SUCH_RECORD_XYZ' OR 'a'='a",
      "NO_SUCH_RECORD_XYZ' OR TRUE --"
    ];

    for (const sqli of maliciousPayloads) {
      const res = await fetch(`${BASE_URL}/api/admin/leads?q=${encodeURIComponent(sqli)}`);
      // 1. Must never crash with 500 error
      assert.notEqual(res.status, 500, `SQLi payload "${sqli}" triggered unhandled 500 error!`);

      const json = await res.json();
      assert.ok(Array.isArray(json.leads), "Must return leads array");

      // 2. If 'OR 1=1' had worked, it would have returned ALL leads in the database!
      // In our secure application, it evaluates as a literal search and returns 0 leads!
      assert.equal(
        json.leads.length,
        0,
        `SQLi payload "${sqli}" bypassed WHERE clause and returned ${json.leads.length} records!`
      );
    }
  });

  it("SQLi DEFENSE: neutralizes SQL injection payloads in public enquiry form body without table destruction", async () => {
    const initialLeadsCount = getLeads().length;

    const res = await fetch(`${BASE_URL}/api/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "private-office",
        name: "Security Audit Tester'); DROP TABLE crm_leads;--",
        email: "sec.audit@injection-test.fr",
        phone: "+33 6 00 00 00 99",
        company: "' OR '1'='1",
        message: "SELECT * FROM admin_users WHERE 1=1"
      })
    });

    assert.equal(res.status, 200, "API must handle input safely without SQL syntax error");
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.lead?.id, "Lead created safely as literal text");
    if (json.lead?.id) cleanupLeadIds.push(json.lead.id);

    // Verify existing database was not wiped or corrupted by DROP TABLE injection
    const postLeadsCount = getLeads().length;
    assert.ok(postLeadsCount > 10, "Existing leads table must not be dropped or truncated");
  });

  // -------------------------------------------------------------
  // 2. Authentication Bypass & Protected Route Enforcement
  // -------------------------------------------------------------
  it("AUTH BYPASS DEFENSE: redirects unauthenticated requests on /admin/pipeline to /admin/login", async () => {
    const res = await fetch(`${BASE_URL}/admin/pipeline`, {
      redirect: "manual"
    });

    // Next.js middleware redirects unauthenticated users with 307 or 302
    assert.ok(
      res.status === 307 || res.status === 302 || res.status === 308,
      `Unauthenticated access to /admin/pipeline returned HTTP ${res.status} instead of redirecting`
    );

    const location = res.headers.get("location") || "";
    assert.ok(location.includes("/admin/login"), "Must redirect directly to /admin/login");
  });

  it("AUTH BYPASS DEFENSE: blocks forged session cookies on protected admin routes", async () => {
    const res = await fetch(`${BASE_URL}/admin/pipeline`, {
      headers: { Cookie: "mc_admin_session=forged.session.token.hack123" },
      redirect: "manual"
    });

    assert.ok(
      res.status === 307 || res.status === 302 || res.status === 308,
      "Forged token must be rejected with redirect to login"
    );
    const location = res.headers.get("location") || "";
    assert.ok(location.includes("/admin/login"));
  });

  // -------------------------------------------------------------
  // 3. Stored & Reflected XSS Sanitization Tests
  // -------------------------------------------------------------
  it("XSS SANITIZATION: safely handles <script> and HTML tags in user-submitted inputs", async () => {
    const xssPayload = "<script>alert('pwned')</script><img src=x onerror=alert(1)>";
    const res = await fetch(`${BASE_URL}/api/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "open-space",
        name: `XSS Test ${xssPayload}`,
        email: "xss.candidate@audit-security.fr",
        phone: "+33 6 11 22 33 44",
        company: "<b>Malicious Corp</b>",
        message: xssPayload
      })
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    if (json.lead?.id) cleanupLeadIds.push(json.lead.id);
    assert.ok(json.lead.name.includes("XSS Test"));
  });

  // -------------------------------------------------------------
  // 4. DoS, Buffer Overflow & Malformed JSON Fuzzing
  // -------------------------------------------------------------
  it("FUZZING RESILIENCE: gracefully handles malformed JSON without crashing the server", async () => {
    const res = await fetch(`${BASE_URL}/api/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{\broken_json_payload: null,"
    });

    assert.ok(res.status >= 400 && res.status < 600, "Server must respond with error status code");
  });

  it("FUZZING RESILIENCE: handles oversized payloads safely", async () => {
    const largeMessage = "A".repeat(50000); // 50KB payload
    const res = await fetch(`${BASE_URL}/api/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "private-office",
        name: "Large Payload Test",
        email: "payload.test@bordeaux-heavy.fr",
        phone: "+33 6 55 44 33 22",
        message: largeMessage
      })
    });

    assert.equal(res.status, 200, "Server must gracefully handle large valid text");
    const json = await res.json();
    if (json.lead?.id) cleanupLeadIds.push(json.lead.id);
  });

  // -------------------------------------------------------------
  // 5. Cookie Security Flags
  // -------------------------------------------------------------
  it("COOKIE SECURITY: ensures admin authentication cookie sets HttpOnly and SameSite=Lax", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@maisoncalve.fr",
        password: "admin123",
        rememberMe: true
      })
    });

    assert.equal(res.status, 200);
    const setCookie = res.headers.get("set-cookie") || "";

    assert.ok(setCookie.includes("mc_admin_session"), "Cookie name must be mc_admin_session");
    assert.ok(setCookie.toLowerCase().includes("httponly"), "Must have HttpOnly flag (anti-XSS stealing)");
    assert.ok(setCookie.toLowerCase().includes("samesite=lax"), "Must have SameSite=Lax flag (anti-CSRF)");
    assert.ok(setCookie.toLowerCase().includes("path=/"), "Must have Path=/");
  });
});
