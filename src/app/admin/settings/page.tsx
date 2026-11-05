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
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Download,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Share2,
  AlertCircle,
  Database,
  Server,
  RefreshCw,
  Globe,
  BarChart3,
  Copy,
  Check,
  Code,
  Sparkles,
  Search,
  Layers,
  HelpCircle,
  Radio
} from "lucide-react";

export default function SettingsPage() {
  const { language, t, isEnglish } = useLanguage();
  const [activeTab, setActiveTab] = useState<"identity" | "rental" | "seo" | "system" | "profile">("identity");

  // Read URL query parameter for direct tab linking (e.g. ?tab=seo or ?tab=system or ?tab=profile)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "seo") {
        setActiveTab("seo");
      } else if (tab === "system") {
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

  // OVH sync state
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

  // Form State: 1. Identity & Agency
  const [agencyName, setAgencyName] = useState("MAISON CALVÉ");
  const [tagline, setTagline] = useState("High-End Real Estate & Coworking in Bordeaux");
  const [paulPhone, setPaulPhone] = useState("+33 5 56 00 22 10");
  const [edgarPhone, setEdgarPhone] = useState("+33 7 81 96 83 95");
  const [agencyEmail, setAgencyEmail] = useState("contact@maisoncalve.fr");
  const [officeAddress, setOfficeAddress] = useState("48 rue Calvé, 33000 Bordeaux");
  const [officeHours, setOfficeHours] = useState("Monday - Friday: 08:30 AM - 07:00 PM | Saturday: By Appointment (Residents 24/7)");

  // Form State: 2. Legal Notice
  const [siret, setSiret] = useState("944 393 487 00011");
  const [licenseCPI, setLicenseCPI] = useState("CPI33012023000000128 · CCI Bordeaux Gironde");
  const [guarantee, setGuarantee] = useState("Galian Assurances — 120 000 € / Allianz Pro");

  // Form State: 3. Rental Rules & Rates
  const [office17Rate, setOffice17Rate] = useState("€950 excl. VAT / month");
  const [office25Rate, setOffice25Rate] = useState("€1,200 excl. VAT / month");
  const [openSpaceRate, setOpenSpaceRate] = useState("€250 excl. VAT / month");
  const [nomadRate, setNomadRate] = useState("€20 excl. VAT day / €10 excl. VAT half-day");
  const [meetingRate, setMeetingRate] = useState("€120 excl. VAT half-day / €200 excl. VAT full day");
  const [vatRate, setVatRate] = useState("20%");
  const [depositRule, setDepositRule] = useState("2 months rent excl. VAT");
  const [noticePeriod, setNoticePeriod] = useState("3 months for private offices · 1 month for open space");
  const [parkingPolicy, setParkingPolicy] = useState("Included with private suites (9 secure courtyard bays total)");

  // Form State: 4. SEO & Google Analytics (User requested image integration)
  const [googleTagId, setGoogleTagId] = useState("GTM-K7CVNBTS");
  const [googleTagEnabled, setGoogleTagEnabled] = useState(true);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [googleSearchConsole, setGoogleSearchConsole] = useState("");
  const [metaTitle, setMetaTitle] = useState("Maison Calvé — Coworking Bordeaux Fondaudège avec Parking");
  const [metaDescription, setMetaDescription] = useState(
    "Maison Calvé : espace de coworking haut de gamme à Bordeaux Fondaudège (48 rue Calvé). 5 bureaux privatifs, open space feutré, salle de réunion 30m² et 9 places de parking privatives sécurisées."
  );
  const [metaKeywords, setMetaKeywords] = useState(
    "coworking bordeaux, coworking bordeaux parking, espace de coworking bordeaux, bureaux privatifs bordeaux, open space bordeaux, salle de reunion bordeaux, meeting room bordeaux, coworking with parking bordeaux, coworking fondaudege, location bureau bordeaux"
  );
  const [canonicalUrl, setCanonicalUrl] = useState("https://maisoncalve.fr");
  const [allowIndexing, setAllowIndexing] = useState(true);
  const [ogTitle, setOgTitle] = useState("Maison Calvé — Coworking Bordeaux Fondaudège");
  const [ogDescription, setOgDescription] = useState(
    "Bureaux privatifs, open space feutré et salle de réunion au 48 rue Calvé avec 9 places de parking privatives."
  );
  const [ogImage, setOgImage] = useState("/images/spaces/real-open-space-fixe-4k.jpg");
  const [customHeadCode, setCustomHeadCode] = useState("");
  const [customBodyCode, setCustomBodyCode] = useState("");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Form State: 5. System, Coordinates & Alerts
  const [instagramAccount, setInstagramAccount] = useState("@maisoncalvebordeaux");
  const [gpsCoordinates, setGpsCoordinates] = useState("44.8488° N, 0.5843° W (Tram D Croix-de-Seguey)");
  const [leadDispatcherEmail, setLeadDispatcherEmail] = useState("admin@maisoncalve.fr");

  // Form State: 6. Profile & Security
  const [adminName, setAdminName] = useState("Paul (Operations Director)");
  const [adminEmail, setAdminEmail] = useState("admin@maisoncalve.fr");

  // Password Update State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Fetch all persisted settings on initial mount
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
        if (s.settings_seo) {
          const seo = s.settings_seo;
          if (seo.googleTagId !== undefined) setGoogleTagId(seo.googleTagId);
          if (seo.googleTagEnabled !== undefined) setGoogleTagEnabled(Boolean(seo.googleTagEnabled));
          if (seo.googleAnalyticsId !== undefined) setGoogleAnalyticsId(seo.googleAnalyticsId);
          if (seo.googleSearchConsole !== undefined) setGoogleSearchConsole(seo.googleSearchConsole);
          if (seo.metaTitle) setMetaTitle(seo.metaTitle);
          if (seo.metaDescription) setMetaDescription(seo.metaDescription);
          if (seo.metaKeywords) setMetaKeywords(seo.metaKeywords);
          if (seo.canonicalUrl) setCanonicalUrl(seo.canonicalUrl);
          if (seo.allowIndexing !== undefined) setAllowIndexing(Boolean(seo.allowIndexing));
          if (seo.ogTitle) setOgTitle(seo.ogTitle);
          if (seo.ogDescription) setOgDescription(seo.ogDescription);
          if (seo.ogImage) setOgImage(seo.ogImage);
          if (seo.customHeadCode !== undefined) setCustomHeadCode(seo.customHeadCode);
          if (seo.customBodyCode !== undefined) setCustomBodyCode(seo.customBodyCode);
        }
        if (s.settings_system) {
          const sys = s.settings_system;
          if (!s.settings_seo && sys.metaTitle) setMetaTitle(sys.metaTitle);
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

  // Save all tabs in bulk to database & disk
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
            settings_seo: {
              googleTagId,
              googleTagEnabled,
              googleAnalyticsId,
              googleSearchConsole,
              metaTitle,
              metaDescription,
              metaKeywords,
              canonicalUrl,
              allowIndexing,
              ogTitle,
              ogDescription,
              ogImage,
              customHeadCode,
              customBodyCode
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

  // Password update handler
  const handleUpdatePassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword) {
      setPasswordStatus({
        success: false,
        message: isEnglish ? "Please enter your current password." : "Veuillez saisir votre mot de passe actuel."
      });
      return;
    }

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
      if (data.success) {
        setPasswordStatus({
          success: true,
          message: isEnglish ? "Password updated successfully in database!" : "Mot de passe mis à jour avec succès dans MySQL !"
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordStatus({
          success: false,
          message: data.message || (isEnglish ? "Error updating password." : "Erreur lors de la mise à jour du mot de passe.")
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

  const copyGoogleTagSnippet = () => {
    const snippet = `<script async src="https://www.googletagmanager.com/gtm.js?id=${googleTagId || "GTM-K7CVNBTS"}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
</script>`;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
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
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? (isEnglish ? "Saving..." : "Enregistrement...") : t("settings.save_btn")}</span>
            </button>
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isEnglish
                ? "Settings, SEO parameters & Google tag successfully saved and applied to the site!"
                : "Paramètres, configuration SEO et Google Tag enregistrés et appliqués au site avec succès !"}
            </span>
          </div>
        )}

        {/* ========================================================== */}
        {/* 2. NAVIGATION TABS                                         */}
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
            <span>{isEnglish ? "Identity & Agency" : "Identité & Agence"}</span>
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
            <span>{isEnglish ? "Rental Rules & Rates" : "Règles & Tarifs"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "seo"
                ? "bg-white text-calve-charcoal shadow-2xs font-bold ring-1 ring-calve-slate/20"
                : "text-calve-muted hover:text-calve-charcoal"
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>{isEnglish ? "SEO & Google Analytics" : "SEO & Google Analytics"}</span>
            {googleTagEnabled && googleTagId && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
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
            <span>{isEnglish ? "System & Alerts" : "Système & Alertes"}</span>
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
            <span>{isEnglish ? "Profile & Security" : "Profil & Sécurité"}</span>
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
                    {isEnglish ? "1. Agency Identity & Branding" : "1. Identité & Image de Marque de l'Agence"}
                  </h3>
                  <p className="text-xs text-calve-muted mt-0.5">
                    {isEnglish ? "Information displayed publicly on the website and mandate agreements." : "Informations affichées publiquement sur le site et les mandats."}
                  </p>
                </div>
                <a
                  href="/"
                  target="_blank"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-calve-slate text-xs font-semibold text-calve-charcoal transition-all flex items-center gap-1.5"
                >
                  <span>{isEnglish ? "Public Portal" : "Portail Public"}</span>
                  <ExternalLink className="w-3 h-3 text-calve-muted" />
                </a>
              </div>

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
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {isEnglish ? "DIRECTOR PHONE (PAUL)" : "TÉLÉPHONE DIRECTEUR (PAUL)"}
                    </label>
                    <input
                      type="text"
                      value={paulPhone}
                      onChange={(e) => setPaulPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {isEnglish ? "COMMERCIAL PHONE (EDGAR)" : "TÉLÉPHONE COMMERCIAL (EDGAR)"}
                    </label>
                    <input
                      type="text"
                      value={edgarPhone}
                      onChange={(e) => setEdgarPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {isEnglish ? "AGENCY EMAIL" : "EMAIL OFFICIEL DE CONTACT"}
                    </label>
                    <input
                      type="email"
                      value={agencyEmail}
                      onChange={(e) => setAgencyEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {isEnglish ? "HEADQUARTERS ADDRESS" : "ADRESSE DU SIÈGE SOCIAL"}
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
                      {isEnglish ? "OPENING HOURS & PROTOCOL" : "HORAIRES D'OUVERTURE & ACCÈS"}
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
                  {isEnglish ? "2. Legal Notice & Professional Licenses (Hoguet Law)" : "2. Mentions Légales & Cartes Professionnelles (Loi Hoguet)"}
                </h3>
                <p className="text-xs text-calve-muted mt-0.5">
                  {isEnglish ? "Mandatory French legal disclosures and financial guarantees." : "Mentions obligatoires régies par la CCI Bordeaux et la législation immobilière."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "SIRET NUMBER" : "NUMÉRO DE SIRET"}
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
                    {isEnglish ? "CPI PROFESSIONAL CARD" : "CARTE PROFESSIONNELLE CPI"}
                  </label>
                  <input
                    type="text"
                    value={licenseCPI}
                    onChange={(e) => setLicenseCPI(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "FINANCIAL GUARANTEE & INSURER" : "GARANTIE FINANCIÈRE & ASSURANCE"}
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
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <h3 className="text-base font-extrabold text-calve-charcoal">
                  {isEnglish ? "1. Official Rental Pricing (Prices excl. VAT)" : "1. Grille Tarifaire Officielle (Prix en € HT)"}
                </h3>
                <p className="text-xs text-calve-muted mt-0.5">
                  {isEnglish ? "Rates displayed live on Maison Calvé public portal and CRM quotes." : "Tarifs affichés en direct sur le site public de Maison Calvé et les devis CRM."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    PRIVATE SUITE 17 M² (3-4 DESKS)
                  </label>
                  <input
                    type="text"
                    value={office17Rate}
                    onChange={(e) => setOffice17Rate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-bold text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    PRIVATE SUITE 25-28 M² (5-6 DESKS)
                  </label>
                  <input
                    type="text"
                    value={office25Rate}
                    onChange={(e) => setOffice25Rate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-bold text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    DEDICATED DESK (OPEN SPACE)
                  </label>
                  <input
                    type="text"
                    value={openSpaceRate}
                    onChange={(e) => setOpenSpaceRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-bold text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    NOMAD PASS (DAY / HALF-DAY)
                  </label>
                  <input
                    type="text"
                    value={nomadRate}
                    onChange={(e) => setNomadRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-bold text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    MEETING ROOM 30 M² (HOURLY / DAY)
                  </label>
                  <input
                    type="text"
                    value={meetingRate}
                    onChange={(e) => setMeetingRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-bold text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    APPLICABLE VAT RATE
                  </label>
                  <input
                    type="text"
                    value={vatRate}
                    onChange={(e) => setVatRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono font-bold text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <h3 className="text-base font-extrabold text-calve-charcoal">
                  {isEnglish ? "2. Lease Conditions & Resident Policies" : "2. Conditions de Bail & Politiques Résidents"}
                </h3>
                <p className="text-xs text-calve-muted mt-0.5">
                  {isEnglish ? "Terms embedded into contract generation and member agreements." : "Conditions appliquées à la signature des contrats et règlements intérieurs."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      SECURITY DEPOSIT REQUIREMENT
                    </label>
                    <input
                      type="text"
                      value={depositRule}
                      onChange={(e) => setDepositRule(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      TERMINATION NOTICE PERIOD
                    </label>
                    <input
                      type="text"
                      value={noticePeriod}
                      onChange={(e) => setNoticePeriod(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    PARKING ALLOCATION POLICY
                  </label>
                  <input
                    type="text"
                    value={parkingPolicy}
                    onChange={(e) => setParkingPolicy(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: SEO & GOOGLE ANALYTICS (USER IMAGE IMPLEMENTATION)  */}
        {/* ========================================================== */}
        {activeTab === "seo" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Card 1: Google Tag & Google Analytics 4 (GA4) Container */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-calve-border/60 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-calve-charcoal">
                        {isEnglish ? "1. Google Tag & Google Analytics (GA4 / GTM)" : "1. Google Tag & Google Analytics (GA4 / GTM)"}
                      </h3>
                      {googleTagEnabled && googleTagId ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          {isEnglish ? "Live & Tagging" : "Actif & Connecté"}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {isEnglish ? "Inactive / Paused" : "Inactif / En Pause"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-calve-muted mt-0.5">
                      {isEnglish
                        ? "Configure Google Tag Manager container or Google Analytics 4 Measurement ID shown on your setup screen."
                        : "Configurez l'identifiant de tag Google Analytics ou le conteneur Google Tag Manager (GTM) requis pour mesurer l'audience."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={googleTagEnabled}
                      onChange={(e) => setGoogleTagEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-2.5 text-xs font-bold text-calve-charcoal select-none">
                      {googleTagEnabled ? (isEnglish ? "Google Tag Enabled" : "Google Tag Activé") : (isEnglish ? "Google Tag Paused" : "Google Tag Désactivé")}
                    </span>
                  </label>
                </div>
              </div>

              {/* Tag ID input and GA4 input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-calve-muted">
                      {isEnglish ? "PRIMARY GOOGLE TAG ID / GTM CONTAINER ID *" : "IDENTIFIANT GOOGLE TAG / GTM PRINCIPAL *"}
                    </label>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      {googleTagId.startsWith("GTM-") ? "GTM Container" : googleTagId.startsWith("G-") ? "GA4 Stream" : "Google Tag"}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={googleTagId}
                      onChange={(e) => setGoogleTagId(e.target.value.trim())}
                      placeholder="GTM-K7CVNBTS ou G-XXXXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono font-bold text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                  </div>
                  <p className="text-[11px] text-calve-muted mt-1.5">
                    {isEnglish
                      ? "Directly matches the container ID from your screenshot: GTM-K7CVNBTS"
                      : "Correspond directement à l'ID affiché sur votre écran Google Tag : GTM-K7CVNBTS"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-calve-muted">
                      {isEnglish ? "SECONDARY GA4 MEASUREMENT ID (OPTIONAL)" : "ID DE MESURE GOOGLE ANALYTICS 4 DIRECT (OPTIONNEL)"}
                    </label>
                    <span className="text-[10px] text-calve-muted font-mono">G-XXXXXXXXXX</span>
                  </div>
                  <input
                    type="text"
                    value={googleAnalyticsId}
                    onChange={(e) => setGoogleAnalyticsId(e.target.value.trim())}
                    placeholder="ex: G-E7W8S9KL10"
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                  <p className="text-[11px] text-calve-muted mt-1.5">
                    {isEnglish
                      ? "Optional: Only needed if you run a direct GA4 measurement stream separate from Tag Manager."
                      : "Facultatif : Nécessaire uniquement si vous suivez un flux GA4 direct en dehors de GTM."}
                  </p>
                </div>
              </div>

              {/* Exact Code Preview matching User's screenshot */}
              <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold font-mono text-slate-200">
                      {isEnglish ? "Auto-Injected Tag Snippet (Next.js <head>)" : "Extrait de Tag Injecté Automatiquement (Next.js <head>)"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyGoogleTagSnippet}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer border border-slate-700"
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{isEnglish ? "Copied!" : "Copié !"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isEnglish ? "Copy Code" : "Copier"}</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="text-[11px] font-mono leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 overflow-x-auto text-emerald-300/90 selection:bg-emerald-900 selection:text-white">
{`<script async src="https://www.googletagmanager.com/gtm.js?id=${googleTagId || "GTM-K7CVNBTS"}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
</script>`}
                </pre>

                <div className="flex items-start gap-2 text-[11px] text-slate-400 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {isEnglish
                      ? "Automatic Setup: When you click 'Save Settings' above, this script and the GTM container noscript fallback are automatically embedded in every page. Google Analytics can immediately verify your site!"
                      : "Installation Automatique : Dès que vous cliquez sur 'Enregistrer' en haut, ce script ainsi que la balise noscript de secours sont automatiquement intégrés dans chaque page. Google Analytics peut valider le tag immédiatement !"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Core Meta Tags & Search Engine Indexing */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-calve-slate" />
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    {isEnglish ? "2. Search Engine Optimization (SEO) & Core Meta Tags" : "2. Référencement Naturel (SEO) & Balises Méta Principales"}
                  </h3>
                </div>
                <p className="text-xs text-calve-muted mt-0.5">
                  {isEnglish
                    ? "Control how Maison Calvé appears on Google Search results, Bing, and web crawlers."
                    : "Contrôlez les titres, résumés et mots-clés affichés dans les résultats Google et Bing."}
                </p>
              </div>

              <div className="space-y-4">
                {/* Meta Title */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-calve-muted">
                      {isEnglish ? "PRIMARY WEBSITE META TITLE *" : "TITRE MÉTA PRINCIPAL DU SITE (PAGE D'ACCUEIL) *"}
                    </label>
                    <span className={`text-[10px] font-mono ${metaTitle.length > 65 ? "text-amber-600 font-bold" : "text-calve-muted"}`}>
                      {metaTitle.length} / 60 {isEnglish ? "characters (ideal: 50-60)" : "caractères (idéal: 50-60)"}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-semibold text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-calve-muted">
                      {isEnglish ? "PRIMARY META DESCRIPTION *" : "DESCRIPTION MÉTA DU SITE (RÉSUMÉ GOOGLE) *"}
                    </label>
                    <span className={`text-[10px] font-mono ${metaDescription.length > 165 ? "text-amber-600 font-bold" : "text-calve-muted"}`}>
                      {metaDescription.length} / 160 {isEnglish ? "characters (ideal: 150-160)" : "caractères (idéal: 150-160)"}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs leading-relaxed"
                  />
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "META KEYWORDS (COMMA SEPARATED)" : "MOTS-CLÉS SEO (SÉPARÉS PAR DES VIRGULES)"}
                  </label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs font-mono"
                  />
                </div>

                {/* Canonical URL and Allow Indexing toggle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {isEnglish ? "CANONICAL BASE URL" : "URL CANONIQUE OFFICIELLE"}
                    </label>
                    <input
                      type="url"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {isEnglish ? "SEARCH ENGINE CRAWLING (ROBOTS.TXT)" : "INDEXATION MOTEURS DE RECHERCHE (ROBOTS)"}
                    </label>
                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-calve-border bg-slate-50">
                      <span className="text-xs font-bold text-calve-charcoal">
                        {allowIndexing ? (isEnglish ? "Index & Follow (Active)" : "Index & Follow (Autorisé)") : (isEnglish ? "No-Index (Paused)" : "No-Index (Bloqué)")}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowIndexing}
                          onChange={(e) => setAllowIndexing(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Google Search Console & Domain Verification */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-calve-slate" />
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    {isEnglish ? "3. Google Search Console & Domain Verification" : "3. Validation Google Search Console & Outils Webmasters"}
                  </h3>
                </div>
                <p className="text-xs text-calve-muted mt-0.5">
                  {isEnglish
                    ? "Validate domain property in Google Search Console using HTML tag verification."
                    : "Validez la propriété de votre site dans Google Search Console grâce à la balise de vérification."}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "GOOGLE SITE VERIFICATION TOKEN OR TAG" : "CODE OU BALISE GOOGLE-SITE-VERIFICATION"}
                  </label>
                  <input
                    type="text"
                    value={googleSearchConsole}
                    onChange={(e) => setGoogleSearchConsole(e.target.value)}
                    placeholder='ex: <meta name="google-site-verification" content="abcdef123..." /> ou juste le code abcdef123...'
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                  />
                  <p className="text-[11px] text-calve-muted mt-1.5">
                    {isEnglish
                      ? "In Google Search Console, choose 'HTML Tag' verification method and paste the string here."
                      : "Dans Google Search Console, choisissez la méthode 'Balise HTML' et collez la balise ou le code ici."}
                  </p>
                </div>

                {/* Direct quick action buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-calve-slate flex items-center justify-between text-xs font-bold text-calve-charcoal transition-all group"
                  >
                    <span>Search Console</span>
                    <ExternalLink className="w-3.5 h-3.5 text-calve-muted group-hover:text-calve-slate" />
                  </a>

                  <a
                    href="https://analytics.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-calve-slate flex items-center justify-between text-xs font-bold text-calve-charcoal transition-all group"
                  >
                    <span>Google Analytics</span>
                    <ExternalLink className="w-3.5 h-3.5 text-calve-muted group-hover:text-calve-slate" />
                  </a>

                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-calve-slate flex items-center justify-between text-xs font-bold text-calve-charcoal transition-all group"
                  >
                    <span>Sitemap XML</span>
                    <ExternalLink className="w-3.5 h-3.5 text-calve-muted group-hover:text-calve-slate" />
                  </a>

                  <a
                    href="/robots.txt"
                    target="_blank"
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-calve-slate flex items-center justify-between text-xs font-bold text-calve-charcoal transition-all group"
                  >
                    <span>Robots.txt</span>
                    <ExternalLink className="w-3.5 h-3.5 text-calve-muted group-hover:text-calve-slate" />
                  </a>
                </div>
              </div>
            </div>

            {/* Card 4: Social Share & Open Graph (OG) Preview */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-calve-slate" />
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    {isEnglish ? "4. Social Share & Open Graph (LinkedIn, WhatsApp, Facebook, X)" : "4. Partage Réseaux Sociaux & Open Graph (LinkedIn, WhatsApp, Facebook, X)"}
                  </h3>
                </div>
                <p className="text-xs text-calve-muted mt-0.5">
                  {isEnglish
                    ? "Customize the preview card generated when your link is shared on messaging apps and social platforms."
                    : "Personnalisez l'aperçu du lien lorsqu'il est partagé sur WhatsApp, LinkedIn, X ou Facebook."}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {isEnglish ? "SOCIAL SHARE TITLE (OG:TITLE)" : "TITRE DU PARTAGE SOCIAL (OG:TITLE)"}
                    </label>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-semibold text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {isEnglish ? "SOCIAL SHARE DESCRIPTION (OG:DESCRIPTION)" : "DESCRIPTION DU PARTAGE SOCIAL (OG:DESCRIPTION)"}
                    </label>
                    <textarea
                      rows={2}
                      value={ogDescription}
                      onChange={(e) => setOgDescription(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      {isEnglish ? "SOCIAL SHARE IMAGE URL (1200X630PX)" : "URL IMAGE DE PARTAGE SOCIAL (1200X630PX)"}
                    </label>
                    <input
                      type="text"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                    />
                  </div>
                </div>

                {/* Social Card Live Preview */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-calve-muted">
                    {isEnglish ? "LIVE SOCIAL PREVIEW CARD" : "APERÇU DE LA CARTE DE PARTAGE"}
                  </span>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-slate-50">
                    <div className="aspect-[1.91/1] w-full bg-slate-200 relative overflow-hidden flex items-center justify-center">
                      {ogImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={ogImage}
                          alt="Open Graph preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as any).src = "/images/spaces/real-open-space-fixe-4k.jpg";
                          }}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">1200 x 630</span>
                      )}
                    </div>
                    <div className="p-3.5 bg-white border-t border-slate-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-calve-muted font-mono tracking-wider">
                        maisoncalve.fr
                      </span>
                      <h4 className="text-xs font-extrabold text-calve-charcoal line-clamp-1">
                        {ogTitle || metaTitle}
                      </h4>
                      <p className="text-[11px] text-calve-muted line-clamp-2 leading-relaxed">
                        {ogDescription || metaDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Advanced Custom Code Injection (<head> & <body>) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-calve-slate" />
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    {isEnglish ? "5. Advanced Custom Script Injection (<head> & <body>)" : "5. Injection de Scripts & Pixels Avancés (<head> & <body>)"}
                  </h3>
                </div>
                <p className="text-xs text-calve-muted mt-0.5">
                  {isEnglish
                    ? "Add custom marketing pixels (Meta Pixel, LinkedIn Insight, Hotjar, TikTok) without touching source code."
                    : "Intégrez d'autres pixels marketing (Pixel Facebook, LinkedIn Insight, Hotjar) en toute sécurité."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "CUSTOM CODE IN <HEAD>" : "CODE PERSONNALISÉ DANS <HEAD>"}
                  </label>
                  <textarea
                    rows={4}
                    value={customHeadCode}
                    onChange={(e) => setCustomHeadCode(e.target.value)}
                    placeholder="<!-- Ex: <script ...></script> ou <meta ...> -->"
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-slate-900 text-emerald-300 font-mono text-[11px] focus:border-calve-slate shadow-2xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                    {isEnglish ? "CUSTOM CODE IN <BODY> (FOOTER)" : "CODE PERSONNALISÉ DANS <BODY> (BAS DE PAGE)"}
                  </label>
                  <textarea
                    rows={4}
                    value={customBodyCode}
                    onChange={(e) => setCustomBodyCode(e.target.value)}
                    placeholder="<!-- Ex: widget de chat, noscript, etc. -->"
                    className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-slate-900 text-emerald-300 font-mono text-[11px] focus:border-calve-slate shadow-2xs leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: SYSTEM & ALERTS                                     */}
        {/* ========================================================== */}
        {activeTab === "system" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <h3 className="text-base font-extrabold text-calve-charcoal">
                  1. Coordinates, Social Channels &amp; Notifications
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                      OFFICIAL INSTAGRAM HANDLE
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
                      GEOGRAPHICAL COORDINATES (BORDEAUX FONDAUDÈGE)
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
                    LEAD &amp; TOUR ALERTS DISPATCHER EMAIL
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
            {/* Card 1: Administrator Account & Cryptographic Security */}
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

            {/* Card 2: Change Administrator Password */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
              <div className="border-b border-calve-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-calve-slate" />
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    2. Change Administrator Password
                  </h3>
                </div>
                <p className="text-xs text-calve-muted mt-0.5">
                  Update your access credentials for the Maison Calvé admin management portal.
                </p>
              </div>

              {passwordStatus && (
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                    passwordStatus.success
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                      : "bg-rose-50 border border-rose-200 text-rose-900"
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
                      title={showCurrentPass ? "Hide password" : "Show password"}
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
                        title={showNewPass ? "Hide password" : "Show password"}
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-calve-muted hover:text-calve-charcoal cursor-pointer p-1"
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
                    onClick={() => handleUpdatePassword()}
                    disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    <KeyRound className={`w-3.5 h-3.5 ${passwordLoading ? "animate-spin" : ""}`} />
                    <span>{passwordLoading ? (isEnglish ? "Updating..." : "Mise à jour...") : (isEnglish ? "Update Password" : "Mettre à jour le mot de passe")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Backup & Export JSON */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-4">
              <div className="border-b border-calve-border/60 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    {isEnglish ? "3. Database JSON Backup & Export" : "3. Sauvegarde & Export JSON de la Base CRM"}
                  </h3>
                  <p className="text-xs text-calve-muted mt-0.5">
                    {isEnglish ? "Download a full JSON snapshot of all leads, leases, and private tours." : "Téléchargez un instantané complet de tous les leads, baux, et visites privées."}
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
                  <span>{isEnglish ? "Download Backup (.json)" : "Télécharger Sauvegarde (.json)"}</span>
                </button>
              </div>
            </div>

            {/* Card 4: Passerelle Base de Données OVH Cloud (MySQL v8.4) */}
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
