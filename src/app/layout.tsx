import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { LanguageProvider } from "@/lib/languageContext";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap"
});

export const viewport: Viewport = {
  themeColor: "#5b7074",
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL("https://maisoncalve.fr"),
  title: "Maison Calvé — Peaceful Coworking Bordeaux Fondaudège avec Parking",
  description:
    "Maison Calvé : espace de coworking haut de gamme à Bordeaux Fondaudège (48 rue Calvé). 5 bureaux privatifs, open space feutré, salle de réunion 30m² et 9 places de parking privatives sécurisées.",
  icons: {
    icon: [
      { url: "/icon-light.svg", media: "(prefers-color-scheme: light)", type: "image/svg+xml" },
      { url: "/icon-dark.svg", media: "(prefers-color-scheme: dark)", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  },
  keywords: [
    "coworking bordeaux",
    "coworking bordeaux parking",
    "espace de coworking bordeaux",
    "bureaux privatifs bordeaux",
    "open space bordeaux",
    "salle de reunion bordeaux",
    "meeting room bordeaux",
    "coworking with parking bordeaux",
    "coworking fondaudege",
    "location bureau bordeaux"
  ],
  authors: [{ name: "Maison Calvé" }],
  creator: "Maison Calvé",
  publisher: "Maison Calvé",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  alternates: {
    canonical: "https://maisoncalve.fr",
    languages: {
      "fr-FR": "https://maisoncalve.fr",
      "en-US": "https://maisoncalve.fr/?lang=en",
      "es-ES": "https://maisoncalve.fr/?lang=es"
    }
  },
  openGraph: {
    title: "Maison Calvé — Peaceful Coworking Bordeaux Fondaudège",
    description:
      "Bureaux privatifs, open space feutré et salle de réunion au 48 rue Calvé avec 9 places de parking privatives.",
    url: "https://maisoncalve.fr",
    siteName: "Maison Calvé",
    images: [
      {
        url: "/images/spaces/real-open-space-fixe-4k.jpg",
        width: 1200,
        height: 800,
        alt: "Maison Calvé - Coworking Hôtel Particulier Bordeaux Fondaudège"
      }
    ],
    locale: "fr_FR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Calvé — Coworking Bordeaux Fondaudège avec Parking",
    description:
      "5 bureaux privatifs, open space feutré et 9 places de parking en plein centre de Bordeaux.",
    images: ["/images/spaces/real-open-space-fixe-4k.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${jakartaSans.variable} font-sans h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-extension DOM mutation sanitizer to prevent hydration mismatch errors (e.g. bis_skin_checked injected by Bitdefender) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var A=['bis_skin_checked','bis_register','data-gramm','cz-shortcut-listen'];function C(n){if(!n)return;try{if(n.nodeType===1){for(var i=0;i<A.length;i++){if(n.hasAttribute(A[i]))n.removeAttribute(A[i])}}if(n.querySelectorAll){for(var i=0;i<A.length;i++){var els=n.querySelectorAll('['+A[i]+']');for(var j=0;j<els.length;j++)els[j].removeAttribute(A[i])}}}catch(e){}}C(document.documentElement);if(typeof MutationObserver!=='undefined'){var obs=null;function O(){if(obs&&document.documentElement){obs.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:A})}}obs=new MutationObserver(function(m){var hit=false;for(var i=0;i<m.length;i++){if(A.indexOf(m[i].attributeName)!==-1){hit=true;break}}if(hit){obs.disconnect();C(document.documentElement);O()}});O();if(typeof window!=='undefined'){window.addEventListener('load',function(){C(document.documentElement);setTimeout(function(){if(obs)obs.disconnect()},2000)})}}})();`
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col font-sans bg-calve-cream text-calve-charcoal"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
