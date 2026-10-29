"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useLanguage } from "@/lib/languageContext";
import {
  Building2,
  Percent,
  Sliders,
  ShieldCheck,
  Save,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  Download,
  Lock,
  Globe,
  Share2
} from "lucide-react";

export default function SettingsPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"identity" | "rental" | "system" | "profile">("identity");
  const [saved, setSaved] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("03:00 PM");

  // Form State: 1. Identity & Agency
  const [agencyName, setAgencyName] = useState("MAISON CALVÉ");
  const [tagline, setTagline] = useState("Immobilier & Coworking Haut de Gamme à Bordeaux");
  const [paulPhone, setPaulPhone] = useState("+33 5 56 00 22 10");
  const [edgarPhone, setEdgarPhone] = useState("+33 7 81 96 83 95");
  const [agencyEmail, setAgencyEmail] = useState("contact@maisoncalve.fr");
  const [officeAddress, setOfficeAddress] = useState("48 rue Calvé, 33000 Bordeaux");
  const [officeHours, setOfficeHours] = useState("Lundi - Vendredi : 08h30 - 19h00 | Samedi : Sur rendez-vous (Résidents 24/7)");

  // Form State: 2. Legal Notice
  const [siret, setSiret] = useState("944 393 487 00011");
  const [licenseCPI, setLicenseCPI] = useState("CPI33012023000000128 · CCI Bordeaux Gironde");
  const [guarantee, setGuarantee] = useState("Galian Assurances — 120 000 € / Allianz Pro");

  // Form State: 3. Rental Rules & Rates
  const [vatRate, setVatRate] = useState("20%");
  const [office17Rate, setOffice17Rate] = useState("750 € HT / mois");
  const [office25Rate, setOffice25Rate] = useState("1 000 € HT / mois");
  const [openSpaceRate, setOpenSpaceRate] = useState("250 € HT / mois");
  const [nomadRate, setNomadRate] = useState("20 € HT journée / 10 € HT demi-journée");
  const [meetingRate, setMeetingRate] = useState("120 € HT demi-j / 200 € HT journée");
  const [depositRule, setDepositRule] = useState("2 mois de loyer HT");
  const [noticePeriod, setNoticePeriod] = useState("3 mois pour bureaux privatifs · 1 mois pour open space");
  const [parkingPolicy, setParkingPolicy] = useState("Inclus avec bureaux privatifs (9 places cour sécurisée au total)");

  // Form State: 4. System & SEO
  const [metaTitle, setMetaTitle] = useState("Maison Calvé — Peaceful Coworking Bordeaux Fondaudège avec Parking");
  const [instagramAccount, setInstagramAccount] = useState("@maisoncalvebordeaux");
  const [gpsCoordinates, setGpsCoordinates] = useState("44.8488° N, 0.5843° W (Tram D Croix-de-Seguey)");
  const [leadDispatcherEmail, setLeadDispatcherEmail] = useState("admin@maisoncalve.fr");

  // Form State: 5. Profile & Security
  const [adminName, setAdminName] = useState("Paul (Directeur d'exploitation)");
  const [adminEmail, setAdminEmail] = useState("admin@maisoncalve.fr");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setLastSyncTime(now);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportBackup = async () => {
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `maison-calve-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    } catch (err) {
      console.error("Backup export failed:", err);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================== */}
        {/* 1. TOP HEADER STRIP (MATCHING REFERENCE IMAGE 2)           */}
        {/* ========================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-calve-muted">
                {t("settings.breadcrumb")}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-calve-charcoal">
              {t("settings.title")}
            </h1>
            <p className="text-xs text-calve-muted mt-0.5">
              {t("settings.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-calve-muted font-mono hidden sm:inline-block">
              {t("settings.last_sync")} {lastSyncTime}
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t("settings.save_btn")}</span>
            </button>
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t("settings.saved_banner")}</span>
          </div>
        )}

        {/* ========================================================== */}
        {/* 2. SEGMENTED NAVIGATION TABS CAPSULE (MATCHING IMAGE 2)    */}
        {/* ========================================================== */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 border border-slate-200/80 rounded-2xl overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("identity")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "identity"
                ? "bg-white text-calve-charcoal shadow-2xs font-bold"
                : "text-calve-muted hover:text-calve-charcoal"
            }`}
          >
            <Building2 className="w-4 h-4 text-calve-slate" />
            <span>{t("settings.tab.identity")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rental")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "rental"
                ? "bg-white text-calve-charcoal shadow-2xs font-bold"
                : "text-calve-muted hover:text-calve-charcoal"
            }`}
          >
            <Percent className="w-4 h-4 text-calve-slate" />
            <span>{t("settings.tab.rental")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("system")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "system"
                ? "bg-white text-calve-charcoal shadow-2xs font-bold"
                : "text-calve-muted hover:text-calve-charcoal"
            }`}
          >
            <Sliders className="w-4 h-4 text-calve-slate" />
            <span>{t("settings.tab.system")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-white text-calve-charcoal shadow-2xs font-bold"
                : "text-calve-muted hover:text-calve-charcoal"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-calve-slate" />
            <span>{t("settings.tab.profile")}</span>
          </button>
        </div>

        {/* ========================================================== */}
        {/* TAB 1: IDENTITY & AGENCY (MATCHING IMAGE 2 PRECISELY)      */}
        {/* ========================================================== */}
        {activeTab === "identity" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Card 1: Agency Identity & Branding */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-calve-border/60 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    {t("settings.identity.title")}
                  </h3>
                  <p className="text-xs text-calve-muted mt-0.5">
                    {t("settings.identity.subtitle")}
                  </p>
                </div>
                <a
                  href="/"
                  target="_blank"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-calve-slate text-xs font-semibold text-calve-charcoal transition-all flex items-center gap-1.5"
                >
                  <span>{t("settings.identity.public_portal")}</span>
                  <ExternalLink className="w-3 h-3 text-calve-muted" />
                </a>
              </div>

              {/* Form Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {language === "fr" ? "NOM OFFICIEL DE L'AGENCE" : "OFFICIAL AGENCY NAME"}
                    </label>
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-bold text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      OFFICIAL TAGLINE / SUBTITLE
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      PAUL GOIZET PHONE
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-calve-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={paulPhone}
                        onChange={(e) => setPaulPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      EDGAR GOIZET PHONE
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-calve-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={edgarPhone}
                        onChange={(e) => setEdgarPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      PRIMARY AGENCY EMAIL
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-calve-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={agencyEmail}
                        onChange={(e) => setAgencyEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      BORDEAUX OFFICE ADDRESS
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-calve-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={officeAddress}
                        onChange={(e) => setOfficeAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      OFFICE OPENING HOURS
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-calve-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={officeHours}
                        onChange={(e) => setOfficeHours(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Legal Notice & Professional Licenses */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <h3 className="text-base font-extrabold text-calve-charcoal">
                  2. Legal Notice &amp; Professional Licenses (Hoguet Law)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    SIRET NUMBER
                  </label>
                  <input
                    type="text"
                    value={siret}
                    onChange={(e) => setSiret(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    PROFESSIONAL LICENSE CPI (CCI BORDEAUX)
                  </label>
                  <input
                    type="text"
                    value={licenseCPI}
                    onChange={(e) => setLicenseCPI(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    FINANCIAL GUARANTEE &amp; PROVIDER
                  </label>
                  <input
                    type="text"
                    value={guarantee}
                    onChange={(e) => setGuarantee(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: RENTAL RULES & RATES                                */}
        {/* ========================================================== */}
        {activeTab === "rental" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Card 1: Official Pricing Grid */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <h3 className="text-base font-extrabold text-calve-charcoal">
                  1. Grille Tarifaire Officielle (Prix en € HT)
                </h3>
                <p className="text-xs text-calve-muted mt-0.5">
                  Tarifs affichés en direct sur le site public de Maison Calvé et les devis CRM.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    Bureau Privatif 17 m²
                  </label>
                  <input
                    type="text"
                    value={office17Rate}
                    onChange={(e) => setOffice17Rate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                  <span className="text-[10px] text-calve-muted mt-1 block">3 à 4 postes de travail</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    Bureau privatif 25m²
                  </label>
                  <input
                    type="text"
                    value={office25Rate}
                    onChange={(e) => setOffice25Rate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                  <span className="text-[10px] text-calve-muted mt-1 block">5 à 6 postes de travail</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    Poste Fixe Open Space
                  </label>
                  <input
                    type="text"
                    value={openSpaceRate}
                    onChange={(e) => setOpenSpaceRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                  <span className="text-[10px] text-calve-muted mt-1 block">par mois par poste (5 postes/espace)</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    Poste Flexible Nomade
                  </label>
                  <input
                    type="text"
                    value={nomadRate}
                    onChange={(e) => setNomadRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                  <span className="text-[10px] text-calve-muted mt-1 block">sur réservation préalable</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    Grande Salle de Réunion 30 m²
                  </label>
                  <input
                    type="text"
                    value={meetingRate}
                    onChange={(e) => setMeetingRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                  <span className="text-[10px] text-calve-muted mt-1 block">avec écran 4K &amp; café barista inclus</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    Taux de TVA Standard
                  </label>
                  <input
                    type="text"
                    value={vatRate}
                    onChange={(e) => setVatRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                  <span className="text-[10px] text-calve-muted mt-1 block">applicable aux prestations de service</span>
                </div>
              </div>
            </div>

            {/* Card 2: Lease Conditions & Rules */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <h3 className="text-base font-extrabold text-calve-charcoal">
                  2. Conditions de Bail &amp; Politiques Résidents
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    DÉPÔT DE GARANTIE
                  </label>
                  <input
                    type="text"
                    value={depositRule}
                    onChange={(e) => setDepositRule(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs text-calve-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    PRÉAVIS DE SORTIE
                  </label>
                  <input
                    type="text"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs text-calve-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    PARKING EN COUR FERMÉE
                  </label>
                  <input
                    type="text"
                    value={parkingPolicy}
                    onChange={(e) => setParkingPolicy(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs text-calve-charcoal"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: SYSTEM, SEO & SOCIAL                                */}
        {/* ========================================================== */}
        {activeTab === "system" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <h3 className="text-base font-extrabold text-calve-charcoal">
                  1. Référencement Naturel (SEO) &amp; Canaux Sociaux
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    META TITLE PRINCIPAL DU SITE
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs text-calve-charcoal font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      COMPTE INSTAGRAM OFFICIEL
                    </label>
                    <div className="relative">
                      <Share2 className="w-3.5 h-3.5 text-calve-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={instagramAccount}
                        onChange={(e) => setInstagramAccount(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-calve-border text-xs font-mono text-calve-charcoal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      COORDONNÉES GÉOGRAPHIQUES (BORDEAUX FONDAUDÈGE)
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-calve-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={gpsCoordinates}
                        onChange={(e) => setGpsCoordinates(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-calve-border text-xs font-mono text-calve-charcoal"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    EMAIL DISPATCHER DES ALERTES LEADS &amp; VISITES
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-calve-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={leadDispatcherEmail}
                      onChange={(e) => setLeadDispatcherEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-calve-border text-xs text-calve-charcoal"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: PROFILE & SECURITY                                  */}
        {/* ========================================================== */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <h3 className="text-base font-extrabold text-calve-charcoal">
                  1. Compte Administrateur &amp; Chiffrement Sécurisé
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    NOM DE L&apos;ADMINISTRATEUR
                  </label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    EMAIL D&apos;AUTHENTIFICATION
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs text-calve-charcoal"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-xs text-calve-charcoal flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Chiffrement TLS 1.3 &amp; AES-256</span>
                  </div>
                  <p className="text-[11px] text-calve-muted mt-0.5">
                    Sessions protégées avec signature sécurisée et jeton HttpOnly contre les attaques XSS.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  Actif &amp; Protégé
                </span>
              </div>
            </div>

            {/* Backup Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-4">
              <div className="border-b border-calve-border/60 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    2. Sauvegarde &amp; Export JSON de la Base CRM
                  </h3>
                  <p className="text-xs text-calve-muted mt-0.5">
                    Téléchargez un instantané complet de tous les leads, baux, et visites privées.
                  </p>
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-calve-charcoal transition-all cursor-pointer shadow-2xs"
                >
                  <Download className="w-4 h-4 text-calve-slate" />
                  <span>Télécharger Sauvegarde (.json)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </AdminLayout>
  );
}
