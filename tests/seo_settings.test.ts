import { test, describe } from "node:test";
import assert from "node:assert";
import { getLocalSettings, persistLocalSettings, DEFAULT_SEO_SETTINGS } from "../src/lib/settingsStore";

describe("6. Unit Tests: SEO & Google Analytics Settings Store", () => {
  test("loads default SEO settings containing user GTM container GTM-K7CVNBTS", () => {
    const settings = getLocalSettings();
    assert.ok(settings.settings_seo, "settings_seo should exist");
    assert.strictEqual(settings.settings_seo?.googleTagId, "GTM-K7CVNBTS");
    assert.strictEqual(settings.settings_seo?.googleTagEnabled, true);
    assert.ok(settings.settings_seo?.metaTitle.includes("Maison Calvé"));
  });

  test("persists updated SEO settings on disk and in memory", () => {
    const updated = persistLocalSettings({
      settings_seo: {
        ...DEFAULT_SEO_SETTINGS,
        googleTagId: "GTM-K7CVNBTS",
        googleTagEnabled: true,
        metaTitle: "Maison Calvé — Premium Coworking Bordeaux",
        googleSearchConsole: "google-site-verification=test12345"
      }
    });

    assert.strictEqual(updated.settings_seo?.googleTagId, "GTM-K7CVNBTS");
    assert.strictEqual(updated.settings_seo?.metaTitle, "Maison Calvé — Premium Coworking Bordeaux");
    assert.strictEqual(updated.settings_seo?.googleSearchConsole, "google-site-verification=test12345");

    // Read back fresh from store
    const reloaded = getLocalSettings();
    assert.strictEqual(reloaded.settings_seo?.googleTagId, "GTM-K7CVNBTS");
    assert.strictEqual(reloaded.settings_seo?.googleSearchConsole, "google-site-verification=test12345");
  });
});

