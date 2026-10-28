"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { Lead, LeadStatus, LeadPriority } from "@/lib/leads";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Mail,
  Phone,
  Building2,
  Users,
  Coffee,
  Car,
  Shield,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Search,
  RefreshCw,
  MoreVertical,
  Send,
  Plus,
  X,
  Trash2,
  ExternalLink,
  MessageSquare,
  Key,
  FileText,
  CheckSquare,
  Square
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/languageContext";

export default function ToursPage() {
  const router = useRouter();
  const { language, t } = useLanguage();

  useEffect(() => {
    router.replace("/admin/pipeline?filter=tours");
  }, [router]);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Quick note state per tour lead
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [noteAuthor, setNoteAuthor] = useState("Paul (Directeur)");

  // Interactive local checklist state per lead id
  const [checklistState, setChecklistState] = useState<Record<string, { coffee: boolean; parking: boolean; files: boolean; keys: boolean }>>({
    "MC-2026-098": { coffee: true, parking: true, files: true, keys: false },
    "MC-2026-095": { coffee: true, parking: true, files: true, keys: true },
    "MC-2026-089": { coffee: true, parking: true, files: false, keys: false }
  });

  const fetchTours = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.success && data.leads) {
        // Filter strictly to visit & tour enquiries
        const tourLeads = data.leads.filter(
          (l: Lead) =>
            l.visitRequested ||
            l.source.toLowerCase().includes("tour") ||
            l.source.toLowerCase().includes("visit")
        );
        setLeads(tourLeads);
      }
    } catch (err) {
      console.error("Error fetching tours:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, status: newStatus, updatedAt: new Date().toISOString() }
          : l
      )
    );

    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus })
      });
    } catch (err) {
      console.error("Error updating tour status:", err);
      fetchTours();
    }
  };

  const handleAddNote = async (leadId: string) => {
    const text = noteInputs[leadId]?.trim();
    if (!text) return;

    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leadId,
          newNote: {
            author: noteAuthor,
            text
          }
        })
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? data.lead : l)));
        setNoteInputs((prev) => ({ ...prev, [leadId]: "" }));
      }
    } catch (err) {
      console.error("Failed to add note to tour:", err);
    }
  };

  const handleDeleteTour = async (leadId: string) => {
    if (!confirm("Confirmer la suppression de cette fiche de visite ?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    try {
      await fetch(`/api/admin/leads?id=${leadId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting tour:", err);
      fetchTours();
    }
  };

  const toggleChecklistItem = (leadId: string, key: "coffee" | "parking" | "files" | "keys") => {
    setChecklistState((prev) => {
      const current = prev[leadId] || { coffee: false, parking: false, files: false, keys: false };
      return {
        ...prev,
        [leadId]: {
          ...current,
          [key]: !current[key]
        }
      };
    });
  };

  const filteredTours = useMemo(() => {
    return leads.filter((l) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        (l.officeSize && l.officeSize.toLowerCase().includes(q)) ||
        l.id.toLowerCase().includes(q);

      if (!matchSearch) return false;
      if (statusFilter !== "all") {
        if (statusFilter === "new" && l.status !== "new") return false;
        if (statusFilter === "tour_scheduled" && l.status !== "tour_scheduled") return false;
        if (statusFilter === "visited" && l.status !== "visited") return false;
        if (statusFilter === "won" && l.status !== "won") return false;
      }
      return true;
    });
  }, [leads, search, statusFilter]);

  // Pricing helper
  const getTourPrice = (tour: Lead) => {
    if (tour.type === "private-office") {
      if (tour.officeSize?.includes("25")) return "1 000 € HT / mois";
      return "750 € HT / mois";
    }
    if (tour.type === "open-space") {
      const count = tour.workstationCount || 1;
      return `${count * 250} € HT / mois`;
    }
    if (tour.type === "meeting-room") {
      return tour.timeSlot === "full-day" ? "200 € HT (Journée)" : "120 € HT (Demi-journée)";
    }
    return "750 € HT / mois";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ========================================================== */}
        {/* 1. TOP HEADER STRIP (MATCHING REFERENCE CRM DESIGN)        */}
        {/* ========================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            {/* Top Breadcrumb */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-calve-muted">
                {t("tours.breadcrumb")}
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-calve-charcoal">
              {t("tours.title")}
            </h1>
            <p className="text-xs text-calve-muted mt-0.5">
              {t("tours.subtitle")}
            </p>
          </div>

          {/* Right Header Controls: Search, Refresh, Filter Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-calve-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("tours.search")}
                className="w-full sm:w-64 pl-8 pr-3 py-1.5 rounded-xl bg-white border border-calve-border text-xs text-calve-charcoal placeholder:text-calve-muted focus:border-calve-slate shadow-2xs"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchTours}
              disabled={refreshing}
              title={t("tooltip.refresh")}
              className="p-2 rounded-xl bg-white border border-calve-border hover:border-calve-slate text-calve-slate transition-colors cursor-pointer shadow-2xs shrink-0 flex items-center justify-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            {/* Filter Pills Segmented */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-semibold shrink-0">
              {[
                { id: "all", label: t("tours.filter.all") },
                { id: "new", label: t("tours.filter.new") },
                { id: "tour_scheduled", label: t("tours.filter.scheduled") },
                { id: "visited", label: t("tours.filter.visited") },
                { id: "won", label: t("tours.filter.won") }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setStatusFilter(pill.id)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === pill.id
                      ? "bg-calve-slate text-white shadow-2xs font-bold"
                      : "text-calve-muted hover:text-calve-charcoal"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* 2. TOP PROTOCOL METRICS CARDS                              */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <Calendar className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-[10px] text-calve-muted uppercase font-bold tracking-wider">
                {t("tours.metric.total")}
              </div>
              <div className="text-xl font-extrabold text-calve-charcoal">
                {leads.length} {language === "fr" ? "demandes" : "enquiries"}
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                {t("tours.metric.total_sub")}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="text-[10px] text-calve-muted uppercase font-bold tracking-wider">
                {t("tours.metric.pending")}
              </div>
              <div className="text-xl font-extrabold text-calve-charcoal">
                {leads.filter((l) => l.status === "new").length} {language === "fr" ? "nouvelles" : "new"}
              </div>
              <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
                {t("tours.metric.pending_sub")}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold shrink-0">
              <Coffee className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="text-[10px] text-calve-muted uppercase font-bold tracking-wider">
                {t("tours.metric.welcome")}
              </div>
              <div className="text-sm font-extrabold text-calve-charcoal">
                {t("tours.metric.welcome_val")}
              </div>
              <div className="text-[11px] text-calve-muted font-medium mt-0.5">
                {t("tours.metric.welcome_sub")}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold shrink-0">
              <Car className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <div className="text-[10px] text-calve-muted uppercase font-bold tracking-wider">
                {t("tours.metric.parking")}
              </div>
              <div className="text-sm font-extrabold text-calve-charcoal">
                {t("tours.metric.parking_val")}
              </div>
              <div className="text-[11px] text-calve-muted font-medium mt-0.5">
                {t("tours.metric.parking_sub")}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* 3. VISITS & TOURS LIST (LUXURY COMMERCIAL REAL ESTATE)     */}
        {/* ========================================================== */}
        <div className="space-y-4">
          {filteredTours.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-white border border-slate-200 text-calve-muted">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-sm text-calve-charcoal">
                Aucune visite ne correspond aux critères de recherche.
              </p>
              <p className="text-xs text-calve-muted mt-1">
                Modifiez vos filtres ou réinitialisez la barre de recherche.
              </p>
            </div>
          ) : (
            filteredTours.map((tour) => {
              const checklist = checklistState[tour.id] || {
                coffee: false,
                parking: false,
                files: false,
                keys: false
              };
              const price = getTourPrice(tour);
              const isHeroTour = tour.source.toLowerCase().includes("hero");

              return (
                <div
                  key={tour.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all p-5 sm:p-6 space-y-4"
                >
                  {/* Card Top Row: Visitor Info & Status */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-3.5">
                      {/* Avatar with Initials */}
                      <div className="w-12 h-12 rounded-2xl bg-calve-slate text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                        {tour.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-calve-charcoal">
                            {tour.name}
                          </h3>
                          {tour.company && (
                            <span className="text-xs font-semibold text-calve-muted">
                              · {tour.company}
                            </span>
                          )}

                          {/* Source Capsule */}
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                              isHeroTour
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                                : "bg-sky-50 text-sky-800 border-sky-200/80"
                            }`}
                          >
                            {isHeroTour ? "BOOK A PRIVATE TOUR" : "BOOK A VISIT"}
                          </span>

                          {tour.priority === "urgent" && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                              Priorité Haute
                            </span>
                          )}
                        </div>

                        {/* Location Subtext */}
                        <div className="text-xs text-calve-muted flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-calve-slate" />
                          <span>48 rue Calvé, 33000 Bordeaux · Quartier Fondaudège</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Changer & Delete Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={tour.status}
                        onChange={(e) =>
                          handleStatusChange(tour.id, e.target.value as LeadStatus)
                        }
                        className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-white text-calve-charcoal cursor-pointer shadow-2xs focus:border-calve-slate"
                      >
                        <option value="new">{t("status.new")}</option>
                        <option value="tour_scheduled">{t("status.tour_scheduled")}</option>
                        <option value="visited">{t("status.visited")}</option>
                        <option value="negotiating">{t("status.negotiating")}</option>
                        <option value="won">{t("status.won")}</option>
                        <option value="closed">{t("status.closed")}</option>
                      </select>

                      <button
                        onClick={() => handleDeleteTour(tour.id)}
                        title={language === "fr" ? "Supprimer la visite" : "Delete Tour"}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Middle: 3 Structured Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* Box 1: Date & Créneau Souhaité */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {t("tours.box.date")}
                      </div>
                      <div className="font-extrabold text-xs sm:text-sm text-calve-charcoal flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-calve-slate shrink-0" />
                        <span>{tour.date || (language === "fr" ? "Dès que possible" : "As soon as possible")}</span>
                      </div>
                      <div className="text-[11px] text-calve-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {tour.timeSlot === "morning"
                            ? language === "fr" ? "Matinée (09h00 - 12h00)" : "Morning (09:00 - 12:00)"
                            : tour.timeSlot === "afternoon"
                            ? language === "fr" ? "Après-midi (14h00 - 18h00)" : "Afternoon (14:00 - 18:00)"
                            : language === "fr" ? "Journée entière" : "Full day"}
                        </span>
                      </div>
                    </div>

                    {/* Box 2: Espace Demandé & Budget */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {t("tours.box.space")}
                      </div>
                      <div className="font-extrabold text-xs sm:text-sm text-calve-slate flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-calve-slate shrink-0" />
                        <span>
                          {tour.type === "private-office"
                            ? tour.officeSize || (language === "fr" ? "Bureau Privatif 17m² / 25m²" : "Private Office 17sqm / 25sqm")
                            : tour.type === "open-space"
                            ? `Open Space (${tour.openSpacePlan === "fixe" ? (language === "fr" ? "Poste Fixe" : "Dedicated Desk") : "Flex"})`
                            : (language === "fr" ? "Salle de Réunion 30m²" : "Meeting Room 30sqm")}
                        </span>
                      </div>
                      <div className="text-[11px] font-black text-calve-charcoal">
                        {price}
                      </div>
                    </div>

                    {/* Box 3: Coordonnées & Contact Direct */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {t("tours.box.contact")}
                      </div>
                      <div className="space-y-1 text-xs">
                        <a
                          href={`tel:${tour.phone}`}
                          className="flex items-center gap-1.5 text-calve-charcoal hover:text-calve-slate font-mono font-bold"
                        >
                          <Phone className="w-3 h-3 text-calve-slate" />
                          <span>{tour.phone}</span>
                        </a>
                        <a
                          href={`mailto:${tour.email}`}
                          className="flex items-center gap-1.5 text-calve-muted hover:text-calve-slate truncate block"
                        >
                          <Mail className="w-3 h-3 text-calve-slate shrink-0" />
                          <span className="truncate">{tour.email}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Visitor Message Quote (if present) */}
                  {tour.message && (
                    <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200/90 text-xs text-calve-charcoal flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-calve-slate shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-calve-slate block text-[11px] uppercase tracking-wider mb-0.5">
                          {t("tours.quote_title")}
                        </span>
                        <p className="italic text-slate-700">&quot;{tour.message}&quot;</p>
                      </div>
                    </div>
                  )}

                  {/* Interactive Reception Checklist Protocol */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-calve-muted flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{t("tours.protocol_title")}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {language === "fr" ? "Hôte : Paul (Directeur)" : "Host: Paul (Director)"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => toggleChecklistItem(tour.id, "coffee")}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                          checklist.coffee
                            ? "bg-emerald-50/70 border-emerald-300 text-emerald-900 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {checklist.coffee ? (
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="text-[11px] truncate">{t("tours.check.coffee")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleChecklistItem(tour.id, "parking")}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                          checklist.parking
                            ? "bg-emerald-50/70 border-emerald-300 text-emerald-900 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {checklist.parking ? (
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="text-[11px] truncate">{t("tours.check.parking")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleChecklistItem(tour.id, "files")}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                          checklist.files
                            ? "bg-emerald-50/70 border-emerald-300 text-emerald-900 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {checklist.files ? (
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="text-[11px] truncate">{t("tours.check.files")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleChecklistItem(tour.id, "keys")}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                          checklist.keys
                            ? "bg-emerald-50/70 border-emerald-300 text-emerald-900 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {checklist.keys ? (
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="text-[11px] truncate">{t("tours.check.keys")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes History & Inline Add Note */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {tour.notes && tour.notes.length > 0 && (
                      <div className="space-y-1.5">
                        {tour.notes.map((note) => (
                          <div
                            key={note.id}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-start justify-between gap-2"
                          >
                            <div>
                              <span className="font-bold text-calve-charcoal mr-2">
                                {note.author} :
                              </span>
                              <span className="text-slate-700">{note.text}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {new Date(note.createdAt).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Add Note Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={noteInputs[tour.id] || ""}
                        onChange={(e) =>
                          setNoteInputs((prev) => ({ ...prev, [tour.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddNote(tour.id);
                          }
                        }}
                        placeholder={t("tours.note_placeholder")}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-calve-charcoal placeholder:text-calve-muted focus:bg-white focus:border-calve-slate"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddNote(tour.id)}
                        className="px-3 py-1.5 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>{t("tours.btn_add")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Footer Strip */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-calve-muted">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span>
                        ID: <strong className="font-mono text-slate-600">{tour.id}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        {language === "fr" ? "Enregistré le" : "Registered on"}{" "}
                        {new Date(tour.createdAt).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${tour.phone}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{t("tours.btn_call")}</span>
                      </a>
                      <a
                        href={`mailto:${tour.email}?subject=Visite%20Maison%20Calv%C3%A9%20Bordeaux`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Mail className="w-3 h-3" />
                        <span>{t("tours.btn_email")}</span>
                      </a>
                      <Link
                        href={`/admin/pipeline?search=${encodeURIComponent(tour.name)}`}
                        className="px-2.5 py-1 rounded-lg bg-calve-slate/10 hover:bg-calve-slate/20 text-calve-slate text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>{t("tours.btn_pipeline")}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
