"use client";

import React, { useState } from "react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { useLanguage } from "@/lib/languageContext";
import { FolderOpen, Image as ImageIcon, Eye, Download, Sparkles, ExternalLink } from "lucide-react";

export default function MediaLibraryPage() {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<"all" | "spaces" | "instagram" | "hero">("all");

  const assets = [
    { name: "hero-open-space.jpg", path: "/images/hero/hero-open-space.jpg", category: "hero", size: "912 KB", dims: "1920x1080" },
    { name: "hero-kitchen.jpg", path: "/images/hero/hero-kitchen.jpg", category: "hero", size: "907 KB", dims: "1920x1080" },
    { name: "hero-meeting.jpg", path: "/images/hero/hero-meeting.jpg", category: "hero", size: "831 KB", dims: "1920x1080" },
    { name: "bureau-privatif-17m.png", path: "/images/spaces/bureau-privatif-17m.png", category: "spaces", size: "346 KB", dims: "1200x800" },
    { name: "bureau-privatif-25m.png", path: "/images/spaces/bureau-privatif-25m.png", category: "spaces", size: "402 KB", dims: "1200x800" },
    { name: "open-space-fixe.jpg", path: "/images/spaces/open-space-fixe.jpg", category: "spaces", size: "88 KB", dims: "800x600" },
    { name: "open-space-nomade.png", path: "/images/spaces/open-space-nomade.png", category: "spaces", size: "415 KB", dims: "1200x800" },
    { name: "calve-exterior.jpg", path: "/images/calve-exterior.jpg", category: "spaces", size: "1.1 MB", dims: "2400x1600" },
    { name: "insta-media-10.jpg", path: "/images/instagram/insta-media-10.jpg", category: "instagram", size: "320 KB", dims: "1080x1080" },
    { name: "insta-media-100.jpg", path: "/images/instagram/insta-media-100.jpg", category: "instagram", size: "290 KB", dims: "1080x1080" },
    { name: "insta-media-103.jpg", path: "/images/instagram/insta-media-103.jpg", category: "instagram", size: "310 KB", dims: "1080x1080" },
    { name: "insta-media-110.jpg", path: "/images/instagram/insta-media-110.jpg", category: "instagram", size: "285 KB", dims: "1080x1080" }
  ];

  const filtered = assets.filter((a) => filter === "all" || a.category === filter);

  return (
    <AdminLayout
      title={t("media.title")}
      subtitle={t("media.subtitle")}
      headerAction={
        <a
          href="https://www.instagram.com/maisoncalvebordeaux/"
          target="_blank"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-calve-border hover:border-calve-slate text-xs font-semibold text-calve-charcoal shadow-2xs"
        >
          <span>Instagram @maisoncalvebordeaux</span>
          <ExternalLink className="w-3.5 h-3.5 text-calve-muted" />
        </a>
      }
    >
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap p-4 rounded-2xl bg-white border border-calve-border/80 shadow-2xs">
        <span className="text-xs font-bold text-calve-muted">{t("media.filter_cat")}</span>
        {[
          { id: "all", label: t("media.tab.all") },
          { id: "hero", label: t("media.tab.hero") },
          { id: "spaces", label: t("media.tab.spaces") },
          { id: "instagram", label: t("media.tab.instagram") }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === tab.id
                ? "bg-calve-slate text-white shadow-2xs font-bold"
                : "bg-slate-100 text-calve-muted hover:text-calve-charcoal"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((asset, i) => (
          <div
            key={i}
            className="group rounded-2xl bg-white border border-calve-border/80 overflow-hidden shadow-2xs hover:shadow-sm transition-all"
          >
            <div className="relative h-44 w-full bg-slate-100">
              <Image
                src={asset.path}
                alt={asset.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3.5 space-y-1">
              <div className="font-bold text-xs text-calve-charcoal truncate" title={asset.name}>
                {asset.name}
              </div>
              <div className="flex items-center justify-between text-[11px] text-calve-muted">
                <span>{asset.dims}</span>
                <span>{asset.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
