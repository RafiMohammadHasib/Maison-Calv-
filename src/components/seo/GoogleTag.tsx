import React from "react";
import { SeoSettings } from "@/lib/settingsStore";

interface GoogleTagHeadProps {
  seo: SeoSettings;
}

export function GoogleTagHead({ seo }: GoogleTagHeadProps) {
  const {
    googleTagId,
    googleTagEnabled,
    googleAnalyticsId,
    googleSearchConsole,
    customHeadCode
  } = seo;

  const cleanGscCode = googleSearchConsole
    ? googleSearchConsole.includes("content=\"")
      ? googleSearchConsole.split("content=\"")[1].split("\"")[0]
      : googleSearchConsole.replace(/<[^>]*>?/gm, "").trim()
    : "";

  return (
    <>
      {/* 1. Google Search Console Verification Meta */}
      {cleanGscCode && (
        <meta name="google-site-verification" content={cleanGscCode} />
      )}

      {/* 2. Primary Google Tag (gtm.js / Google Analytics) as required by Google setup */}
      {googleTagEnabled && googleTagId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(
              googleTagId.trim()
            )}`}
          />
          <script
            id="google-tag-init"
            dangerouslySetInnerHTML={{
              __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${googleTagId.startsWith("G-") ? `gtag('config', '${googleTagId.trim()}');` : ""}
              `.trim()
            }}
          />
        </>
      )}

      {/* 3. Secondary Google Analytics 4 (gtag.js) stream ID if distinct */}
      {googleTagEnabled &&
        googleAnalyticsId &&
        googleAnalyticsId.trim() !== googleTagId.trim() && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
                googleAnalyticsId.trim()
              )}`}
            />
            <script
              id="google-analytics-gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('config', '${googleAnalyticsId.trim()}');
                `.trim()
              }}
            />
          </>
        )}

      {/* 4. Custom Head Code / Injection */}
      {customHeadCode && (
        <div
          id="custom-head-injection"
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: customHeadCode }}
        />
      )}
    </>
  );
}

interface GoogleTagBodyProps {
  seo: SeoSettings;
}

export function GoogleTagBody({ seo }: GoogleTagBodyProps) {
  const { googleTagId, googleTagEnabled, customBodyCode } = seo;

  const isGtm = googleTagId && googleTagId.trim().toUpperCase().startsWith("GTM-");

  return (
    <>
      {/* Google Tag Manager (noscript fallback container) */}
      {googleTagEnabled && isGtm && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(
              googleTagId.trim()
            )}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}

      {/* Custom Body Code / Footer scripts */}
      {customBodyCode && (
        <div
          id="custom-body-injection"
          dangerouslySetInnerHTML={{ __html: customBodyCode }}
        />
      )}
    </>
  );
}

