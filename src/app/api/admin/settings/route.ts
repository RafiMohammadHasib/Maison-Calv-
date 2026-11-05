import { NextResponse } from "next/server";
import {
  getLocalSettings,
  getSiteSettingsAsync,
  saveSiteSettingsAsync,
  persistLocalSettings,
  DEFAULT_SITE_SETTINGS
} from "@/lib/settingsStore";
import {
  isOvhBridgeConfigured,
  fetchOvhSetting,
  saveOvhSetting,
  deleteOvhSetting
} from "@/lib/ovhBridge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    // 1. Single setting lookup
    if (key) {
      if (isOvhBridgeConfigured()) {
        try {
          const ovhRes = await fetchOvhSetting(key);
          if (ovhRes.success && ovhRes.value !== null && ovhRes.value !== undefined) {
            return NextResponse.json({
              success: true,
              source: "ovh_mysql",
              key,
              value: ovhRes.value
            });
          }
        } catch (err) {
          console.warn(`Could not fetch setting ${key} from OVH:`, err);
        }
      }

      const local = getLocalSettings();
      return NextResponse.json({
        success: true,
        source: "local_storage",
        key,
        value: local[key] ?? DEFAULT_SITE_SETTINGS[key] ?? null
      });
    }

    // 2. All settings lookup
    const { settings, source } = await getSiteSettingsAsync();

    return NextResponse.json({
      success: true,
      source,
      settings,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Error in GET /api/admin/settings:", err);
    return NextResponse.json(
      { success: false, message: "Erreur lecture paramètres", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    // 1. Bulk update: { settings: { key1: val1, key2: val2, ... } }
    if (body.settings && typeof body.settings === "object") {
      const { settings, syncedWithOvh } = await saveSiteSettingsAsync(body.settings);

      return NextResponse.json({
        success: true,
        message: "Tous les paramètres ont été enregistrés avec succès.",
        settings,
        syncedWithOvh,
        timestamp: now
      });
    }

    // 2. Single update: { key: "...", value: ... }
    const { key, value } = body;
    if (!key) {
      return NextResponse.json(
        { success: false, message: "Clé de paramètre requise." },
        { status: 400 }
      );
    }

    const updated = persistLocalSettings({ [key]: value });

    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await saveOvhSetting(key, value);
        ovhSuccess = Boolean(ovhRes.success);
      } catch (err) {
        console.warn(`Could not save setting ${key} to OVH:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Paramètre '${key}' enregistré avec succès.`,
      key,
      value,
      settings: updated,
      syncedWithOvh: ovhSuccess,
      timestamp: now
    });
  } catch (err: any) {
    console.error("Error in POST /api/admin/settings:", err);
    return NextResponse.json(
      { success: false, message: "Erreur sauvegarde paramètres", error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let key = searchParams.get("key");

    if (!key) {
      try {
        const body = await request.json();
        key = body.key;
      } catch {
        // no body
      }
    }

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Clé de paramètre requise pour suppression." },
        { status: 400 }
      );
    }

    const current = getLocalSettings();
    delete current[key];
    persistLocalSettings(current);

    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await deleteOvhSetting(key);
        ovhSuccess = Boolean(ovhRes.success);
      } catch (err) {
        console.warn(`Could not delete setting ${key} on OVH:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Paramètre '${key}' supprimé avec succès.`,
      key,
      syncedWithOvh: ovhSuccess
    });
  } catch (err: any) {
    console.error("Error in DELETE /api/admin/settings:", err);
    return NextResponse.json(
      { success: false, message: "Erreur suppression paramètre", error: err.message },
      { status: 500 }
    );
  }
}
