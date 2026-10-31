"use client";

import React, { useState, useEffect } from "react";
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
  Download,
  Lock,
  Share2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff
} from "lucide-react";

export default function SettingsPage() {
  const { language, t, isEnglish } = useLanguage();
  const [activeTab, setActiveTab] = useState<"identity" | "rental" | "system" | "profile">("identity");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "seo" || tab === "system") {
        setActiveTab("system");
      } else if (tab === "profile") {
        setActiveTab("profile");
      } else if (tab === "rental") {
        setActiveTab("rental");
      } else if (tab === "identity") {
        setActiveTab("identity");
      }
    }
  }, []);

  const [saved, setSaved] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("03:00 PM");

  // Form State: 1. Identity & Agency
  const [agencyName, setAgencyName] = useState("MAISON CALVÉ");
  const [tagline, setTagline] = useState("");
  const [paulPhone, setPaulPhone] = useState("+33 5 56 00 22 10");
  const [edgarPhone, setEdgarPhone] = useState("+33 7 81 96 83 95");
  const [agencyEmail, setAgencyEmail] = useState("contact@maisoncalve.fr");
  const [officeAddress, setOfficeAddress] = useState("48 rue Calvé, 33000 Bordeaux");
  const [officeHours, setOfficeHours] = useState("");

  // Form State: 2. Legal Notice
  const [siret, setSiret] = useState("944 393 487 00011");
  const [licenseCPI, setLicenseCPI] = useState("CPI33012023000000128 · CCI Bordeaux Gironde");
  const [guarantee, setGuarantee] = useState("Galian Assurances — 120 000 € / Allianz Pro");

  // Form State: 3. Rental Rules & Rates
  const [vatRate, setVatRate] = useState("20%");
  const [office17Rate, setOffice17Rate] = useState("");
  const [office25Rate, setOffice25Rate] = useState("");
  const [openSpaceRate, setOpenSpaceRate] = useState("");
  const [nomadRate, setNomadRate] = useState("");
  const [meetingRate, setMeetingRate] = useState("");
  const [depositRule, setDepositRule] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [parkingPolicy, setParkingPolicy] = useState("");

  // Form State: 4. System & SEO
  const [metaTitle, setMetaTitle] = useState("");
  const [instagramAccount, setInstagramAccount] = useState("@maisoncalvebordeaux");
  const [gpsCoordinates, setGpsCoordinates] = useState("44.8488° N, 0.5843° W (Tram D Croix-de-Seguey)");
  const [leadDispatcherEmail, setLeadDispatcherEmail] = useState("admin@maisoncalve.fr");

  // Form State: 5. Profile & Security
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("admin@maisoncalve.fr");

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 6) {
      setPasswordStatus({
        success: false,
        message: isEnglish
          ? "The new password must be at least 6 characters long."
          : "Le nouveau mot de passe doit comporter au moins 6 caractères."
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        success: false,
        message: isEnglish
          ? "The new password and confirmation do not match."
          : "Le nouveau mot de passe et sa confirmation ne correspondent pas."
      });
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await fetch("/api/admin/auth", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordStatus({
          success: true,
          message: isEnglish
            ? "Administrator password updated successfully!"
            : "Mot de passe administrateur modifié avec succès !"
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordStatus({
          success: false,
          message: data.message || (isEnglish ? "Failed to update password." : "Échec de la mise à jour du mot de passe.")
        });
      }
    } catch (err: any) {
      setPasswordStatus({
        success: false,
        message: err.message || (isEnglish ? "Server connection error." : "Erreur de connexion au serveur.")
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toLocaleTimeString(isEnglish ? "en-US" : "fr-FR", { hour: "2-digit", minute: "2-digit" });
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
        {/* 1. TOP HEADER STRIP                                        */}
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
        {/* 2. SEGMENTED NAVIGATION TABS CAPSULE                       */}
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
        {/* TAB 1: IDENTITY & AGENCY                                   */}
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
                      {isEnglish ? "OFFICIAL AGENCY NAME" : "NOM OFFICIEL DE L'AGENCE"}
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
                      {isEnglish ? "OFFICIAL TAGLINE / SUBTITLE" : "SLOGAN / SOUS-TITRE OFFICIEL"}
                    </label>
                    <input
                      type="text"
                      value={tagline || (isEnglish ? "High-End Real Estate & Coworking in Bordeaux" : "Immobilier & Coworking Haut de Gamme à Bordeaux")}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {isEnglish ? "PAUL GOIZET PHONE" : "TÉLÉPHONE PAUL GOIZET"}
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
                      {isEnglish ? "EDGAR GOIZET PHONE" : "TÉLÉPHONE EDGAR GOIZET"}
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
                      {isEnglish ? "PRIMARY AGENCY EMAIL" : "EMAIL PRINCIPAL DE L'AGENCE"}
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
                      {isEnglish ? "BORDEAUX OFFICE ADDRESS" : "ADRESSE DU SIÈGE BORDEAUX"}
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
                      {isEnglish ? "OFFICE OPENING HOURS" : "HORAIRES D'OUVERTURE"}
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-calve-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={officeHours || (isEnglish ? "Monday - Friday: 08:30 AM - 07:00 PM | Saturday: By Appointment (Residents 24/7)" : "Lundi - Vendredi : 08h30 - 19h00 | Samedi : Sur rendez-vous (Résidents 24/7)")}
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
                  {t("settings.legal.title")}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "SIRET NUMBER" : "NUMÉRO SIRET"}
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
                    {isEnglish ? "PROFESSIONAL LICENSE CPI (CCI BORDEAUX)" : "CARTE PROFESSIONNELLE CPI (CCI BORDEAUX)"}
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
                    {isEnglish ? "FINANCIAL GUARANTEE & PROVIDER" : "GARANTIE FINANCIÈRE & ASSURANCE"}
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
                  {t("settings.rental.title")}
                </h3>
                <p className="text-xs text-calve-muted mt-0.5">
                  {t("settings.rental.subtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "Private Office 21 sqm" : "Bureau Privatif 21 m²"}
                  </label>
                  <input
                    type="text"
                    value={office17Rate || (isEnglish ? "€750 excl. VAT / month" : "750 € HT / mois")}
                    onChange={(e) => setOffice17Rate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                  <span className="text-[10px] text-calve-muted mt-1 block">
                    {isEnglish ? "3 to 4 workstations" : "3 à 4 postes de travail"}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "Private Office 28 sqm" : "Bureau privatif 28 m²"}
                  </label>
                  <input
                    type="text"
                    value={office25Rate || (isEnglish ? "€1,200 excl. VAT / month" : "1 200 € HT / mois")}
                    onChange={(e) => setOffice25Rate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                  <span className="text-[10px] text-calve-muted mt-1 block">
                    {isEnglish ? "5 to 6 workstations" : "5 à 6 postes de travail"}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "Dedicated Desk Open Space" : "Poste Fixe Open Space"}
                  </label>
                  <input
                    type="text"
                    value={openSpaceRate || (isEnglish ? "€250 excl. VAT / month" : "250 € HT / mois")}
                    onChange={(e) => setOpenSpaceRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                  <span className="text-[10px] text-calve-muted mt-1 block">
                    {isEnglish ? "per month per desk (5 desks/space)" : "par mois par poste (5 postes/espace)"}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "Flexible Hot Desk" : "Poste Flexible Nomade"}
                  </label>
                  <input
                    type="text"
                    value={nomadRate || (isEnglish ? "€20 excl. VAT day / €10 excl. VAT half-day" : "20 € HT journée / 10 € HT demi-journée")}
                    onChange={(e) => setNomadRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                  <span className="text-[10px] text-calve-muted mt-1 block">
                    {isEnglish ? "upon prior reservation" : "sur réservation préalable"}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "Executive Meeting Room 30 sqm" : "Grande Salle de Réunion 30 m²"}
                  </label>
                  <input
                    type="text"
                    value={meetingRate || (isEnglish ? "€120 excl. VAT half-day / €200 excl. VAT full day" : "120 € HT demi-j / 200 € HT journée")}
                    onChange={(e) => setMeetingRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                  <span className="text-[10px] text-calve-muted mt-1 block">
                    {isEnglish ? "with 4K screen & barista coffee included" : "avec écran 4K & café barista inclus"}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "Standard VAT Rate" : "Taux de TVA Standard"}
                  </label>
                  <input
                    type="text"
                    value={vatRate}
                    onChange={(e) => setVatRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                  <span className="text-[10px] text-calve-muted mt-1 block">
                    {isEnglish ? "applicable to corporate service contracts" : "applicable aux prestations de service"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Lease Conditions & Rules */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <h3 className="text-base font-extrabold text-calve-charcoal">
                  {t("settings.lease.title")}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "SECURITY DEPOSIT" : "DÉPÔT DE GARANTIE"}
                  </label>
                  <input
                    type="text"
                    value={depositRule || (isEnglish ? "2 months rent excl. VAT" : "2 mois de loyer HT")}
                    onChange={(e) => setDepositRule(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs text-calve-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "NOTICE PERIOD" : "PRÉAVIS DE SORTIE"}
                  </label>
                  <input
                    type="text"
                    value={noticePeriod || (isEnglish ? "3 months for private offices · 1 month for open space" : "3 mois pour bureaux privatifs · 1 mois pour open space")}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs text-calve-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "SECURE COURTYARD PARKING" : "PARKING EN COUR FERMÉE"}
                  </label>
                  <input
                    type="text"
                    value={parkingPolicy || (isEnglish ? "Included with private suites (9 secure courtyard bays total)" : "Inclus avec bureaux privatifs (9 places cour sécurisée au total)")}
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
                  {t("settings.seo.title")}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "PRIMARY WEBSITE META TITLE" : "META TITLE PRINCIPAL DU SITE"}
                  </label>
                  <input
                    type="text"
                    value={metaTitle || (isEnglish ? "Maison Calvé — Premium Coworking Bordeaux Fondaudège with Parking" : "Maison Calvé — Coworking Bordeaux Fondaudège avec Parking")}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs text-calve-charcoal font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {isEnglish ? "OFFICIAL INSTAGRAM HANDLE" : "COMPTE INSTAGRAM OFFICIEL"}
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
                      {isEnglish ? "GEOGRAPHICAL COORDINATES (BORDEAUX FONDAUDÈGE)" : "COORDONNÉES GÉOGRAPHIQUES (BORDEAUX FONDAUDÈGE)"}
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
                    {isEnglish ? "LEAD & TOUR ALERTS DISPATCHER EMAIL" : "EMAIL DISPATCHER DES ALERTES LEADS & VISITES"}
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
        {/* TAB 5: PROFILE & SECURITY                                  */}
        {/* ========================================================== */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <h3 className="text-base font-extrabold text-calve-charcoal">
                  {t("settings.profile.title")}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "ADMINISTRATOR FULL NAME" : "NOM DE L'ADMINISTRATEUR"}
                  </label>
                  <input
                    type="text"
                    value={adminName || (isEnglish ? "Paul (Operations Director)" : "Paul (Directeur d'exploitation)")}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-bold text-calve-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "AUTHENTICATION EMAIL" : "EMAIL D'AUTHENTIFICATION"}
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
                    <span>{isEnglish ? "Session security & access token revocation" : "Sécurité des sessions & jetons d'accès"}</span>
                  </div>
                  <p className="text-[11px] text-calve-muted mt-0.5">
                    {isEnglish
                      ? "HMAC-SHA256 signed tokens with HttpOnly cookies preventing XSS and replay exploits."
                      : "Sessions protégées avec signature sécurisée et jeton HttpOnly contre les attaques XSS."}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  {isEnglish ? "Active & Protected" : "Actif & Protégé"}
                </span>
              </div>
            </div>

            {/* Card 2: Change Administrator Password */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-calve-slate" />
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    {t("settings.password.title")}
                  </h3>
                </div>
                <p className="text-xs text-calve-muted mt-0.5">
                  {t("settings.password.subtitle")}
                </p>
              </div>

              {passwordStatus && (
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in border ${
                    passwordStatus.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-rose-50 border-rose-200 text-rose-900"
                  }`}
                >
                  {passwordStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{passwordStatus.message}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {t("settings.password.current")}
                  </label>
                  <div className="relative max-w-md">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-mono text-calve-charcoal focus:border-calve-slate pr-10 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-calve-muted hover:text-calve-charcoal cursor-pointer"
                      title={showCurrentPass ? "Hide password" : "Show password"}
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {t("settings.password.new")}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        minLength={6}
                        className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-mono text-calve-charcoal focus:border-calve-slate pr-10 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-calve-muted hover:text-calve-charcoal cursor-pointer"
                        title={showNewPass ? "Hide password" : "Show password"}
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-calve-muted mt-1 block">
                      {t("settings.password.hint")}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {t("settings.password.confirm")}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        minLength={6}
                        className="w-full px-4 py-2.5 rounded-xl border border-calve-border text-xs font-mono text-calve-charcoal focus:border-calve-slate pr-10 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-calve-muted hover:text-calve-charcoal cursor-pointer"
                        title={showConfirmPass ? "Hide password" : "Show password"}
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleUpdatePassword}
                    disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <KeyRound className={`w-3.5 h-3.5 ${passwordLoading ? "animate-spin" : ""}`} />
                    <span>{passwordLoading ? (isEnglish ? "Updating..." : "Mise à jour...") : t("settings.password.btn")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Backup Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-4">
              <div className="border-b border-calve-border/60 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    {t("settings.backup.title")}
                  </h3>
                  <p className="text-xs text-calve-muted mt-0.5">
                    {t("settings.backup.subtitle")}
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
                  <span>{t("settings.backup.btn")}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </AdminLayout>
  );
}
