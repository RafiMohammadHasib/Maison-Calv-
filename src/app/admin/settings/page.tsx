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
  FileText,
  Download,
  Lock,
  Key,
  Eye,
  EyeOff,
  Globe,
  Share2,
  Sparkles,
  Database,
  Server,
  RefreshCw,
  AlertCircle
} from "lucide-react";

export default function SettingsPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"identity" | "rental" | "database" | "system" | "profile">("identity");
  const [ovhTesting, setOvhTesting] = useState(false);
  const [ovhSyncing, setOvhSyncing] = useState(false);
  const [ovhStatus, setOvhStatus] = useState<any>(null);

  const handleTestOvh = async () => {
    setOvhTesting(true);
    setOvhStatus(null);
    try {
      const res = await fetch("/api/admin/ovh-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" })
      });
      const data = await res.json();
      setOvhStatus(data);
    } catch (err: any) {
      setOvhStatus({ success: false, error: err.message || "Failed to reach OVH" });
    } finally {
      setOvhTesting(false);
    }
  };

  const handleSyncAllOvh = async () => {
    setOvhSyncing(true);
    setOvhStatus(null);
    try {
      const res = await fetch("/api/admin/ovh-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync_all" })
      });
      const data = await res.json();
      setOvhStatus(data);
    } catch (err: any) {
      setOvhStatus({ success: false, error: err.message || "Sync failed" });
    } finally {
      setOvhSyncing(false);
    }
  };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [syncedWithOvh, setSyncedWithOvh] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("03:00 PM");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchAllSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        const s = data.settings;
        if (s.settings_identity) {
          const id = s.settings_identity;
          if (id.agencyName) setAgencyName(id.agencyName);
          if (id.tagline) setTagline(id.tagline);
          if (id.paulPhone) setPaulPhone(id.paulPhone);
          if (id.edgarPhone) setEdgarPhone(id.edgarPhone);
          if (id.agencyEmail) setAgencyEmail(id.agencyEmail);
          if (id.officeAddress) setOfficeAddress(id.officeAddress);
          if (id.officeHours) setOfficeHours(id.officeHours);
          if (id.siret) setSiret(id.siret);
          if (id.licenseCPI) setLicenseCPI(id.licenseCPI);
          if (id.guarantee) setGuarantee(id.guarantee);
        }
        if (s.settings_rental) {
          const r = s.settings_rental;
          if (r.office17Rate) setOffice17Rate(r.office17Rate);
          if (r.office25Rate) setOffice25Rate(r.office25Rate);
          if (r.openSpaceRate) setOpenSpaceRate(r.openSpaceRate);
          if (r.nomadRate) setNomadRate(r.nomadRate);
          if (r.meetingRate) setMeetingRate(r.meetingRate);
          if (r.vatRate) setVatRate(r.vatRate);
          if (r.depositRule) setDepositRule(r.depositRule);
          if (r.noticePeriod) setNoticePeriod(r.noticePeriod);
          if (r.parkingPolicy) setParkingPolicy(r.parkingPolicy);
        }
        if (s.settings_system) {
          const sys = s.settings_system;
          if (sys.metaTitle) setMetaTitle(sys.metaTitle);
          if (sys.instagramAccount) setInstagramAccount(sys.instagramAccount);
          if (sys.gpsCoordinates) setGpsCoordinates(sys.gpsCoordinates);
          if (sys.leadDispatcherEmail) setLeadDispatcherEmail(sys.leadDispatcherEmail);
        }
        if (s.settings_profile) {
          const p = s.settings_profile;
          if (p.adminName) setAdminName(p.adminName);
          if (p.adminEmail) setAdminEmail(p.adminEmail);
        }
        if (data.source === "ovh_mysql") {
          setSyncedWithOvh(true);
        }
        if (data.timestamp) {
          const d = new Date(data.timestamp);
          setLastSyncTime(d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
        }
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const handleUpdatePassword = async () => {
    setPasswordMessage(null);
    if (!currentPassword) {
      setPasswordMessage({ type: "error", text: "Veuillez saisir votre mot de passe actuel." });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Le nouveau mot de passe doit comporter au moins 6 caractères." });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMessage({ type: "error", text: "Les deux nouveaux mots de passe ne correspondent pas." });
      return;
    }

    try {
      setPasswordUpdating(true);
      const res = await fetch("/api/admin/auth", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setPasswordMessage({ type: "success", text: "Mot de passe mis à jour avec succès dans MySQL !" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setPasswordMessage({ type: "error", text: data.message || "Erreur lors de la mise à jour du mot de passe." });
      }
    } catch (err: any) {
      setPasswordMessage({ type: "error", text: err.message || "Erreur de connexion au serveur." });
    } finally {
      setPasswordUpdating(false);
    }
  };

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
  const [office25Rate, setOffice25Rate] = useState("1 200 € HT / mois");
  const [openSpaceRate, setOpenSpaceRate] = useState("250 € HT / mois");
  const [nomadRate, setNomadRate] = useState("20 € HT journée / 10 € HT demi-journée");
  const [meetingRate, setMeetingRate] = useState("120 € HT demi-j / 200 € HT journée");
  const [depositRule, setDepositRule] = useState("2 mois de loyer HT");
  const [noticePeriod, setNoticePeriod] = useState("3 mois pour bureaux privatifs · 1 mois pour open space");
  const [parkingPolicy, setParkingPolicy] = useState("Inclus avec bureaux privatifs (9 places cour sécurisée au total)");

  // Form State: 4. System & SEO
  const [metaTitle, setMetaTitle] = useState("Maison Calvé — Coworking Bordeaux Fondaudège avec Parking");
  const [instagramAccount, setInstagramAccount] = useState("@maisoncalvebordeaux");
  const [gpsCoordinates, setGpsCoordinates] = useState("44.8488° N, 0.5843° W (Tram D Croix-de-Seguey)");
  const [leadDispatcherEmail, setLeadDispatcherEmail] = useState("admin@maisoncalve.fr");

  // Form State: 5. Profile & Security
  const [adminName, setAdminName] = useState("Paul (Directeur d'exploitation)");
  const [adminEmail, setAdminEmail] = useState("admin@maisoncalve.fr");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            settings_identity: {
              agencyName,
              tagline,
              paulPhone,
              edgarPhone,
              agencyEmail,
              officeAddress,
              officeHours,
              siret,
              licenseCPI,
              guarantee
            },
            settings_rental: {
              office17Rate,
              office25Rate,
              openSpaceRate,
              nomadRate,
              meetingRate,
              vatRate,
              depositRule,
              noticePeriod,
              parkingPolicy
            },
            settings_system: {
              metaTitle,
              instagramAccount,
              gpsCoordinates,
              leadDispatcherEmail
            },
            settings_profile: {
              adminName,
              adminEmail
            }
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setSyncedWithOvh(Boolean(data.syncedWithOvh));
        const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        setLastSyncTime(now);
        setTimeout(() => setSaved(false), 4000);
      }
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
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
                    Bureau Privatif 21 m²
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
                    Bureau privatif 28 m²
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
        {/* ========================================================== */}
        {/* TAB 3: SYSTEM, SEO & SOCIAL                                */}
        {/* ========================================================== */}
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
            {/* Card 1: Administrator Account & Cryptographic Security (Matching Image 5) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <h3 className="text-base font-extrabold text-calve-charcoal">
                  1. Administrator Account &amp; Cryptographic Security
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    ADMINISTRATOR FULL NAME
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
                    AUTHENTICATION EMAIL
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
                    <span>Session security &amp; access token revocation</span>
                  </div>
                  <p className="text-[11px] text-calve-muted mt-0.5">
                    HMAC-SHA256 signed tokens with HttpOnly cookies preventing XSS and replay exploits.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  Active &amp; Protected
                </span>
              </div>
            </div>

            {/* Card 2: Change Administrator Password (Matching Image 5) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-calve-slate" />
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    2. Change Administrator Password
                  </h3>
                </div>
                <p className="text-xs text-calve-muted mt-0.5">
                  Update your access credentials for the Maison Calvé admin management portal.
                </p>
              </div>

              {passwordMessage && (
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                    passwordMessage.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                      : "bg-rose-50 border border-rose-200 text-rose-900"
                  }`}
                >
                  {passwordMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    CURRENT PASSWORD *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-calve-muted hover:text-calve-charcoal cursor-pointer p-1"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      NEW PASSWORD *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-calve-muted hover:text-calve-charcoal cursor-pointer p-1"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-calve-muted mt-1 block">
                      Password must be at least 6 characters.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      CONFIRM NEW PASSWORD *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-calve-muted hover:text-calve-charcoal cursor-pointer p-1"
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
                    disabled={passwordUpdating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{passwordUpdating ? "Mise à jour..." : "Update Password"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Backup & Export JSON */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-4">
              <div className="border-b border-calve-border/60 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    3. Sauvegarde &amp; Export JSON de la Base CRM
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

            {/* Card 4: Passerelle OVH MySQL & Diagnostics */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-calve-border/60 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-calve-slate" />
                    <h3 className="text-base font-extrabold text-calve-charcoal">
                      4. Passerelle Base de Données OVH Cloud (MySQL v8.4)
                    </h3>
                  </div>
                  <p className="text-xs text-calve-muted mt-0.5">
                    Pont de données distant reliant Next.js à votre hébergement OVH Web Cloud (uwenyoimaison).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {ovhStatus?.success || ovhStatus?.status === "healthy" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Connecté &amp; Opérationnel
                    </span>
                  ) : ovhStatus?.error ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      Échec de connexion
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold">
                      <Server className="w-3.5 h-3.5 text-slate-500" />
                      Prêt pour le test
                    </span>
                  )}
                </div>
              </div>

              {ovhStatus && (
                <div
                  className={`p-4 rounded-2xl text-xs font-medium border ${
                    ovhStatus.success || ovhStatus.status === "healthy"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-rose-50 border-rose-200 text-rose-900"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {ovhStatus.success || ovhStatus.status === "healthy" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>
                      {ovhStatus.success || ovhStatus.status === "healthy"
                        ? "Communication avec OVH MySQL réussie !"
                        : "Erreur lors du contact avec la passerelle OVH"}
                    </span>
                  </div>
                  <p>{ovhStatus.message || ovhStatus.error || JSON.stringify(ovhStatus)}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleTestOvh}
                  disabled={ovhTesting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${ovhTesting ? "animate-spin" : ""}`} />
                  <span>{ovhTesting ? "Test en cours..." : "Tester la Connexion OVH"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSyncAllOvh}
                  disabled={ovhSyncing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Database className={`w-3.5 h-3.5 ${ovhSyncing ? "animate-spin" : ""}`} />
                  <span>{ovhSyncing ? "Synchronisation..." : "Migrer tous les Leads vers OVH"}</span>
                </button>

                <a
                  href="http://uwenyoi.cluster131.hosting.ovh.net/maison-api/index.php?action=health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-calve-charcoal text-xs font-semibold transition-all border border-slate-200/80"
                >
                  <span>Diagnostic API Health</span>
                  <ExternalLink className="w-3.5 h-3.5 text-calve-muted" />
                </a>
              </div>
            </div>
          </div>
        )}
</form>
    </AdminLayout>
  );
}
