"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useLanguage } from "@/lib/languageContext";
import { TenantRecord } from "@/lib/inventorySync";
import {
  Users,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Key,
  Car,
  Calendar,
  CreditCard,
  FileText,
  Search,
  ExternalLink,
  BadgeCheck,
  RefreshCw,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Trash2,
  Edit,
  Plus,
  X,
  Save
} from "lucide-react";

export default function TenantsPage() {
  const { language, t, isEnglish } = useLanguage();
  const [search, setSearch] = useState("");
  const [tenants, setTenants] = useState<TenantRecord[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "private" | "open" | "meeting">("all");

  // Edit tenant modal state
  const [editingTenant, setEditingTenant] = useState<TenantRecord | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    company: "",
    role: "",
    email: "",
    phone: "",
    spaceAssigned: "",
    workstations: 1,
    parkingBays: "",
    monthlyRent: "",
    status: "active" as "active" | "onboarding" | "notice"
  });

  // Create tenant modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    company: "",
    role: "Résident Partenaire",
    email: "",
    phone: "",
    spaceAssigned: "Bureau Privatif 21 m²",
    workstations: 3,
    parkingBays: "Places #3 & #4",
    monthlyRent: "750 € HT / mois",
    status: "active" as "active" | "onboarding" | "notice"
  });

  const fetchTenants = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/tenants");
      const data = await res.json();
      if (data.success) {
        setTenants(data.tenants || []);
        setMetrics(data.metrics || null);
      }
    } catch (err) {
      console.error("Error fetching tenants:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const openEditModal = (tenant: TenantRecord) => {
    setEditingTenant(tenant);
    setEditForm({
      name: tenant.name,
      company: tenant.company,
      role: tenant.role,
      email: tenant.email,
      phone: tenant.phone,
      spaceAssigned: tenant.spaceAssigned,
      workstations: tenant.workstations,
      parkingBays: tenant.parkingBays,
      monthlyRent: tenant.monthlyRent,
      status: tenant.status
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    try {
      const res = await fetch("/api/admin/tenants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTenant.id,
          ...editForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setTenants((prev) =>
          prev.map((t) => (t.id === editingTenant.id ? { ...t, ...editForm } : t))
        );
        setEditingTenant(null);
      }
    } catch (err) {
      console.error("Error updating tenant in DB:", err);
    }
  };

  const handleDeleteTenant = async (id: string, name: string) => {
    const confirmMsg = isEnglish
      ? `Confirm deletion of "${name}" from directory and database?`
      : `Confirmer la suppression définitive de "${name}" de la base de données ?`;
    if (!confirm(confirmMsg)) return;

    setTenants((prev) => prev.filter((t) => t.id !== id));

    try {
      await fetch(`/api/admin/tenants?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("Error deleting tenant:", err);
      fetchTenants();
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.company || !createForm.email) return;

    try {
      const res = await fetch("/api/admin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm)
      });
      const data = await res.json();
      if (data.success && data.tenant) {
        setTenants((prev) => [data.tenant, ...prev]);
        setIsCreateOpen(false);
        setCreateForm({
          name: "",
          company: "",
          role: "Résident Partenaire",
          email: "",
          phone: "",
          spaceAssigned: "Bureau Privatif 21 m²",
          workstations: 3,
          parkingBays: "Places #3 & #4",
          monthlyRent: "750 € HT / mois",
          status: "active"
        });
      }
    } catch (err) {
      console.error("Error creating tenant:", err);
    }
  };

  const filtered = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(search.toLowerCase()) ||
      tenant.company.toLowerCase().includes(search.toLowerCase()) ||
      tenant.email.toLowerCase().includes(search.toLowerCase()) ||
      tenant.spaceAssigned.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "private") {
      return tenant.spaceAssigned.toLowerCase().includes("privatif") || tenant.spaceAssigned.toLowerCase().includes("bureau");
    }
    if (filterType === "open") {
      return tenant.spaceAssigned.toLowerCase().includes("open space");
    }
    if (filterType === "meeting") {
      return tenant.spaceAssigned.toLowerCase().includes("réunion") || tenant.spaceAssigned.toLowerCase().includes("salle");
    }

    return true;
  });

  // Helper to extract clean Company and Contact Person without duplicate parentheses
  const getResidentIdentity = (tenant: TenantRecord) => {
    const rawCompany = (tenant.company || "").trim();
    const rawName = (tenant.name || "").trim();

    let company = rawCompany;
    let contactPerson = rawName;

    if (rawName.includes("(") && rawName.includes(")")) {
      const match = rawName.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        if (!company || company.toLowerCase() === match[1].toLowerCase().trim()) {
          company = match[1].trim();
        }
        contactPerson = match[2].trim();
      }
    }

    if (company && contactPerson.toLowerCase().startsWith(company.toLowerCase())) {
      contactPerson = contactPerson.slice(company.length).replace(/^[(\s-]+|[)\s-]+$/g, "").trim();
    }

    if (company && contactPerson && company.toLowerCase() === contactPerson.toLowerCase()) {
      contactPerson = "";
    }

    const title = company || contactPerson || (isEnglish ? "Resident Occupant" : "Résident Occupant");
    const subtitle = contactPerson && contactPerson !== company ? contactPerson : null;

    const initials = (company || contactPerson || "MC")
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "MC";

    return { title, subtitle, initials };
  };

  return (
    <AdminLayout
      title={isEnglish ? "Tenants & Residents Directory" : "Annuaire des Résidents & Locataires"}
      subtitle={
        isEnglish
          ? "Live synchronization with CRM won leads and active building occupant contracts."
          : "Synchronisation en direct avec les leads CRM gagnés et les contrats de résidents actifs."
      }
      onSearch={setSearch}
    >
      {/* Executive Quick Actions & Real-Time Sync Bar */}
      <div className="bg-white border border-calve-border/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info & Live Sync Status */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-calve-stone/80 border border-calve-border/70 flex items-center justify-center text-calve-slate shrink-0">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-calve-charcoal flex items-center gap-2 flex-wrap">
              <span>{isEnglish ? "Automated Resident Onboarding" : "Intégration Automatisée des Résidents"}</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isEnglish ? "Live Sync Active" : "Synchro Active"}
              </span>
            </div>
            <p className="text-xs text-calve-muted mt-0.5 leading-relaxed">
              {isEnglish
                ? "Every opportunity marked as 'Won / Signed' in the CRM automatically appears here with assigned space, badges and rent."
                : "Chaque lead marqué 'Gagné / Signé' dans le CRM apparaît automatiquement ici avec espace assigné, badges et loyer."}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-calve-stone">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-xs font-bold text-white transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isEnglish ? "New Resident" : "Nouveau Résident"}</span>
          </button>
          <button
            onClick={fetchTenants}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-calve-stone/60 border border-calve-border/80 text-xs font-semibold text-calve-slate transition-all shadow-2xs cursor-pointer disabled:opacity-50 active:scale-95"
            title={isEnglish ? "Refresh database" : "Actualiser la base"}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isEnglish ? "Refresh" : "Actualiser"}</span>
          </button>
          <Link
            href="/admin/spaces"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-calve-stone/60 border border-calve-border/80 text-xs font-semibold text-calve-charcoal transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <span>{isEnglish ? "View Spaces" : "Voir Espaces"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-calve-muted" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Resident Companies" : "Entreprises Résidentes"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {metrics?.activeCompanies ?? 2} {isEnglish ? "companies" : "sociétés"}
          </div>
          <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% active contracts & bails</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Assigned Desks" : "Postes Attribués"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {metrics?.assignedDesks ?? 4} {isEnglish ? "desks" : "postes"}
          </div>
          <p className="text-xs text-calve-muted">
            Private offices + open space
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Courtyard Parking Bays" : "Places de Parking Cour"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {metrics?.parkingBaysAssigned ?? 2} / {metrics?.totalParkingBays ?? 9} bays
          </div>
          <p className="text-xs text-calve-muted">
            7 visitor bays available
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Active 24/7 RFID Badges" : "Badges RFID 24/7 Actifs"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {metrics?.activeBadges ?? 3} badges
          </div>
          <p className="text-xs text-calve-muted">
            Main gate & portal access
          </p>
        </div>
      </div>

      {/* Filter Tabs Capsule */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 border border-slate-200/80 rounded-2xl overflow-x-auto text-xs font-semibold w-fit">
        <button
          onClick={() => setFilterType("all")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            filterType === "all"
              ? "bg-white text-calve-charcoal shadow-2xs font-bold"
              : "text-calve-muted hover:text-calve-charcoal"
          }`}
        >
          {isEnglish ? `All Residents (${tenants.length})` : `Tous les Résidents (${tenants.length})`}
        </button>
        <button
          onClick={() => setFilterType("private")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            filterType === "private"
              ? "bg-white text-calve-charcoal shadow-2xs font-bold"
              : "text-calve-muted hover:text-calve-charcoal"
          }`}
        >
          {isEnglish ? "Private Offices" : "Bureaux Privatifs"}
        </button>
        <button
          onClick={() => setFilterType("open")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            filterType === "open"
              ? "bg-white text-calve-charcoal shadow-2xs font-bold"
              : "text-calve-muted hover:text-calve-charcoal"
          }`}
        >
          Open Space
        </button>
        <button
          onClick={() => setFilterType("meeting")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            filterType === "meeting"
              ? "bg-white text-calve-charcoal shadow-2xs font-bold"
              : "text-calve-muted hover:text-calve-charcoal"
          }`}
        >
          {isEnglish ? "Meeting Room Sessions" : "Sessions Réunion"}
        </button>
      </div>

      {/* Tenants Table */}
      <div className="rounded-3xl bg-white border border-calve-border/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-calve-border/60 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-calve-slate" />
            <h3 className="font-extrabold text-sm text-calve-charcoal">
              {isEnglish ? "List of Resident Companies & Team Members" : "Liste des Entreprises & Collaborateurs Résidents"}
            </h3>
          </div>
          <span className="text-xs font-semibold text-calve-muted">
            {filtered.length} {isEnglish ? "residents listed" : "résidents répertoriés"}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-calve-muted">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-calve-slate" />
            <span>{isEnglish ? "Loading synchronized resident records..." : "Chargement des résidents synchronisés..."}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-bold text-calve-charcoal">
              {isEnglish ? "No residents matching your filter." : "Aucun résident ne correspond à vos filtres."}
            </p>
            <p className="text-xs text-calve-muted max-w-md mx-auto">
              {isEnglish
                ? "When leads are won in the CRM pipeline, they will instantly appear here."
                : "Lorsque des opportunités sont gagnées dans le pipeline CRM, elles apparaîtront instantanément ici."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-calve-border/60">
            {filtered.map((tenant) => {
              const { title, subtitle, initials } = getResidentIdentity(tenant);
              const formattedLeaseDate = tenant.leaseStart
                ? new Date(tenant.leaseStart).toLocaleDateString(isEnglish ? "en-US" : "fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })
                : (isEnglish ? "Permanent Partner Agreement" : "Convention Partenaire Permanente");

              return (
                <div
                  key={tenant.id}
                  className="p-5 sm:p-6 hover:bg-slate-50/70 transition-all duration-200 space-y-4 group"
                >
                  {/* 1. TOP HEADER: Resident Identity & Anchored Action Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left: Avatar + Company + Contact Person + Badges */}
                    <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2D4B49] via-[#1E3331] to-[#111F1E] text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs border border-white/10">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        {/* Company Title & Status Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-base sm:text-lg text-calve-charcoal tracking-tight truncate">
                            {title}
                          </h4>

                          {/* CRM Won Badge or Foundation Partner */}
                          {tenant.isFromWonLead ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{isEnglish ? "Signed Lead" : "Lead Signé CRM"}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
                              <Building2 className="w-3 h-3 text-amber-700" />
                              <span>{isEnglish ? "Property Partner" : "Partenaire Résident"}</span>
                            </span>
                          )}

                          {/* Status Pill */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              tenant.status === "active"
                                ? "bg-emerald-100/80 text-emerald-900 border border-emerald-200"
                                : "bg-blue-50 text-blue-800 border border-blue-200"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            <span>
                              {tenant.status === "active"
                                ? isEnglish
                                  ? "Active"
                                  : "Actif"
                                : isEnglish
                                ? "Onboarding"
                                : "En installation"}
                            </span>
                          </span>
                        </div>

                        {/* Subtitle / Contact Person & Role (NO duplicate company, NO nested parentheses) */}
                        <div className="flex items-center gap-2 text-xs text-calve-muted mt-1 flex-wrap">
                          {subtitle && (
                            <span className="font-semibold text-slate-700">
                              {subtitle}
                            </span>
                          )}
                          {subtitle && tenant.role && <span className="text-slate-300">•</span>}
                          {tenant.role && (
                            <span className="text-slate-500 font-medium">
                              {tenant.role}
                            </span>
                          )}
                        </div>

                        {/* Contact Methods & CRM Dossier Link */}
                        <div className="flex items-center gap-4 text-xs text-calve-muted mt-2.5 flex-wrap">
                          <a
                            href={`mailto:${tenant.email}`}
                            className="flex items-center gap-1.5 text-calve-slate hover:text-calve-charcoal hover:underline font-medium transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-calve-slate/80" />
                            <span>{tenant.email}</span>
                          </a>
                          {tenant.phone && (
                            <a
                              href={`tel:${tenant.phone}`}
                              className="flex items-center gap-1.5 hover:text-calve-charcoal font-mono transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-calve-slate/80" />
                              <span>{tenant.phone}</span>
                            </a>
                          )}
                          {tenant.leadId && (
                            <Link
                              href={`/admin/pipeline?filter=won`}
                              className="inline-flex items-center gap-1 text-[11px] text-calve-slate hover:text-calve-charcoal font-semibold underline decoration-dotted"
                            >
                              <span>Dossier {tenant.leadId}</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Firmly Anchored Action Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                      <button
                        onClick={() => openEditModal(tenant)}
                        title={isEnglish ? "Edit resident details" : "Modifier les détails"}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95"
                      >
                        <Edit className="w-3.5 h-3.5 text-calve-slate" />
                        <span className="hidden sm:inline">{isEnglish ? "Edit" : "Modifier"}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTenant(tenant.id, tenant.company || tenant.name)}
                        title={isEnglish ? "Remove resident from directory" : "Supprimer de l'annuaire"}
                        className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 2. STRUCTURED 3-COLUMN TELEMETRY GRID (Clean, balanced, zero wrapping artifacts) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Tile 1: Assigned Space */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        <Building2 className="w-3.5 h-3.5 text-calve-slate" />
                        <span>{isEnglish ? "Assigned Space" : "Espace Attribué"}</span>
                      </div>
                      <div className="font-bold text-sm text-calve-charcoal mt-1 truncate" title={tenant.spaceAssigned}>
                        {tenant.spaceAssigned}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {tenant.workstations} {isEnglish ? "workstation" : "poste"}{tenant.workstations > 1 ? "s" : ""}
                      </div>
                    </div>

                    {/* Tile 2: Courtyard Parking */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        <Car className="w-3.5 h-3.5 text-calve-slate" />
                        <span>{isEnglish ? "Courtyard Parking" : "Stationnement Cour"}</span>
                      </div>
                      <div className="font-bold text-sm text-calve-charcoal mt-1 truncate">
                        {tenant.parkingBays || (isEnglish ? "Pedestrian / Bike access" : "Accès piéton & vélo")}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {isEnglish ? "Secured private courtyard" : "Cour privative sécurisée"}
                      </div>
                    </div>

                    {/* Tile 3: Monthly Rent / Rate */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        <CreditCard className="w-3.5 h-3.5 text-calve-slate" />
                        <span>{isEnglish ? "Rate & Billing" : "Tarif & Facturation"}</span>
                      </div>
                      <div className="font-extrabold text-sm text-calve-slate mt-1 truncate">
                        {tenant.monthlyRent}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {isEnglish ? "Direct resident contract" : "Bail & convention active"}
                      </div>
                    </div>
                  </div>

                  {/* 3. FOOTER ROW: Security Badges & Lease Timeline */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-calve-muted">
                    {/* RFID Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-600 text-[11px]">
                        {isEnglish ? "24/7 RFID Badges:" : "Badges RFID 24/7 :"}
                      </span>
                      {tenant.badgeIds && tenant.badgeIds.length > 0 ? (
                        tenant.badgeIds.map((b) => (
                          <span
                            key={b}
                            className="font-mono text-[10px] font-bold tracking-wider bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 shadow-2xs"
                          >
                            {b}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          {isEnglish ? "Pending issuance" : "En cours d'attribution"}
                        </span>
                      )}
                    </div>

                    {/* Lease Start Date */}
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {isEnglish ? "Lease commenced: " : "Début du contrat : "}
                        <strong className="text-slate-700 font-semibold">{formattedLeaseDate}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: EDIT TENANT / RESIDENT                           */}
      {/* ========================================================= */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-calve-charcoal">
                  {isEnglish ? "Edit Resident Details" : "Modifier le Résident"}
                </h3>
                <p className="text-xs text-calve-muted mt-0.5">{editingTenant.id}</p>
              </div>
              <button
                onClick={() => setEditingTenant(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Company / Organization" : "Entreprise / Société"}
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Contact Name" : "Nom du Contact"}
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Email Address" : "Email"}
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Phone Number" : "Téléphone"}
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  {isEnglish ? "Assigned Space" : "Espace Assigné"}
                </label>
                <input
                  type="text"
                  value={editForm.spaceAssigned}
                  onChange={(e) => setEditForm({ ...editForm, spaceAssigned: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Monthly Rent" : "Loyer Mensuel"}
                  </label>
                  <input
                    type="text"
                    value={editForm.monthlyRent}
                    onChange={(e) => setEditForm({ ...editForm, monthlyRent: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Status" : "Statut"}
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as "active" | "onboarding" | "notice"
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                  >
                    <option value="active">{isEnglish ? "Active" : "Actif"}</option>
                    <option value="onboarding">{isEnglish ? "Onboarding" : "En installation"}</option>
                    <option value="notice">{isEnglish ? "Notice Period" : "Préavis de sortie"}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {isEnglish ? "Cancel" : "Annuler"}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isEnglish ? "Save Changes" : "Enregistrer les modifications"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CREATE NEW RESIDENT / TENANT                     */}
      {/* ========================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-calve-charcoal">
                {isEnglish ? "Add New Resident / Tenant" : "Ajouter un Nouveau Résident"}
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Company / Organization *" : "Entreprise / Société *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isEnglish ? "e.g. Bordeaux Tech SAS" : "Ex: Aquitaine Tech SAS"}
                    value={createForm.company}
                    onChange={(e) => setCreateForm({ ...createForm, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Contact Name *" : "Nom du Contact *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isEnglish ? "e.g. Jean Dupont" : "Ex: Jean Dupont"}
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Email Address *" : "Email *"}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@company.fr"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Phone Number" : "Téléphone"}
                  </label>
                  <input
                    type="text"
                    placeholder="+33 6 12 34 56 78"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  {isEnglish ? "Assigned Space" : "Espace Assigné"}
                </label>
                <input
                  type="text"
                  placeholder={isEnglish ? "e.g. Private Office Resident (East Wing)" : "Ex: Bureau Privatif Résident (Aile Est)"}
                  value={createForm.spaceAssigned}
                  onChange={(e) => setCreateForm({ ...createForm, spaceAssigned: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Monthly Rent" : "Loyer Mensuel"}
                  </label>
                  <input
                    type="text"
                    placeholder="850 € HT"
                    value={createForm.monthlyRent}
                    onChange={(e) => setCreateForm({ ...createForm, monthlyRent: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Parking Spaces" : "Places de Parking"}
                  </label>
                  <input
                    type="text"
                    placeholder={isEnglish ? "e.g. Bays #1 & #2" : "Ex: Places #1 & #2"}
                    value={createForm.parkingBays}
                    onChange={(e) => setCreateForm({ ...createForm, parkingBays: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {isEnglish ? "Cancel" : "Annuler"}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEnglish ? "Create Resident" : "Ajouter dans la Base de Données"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
