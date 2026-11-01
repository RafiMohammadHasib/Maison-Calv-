"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useLanguage } from "@/lib/languageContext";
import {
  FileEdit,
  Eye,
  CheckCircle2,
  LayoutTemplate,
  Save,
  ExternalLink,
  Layers,
  ArrowRight,
  RefreshCw,
  Database
} from "lucide-react";

export default function CMSPage() {
  const { language, t, isEnglish } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [syncedWithOvh, setSyncedWithOvh] = useState(false);

  const [heroBadge, setHeroBadge] = useState("Coworking haut de gamme – Bordeaux Fondaudège");
  const [heroDesc, setHeroDesc] = useState(
    "Un espace de travail confortable, calme et haut de gamme pensé pour s'y installer dans le temps."
  );
  const [office17Price, setOffice17Price] = useState("750€ HT");
  const [office25Price, setOffice25Price] = useState("1200€ HT");
  const [openSpacePrice, setOpenSpacePrice] = useState("250€ HT");

  const fetchCmsContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings?key=cms_content");
      const data = await res.json();
      if (data.success && data.value) {
        if (data.value.heroBadge) setHeroBadge(data.value.heroBadge);
        if (data.value.heroDesc) setHeroDesc(data.value.heroDesc);
        if (data.value.office17Price) setOffice17Price(data.value.office17Price);
        if (data.value.office25Price) setOffice25Price(data.value.office25Price);
        if (data.value.openSpacePrice) setOpenSpacePrice(data.value.openSpacePrice);
        if (data.source === "ovh_mysql") setSyncedWithOvh(true);
      }
    } catch (err) {
      console.error("Error loading CMS settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "cms_content",
          value: {
            heroBadge,
            heroDesc,
            office17Price,
            office25Price,
            openSpacePrice
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setSyncedWithOvh(Boolean(data.syncedWithOvh));
        setTimeout(() => setSaved(false), 4000);
      }
    } catch (err) {
      console.error("Error saving CMS content:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title={isEnglish ? "Content & Space Editor (CMS)" : "Éditeur de Contenu & Espaces (CMS)"}
      subtitle={
        isEnglish
          ? "Edit key hero copy, online pricing, and urgency tags displayed on the Maison Calvé website."
          : "Modifiez les textes clés du hero, les tarifs en ligne et les informations de disponibilité affichés sur le site Maison Calvé."
      }
      headerAction={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchCmsContent}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-calve-border hover:border-calve-slate text-xs font-semibold text-calve-charcoal transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-calve-slate ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isEnglish ? "Refresh" : "Actualiser"}</span>
          </button>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-calve-border hover:border-calve-slate text-xs font-semibold text-calve-charcoal transition-all shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-calve-slate" />
            <span>{isEnglish ? "Live Preview" : "Aperçu Direct"}</span>
            <ExternalLink className="w-3 h-3 text-calve-muted" />
          </a>
        </div>
      }
    >
      <form onSubmit={handleSave} className="space-y-6">
        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isEnglish
                  ? "CMS modifications successfully saved to MySQL database."
                  : "Modifications CMS enregistrées avec succès dans la base de données MySQL."}
              </span>
            </div>
            {syncedWithOvh && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-200/60 text-emerald-900 text-[10px] font-bold flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>OVH MySQL Live Synced</span>
              </span>
            )}
          </div>
        )}

        {/* 1. Hero Content Block */}
        <div className="p-6 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-calve-border/60 pb-3">
            <LayoutTemplate className="w-4 h-4 text-calve-slate" />
            <h3 className="font-extrabold text-sm text-calve-charcoal">
              {isEnglish ? "Hero Section (Homepage Header)" : "Section Hero (En-tête de page)"}
            </h3>
          </div>

          <div className="space-y-3">
            <div>
<label htmlFor="cms-heroBadge" className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                {isEnglish ? "TOP HERO BADGE" : "BADGE SUPÉRIEUR DU HERO"}
              </label>
              <input
                id="cms-heroBadge"
                name="heroBadge"
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs focus:border-calve-slate font-medium"
              />
            </div>

            <div>
<label htmlFor="cms-heroDesc" className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                {isEnglish ? "CATCHPHRASE DESCRIPTION (UNDER MAISON CALVÉ WORDMARK)" : "DESCRIPTION D'ACCROCHE (SOUS LE MOT-SYMBOLE MAISON CALVÉ)"}
              </label>
              <textarea
                id="cms-heroDesc"
                name="heroDesc"
                rows={2}
                value={heroDesc}
                onChange={(e) => setHeroDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs focus:border-calve-slate font-medium"
              />
            </div>
          </div>
        </div>

        {/* 2. Space Pricing & Tarifs Block */}
        <div className="p-6 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-calve-border/60 pb-3">
            <Layers className="w-4 h-4 text-calve-slate" />
            <h3 className="font-extrabold text-sm text-calve-charcoal">
              Official Space Pricing (Excl. VAT)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
<label htmlFor="cms-office17Price" className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                {isEnglish ? "PRIVATE OFFICE 21 SQM" : "BUREAU PRIVATIF 21 M²"}
              </label>
              <input
                id="cms-office17Price"
                name="office17Price"
                type="text"
                value={office17Price}
                onChange={(e) => setOffice17Price(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
              />
              <span className="text-[10px] text-calve-muted mt-1 block">
                per month · 3 to 4 desks
              </span>
            </div>

            <div>
<label htmlFor="cms-office25Price" className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                {isEnglish ? "PRIVATE OFFICE 28 SQM" : "BUREAU PRIVATIF 28 M²"}
              </label>
              <input
                id="cms-office25Price"
                name="office25Price"
                type="text"
                value={office25Price}
                onChange={(e) => setOffice25Price(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
              />
              <span className="text-[10px] text-calve-muted mt-1 block">
                per month · 5 to 6 desks
              </span>
            </div>

            <div>
<label htmlFor="cms-openSpacePrice" className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                {isEnglish ? "DEDICATED OPEN SPACE DESK" : "POSTE FIXE OPEN SPACE"}
              </label>
              <input
                id="cms-openSpacePrice"
                name="openSpacePrice"
                type="text"
                value={openSpacePrice}
                onChange={(e) => setOpenSpacePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
              />
              <span className="text-[10px] text-calve-muted mt-1 block">
                per month per desk · 5 max
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-sm cursor-pointer transition-all disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
            <span>{saving ? "Saving..." : "SAVE CMS CHANGES"}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
