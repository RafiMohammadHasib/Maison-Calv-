import { NextResponse } from "next/server";
import {
  isOvhBridgeConfigured,
  fetchOvhSettings,
  fetchOvhSetting,
  saveOvhSetting,
  saveOvhSettingsBulk,
  deleteOvhSetting
} from "@/lib/ovhBridge";

// Default settings fallbacks matching reference production data
export const DEFAULT_SETTINGS: Record<string, any> = {
  cms_content: {
    heroBadge: "Coworking haut de gamme – Bordeaux Fondaudège",
    heroDesc:
      "Un espace de travail confortable, calme et haut de gamme pensé pour s'y installer dans le temps.",
    office17Price: "950€ HT",
    office25Price: "1200€ HT",
    openSpacePrice: "250€ HT"
  },
  settings_identity: {
    agencyName: "MAISON CALVÉ",
    tagline: "High-End Real Estate & Coworking in Bordeaux",
    paulPhone: "+33 5 56 00 22 10",
    edgarPhone: "+33 7 81 96 83 95",
    agencyEmail: "contact@maisoncalve.fr",
    officeAddress: "48 rue Calvé, 33000 Bordeaux",
    officeHours:
      "Monday - Friday: 08:30 AM - 07:00 PM | Saturday: By Appointment (Residents 24/7)",
    siret: "944 393 487 00011",
    licenseCPI: "CPI33012023000000128 · CCI Bordeaux Gironde",
    guarantee: "Galian Assurances — 120 000 € / Allianz Pro"
  },
  settings_rental: {
    office17Rate: "€950 excl. VAT / month",
    office25Rate: "€1,200 excl. VAT / month",
    openSpaceRate: "€250 excl. VAT / month",
    nomadRate: "€20 excl. VAT day / €10 excl. VAT half-day",
    meetingRate: "€120 excl. VAT half-day / €200 excl. VAT full day",
    vatRate: "20%",
    depositRule: "2 months rent excl. VAT",
    noticePeriod: "3 months for private offices · 1 month for open space",
    parkingPolicy: "Included with private suites (9 secure courtyard bays total)"
  },
  settings_system: {
    metaTitle: "Maison Calvé — Premium Coworking Bordeaux Fondaudège with Parking",
    instagramAccount: "@maisoncalvebordeaux",
    gpsCoordinates: "44.8488° N, 0.5843° W (Tram D Croix-de-Seguey)",
    leadDispatcherEmail: "admin@maisoncalve.fr"
  },
  settings_profile: {
    adminName: "Paul (Operations Director)",
    adminEmail: "admin@maisoncalve.fr"
  }
};

// In-memory fallback cache for development or temporary disconnection
let localSettingsCache: Record<string, any> = { ...DEFAULT_SETTINGS };

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

      return NextResponse.json({
        success: true,
        source: "local_fallback",
        key,
        value: localSettingsCache[key] ?? DEFAULT_SETTINGS[key] ?? null
      });
    }

    // 2. All settings lookup
    let mergedSettings = { ...DEFAULT_SETTINGS, ...localSettingsCache };
    let source = "local_fallback";

    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await fetchOvhSettings();
        if (ovhRes.success && ovhRes.settings && typeof ovhRes.settings === "object") {
          mergedSettings = { ...DEFAULT_SETTINGS, ...ovhRes.settings };
          localSettingsCache = { ...mergedSettings };
          source = "ovh_mysql";
        }
      } catch (err) {
        console.warn("Could not fetch settings from OVH:", err);
      }
    }

    return NextResponse.json({
      success: true,
      source,
      settings: mergedSettings,
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
      localSettingsCache = { ...localSettingsCache, ...body.settings };

      let ovhSuccess = false;
      if (isOvhBridgeConfigured()) {
        try {
          const ovhRes = await saveOvhSettingsBulk(body.settings);
          ovhSuccess = Boolean(ovhRes.success);
        } catch (err) {
          console.warn("Could not save bulk settings to OVH:", err);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Tous les paramètres ont été enregistrés.",
        syncedWithOvh: ovhSuccess,
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

    localSettingsCache[key] = value;

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

    delete localSettingsCache[key];

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

