"use client";

import React, { useState } from "react";
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
  ArrowRight
} from "lucide-react";

export default function CMSPage() {
  const { language, t, isEnglish } = useLanguage();
  const [saved, setSaved] = useState(false);

  const [heroBadge, setHeroBadge] = useState("Coworking haut de gamme - Bordeaux Fondaudège");
  const [heroDesc, setHeroDesc] = useState(
    "Un espace de travail confortable, calme et haut de gamme pensé pour s’y installer dans le temps."
  );
  const [office17Price, setOffice17Price] = useState("750€ HT");
  const [office25Price, setOffice25Price] = useState("1200€ HT");
  const [openSpacePrice, setOpenSpacePrice] = useState("250€ HT");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout
      title={t("cms.title")}
      subtitle={t("cms.subtitle")}
      headerAction={
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-calve-border hover:border-calve-slate text-xs font-semibold text-calve-charcoal transition-all shadow-2xs"
        >
          <Eye className="w-3.5 h-3.5 text-calve-slate" />
          <span>{t("cms.preview")}</span>
          <ExternalLink className="w-3 h-3 text-calve-muted" />
        </a>
      }
    >
      <form onSubmit={handleSave} className="space-y-6">
        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t("cms.saved")}</span>
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                {isEnglish ? "Top Hero Badge" : "Badge supérieur du Hero"}
              </label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs focus:border-calve-slate font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                {isEnglish ? "Catchphrase description (Under Maison Calvé wordmark)" : "Description d'accroche (Sous le mot-symbole Maison Calvé)"}
              </label>
              <textarea
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
              {isEnglish ? "Official Space Pricing (Excl. VAT)" : "Tarification officielle des Espaces (Hors Taxes)"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                {isEnglish ? "Private Office 21 sqm" : "Bureau Privatif 21 m²"}
              </label>
              <input
                type="text"
                value={office17Price}
                onChange={(e) => setOffice17Price(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
              />
              <span className="text-[10px] text-calve-muted mt-1 block">
                {isEnglish ? "per month · 3 to 4 desks" : "par mois · 3 à 4 postes"}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                {isEnglish ? "Private Office 28 sqm" : "Bureau privatif 28 m²"}
              </label>
              <input
                type="text"
                value={office25Price}
                onChange={(e) => setOffice25Price(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
              />
              <span className="text-[10px] text-calve-muted mt-1 block">
                {isEnglish ? "per month · 5 to 6 desks" : "par mois · 5 à 6 postes"}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                {isEnglish ? "Dedicated Open Space Desk" : "Poste Fixe Open Space"}
              </label>
              <input
                type="text"
                value={openSpacePrice}
                onChange={(e) => setOpenSpacePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
              />
              <span className="text-[10px] text-calve-muted mt-1 block">
                {isEnglish ? "per month per desk · 5 max" : "par mois par poste · 5 max"}
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-sm cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isEnglish ? "Save CMS changes" : "Enregistrer les modifications CMS"}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
