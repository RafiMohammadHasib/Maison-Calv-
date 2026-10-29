"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { Lead, LeadStatus, LeadPriority } from "@/lib/leads";
import { useLanguage } from "@/lib/languageContext";
import {
  Kanban,
  Search,
  Calendar,
  Building2,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  Trash2,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  MapPin,
  X,
  Plus,
  Send,
  Home,
  GripVertical,
  ArrowRight,
  User,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  FileText,
  Check
} from "lucide-react";

interface StageConfig {
  key: LeadStatus;
  label: string;
  dotColor: string;
  badgeBg: string;
  borderColor: string;
}

function KanbanColumnScrollArea({
  children,
  isColumnOver = false
}: {
  children: React.ReactNode;
  isColumnOver?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef<number>(0);
  const [canScrollTop, setCanScrollTop] = useState(false);
  const [canScrollBottom, setCanScrollBottom] = useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollTop(el.scrollTop > 6);
    setCanScrollBottom(el.scrollTop + el.clientHeight < el.scrollHeight - 6);
  };

  const startAutoScroll = () => {
    if (animFrameRef.current !== null) return;
    const step = () => {
      const el = containerRef.current;
      if (el && scrollSpeedRef.current !== 0) {
        el.scrollTop += scrollSpeedRef.current;
        checkScroll();
      }
      if (scrollSpeedRef.current !== 0) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
  };

  const stopAutoScroll = () => {
    scrollSpeedRef.current = 0;
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el || el.scrollHeight <= el.clientHeight) {
      stopAutoScroll();
      return;
    }

    const rect = el.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    // Edge zones: top 22% and bottom 22% (up to 95px)
    const edgeZone = Math.min(height * 0.22, 95);

    if (y < edgeZone && el.scrollTop > 0) {
      const intensity = 1 - Math.max(0, y) / edgeZone;
      scrollSpeedRef.current = -Math.max(2, Math.round(intensity * 12));
      startAutoScroll();
    } else if (y > height - edgeZone && el.scrollTop + el.clientHeight < el.scrollHeight - 1) {
      const intensity = 1 - Math.max(0, height - y) / edgeZone;
      scrollSpeedRef.current = Math.max(2, Math.round(intensity * 12));
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el || el.scrollHeight <= el.clientHeight) return;

    const rect = el.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    const edgeZone = Math.min(height * 0.25, 110);

    if (y < edgeZone && el.scrollTop > 0) {
      const intensity = 1 - Math.max(0, y) / edgeZone;
      scrollSpeedRef.current = -Math.max(3, Math.round(intensity * 14));
      startAutoScroll();
    } else if (y > height - edgeZone && el.scrollTop + el.clientHeight < el.scrollHeight - 1) {
      const intensity = 1 - Math.max(0, height - y) / edgeZone;
      scrollSpeedRef.current = Math.max(3, Math.round(intensity * 14));
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  };

  useEffect(() => {
    checkScroll();
    return () => stopAutoScroll();
  }, [children]);

  return (
    <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden group/scroller">
      {/* Top subtle fade indicator when scrollable above */}
      {canScrollTop && (
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#F8F9FA] via-[#F8F9FA]/80 to-transparent pointer-events-none z-10 opacity-90 transition-opacity" />
      )}

      {/* Cards container: completely hides ugly default scrollbar while enabling auto-hover-scroll & smooth wheel */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={stopAutoScroll}
        onDragOver={handleDragOver}
        onDragLeave={stopAutoScroll}
        onScroll={checkScroll}
        className="space-y-2.5 flex-1 overflow-y-auto pr-0.5 pt-1 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {/* Bottom subtle fade indicator when scrollable below */}
      {canScrollBottom && (
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/80 to-transparent pointer-events-none z-10 opacity-90 transition-opacity" />
      )}
    </div>
  );
}

export default function PipelinePage() {
  const { language, t } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | "offices" | "open-space" | "meeting" | "tours" | "won">("all");
  const [refreshing, setRefreshing] = useState(false);

  // Drag and Drop States
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStatus | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string } | null>(null);

  // Selected lead modal for detailed view & note adding
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("Paul (Directeur)");

  // Quick manual lead creation modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "private-office" as "private-office" | "open-space" | "meeting-room",
    officeSize: "21 m² (3-4 postes)",
    date: "",
    timeSlot: "morning",
    priority: "high" as LeadPriority,
    message: "",
    initialNote: ""
  });

  // Read URL params (e.g. ?filter=tours) on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const f = params.get("filter");
      if (f === "tours") setFilterCategory("tours");
      else if (f === "offices") setFilterCategory("offices");
      else if (f === "open-space") setFilterCategory("open-space");
      else if (f === "meeting") setFilterCategory("meeting");
      else if (f === "won") setFilterCategory("won");
    }
  }, []);

  const fetchLeads = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.success && data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Error loading pipeline leads:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Update lead status (called by Drag & Drop or modal buttons)
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const lead = leads.find((l) => l.id === leadId);
    const prevStatus = lead?.status;

    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus, updatedAt: new Date().toISOString() } : l))
    );

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update lead status");
      }

      if (newStatus === "won") {
        const companyOrName = lead?.company || lead?.name || "Client";
        setToastMessage({
          title: `🎉 Lead Gagné ! (${companyOrName})`,
          subtitle: "Enregistré comme Résident et l'espace est maintenant marqué comme Réservé."
        });
        setTimeout(() => setToastMessage(null), 7000);
      } else {
        setToastMessage({
          title: "Étape du pipeline mise à jour",
          subtitle: `Le dossier a été transféré vers "${newStatus}".`
        });
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      // Revert if error
      if (prevStatus) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: prevStatus } : l))
        );
      }
      fetchLeads();
    }
  };

  // Add internal note to lead
  const handleAddNote = async (leadId: string, customText?: string) => {
    const textToAdd = (customText || newNoteText).trim();
    if (!textToAdd) return;

    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leadId,
          newNote: {
            author: noteAuthor,
            text: textToAdd
          }
        })
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? data.lead : l)));
        setSelectedLead(data.lead);
        setNewNoteText("");
        showToast(
          language === "fr" ? "Note ajoutée" : "Note added",
          language === "fr" ? `Par ${noteAuthor}` : `By ${noteAuthor}`
        );
      }
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: string) => {
    const confirmMsg = language === "fr"
      ? "Confirmer la suppression définitive de cette opportunité ?"
      : "Confirm permanent deletion of this opportunity?";
    if (!confirm(confirmMsg)) return;

    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (selectedLead?.id === leadId) setSelectedLead(null);
    try {
      await fetch(`/api/admin/leads?id=${leadId}`, { method: "DELETE" });
      showToast(
        language === "fr" ? "Opportunité supprimée" : "Opportunity deleted",
        leadId
      );
    } catch (err) {
      console.error("Error deleting lead:", err);
      fetchLeads();
    }
  };

  // Manual lead creation
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          source: "Direct CRM Entry (Admin)",
          status: "new"
        })
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setIsCreateModalOpen(false);
        setLeads((prev) => [data.lead, ...prev]);
        setCreateForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          type: "private-office",
          officeSize: "21 m² (3-4 postes)",
          date: "",
          timeSlot: "morning",
          priority: "high",
          message: "",
          initialNote: ""
        });
        showToast(
          language === "fr" ? "Nouveau prospect créé" : "New lead created",
          `${data.lead.name} (${t("pipeline.stage.new")})`
        );
      }
    } catch (err) {
      console.error("Error creating lead:", err);
    }
  };

  const showToast = (title: string, subtitle?: string) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedLeadId(leadId);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageKey: LeadStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stageKey) {
      setDragOverStage(stageKey);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stageKey: LeadStatus) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverStage === stageKey) {
      setDragOverStage(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStage: LeadStatus) => {
    e.preventDefault();
    setDragOverStage(null);
    const leadId = e.dataTransfer.getData("text/plain") || draggedLeadId;
    if (!leadId) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const currentStage = normalizeStatus(lead.status);
    if (currentStage === targetStage) {
      setDraggedLeadId(null);
      return;
    }

    const targetStageLabel = stages.find((s) => s.key === targetStage)?.label || targetStage;
    showToast(
      `${lead.name}`,
      language === "fr" ? `Déplacé vers "${targetStageLabel}"` : `Moved to "${targetStageLabel}"`
    );

    setDraggedLeadId(null);
    await handleStatusChange(leadId, targetStage);
  };

  // 6 Pipeline Stages matching Goizet Gestion OS reference image
  const stages: StageConfig[] = [
    { key: "new", label: t("pipeline.stage.new"), dotColor: "bg-amber-400", badgeBg: "bg-amber-50 text-amber-900 border-amber-200", borderColor: "border-amber-300" },
    { key: "contacted", label: t("pipeline.stage.contacted"), dotColor: "bg-amber-500", badgeBg: "bg-amber-50 text-amber-900 border-amber-200", borderColor: "border-amber-400" },
    { key: "qualified", label: t("pipeline.stage.qualified"), dotColor: "bg-blue-500", badgeBg: "bg-blue-50 text-blue-900 border-blue-200", borderColor: "border-blue-400" },
    { key: "tour_scheduled", label: t("pipeline.stage.viewing"), dotColor: "bg-purple-500", badgeBg: "bg-purple-50 text-purple-900 border-purple-200", borderColor: "border-purple-400" },
    { key: "won", label: t("pipeline.stage.won"), dotColor: "bg-emerald-500", badgeBg: "bg-emerald-50 text-emerald-900 border-emerald-200", borderColor: "border-emerald-400" },
    { key: "closed", label: t("pipeline.stage.closed"), dotColor: "bg-slate-400", badgeBg: "bg-slate-100 text-slate-700 border-slate-200", borderColor: "border-slate-300" }
  ];

  // Helper to map legacy/alternative status values into one of the 6 stages
  const normalizeStatus = (status: LeadStatus): LeadStatus => {
    if (status === "viewing" || status === "visited") return "tour_scheduled";
    if (status === "negotiating") return "qualified";
    if (status === "lost") return "closed";
    return status;
  };

  // Helper for card pricing formatting
  const getCardPrice = (lead: Lead) => {
    if (lead.type === "private-office") {
      if (lead.officeSize?.includes("25")) return "1 000 € HT";
      return "750 € HT";
    }
    if (lead.type === "open-space") {
      if (lead.openSpacePlan === "fixe") {
        const count = lead.workstationCount || 1;
        return `${count * 250} € HT`;
      }
      return "20 € HT";
    }
    if (lead.type === "meeting-room") {
      return lead.timeSlot === "full-day" ? "200 € HT" : "120 € HT";
    }
    return "750 € HT";
  };

  // Helper for category badge pill
  const getCategoryBadge = (lead: Lead) => {
    const isTour =
      lead.visitRequested ||
      lead.source.toLowerCase().includes("tour") ||
      lead.source.toLowerCase().includes("visit");

    if (isTour) {
      return {
        label: language === "fr" ? "VISITE PRIVÉE" : "PRIVATE TOUR",
        className: "bg-emerald-50 text-emerald-800 border-emerald-200/90 font-bold"
      };
    }
    if (lead.type === "private-office") {
      return {
        label: language === "fr" ? "DEMANDE LOCATAIRE" : "TENANT REQUEST",
        className: "bg-sky-50 text-sky-800 border-sky-200/90 font-bold"
      };
    }
    if (lead.type === "open-space") {
      return {
        label: "OPEN SPACE",
        className: "bg-teal-50 text-teal-800 border-teal-200/90 font-bold"
      };
    }
    if (lead.type === "meeting-room") {
      return {
        label: language === "fr" ? "SALLE RÉUNION" : "MEETING ROOM",
        className: "bg-purple-50 text-purple-800 border-purple-200/90 font-bold"
      };
    }
    return {
      label: language === "fr" ? "MESSAGE CONTACT" : "CONTACT MESSAGE",
      className: "bg-slate-100 text-slate-700 border-slate-200/90 font-bold"
    };
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        l.id.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (filterCategory === "offices") return l.type === "private-office";
      if (filterCategory === "open-space") return l.type === "open-space";
      if (filterCategory === "meeting") return l.type === "meeting-room";
      if (filterCategory === "tours") {
        return (
          l.visitRequested ||
          l.source.toLowerCase().includes("tour") ||
          l.source.toLowerCase().includes("visit")
        );
      }
      if (filterCategory === "won") return l.status === "won";

      return true;
    });
  }, [leads, search, filterCategory]);

  // Dynamic counts for each filter pill
  const counts = useMemo(() => {
    return {
      all: leads.length,
      offices: leads.filter((l) => l.type === "private-office").length,
      openSpace: leads.filter((l) => l.type === "open-space").length,
      meeting: leads.filter((l) => l.type === "meeting-room").length,
      tours: leads.filter(
        (l) => l.visitRequested || l.source.toLowerCase().includes("tour") || l.source.toLowerCase().includes("visit")
      ).length,
      won: leads.filter((l) => l.status === "won").length
    };
  }, [leads]);

  return (
    <AdminLayout fullWidth={true}>
      {/* ========================================================== */}
      {/* 1. TOP PIPELINE HEADER STRIP (MATCHING REFERENCE IMAGE 1)  */}
      {/* ========================================================== */}
      <div className="space-y-3.5 w-full">
        {/* Tier 1: Title, Subtitle, Stats Badge & + New Lead */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {t("pipeline.breadcrumb")}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                BORDEAUX FONDAUDÈGE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {t("pipeline.title")}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("pipeline.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Total Active Counter */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                {leads.length} {language === "fr" ? "Opportunités actives" : "Active Opportunities"}
              </span>
            </div>

            {/* + New Lead Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-calve-slate text-white text-xs font-bold hover:bg-calve-slate-dark transition-all cursor-pointer shadow-sm hover:shadow flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === "fr" ? "Nouveau Lead" : "New Lead"}</span>
            </button>
          </div>
        </div>

        {/* Tier 2: Search, Refresh, and Segmented Filters across full width */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 pt-0.5">
          {/* Left: Search & Refresh */}
          <div className="flex items-center gap-2 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("pipeline.search")}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:border-calve-slate shadow-2xs transition-colors"
              />
            </div>

            <button
              onClick={fetchLeads}
              disabled={refreshing}
              title={t("tooltip.refresh")}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-calve-slate text-slate-600 transition-colors cursor-pointer shadow-2xs shrink-0 flex items-center justify-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Right: Segmented Filter Control with Live Counters */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-semibold shrink-0">
            {[
              { id: "all", label: t("pipeline.filter.all"), count: counts.all },
              { id: "offices", label: t("pipeline.filter.offices"), count: counts.offices },
              { id: "open-space", label: t("pipeline.filter.open_space"), count: counts.openSpace },
              { id: "meeting", label: t("pipeline.filter.meeting"), count: counts.meeting },
              { id: "tours", label: t("pipeline.filter.tours"), count: counts.tours },
              { id: "won", label: t("pipeline.filter.won"), count: counts.won }
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setFilterCategory(pill.id as any)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  filterCategory === pill.id
                    ? "bg-calve-slate text-white shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    filterCategory === pill.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================== */}
        {/* 2. KANBAN 6-COLUMN FULL-WIDTH BOARD (DRAG & DROP ENABLED)  */}
        {/* ========================================================== */}
        <div className="overflow-x-auto pb-4 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-6 gap-3.5 min-w-[1360px] 2xl:min-w-0 w-full">
            {stages.map((stage) => {
              const columnLeads = filteredLeads.filter(
                (l) => normalizeStatus(l.status) === stage.key
              );
              const isColumnOver = dragOverStage === stage.key;

              return (
                <div
                  key={stage.key}
                  onDragOver={(e) => handleDragOver(e, stage.key)}
                  onDragLeave={(e) => handleDragLeave(e, stage.key)}
                  onDrop={(e) => handleDrop(e, stage.key)}
                  className={`flex flex-col rounded-2xl p-3 border transition-all duration-200 h-[calc(100vh-215px)] min-h-[660px] ${
                    isColumnOver
                      ? "bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-300/40 shadow-md"
                      : "bg-[#F8F9FA] border-slate-200/80"
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-1 pt-0.5 pb-2.5 border-b border-slate-200/70 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stage.dotColor} shadow-2xs`} />
                      <span className="text-xs font-extrabold text-slate-800">
                        {stage.label}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold border border-slate-200 bg-white text-slate-700 shadow-2xs">
                      {columnLeads.length}
                    </span>
                  </div>

                  {/* Drop Indicator */}
                  {isColumnOver && (
                    <div className="p-3 my-1 border-2 border-dashed border-emerald-500 rounded-2xl bg-emerald-100/50 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-2xs shrink-0">
                      <Plus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {language === "fr"
                          ? `Déposer dans "${stage.label}"`
                          : `Drop into "${stage.label}"`}
                      </span>
                    </div>
                  )}

                  {/* Scrollable Column Cards Container with Auto-Scroll on Mouse Hover */}
                  <KanbanColumnScrollArea isColumnOver={isColumnOver}>
                    {columnLeads.length === 0 && !isColumnOver ? (
                      <div className="h-36 border-2 border-dashed border-slate-200/90 rounded-2xl flex flex-col items-center justify-center text-center p-3 text-slate-400 space-y-1 my-auto">
                        <span className="text-xs font-medium">{t("pipeline.empty")}</span>
                        <span className="text-[10px] text-slate-400/80">
                          {language === "fr" ? "Glissez une carte ici" : "Drag a card here"}
                        </span>
                      </div>
                    ) : (
                      columnLeads.map((lead) => {
                      const category = getCategoryBadge(lead);
                      const price = getCardPrice(lead);
                      const isBeingDragged = draggedLeadId === lead.id;
                      const dateFormatted = new Date(lead.createdAt).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit"
                      });

                      return (
                        <div
                          key={lead.id}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setSelectedLead(lead)}
                          className={`bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5 transition-all duration-150 cursor-grab active:cursor-grabbing relative group hover:shadow-md hover:border-slate-300 ${
                            isBeingDragged
                              ? "opacity-30 scale-95 border-dashed border-calve-slate ring-2 ring-calve-slate/20"
                              : ""
                          }`}
                        >
                          {/* Top Tag & Options */}
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${category.className}`}
                            >
                              {category.label}
                            </span>
                            <div className="flex items-center gap-1 text-slate-300 group-hover:text-slate-600 transition-colors">
                              <GripVertical className="w-3.5 h-3.5 text-slate-400/70" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLead(lead);
                                }}
                                className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Lead Name & Company */}
                          <div>
                            <h4 className="text-xs font-extrabold text-calve-charcoal leading-snug truncate">
                              {lead.name}
                            </h4>
                            {lead.company && (
                              <p className="text-[11px] text-calve-muted truncate font-medium">
                                {lead.company}
                              </p>
                            )}
                          </div>

                          {/* Bold Price */}
                          <div className="text-xs font-black text-calve-charcoal">
                            {price}
                          </div>

                          {/* Space Spec Pill */}
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-semibold max-w-full truncate">
                            <Home className="w-3 h-3 text-calve-slate shrink-0" />
                            <span className="truncate">
                              {lead.type === "private-office"
                                ? lead.officeSize || "Bureau 21 m²"
                                : lead.type === "open-space"
                                ? `Open Space (${lead.openSpacePlan === "fixe" ? "Poste Fixe" : "Nomade"})`
                                : "Salle Réunion 30m²"}
                            </span>
                          </div>

                          {/* Location */}
                          <div className="text-[10px] text-calve-muted truncate flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            <span>48 rue Calvé · Bordeaux</span>
                          </div>

                          {/* Notes preview pill if any */}
                          {lead.notes && lead.notes.length > 0 && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50/70 border border-amber-200/60 text-[9px] text-amber-900 font-medium">
                              <MessageSquare className="w-2.5 h-2.5 text-amber-700 shrink-0" />
                              <span className="truncate">
                                {lead.notes[lead.notes.length - 1].text}
                              </span>
                            </div>
                          )}

                          {/* Bottom Row: Phone & Date */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span className="truncate max-w-[110px]">{lead.phone}</span>
                            <span>{dateFormatted}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  </KanbanColumnScrollArea>
              </div>
            );
          })}
        </div>
      </div>
    </div>

      {/* ========================================================== */}
      {/* 3. SLIDE-OVER LEAD DETAIL MODAL WITH WORKFLOW STAGES & NOTES */}
      {/* ========================================================== */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 bg-calve-charcoal/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl border border-calve-border shadow-2xl p-6 space-y-5 overflow-y-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-calve-border/60 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    ID: {selectedLead.id}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      getCategoryBadge(selectedLead).className
                    }`}
                  >
                    {getCategoryBadge(selectedLead).label}
                  </span>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedLead.priority}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-calve-charcoal">
                  {selectedLead.name}
                </h3>
                {selectedLead.company && (
                  <p className="text-xs text-calve-muted font-semibold mt-0.5">{selectedLead.company}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-calve-charcoal transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Interactive Stage Progression Stepper */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-calve-slate flex items-center justify-between">
                <span>{t("pipeline.modal.change_stage")}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {language === "fr" ? "Cliquez pour changer d'étape" : "Click step to advance"}
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 pt-1">
                {stages.map((stage, idx) => {
                  const isActive = normalizeStatus(selectedLead.status) === stage.key;
                  return (
                    <button
                      key={stage.key}
                      type="button"
                      onClick={() => handleStatusChange(selectedLead.id, stage.key)}
                      className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? "bg-calve-slate text-white border-calve-slate shadow-sm font-bold ring-2 ring-calve-slate/30"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono opacity-60">0{idx + 1}</span>
                        <span className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
                      </div>
                      <span className="text-[11px] font-bold mt-1 truncate">{stage.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Contact & Space Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Contact Card */}
              <div className="p-3.5 rounded-2xl bg-white border border-calve-border space-y-2 shadow-2xs">
                <span className="text-[10px] text-calve-muted uppercase font-bold tracking-wider block">
                  {language === "fr" ? "Coordonnées de Contact" : "Contact Details"}
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-calve-slate hover:underline font-semibold flex items-center gap-1.5 truncate"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{selectedLead.email}</span>
                    </a>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="font-mono text-calve-charcoal font-bold flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-calve-slate shrink-0" />
                      <span>{selectedLead.phone}</span>
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex-1 text-center py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    📞 {language === "fr" ? "Appeler" : "Call"}
                  </a>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex-1 text-center py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    ✉️ Email
                  </a>
                </div>
              </div>

              {/* Space & Pricing Card */}
              <div className="p-3.5 rounded-2xl bg-white border border-calve-border space-y-2 shadow-2xs">
                <span className="text-[10px] text-calve-muted uppercase font-bold tracking-wider block">
                  {language === "fr" ? "Espace & Tarif Locatif" : "Space & Rate"}
                </span>
                <div className="space-y-1">
                  <div className="text-base font-black text-calve-charcoal">
                    {getCardPrice(selectedLead)}
                  </div>
                  <div className="text-xs text-calve-charcoal font-semibold flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-calve-slate" />
                    <span>
                      {selectedLead.type === "private-office"
                        ? selectedLead.officeSize || "Bureau 21 m²"
                        : selectedLead.type === "open-space"
                        ? `Open Space (${selectedLead.openSpacePlan === "fixe" ? "Poste Fixe" : "Nomade"})`
                        : "Salle Réunion 30m²"}
                    </span>
                  </div>
                  {selectedLead.date && (
                    <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {language === "fr" ? "Date souhaitée :" : "Desired Date:"} {selectedLead.date}{" "}
                        {selectedLead.timeSlot ? `(${selectedLead.timeSlot})` : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Initial Enquiry Message if any */}
            {selectedLead.message && (
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs text-calve-charcoal leading-relaxed space-y-1">
                <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                  {language === "fr" ? "Message initial du prospect :" : "Initial Enquiry Message:"}
                </span>
                <p className="italic text-slate-700">&quot;{selectedLead.message}&quot;</p>
              </div>
            )}

            {/* Internal Follow-up Notes Workflow */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
              <div className="flex items-center justify-between text-xs font-bold text-calve-charcoal">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-calve-slate" />
                  <span>{t("pipeline.modal.history")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-calve-muted">{language === "fr" ? "Auteur :" : "Author:"}</span>
                  <select
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                    className="px-2 py-0.5 rounded-lg bg-white border border-calve-border text-[11px] font-bold text-calve-charcoal cursor-pointer"
                  >
                    <option value="Paul (Directeur)">Paul (Directeur)</option>
                    <option value="Clara (Accueil)">Clara (Accueil)</option>
                    <option value="Administrateur">Administrateur</option>
                  </select>
                </div>
              </div>

              {/* Quick Note Action Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-semibold text-slate-400 self-center mr-1">
                  {language === "fr" ? "Raccourcis :" : "Quick actions:"}
                </span>
                {[
                  {
                    fr: "📞 Appel passé : prospect très intéressé",
                    en: "📞 Phone call completed: high interest"
                  },
                  {
                    fr: "📧 Proposition commerciale envoyée par email",
                    en: "📧 Commercial proposal sent by email"
                  },
                  {
                    fr: "☕ Visite privée confirmée pour jeudi",
                    en: "☕ Private tour confirmed for Thursday"
                  },
                  {
                    fr: "📝 Dossier de candidature & bail reçus",
                    en: "📝 Candidate file & lease received"
                  }
                ].map((chip, idx) => {
                  const text = language === "fr" ? chip.fr : chip.en;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddNote(selectedLead.id, text)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-calve-slate hover:text-white border border-slate-200 text-[10px] font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs"
                    >
                      {text}
                    </button>
                  );
                })}
              </div>

              {/* Notes List */}
              {selectedLead.notes && selectedLead.notes.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedLead.notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-white border border-slate-200/90 text-xs flex justify-between items-start gap-3 shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-calve-charcoal font-bold">{n.author}</strong>
                          <span className="text-[10px] text-calve-muted font-mono">
                            {new Date(n.createdAt).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{n.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-calve-muted italic py-1">
                  {language === "fr"
                    ? "Aucune note interne pour l'instant. Ajoutez un compte-rendu ci-dessous :"
                    : "No internal notes yet. Log a follow-up note below:"}
                </p>
              )}

              {/* Add Note Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddNote(selectedLead.id);
                  }}
                  placeholder={t("pipeline.modal.add_note")}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-calve-border text-xs focus:border-calve-slate text-calve-charcoal placeholder:text-calve-muted shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => handleAddNote(selectedLead.id)}
                  className="px-4 py-2 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold cursor-pointer transition-all shadow-2xs shrink-0 flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>{t("pipeline.modal.add_btn")}</span>
                </button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-calve-border/60 flex items-center justify-between text-xs">
              <span className="text-calve-muted text-[11px]">
                {language === "fr" ? "Reçu le" : "Received on"}{" "}
                {new Date(selectedLead.createdAt).toLocaleString(language === "fr" ? "fr-FR" : "en-US")} · Source:{" "}
                <strong className="text-calve-charcoal">{selectedLead.source}</strong>
              </span>
              <button
                type="button"
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="flex items-center gap-1.5 text-rose-600 hover:text-rose-800 text-xs font-bold cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t("pipeline.modal.delete")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 4. QUICK CREATE OPPORTUNITY MODAL                          */}
      {/* ========================================================== */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-calve-charcoal/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl border border-calve-border shadow-2xl p-6 space-y-4 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-calve-border/60 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-calve-charcoal">
                  {language === "fr" ? "Créer un nouveau prospect" : "Create New Lead"}
                </h3>
                <p className="text-xs text-calve-muted">
                  {language === "fr" ? "Ajoute directement le prospect dans 'New Leads'" : "Instantly adds lead into 'New Leads' column"}
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-calve-charcoal">Nom & Prénom *</label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="Jean Dupont"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-calve-border focus:border-calve-slate"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-calve-charcoal">Société / Entité</label>
                  <input
                    type="text"
                    value={createForm.company}
                    onChange={(e) => setCreateForm({ ...createForm, company: e.target.value })}
                    placeholder="Cabinet Dupont"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-calve-border focus:border-calve-slate"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-calve-charcoal">Téléphone direct *</label>
                  <input
                    type="tel"
                    required
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="06 12 34 56 78"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-calve-border focus:border-calve-slate font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-calve-charcoal">Email professionnel *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="jean@dupont.fr"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-calve-border focus:border-calve-slate"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-calve-charcoal">Type d&apos;espace</label>
                  <select
                    value={createForm.type}
                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-calve-border focus:border-calve-slate font-medium"
                  >
                    <option value="private-office">Bureau Privatif (17 ou 28 m²)</option>
                    <option value="open-space">Open Space (Poste fixe 250€)</option>
                    <option value="meeting-room">Salle de Réunion (30m²)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-calve-charcoal">Précision / Taille</label>
                  <input
                    type="text"
                    value={createForm.officeSize}
                    onChange={(e) => setCreateForm({ ...createForm, officeSize: e.target.value })}
                    placeholder="21 m² (3-4 postes)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-calve-border focus:border-calve-slate"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-calve-charcoal">Message ou demande initiale</label>
                <textarea
                  rows={2}
                  value={createForm.message}
                  onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
                  placeholder="Recherche bureau au calme avec parking..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-calve-border focus:border-calve-slate"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-calve-charcoal">Première note interne de suivi</label>
                <input
                  type="text"
                  value={createForm.initialNote}
                  onChange={(e) => setCreateForm({ ...createForm, initialNote: e.target.value })}
                  placeholder="Appel reçu le matin, visite à caler..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-calve-border focus:border-calve-slate"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-calve-border text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  {language === "fr" ? "Annuler" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white font-bold shadow-xs cursor-pointer"
                >
                  {language === "fr" ? "Créer dans 'New Leads'" : "Create in 'New Leads'"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 5. FLOATING DRAG & DROP CONFIRMATION TOAST                 */}
      {/* ========================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 fade-in duration-200 max-w-md">
          <div className="p-4 rounded-2xl bg-calve-charcoal text-white shadow-2xl border border-slate-700/80 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 font-bold" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">{toastMessage.title}</p>
                  {toastMessage.subtitle && (
                    <p className="text-[11px] text-slate-300 font-medium mt-1 leading-snug">{toastMessage.subtitle}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {toastMessage.title.includes("Gagné") && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
                <Link
                  href="/admin/tenants"
                  className="flex-1 text-center px-2.5 py-1.5 rounded-lg bg-calve-gold hover:bg-[#b89155] text-calve-charcoal text-[11px] font-bold transition-all shadow-xs"
                >
                  Voir Résidents →
                </Link>
                <Link
                  href="/admin/spaces"
                  className="flex-1 text-center px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold transition-all"
                >
                  Voir Espaces →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
