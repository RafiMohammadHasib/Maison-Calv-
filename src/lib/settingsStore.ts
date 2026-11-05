import fs from "fs";
import path from "path";
import {
  isOvhBridgeConfigured,
  fetchOvhSettings,
  saveOvhSettingsBulk,
  saveOvhSetting
} from "./ovhBridge";

export interface SeoSettings {
  googleTagId: string; // e.g. "GTM-K7CVNBTS" or "G-XXXXXXXXXX"
  googleTagEnabled: boolean;
  googleAnalyticsId?: string; // Optional direct GA4 ID (G-XXXXXXX)
  googleSearchConsole?: string; // e.g. "google-site-verification=..."
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  allowIndexing: boolean; // true = index, follow; false = noindex, nofollow
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  customHeadCode?: string;
  customBodyCode?: string;
}

export interface SiteSettings {
  cms_content?: Record<string, any>;
  settings_identity?: Record<string, any>;
  settings_rental?: Record<string, any>;
  settings_system?: Record<string, any>;
  settings_seo?: SeoSettings;
  settings_profile?: Record<string, any>;
  [key: string]: any;
}

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  googleTagId: "GTM-K7CVNBTS",
  googleTagEnabled: true,
  googleAnalyticsId: "",
  googleSearchConsole: "",
  metaTitle: "Maison Calvé — Coworking Bordeaux Fondaudège avec Parking",
  metaDescription:
    "Maison Calvé : espace de coworking haut de gamme à Bordeaux Fondaudège (48 rue Calvé). 5 bureaux privatifs, open space feutré, salle de réunion 30m² et 9 places de parking privatives sécurisées.",
  metaKeywords:
    "coworking bordeaux, coworking bordeaux parking, espace de coworking bordeaux, bureaux privatifs bordeaux, open space bordeaux, salle de reunion bordeaux, meeting room bordeaux, coworking with parking bordeaux, coworking fondaudege, location bureau bordeaux",
  canonicalUrl: "https://maisoncalve.fr",
  allowIndexing: true,
  ogTitle: "Maison Calvé — Coworking Bordeaux Fondaudège",
  ogDescription:
    "Bureaux privatifs, open space feutré et salle de réunion au 48 rue Calvé avec 9 places de parking privatives.",
  ogImage: "/images/spaces/real-open-space-fixe-4k.jpg",
  customHeadCode: "",
  customBodyCode: ""
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
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
  settings_seo: DEFAULT_SEO_SETTINGS,
  settings_profile: {
    adminName: "Paul (Operations Director)",
    adminEmail: "admin@maisoncalve.fr"
  }
};

const SETTINGS_FILE_PATH = path.join(process.cwd(), "src", "data", "site_settings.json");

let memoryCache: SiteSettings | null = null;

/**
 * Load settings from local disk or default fallback.
 */
export function getLocalSettings(): SiteSettings {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const raw = fs.readFileSync(SETTINGS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      const resolved: SiteSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        settings_seo: {
          ...DEFAULT_SEO_SETTINGS,
          ...(parsed.settings_seo || {})
        }
      };
      memoryCache = resolved;
      return resolved;
    }
  } catch (err) {
    console.error("Failed to read site_settings.json:", err);
  }

  const fallback: SiteSettings = { ...DEFAULT_SITE_SETTINGS };
  memoryCache = fallback;
  return fallback;
}

/**
 * Save settings to disk and memory cache.
 */
export function persistLocalSettings(newSettings: Partial<SiteSettings>): SiteSettings {
  const current = getLocalSettings();
  const merged: SiteSettings = {
    ...current,
    ...newSettings,
    settings_seo: {
      ...DEFAULT_SEO_SETTINGS,
      ...(current.settings_seo || {}),
      ...(newSettings.settings_seo || {})
    },
    updatedAt: new Date().toISOString()
  };

  memoryCache = merged;

  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(merged, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write site_settings.json:", err);
  }

  return merged;
}

/**
 * Get full settings (attempts OVH bridge when available, falling back to local file).
 */
export async function getSiteSettingsAsync(): Promise<{
  settings: SiteSettings;
  source: string;
}> {
  const local = getLocalSettings();

  if (isOvhBridgeConfigured()) {
    try {
      const ovhRes = await fetchOvhSettings();
      if (ovhRes.success && ovhRes.settings && typeof ovhRes.settings === "object") {
        const merged: SiteSettings = {
          ...local,
          ...ovhRes.settings,
          settings_seo: {
            ...DEFAULT_SEO_SETTINGS,
            ...(local.settings_seo || {}),
            ...(ovhRes.settings.settings_seo || {})
          }
        };
        memoryCache = merged;
        return { settings: merged, source: "ovh_mysql" };
      }
    } catch (err) {
      console.warn("Could not fetch remote settings from OVH, using local:", err);
    }
  }

  return { settings: local, source: "local_storage" };
}

/**
 * Save settings (both to local file and OVH MySQL bridge).
 */
export async function saveSiteSettingsAsync(
  newSettings: Partial<SiteSettings>
): Promise<{ settings: SiteSettings; syncedWithOvh: boolean }> {
  const localMerged = persistLocalSettings(newSettings);

  let syncedWithOvh = false;
  if (isOvhBridgeConfigured()) {
    try {
      const ovhRes = await saveOvhSettingsBulk(newSettings);
      syncedWithOvh = Boolean(ovhRes.success);
    } catch (err) {
      console.warn("Could not push settings to OVH MySQL bridge:", err);
    }
  }

  return { settings: localMerged, syncedWithOvh };
}
