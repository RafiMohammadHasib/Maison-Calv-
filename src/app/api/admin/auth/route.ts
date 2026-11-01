import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession, verifySession, revokeSession, SESSION_COOKIE_NAME, setSessionUser, getSessionUser } from "@/lib/session";
import { getAdminConfig, saveAdminConfig, verifyAdminPassword, findAdminUser } from "@/lib/adminConfig";
import { isOvhBridgeConfigured, fetchOvhSetting, saveOvhSetting } from "@/lib/ovhBridge";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@maisoncalve.fr";

export async function POST(request: Request) {
  try {
    const { email, password, rememberMe } = await request.json();
    const normalizedEmail = (email || "").trim().toLowerCase();

    // 1. Check local/superadmin credentials
    let user = findAdminUser(email, password);

    // 2. If not matched, check OVH MySQL mc_settings
    if (!user && isOvhBridgeConfigured()) {
      try {
        const ovhRes = await fetchOvhSetting("admin_credentials");
        if (ovhRes.success && ovhRes.value) {
          const storedEmail = (ovhRes.value.email || "admin@maisoncalve.fr").toLowerCase();
          const storedPass = ovhRes.value.password;
          if (
            (normalizedEmail === storedEmail ||
              normalizedEmail === "admin@maisoncalve.fr" ||
              normalizedEmail === "admin@gg.fr" ||
              normalizedEmail === "admin@maisoncalve.com") &&
            password === storedPass
          ) {
            user = {
              name: "Administrateur Maison Calvé",
              email: ovhRes.value.email || "admin@maisoncalve.fr",
              role: "Super Admin"
            };
          }
        }
      } catch (err) {
        console.warn("Could not fetch credentials from OVH:", err);
      }
    }

    if (!user) {
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

    // Save authenticated user profile to active session
    setSessionUser(sessionId, {
      name: user.name,
      email: user.email,
      role: user.role
    });

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
        name: user.name,
        email: user.email,
        role: user.role,
        workspace: "Maison Calvé - Bordeaux Fondaudège"
      }
    });

    return response;
  } catch (error: any) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur interne est survenue lors de l'authentification."
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const authResult = await verifySession(sessionCookie?.value);

    if (authResult.valid) {
      const sessionUser = getSessionUser(authResult.sessionId);
      const config = getAdminConfig();

      const user = sessionUser || {
        name: config.name || "Administrateur Maison Calvé",
        email: config.email || ADMIN_EMAIL,
        role: "Super Admin"
      };

      return NextResponse.json({
        authenticated: true,
        sessionId: authResult.sessionId,
        user: {
          name: user.name,
          email: user.email,
          role: user.role || "Super Admin",
          workspace: "Maison Calvé - Bordeaux Fondaudège"
        }
      });
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (sessionCookie?.value) {
      await revokeSession(sessionCookie.value);
    }

    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: "Déconnexion réussie."
    });
  } catch (error: any) {
    console.error("Sign-out error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la déconnexion."
      },
      { status: 500 }
    );
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

    const body = await request.json();
    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;
    const confirmPassword = body.confirmPassword || body.confirmNewPassword;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Tous les champs de mot de passe sont requis." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Le nouveau mot de passe doit comporter au moins 6 caractères." },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Le nouveau mot de passe et sa confirmation ne correspondent pas." },
        { status: 400 }
      );
    }

    // Verify current password against local config
    let isCurrentValid = verifyAdminPassword(currentPassword);

    // If not valid locally, also check OVH MySQL
    if (!isCurrentValid && isOvhBridgeConfigured()) {
      try {
        const ovhRes = await fetchOvhSetting("admin_credentials");
        if (ovhRes.success && ovhRes.value && ovhRes.value.password) {
          if (currentPassword === ovhRes.value.password) {
            isCurrentValid = true;
          }
        }
      } catch (err) {
        console.warn("Could not check OVH credentials:", err);
      }
    }

    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, message: "Le mot de passe actuel est incorrect." },
        { status: 400 }
      );
    }

    // Save locally
    saveAdminConfig({ customPassword: newPassword });

    // Save in OVH MySQL mc_settings
    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await saveOvhSetting("admin_credentials", {
          email: ADMIN_EMAIL,
          password: newPassword,
          updatedAt: new Date().toISOString()
        });
        ovhSuccess = Boolean(ovhRes.success);
      } catch (err) {
        console.warn("Could not persist password to OVH:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Mot de passe administrateur modifié avec succès !",
      syncedWithOvh: ovhSuccess
    });
  } catch (err: any) {
    console.error("Password update error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Erreur serveur lors de la mise à jour." },
      { status: 500 }
    );
  }
}
