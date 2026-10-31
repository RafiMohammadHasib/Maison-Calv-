/**
 * Enterprise Session & Cryptographic Token Manager for Maison Calvé Admin Portal
 *
 * Provides:
 * - Dynamic cryptographically signed session IDs (UUIDv4)
 * - HMAC-SHA256 Web Crypto verification (works in Edge Runtime and Node.js)
 * - Session expiration & active revocation tracking
 */

const SESSION_SECRET = process.env.SESSION_SECRET || "mc_calve_bordeaux_session_secret_2026_x89";
export const SESSION_COOKIE_NAME = "mc_admin_session";

// Server-side set of revoked session IDs (in-memory for active process)
const revokedSessionIds = new Set<string>();

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a unique signed session token for a newly authenticated user.
 */
export async function createSession(rememberMe = true): Promise<{
  token: string;
  sessionId: string;
  expiresAt: number;
  maxAgeSeconds: number;
}> {
  const sessionId = crypto.randomUUID();
  const maxAgeSeconds = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 7 days or 24 hours
  const expiresAt = Date.now() + maxAgeSeconds * 1000;
  const payload = `${sessionId}.${expiresAt}`;

  const enc = new TextEncoder();
  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const token = `${payload}.${signatureHex}`;
  return { token, sessionId, expiresAt, maxAgeSeconds };
}

/**
 * Cryptographically verifies an incoming session token.
 */
export async function verifySession(token?: string | null): Promise<{
  valid: boolean;
  sessionId?: string;
  expiresAt?: number;
}> {
  if (!token || typeof token !== "string") {
    return { valid: false };
  }

  // Handle legacy static token for backwards compatibility during transition if needed
  if (token === "mc_session_authorized_2026") {
    return { valid: false }; // Deprecated: force fresh dynamic session
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false };
    }

    const [sessionId, expiresAtStr, signatureHex] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    // Check expiration
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return { valid: false };
    }

    // Check if session was revoked on logout
    if (revokedSessionIds.has(sessionId)) {
      return { valid: false };
    }

    const payload = `${sessionId}.${expiresAtStr}`;
    const enc = new TextEncoder();
    const key = await getHmacKey();

    // Convert hex back to bytes
    const match = signatureHex.match(/.{1,2}/g);
    if (!match) return { valid: false };
    const sigBytes = new Uint8Array(match.map((byte) => parseInt(byte, 16)));

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
    if (!isValid) {
      return { valid: false };
    }

    return { valid: true, sessionId, expiresAt };
  } catch (err) {
    console.error("Session verification error:", err);
    return { valid: false };
  }
}

/**
 * Revokes a session ID, ensuring it can never be reused.
 */
export function revokeSession(tokenOrSessionId?: string | null): void {
  if (!tokenOrSessionId) return;

  if (tokenOrSessionId.includes(".")) {
    const parts = tokenOrSessionId.split(".");
    if (parts[0]) {
      revokedSessionIds.add(parts[0]);
    }
  } else {
    revokedSessionIds.add(tokenOrSessionId);
  }
}

