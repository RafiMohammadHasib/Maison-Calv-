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
      {/* Top Banner & Quick Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-calve-charcoal to-[#1a2332] text-white shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-calve-gold/20 border border-calve-gold/40 flex items-center justify-center shrink-0">
            <BadgeCheck className="w-5 h-5 text-calve-gold" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-2">
              <span>{isEnglish ? "Automated Resident Onboarding" : "Intégration Automatisée des Résidents"}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {isEnglish ? "Live Sync Active" : "Synchro Active"}
              </span>
            </div>
            <p className="text-xs text-white/70">
              {isEnglish
                ? "Every opportunity marked as 'Won / Signed' in the CRM automatically appears here with assigned space, badges and rent."
                : "Chaque lead marqué 'Gagné / Signé' dans le CRM apparaît automatiquement ici avec espace assigné, badges et loyer."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isEnglish ? "+ New Resident" : "+ Nouveau Résident"}</span>
          </button>
          <button
            onClick={fetchTenants}
            disabled={refreshing}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{isEnglish ? "Refresh" : "Actualiser"}</span>
          </button>
          <Link
            href="/admin/spaces"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <span>{isEnglish ? "View Spaces" : "Voir Espaces"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
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
            {filtered.map((tenant) => (
              <div key={tenant.id} className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Avatar & Identity */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-calve-slate text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {tenant.company ? tenant.company.slice(0, 2).toUpperCase() : tenant.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-base text-calve-charcoal">
                          {tenant.company || tenant.name}
                        </h4>
                        <span className="text-xs text-calve-muted">({tenant.name})</span>

                        {/* CRM Won Badge or Foundation Partner */}
                        {tenant.isFromWonLead ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {isEnglish ? "Won CRM Lead" : "Lead Signé CRM"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200">
                            <Building2 className="w-3 h-3 text-amber-700" />
                            {isEnglish ? "Property Partner" : "Partenaire Résident"}
                          </span>
                        )}

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tenant.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {tenant.status === "active"
                            ? isEnglish
                              ? "Active"
                              : "Actif"
                            : isEnglish
                            ? "Onboarding"
                            : "En installation"}
                        </span>
                      </div>

                      <p className="text-xs text-calve-muted mt-0.5">{tenant.role}</p>

                      <div className="flex items-center gap-4 text-xs text-calve-muted mt-2 flex-wrap">
                        <a
                          href={`mailto:${tenant.email}`}
                          className="flex items-center gap-1 text-calve-slate hover:text-calve-slate-dark hover:underline font-medium"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{tenant.email}</span>
                        </a>
                        <a
                          href={`tel:${tenant.phone}`}
                          className="flex items-center gap-1 hover:text-calve-slate font-mono"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{tenant.phone}</span>
                        </a>
                        {tenant.leadId && (
                          <Link
                            href={`/admin/pipeline?filter=won`}
                            className="inline-flex items-center gap-1 text-[11px] text-calve-muted hover:text-calve-charcoal font-semibold underline decoration-dotted"
                          >
                            <span>Dossier {tenant.leadId}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Details: Space, Parking, Rent & Actions */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-[200px]">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        {isEnglish ? "Assigned space" : "Espace occupé"}
                      </div>
                      <div className="font-extrabold text-calve-charcoal mt-0.5 truncate">
                        {tenant.spaceAssigned}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        {isEnglish ? "Parking" : "Stationnement"}
                      </div>
                      <div className="font-extrabold text-calve-slate mt-0.5 flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-calve-slate" />
                        <span>{tenant.parkingBays}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-calve-stone/40 border border-calve-border">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        {isEnglish ? "Monthly Rent" : "Loyer Mensuel"}
                      </div>
                      <div className="font-extrabold text-calve-slate mt-0.5">
                        {tenant.monthlyRent}
                      </div>
                    </div>

                    {/* Action buttons (Edit & Delete) */}
                    <div className="flex items-center gap-1.5 pl-2">
                      <button
                        onClick={() => openEditModal(tenant)}
                        title={isEnglish ? "Edit resident" : "Modifier résident"}
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTenant(tenant.id, tenant.company || tenant.name)}
                        title={isEnglish ? "Delete resident from DB" : "Supprimer de la base"}
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Badges and lease dates */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-calve-muted">
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-calve-slate" />
                    <span className="font-medium">{isEnglish ? "24/7 RFID Badges:" : "Badges RFID 24/7 :"}</span>
                    {tenant.badgeIds.map((b) => (
                      <span
                        key={b}
                        className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-700"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-calve-muted" />
                    <span>
                      {isEnglish ? "Lease started on: " : "Bail débuté le : "}
                      {tenant.leaseStart ? new Date(tenant.leaseStart).toLocaleDateString(isEnglish ? "en-US" : "fr-FR") : "Convention"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
                    Entreprise / Société
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
                    Nom du Contact
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
                    Email
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
                    Téléphone
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
                  Espace Assigné
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
                    Loyer Mensuel
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
                    Statut
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
                    <option value="active">Actif (Active)</option>
                    <option value="onboarding">En installation (Onboarding)</option>
                    <option value="notice">Préavis de sortie (Notice)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer dans OVH MySQL</span>
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
                    Entreprise / Société *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Aquitaine Tech SAS"
                    value={createForm.company}
                    onChange={(e) => setCreateForm({ ...createForm, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Nom du Contact *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jean Dupont"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jean@aquitaine-tech.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    placeholder="06 12 34 56 78"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Espace Assigné
                </label>
                <input
                  type="text"
                  value={createForm.spaceAssigned}
                  onChange={(e) => setCreateForm({ ...createForm, spaceAssigned: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Loyer Mensuel
                  </label>
                  <input
                    type="text"
                    value={createForm.monthlyRent}
                    onChange={(e) => setCreateForm({ ...createForm, monthlyRent: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Places de Parking
                  </label>
                  <input
                    type="text"
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
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter dans la Base de Données</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
