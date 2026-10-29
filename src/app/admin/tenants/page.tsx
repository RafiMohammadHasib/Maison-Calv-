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
  CheckCircle2
} from "lucide-react";

export default function TenantsPage() {
  const { language, t, isEnglish } = useLanguage();
  const [search, setSearch] = useState("");
  const [tenants, setTenants] = useState<TenantRecord[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "private" | "open" | "meeting">("all");

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
                : "Chaque opportunité passée en 'Gagné / Signé' dans le CRM est immédiatement enregistrée ici avec espace, badges et loyer."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={fetchTenants}
            disabled={refreshing}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{isEnglish ? "Refresh" : "Actualiser"}</span>
          </button>
          <Link
            href="/admin/pipeline"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-calve-gold hover:bg-[#b89155] text-calve-charcoal text-xs font-bold transition-all shadow-xs"
          >
            <span>{isEnglish ? "CRM Pipeline" : "Pipeline CRM"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/spaces"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition-all shadow-xs"
          >
            <span>{isEnglish ? "View Spaces" : "Voir Espaces"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Resident Companies" : "Entreprises Résidentes"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {loading ? "..." : `${tenants.length} ${isEnglish ? "companies" : "sociétés"}`}
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{isEnglish ? "100% active contracts & bails" : "100% baux & conventions actifs"}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Assigned Desks" : "Postes Attribués"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {loading ? "..." : `${metrics?.occupiedDesksCount || 12} ${isEnglish ? "desks" : "postes"}`}
          </div>
          <p className="text-[11px] text-calve-muted">
            {isEnglish ? "Private offices + open space" : "Bureaux privatifs + open space"}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Courtyard Parking Bays" : "Stationnement Cour Privée"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {loading ? "..." : `${metrics?.assignedCourtyardBays || 4} / 9 ${isEnglish ? "bays" : "places"}`}
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold">
            {loading ? "..." : `${9 - (metrics?.assignedCourtyardBays || 4)} ${isEnglish ? "visitor bays available" : "places visiteurs disponibles"}`}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Active 24/7 RFID Badges" : "Badges Actifs 24/7"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {loading ? "..." : `${tenants.reduce((acc, t) => acc + (t.badgeIds?.length || 1), 0)} ${isEnglish ? "badges" : "badges RFID"}`}
          </div>
          <p className="text-[11px] text-calve-muted">
            {isEnglish ? "Main gate & portal access" : "Portail motorisé & porte d'honneur"}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterType("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            filterType === "all"
              ? "bg-calve-charcoal text-white shadow-xs"
              : "bg-white text-calve-muted hover:text-calve-charcoal border border-calve-border/80"
          }`}
        >
          {isEnglish ? "All Residents" : "Tous les résidents"} ({tenants.length})
        </button>
        <button
          onClick={() => setFilterType("private")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            filterType === "private"
              ? "bg-calve-charcoal text-white shadow-xs"
              : "bg-white text-calve-muted hover:text-calve-charcoal border border-calve-border/80"
          }`}
        >
          {isEnglish ? "Private Offices" : "Bureaux Privatifs"}
        </button>
        <button
          onClick={() => setFilterType("open")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            filterType === "open"
              ? "bg-calve-charcoal text-white shadow-xs"
              : "bg-white text-calve-muted hover:text-calve-charcoal border border-calve-border/80"
          }`}
        >
          {isEnglish ? "Open Space" : "Open Space Résidents"}
        </button>
        <button
          onClick={() => setFilterType("meeting")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            filterType === "meeting"
              ? "bg-calve-charcoal text-white shadow-xs"
              : "bg-white text-calve-muted hover:text-calve-charcoal border border-calve-border/80"
          }`}
        >
          {isEnglish ? "Meeting Room Sessions" : "Sessions Salle de Réunion"}
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
                            {isEnglish ? "Property Partner" : "Partenaire Résident Permanent"}
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

                  {/* Right Details: Space, Parking, Rent */}
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
                      {new Date(tenant.leaseStart).toLocaleDateString(isEnglish ? "en-US" : "fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
