"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { useLanguage } from "@/lib/languageContext";
import {
  FolderOpen,
  Image as ImageIcon,
  Eye,
  Download,
  ExternalLink,
  Copy,
  Check,
  X,
  Search,
  Sparkles
} from "lucide-react";

interface MediaAsset {
  name: string;
  path: string;
  category: "spaces" | "hero" | "instagram";
  size: string;
  dims: string;
  alt: string;
}

const RAW_ASSETS: MediaAsset[] = [
  // 1. Offices & Workspaces (Unique 4K architectural photography)
  {
    name: "real-meeting-room-30m-4k.jpg",
    path: "/images/spaces/real-meeting-room-30m-4k.jpg",
    category: "spaces",
    size: "1.2 MB",
    dims: "3160x2120",
    alt: "Grande Salle de Réunion 30 m²"
  },
  {
    name: "real-kitchen-4k.jpg",
    path: "/images/spaces/real-kitchen-4k.jpg",
    category: "spaces",
    size: "1.1 MB",
    dims: "3160x2120",
    alt: "Cuisine Équipée & Barista Café"
  },
  {
    name: "real-office-21m-4k.jpg",
    path: "/images/spaces/real-office-21m-4k.jpg",
    category: "spaces",
    size: "1.1 MB",
    dims: "1792x2400",
    alt: "Bureau Privatif 21 m² (Aile Ouest)"
  },
  {
    name: "real-office-28m-4k.jpg",
    path: "/images/spaces/real-office-28m-4k.jpg",
    category: "spaces",
    size: "670 KB",
    dims: "1792x2400",
    alt: "Bureau Privatif 28 m² (RDC Cour)"
  },
  {
    name: "real-office-17m-wide-4k.jpg",
    path: "/images/spaces/real-office-17m-wide-4k.jpg",
    category: "spaces",
    size: "1.3 MB",
    dims: "2528x1696",
    alt: "Bureau Privatif Vue Grand Angle"
  },
  {
    name: "real-open-space-fixe-4k.jpg",
    path: "/images/spaces/real-open-space-fixe-4k.jpg",
    category: "spaces",
    size: "1.0 MB",
    dims: "2528x1696",
    alt: "Open Space — Postes Fixes Pierres Apparentes"
  },
  {
    name: "real-open-space-wide-4k.jpg",
    path: "/images/spaces/real-open-space-wide-4k.jpg",
    category: "spaces",
    size: "1.3 MB",
    dims: "3160x2120",
    alt: "Open Space Vue Panoramique"
  },
  {
    name: "real-open-space-nomade-4k.jpg",
    path: "/images/spaces/real-open-space-nomade-4k.jpg",
    category: "spaces",
    size: "1.1 MB",
    dims: "1792x2400",
    alt: "Open Space — Postes Nomades Flexibles"
  },

  // 2. Hero & Architecture Exterior
  {
    name: "calve-exterior.jpg",
    path: "/images/calve-exterior.jpg",
    category: "hero",
    size: "1.1 MB",
    dims: "3160x2120",
    alt: "Façade Hôtel Particulier 48 rue Calvé"
  },
  {
    name: "calve-parking.jpg",
    path: "/images/calve-parking.jpg",
    category: "hero",
    size: "1.2 MB",
    dims: "3160x2120",
    alt: "Cour Privée Fermée 9 Places de Parking"
  },
  {
    name: "maison-calve-tram-station.jpg",
    path: "/images/real/maison-calve-tram-station.jpg",
    category: "hero",
    size: "79 KB",
    dims: "1080x1080",
    alt: "Station Tram D Fondaudège Muséum (3 min)"
  },
  {
    name: "maison-calve-street-stencil.jpg",
    path: "/images/real/maison-calve-street-stencil.jpg",
    category: "hero",
    size: "168 KB",
    dims: "1080x1080",
    alt: "Signalétique Urbaine 48 Rue Calvé"
  },
  {
    name: "maison-calve-street-poster.jpg",
    path: "/images/real/maison-calve-street-poster.jpg",
    category: "hero",
    size: "98 KB",
    dims: "1080x1080",
    alt: "Affiche Culturelle Maison Calvé"
  },
  {
    name: "maison-calve-signage.jpg",
    path: "/images/real/maison-calve-signage.jpg",
    category: "hero",
    size: "34 KB",
    dims: "1080x1080",
    alt: "Plaque Laiton Entrée Hôtel Particulier"
  },

  // 3. Instagram Feed & Lifestyle
  {
    name: "insta-media-10.jpg",
    path: "/images/instagram/insta-media-10.jpg",
    category: "instagram",
    size: "51 KB",
    dims: "1080x1080",
    alt: "Café Barista & Thé Matcha Bio"
  },
  {
    name: "insta-media-102.jpg",
    path: "/images/instagram/insta-media-102.jpg",
    category: "instagram",
    size: "127 KB",
    dims: "1080x1080",
    alt: "Architecture Bordelaise & Lumière Naturelle"
  },
  {
    name: "insta-media-103.jpg",
    path: "/images/instagram/insta-media-103.jpg",
    category: "instagram",
    size: "71 KB",
    dims: "1080x1080",
    alt: "Ambiance Matinale Cour Intérieure"
  },
  {
    name: "insta-media-104.jpg",
    path: "/images/instagram/insta-media-104.jpg",
    category: "instagram",
    size: "63 KB",
    dims: "1080x1080",
    alt: "Espace Travail Résident Végétalisé"
  },
  {
    name: "insta-media-107.jpg",
    path: "/images/instagram/insta-media-107.jpg",
    category: "instagram",
    size: "81 KB",
    dims: "1080x1080",
    alt: "Connexion Fibre & Phonebox Acoustique"
  },
  {
    name: "insta-media-100.jpg",
    path: "/images/instagram/insta-media-100.jpg",
    category: "instagram",
    size: "31 KB",
    dims: "1080x1080",
    alt: "Coin Détente & Bibliothèque Calme"
  },
  {
    name: "insta-media-106.jpg",
    path: "/images/instagram/insta-media-106.jpg",
    category: "instagram",
    size: "116 KB",
    dims: "1080x1080",
    alt: "Badge d'Accès Sécurisé 24/7 RFID"
  },
  {
    name: "insta-media-112.jpg",
    path: "/images/instagram/insta-media-112.jpg",
    category: "instagram",
    size: "34 KB",
    dims: "1080x1080",
    alt: "Ambiance Nocturne & Sérénité"
  }
];

export default function MediaLibraryPage() {
  const { isEnglish, t } = useLanguage();
  const [filter, setFilter] = useState<"all" | "spaces" | "instagram" | "hero">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // De-duplicate assets strictly by file path so no two identical photos ever appear
  const uniqueAssets = useMemo(() => {
    const seenPaths = new Set<string>();
    return RAW_ASSETS.filter((a) => {
      if (seenPaths.has(a.path)) return false;
      seenPaths.add(a.path);
      return true;
    });
  }, []);

  const counts = useMemo(() => {
    return {
      all: uniqueAssets.length,
      hero: uniqueAssets.filter((a) => a.category === "hero").length,
      spaces: uniqueAssets.filter((a) => a.category === "spaces").length,
      instagram: uniqueAssets.filter((a) => a.category === "instagram").length
    };
  }, [uniqueAssets]);

  const filtered = useMemo(() => {
    return uniqueAssets.filter((a) => {
      if (filter !== "all" && a.category !== filter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        return (
          a.name.toLowerCase().includes(q) ||
          a.alt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [uniqueAssets, filter, searchQuery]);

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2500);
  };

  return (
    <AdminLayout
      title={t("media.title")}
      subtitle={t("media.subtitle")}
      onSearch={setSearchQuery}
      headerAction={
        <a
          href="https://www.instagram.com/maisoncalvebordeaux/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-calve-border hover:border-calve-slate text-xs font-semibold text-calve-charcoal shadow-2xs transition-colors"
        >
          <span>Instagram @maisoncalvebordeaux</span>
          <ExternalLink className="w-3.5 h-3.5 text-calve-muted" />
        </a>
      }
    >
      {/* Filters Bar with Counts */}
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 rounded-2xl bg-white border border-calve-border/80 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-calve-muted mr-1">{t("media.filter_cat")}</span>
          {[
            { id: "all", label: t("media.tab.all"), count: counts.all },
            { id: "spaces", label: t("media.tab.spaces"), count: counts.spaces },
            { id: "hero", label: t("media.tab.hero"), count: counts.hero },
            { id: "instagram", label: t("media.tab.instagram"), count: counts.instagram }
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-calve-slate text-white shadow-2xs font-bold"
                    : "bg-slate-100 text-calve-muted hover:text-calve-charcoal hover:bg-slate-200/80"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-calve-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs font-medium text-calve-muted">
          {filtered.length} {isEnglish ? "distinct photo assets" : "photos uniques répertoriées"}
        </div>
      </div>

      {/* Grid of Unique Photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((asset, i) => (
          <div
            key={asset.path}
            onClick={() => setSelectedAsset(asset)}
            className="group rounded-2xl bg-white border border-calve-border/80 overflow-hidden shadow-2xs hover:shadow-md hover:border-calve-slate/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
              <Image
                src={asset.path}
                alt={asset.alt}
                fill
                priority={i < 4}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="p-2 rounded-full bg-white/90 text-calve-charcoal shadow-sm">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider text-calve-charcoal shadow-2xs">
                  {asset.category}
                </span>
              </div>
            </div>
            <div className="p-3.5 space-y-1">
              <div className="font-bold text-xs text-calve-charcoal truncate" title={asset.name}>
                {asset.name}
              </div>
              <div className="flex items-center justify-between text-[11px] text-calve-muted">
                <span>{asset.dims}</span>
                <span className="font-mono">{asset.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Preview */}
      {selectedAsset && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedAsset(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full bg-stone-900">
              <Image
                src={selectedAsset.path}
                alt={selectedAsset.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 700px"
              />
              <button
                onClick={() => setSelectedAsset(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    {selectedAsset.name}
                  </h3>
                  <p className="text-xs text-calve-muted mt-0.5">{selectedAsset.alt}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-calve-cream text-calve-charcoal text-xs font-bold uppercase tracking-wider border border-calve-border">
                  {selectedAsset.category}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-calve-stone/30 border border-calve-border/70 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-calve-muted uppercase block">
                    {isEnglish ? "Resolution" : "Dimensions"}
                  </span>
                  <span className="font-bold text-calve-charcoal">{selectedAsset.dims}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-calve-muted uppercase block">
                    {isEnglish ? "File Size" : "Taille Fichier"}
                  </span>
                  <span className="font-bold text-calve-charcoal">{selectedAsset.size}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-calve-muted uppercase block">
                    {isEnglish ? "Format" : "Format"}
                  </span>
                  <span className="font-bold text-calve-charcoal">JPEG / 4K</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleCopy(selectedAsset.path)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-calve-charcoal hover:bg-calve-slate text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedPath === selectedAsset.path ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{isEnglish ? "Path Copied!" : "Lien Copié !"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{isEnglish ? "Copy Image Path" : "Copier le Chemin d'Accès"}</span>
                    </>
                  )}
                </button>

                <a
                  href={selectedAsset.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-white border border-calve-border hover:border-calve-slate text-calve-charcoal text-xs font-bold transition-all shadow-2xs flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-calve-slate" />
                  <span>{isEnglish ? "Open Full Res" : "Plein Format"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
