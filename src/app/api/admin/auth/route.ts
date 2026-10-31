import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession, verifySession, revokeSession, SESSION_COOKIE_NAME } from "@/lib/session";
import { getAdminConfig, saveAdminConfig, verifyAdminPassword } from "@/lib/adminConfig";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@maisoncalve.fr";

export async function POST(request: Request) {
  try {
    const { email, password, rememberMe } = await request.json();

    const config = getAdminConfig();
    const effectiveAdminEmail = config.email || ADMIN_EMAIL;

    const normalizedEmail = (email || "").trim().toLowerCase();
    const isEmailValid =
      normalizedEmail === effectiveAdminEmail.toLowerCase() ||
      normalizedEmail === ADMIN_EMAIL.toLowerCase() ||
      normalizedEmail === "admin@gg.fr" ||
      normalizedEmail === "admin@maisoncalve.com";
    const isPasswordValid = verifyAdminPassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Identifiants invalides. Veuillez vérifier votre adresse email et votre mot de passe."
        },
        { status: 401 }
      );
    }

    // Generate unique cryptographic session
    const { token, sessionId, expiresAt, maxAgeSeconds } = await createSession(rememberMe);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAgeSeconds,
      path: "/"
    });

    const response = NextResponse.json({
      success: true,
      message: "Authentification réussie.",
      sessionId,
      expiresAt,
      user: {
        name: config.name || "Administrateur Maison Calvé",
        email: effectiveAdminEmail,
        role: "Super Admin",
        workspace: "Maison Calvé - Bordeaux Fondaudège"
      }
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const authResult = await verifySession(sessionCookie?.value);

    if (authResult.valid) {
      const config = getAdminConfig();
      return NextResponse.json({
        authenticated: true,
        sessionId: authResult.sessionId,
        user: {
          name: config.name || "Administrateur Maison Calvé",
          email: config.email || ADMIN_EMAIL,
          role: "Super Admin",
          workspace: "Maison Calvé - Bordeaux Fondaudège"
        }
      });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err) {
    console.error("Auth check error:", err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const authResult = await verifySession(sessionCookie?.value);

    if (!authResult.valid) {
      return NextResponse.json(
        { success: false, message: "Session expirée ou non autorisée. Veuillez vous reconnecter." },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Tous les champs de mot de passe sont requis." },
        { status: 400 }
      );
    }

    // Verify current password
    if (!verifyAdminPassword(currentPassword)) {
      return NextResponse.json(
        { success: false, message: "Le mot de passe actuel est incorrect." },
        { status: 400 }
      );
    }

    // Check minimum length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Le nouveau mot de passe doit comporter au moins 6 caractères." },
        { status: 400 }
      );
    }

    // Check matching
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Le nouveau mot de passe et sa confirmation ne correspondent pas." },
        { status: 400 }
      );
    }

    // Save new custom password
    saveAdminConfig({ customPassword: newPassword });

    return NextResponse.json({
      success: true,
      message: "Mot de passe administrateur modifié avec succès !"
    });
  } catch (err: any) {
    console.error("Password update error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Erreur serveur lors de la mise à jour." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    // Invalidate session ID on server
    if (sessionCookie?.value) {
      revokeSession(sessionCookie.value);
    }

    // Clear cookie with exact path=/ and maxAge=0
    cookieStore.set(SESSION_COOKIE_NAME, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    cookieStore.delete({
      name: SESSION_COOKIE_NAME,
      path: "/"
    });

    const response = NextResponse.json({
      success: true,
      message: "Session terminée et révoquée avec succès"
    });

    // Explicit Set-Cookie header to purge browser storage across all client contexts
    response.headers.set(
      "Set-Cookie",
      `${SESSION_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax`
    );

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
