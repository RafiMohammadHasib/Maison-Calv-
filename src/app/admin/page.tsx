"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { Lead, LeadStatus } from "@/lib/leads";
import { SpaceInventoryRecord, TenantRecord } from "@/lib/inventorySync";
import { useLanguage } from "@/lib/languageContext";
import {
  Building2,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Kanban,
  Users,
  Clock,
  MapPin,
  Mail,
  Phone,
  Download,
  ChevronRight,
  ChevronDown,
  Trash2,
  MessageSquare,
  AlertCircle,
  Search,
  Check,
  ExternalLink,
  Briefcase,
  ArrowUpRight,
  Filter,
  X
} from "lucide-react";

interface SplinePoint {
  x: number;
  y: number;
}

// Catmull-Rom to Cubic Bezier curve algorithm
function computeBezierSpline(points: SplinePoint[]): string {
  const n = points.length;
  if (n < 2) return "";
  const d: string[] = [];
  d.push(`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`);

  for (let i = 0; i < n - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < n - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d.push(
      `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    );
  }
  return d.join(" ");
}

const STATUS_STAGES: {
  id: LeadStatus;
  labelFr: string;
  labelEn: string;
  dot: string;
  bg: string;
  border: string;
  text: string;
}[] = [
  {
    id: "new",
    labelFr: "Nouvel arrivant",
    labelEn: "New Arrival",
    dot: "bg-amber-500",
    bg: "bg-amber-50/80",
    border: "border-amber-200",
    text: "text-amber-900"
  },
  {
    id: "tour_scheduled",
    labelFr: "Visite programmée",
    labelEn: "Tour Scheduled",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50/80",
    border: "border-emerald-200",
    text: "text-emerald-900"
  },
  {
    id: "visited",
    labelFr: "Visite effectuée",
    labelEn: "Tour Completed",
    dot: "bg-sky-500",
    bg: "bg-sky-50/80",
    border: "border-sky-200",
    text: "text-sky-900"
  },
  {
    id: "negotiating",
    labelFr: "En négociation",
    labelEn: "In Negotiation",
    dot: "bg-purple-500",
    bg: "bg-purple-50/80",
    border: "border-purple-200",
    text: "text-purple-900"
  },
  {
    id: "won",
    labelFr: "Contrat signé",
    labelEn: "Contract Signed",
    dot: "bg-teal-500",
    bg: "bg-teal-50/90",
    border: "border-teal-200",
    text: "text-teal-900"
  },
  {
    id: "closed",
    labelFr: "Sans suite / Annulé",
    labelEn: "Closed / Cancelled",
    dot: "bg-slate-400",
    bg: "bg-slate-100",
    border: "border-slate-200",
    text: "text-slate-700"
  }
];

function getStatusBadgeConfig(status: LeadStatus, isEnglish: boolean) {
  switch (status) {
    case "new":
    case "contacted":
      return {
        label: isEnglish ? "New Arrival" : "Nouvel arrivant",
        dot: "bg-amber-500",
        bg: "bg-amber-50/80",
        border: "border-amber-200",
        text: "text-amber-900"
      };
    case "qualified":
    case "tour_scheduled":
      return {
        label: isEnglish ? "Tour Scheduled" : "Visite programmée",
        dot: "bg-emerald-500",
        bg: "bg-emerald-50/80",
        border: "border-emerald-200",
        text: "text-emerald-900"
      };
    case "viewing":
    case "visited":
      return {
        label: isEnglish ? "Tour Completed" : "Visite effectuée",
        dot: "bg-sky-500",
        bg: "bg-sky-50/80",
        border: "border-sky-200",
        text: "text-sky-900"
      };
    case "negotiating":
      return {
        label: isEnglish ? "In Negotiation" : "En négociation",
        dot: "bg-purple-500",
        bg: "bg-purple-50/80",
        border: "border-purple-200",
        text: "text-purple-900"
      };
    case "won":
      return {
        label: isEnglish ? "Contract Signed" : "Contrat signé",
        dot: "bg-teal-500",
        bg: "bg-teal-50/90",
        border: "border-teal-200",
        text: "text-teal-900"
      };
    case "closed":
    case "lost":
    default:
      return {
        label: isEnglish ? "Closed / Cancelled" : "Sans suite / Annulé",
        dot: "bg-slate-400",
        bg: "bg-slate-100",
        border: "border-slate-200",
        text: "text-slate-700"
      };
  }
}

function getLeadFinancials(lead: Lead, isEnglish: boolean): { label: string; rate: string } {
  if (lead.type === "private-office") {
    const defaultName = isEnglish ? "Private Office" : "Bureau Privatif";
    if (lead.officeSize?.includes("25") || lead.officeSize?.includes("28")) {
      return { 
        label: isEnglish ? lead.officeSize.replace(/Bureau [pP]rivatif/g, "Private Office").replace("postes", "desks") : lead.officeSize, 
        rate: isEnglish ? "€1,200 excl. VAT/mo" : "1 200 € HT/mois" 
      };
    }
    if (lead.officeSize?.includes("17") || lead.officeSize?.includes("21")) {
      return { 
        label: isEnglish ? lead.officeSize.replace(/Bureau [pP]rivatif/g, "Private Office").replace("postes", "desks") : lead.officeSize, 
        rate: isEnglish ? "€950 excl. VAT/mo" : "950 € HT/mois" 
      };
    }
    return { label: lead.officeSize || defaultName, rate: isEnglish ? "€850 excl. VAT/mo" : "850 € HT/mois" };
  }
  if (lead.type === "open-space") {
    const stations = lead.workstationCount || 1;
    const isNomade = lead.openSpacePlan === "flexible";
    const unitPrice = isNomade ? 180 : 250;
    const total = unitPrice * stations;
    const planName = isNomade 
      ? (isEnglish ? "Hot Desk" : "Poste Nomade") 
      : (isEnglish ? "Dedicated Desk" : "Poste Fixe");
    return {
      label: `Open Space (${planName} × ${stations})`,
      rate: isEnglish ? `€${total} excl. VAT/mo` : `${total} € HT/mois`
    };
  }
  if (lead.type === "meeting-room") {
    const isDay = lead.timeSlot === "full-day";
    return {
      label: isEnglish ? "Meeting Room 30 sqm" : "Salle de Réunion 30 m²",
      rate: isDay 
        ? (isEnglish ? "€200 excl. VAT (full day)" : "200 € HT (journée)") 
        : (isEnglish ? "€120 excl. VAT (half-day)" : "120 € HT (demi-j)")
    };
  }
  return { 
    label: isEnglish ? "Specific Request" : "Demande Spécifique", 
    rate: isEnglish ? "Custom Quote" : "Sur devis" 
  };
}

function formatBucketLabel(startDate: Date, endDate: Date, locale: "fr" | "en") {
  const startDay = String(startDate.getDate()).padStart(2, "0");
  const endDay = String(endDate.getDate()).padStart(2, "0");
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthsFr = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const months = locale === "fr" ? monthsFr : monthsEn;

  const startMonth = months[startDate.getMonth()];
  const endMonth = months[endDate.getMonth()];

  const label =
    startDate.getMonth() === endDate.getMonth()
      ? `${startDay} - ${endDay} ${endMonth}`
      : `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  const shortLabel = `${endDay} ${endMonth}`;
  return { label, shortLabel };
}

export default function AdminDashboardPage() {
  const { t, isEnglish } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [spaces, setSpaces] = useState<SpaceInventoryRecord[]>([]);
  const [tenants, setTenants] = useState<TenantRecord[]>([]);
  const [inventoryMetrics, setInventoryMetrics] = useState<{
    availableSuitesCount?: number;
    totalSuitesCount?: number;
    availablePrivateOffices?: number;
    totalPrivateOffices?: number;
    occupiedDesks?: number;
    totalDesks?: number;
    assignedParkingBays?: number;
    totalParkingBays?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Tabs
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "tours" | "offices" | "open-space" | "meeting" | "won">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [chartMetric, setChartMetric] = useState<"leads" | "revenue" | "tours">("leads");

  // Interaction State
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<{ [leadId: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string } | null>(null);

  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        setOpenStatusMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [leadsRes, spacesRes, tenantsRes] = await Promise.all([
        fetch("/api/admin/leads").then((r) => r.json()).catch(() => ({ success: false })),
        fetch("/api/admin/spaces").then((r) => r.json()).catch(() => ({ success: false })),
        fetch("/api/admin/tenants").then((r) => r.json()).catch(() => ({ success: false }))
      ]);

      if (leadsRes?.success) {
        setLeads(leadsRes.leads || []);
        setStats(leadsRes.stats || {});
      }
      if (spacesRes?.success) {
        setSpaces(spacesRes.spaces || []);
        if (spacesRes.metrics) setInventoryMetrics(spacesRes.metrics);
      }
      if (tenantsRes?.success) {
        setTenants(tenantsRes.tenants || []);
        if (tenantsRes.metrics && !spacesRes?.metrics) setInventoryMetrics(tenantsRes.metrics);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const lead = leads.find((l) => l.id === leadId);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus, updatedAt: new Date().toISOString() } : l))
    );
    setOpenStatusMenuId(null);

    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus })
      });
      const data = await res.json();
      if (data.success && data.stats) setStats(data.stats);

      if (newStatus === "won") {
        const companyOrName = lead?.company || lead?.name || "Client";
        setToastMessage({
          title: `🎉 Lead Gagné ! (${companyOrName})`,
          subtitle: "Ajouté à l'Annuaire des Résidents et son espace est maintenant Réservé."
        });
        setTimeout(() => setToastMessage(null), 7000);
      }
      // Refresh inventory & tenants sync
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchDashboardData();
    }
  };

  const handleAddNote = async (leadId: string) => {
    const text = (noteInputs[leadId] || "").trim();
    if (!text) return;

    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leadId,
          newNote: {
            author: "Paul (Directeur)",
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
      console.error("Failed to add note:", err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm(t("dashboard.lead.confirm_delete"))) return;

    try {
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      const res = await fetch(`/api/admin/leads?id=${leadId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success && data.stats) setStats(data.stats);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to delete lead:", err);
      fetchDashboardData();
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Type",
      "Space/Size",
      "Source",
      "Status",
      "Date",
      "Priority",
      "Created At"
    ];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      l.email,
      l.phone,
      `"${(l.company || "").replace(/"/g, '""')}"`,
      l.type,
      `"${(l.officeSize || l.openSpacePlan || "").replace(/"/g, '""')}"`,
      `"${l.source.replace(/"/g, '""')}"`,
      l.status,
      l.date || "",
      l.priority,
      l.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `maison-calve-leads-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Real-time Space & Suite inventory metrics
  const privateOffices = useMemo(() => spaces.filter((s) => s.category === "private"), [spaces]);

  const availableOfficesCount = useMemo(() => {
    if (inventoryMetrics?.availableSuitesCount !== undefined) {
      return inventoryMetrics.availableSuitesCount;
    }
    if (inventoryMetrics?.availablePrivateOffices !== undefined) {
      return inventoryMetrics.availablePrivateOffices;
    }
    return privateOffices.filter((s) => s.status === "available").length;
  }, [inventoryMetrics, privateOffices]);

  const totalOfficesCount = useMemo(() => {
    if (inventoryMetrics?.totalSuitesCount !== undefined) {
      return inventoryMetrics.totalSuitesCount;
    }
    if (inventoryMetrics?.totalPrivateOffices !== undefined) {
      return inventoryMetrics.totalPrivateOffices;
    }
    return Math.max(privateOffices.length + 3, 5);
  }, [inventoryMetrics, privateOffices]);

  const suitesSubtext = useMemo(() => {
    if (privateOffices.length === 0) {
      return t("dashboard.metric.suites_sub");
    }
    const avail = privateOffices.filter((s) => s.status === "available");
    if (avail.length >= 2) {
      return isEnglish ? "21sqm (€950) & 28sqm (€1,200) excl. VAT" : "21m² (950€) & 28m² (1 200€) HT";
    }
    if (avail.length === 1) {
      return isEnglish
        ? `${avail[0].area} (${avail[0].price} excl. VAT) available`
        : `${avail[0].name} (${avail[0].price}) disponible`;
    }
    return isEnglish ? "100% occupied · Priority waitlist" : "100% complet · Liste d'attente active";
  }, [privateOffices, isEnglish, t]);

  // Real-time Tenant Retention metrics
  const retentionStats = useMemo(() => {
    if (tenants.length === 0) {
      return {
        rate: stats?.retentionRate || "98%",
        sub: t("dashboard.metric.retention_sub")
      };
    }
    const activeCount = tenants.filter((t) => t.status === "active").length;
    const rateNumber = Math.round((activeCount / tenants.length) * 100);
    return {
      rate: `${rateNumber}%`,
      sub: isEnglish ? "Long-term commitment favored" : "Engagement long terme privilégié"
    };
  }, [tenants, stats, isEnglish, t]);

  // Live counter metrics for Category Tabs
  const tabCounts = useMemo(() => {
    return {
      all: leads.length,
      tours: leads.filter(
        (l) => l.visitRequested || l.source.toLowerCase().includes("tour") || l.source.toLowerCase().includes("visit")
      ).length,
      offices: leads.filter((l) => l.type === "private-office").length,
      openSpace: leads.filter((l) => l.type === "open-space").length,
      meeting: leads.filter((l) => l.type === "meeting-room").length,
      won: leads.filter((l) => l.status === "won").length
    };
  }, [leads]);

  // Actual Historical Telemetry Intervals for the Executive Spline Curve (100% Dynamic from Database)
  const chartData = useMemo(() => {
    const getLeadRev = (l: Lead) => {
      if (l.type === "private-office") {
        if (l.officeSize?.includes("28") || l.officeSize?.includes("25")) return 1200;
        if (l.officeSize?.includes("17") || l.officeSize?.includes("21")) return 950;
        return 850;
      }
      if (l.type === "open-space") {
        const stations = l.workstationCount || 1;
        return (l.openSpacePlan === "flexible" ? 180 : 250) * stations;
      }
      if (l.type === "meeting-room") {
        return l.timeSlot === "full-day" ? 200 : 120;
      }
      return 150;
    };

    // Anchor time: latest lead timestamp or current time, whichever is newer
    const latestLeadTime = leads.length > 0
      ? Math.max(...leads.map((l) => new Date(l.createdAt).getTime()).filter((t) => !isNaN(t)))
      : Date.now();
    const anchorMs = Math.max(latestLeadTime, Date.now());

    // 5 progressive temporal buckets spanning 5 rolling weeks
    const rawBuckets = Array.from({ length: 5 }, (_, idx) => {
      const endMs = anchorMs - (4 - idx) * 7 * 24 * 3600 * 1000;
      const startMs = endMs - 7 * 24 * 3600 * 1000;
      const startDate = new Date(startMs);
      const endDate = new Date(endMs);
      const { label, shortLabel } = formatBucketLabel(startDate, endDate, isEnglish ? "en" : "fr");

      // Filter real leads in this time interval
      const bucketLeads = leads.filter((l) => {
        const t = new Date(l.createdAt).getTime();
        if (isNaN(t)) return false;
        if (idx === 4) return t >= startMs && t <= endMs;
        return t >= startMs && t < endMs;
      });

      const toursCount = bucketLeads.filter(
        (l) => l.visitRequested || l.source.toLowerCase().includes("tour") || l.source.toLowerCase().includes("visit")
      ).length;

      const revTotal = bucketLeads.reduce((acc, l) => acc + getLeadRev(l), 0);
      const officeCount = bucketLeads.filter((l) => l.type === "private-office").length;
      const openCount = bucketLeads
        .filter((l) => l.type === "open-space")
        .reduce((acc, l) => acc + (l.workstationCount || 1), 0);
      const meetingCount = bucketLeads.filter((l) => l.type === "meeting-room").length;

      return {
        key: `w${idx + 1}`,
        idx,
        label,
        shortLabel,
        sub: isEnglish ? `Week ${idx + 1}` : `Semaine ${idx + 1}`,
        shortSub: isEnglish ? `W${idx + 1}` : `S${idx + 1}`,
        leads: bucketLeads.length,
        tours: toursCount,
        revenue: revTotal,
        officeCount,
        openCount,
        meetingCount,
      };
    });

    // Find peak bucket for the active metric or overall leads
    const metricVals = rawBuckets.map((b) =>
      chartMetric === "leads" ? b.leads : chartMetric === "tours" ? b.tours : b.revenue
    );
    const maxVal = Math.max(...metricVals, 1);
    const peakIdx = metricVals.lastIndexOf(maxVal);

    return rawBuckets.map((b, idx) => {
      let tag = "";
      if (idx === peakIdx && maxVal > 0) {
        tag = isEnglish ? "PEAK" : "PIC";
      } else if (idx === 0) {
        tag = isEnglish ? "START" : "DÉPART";
      } else {
        const prevMetricVal = metricVals[idx - 1] || 0;
        const currMetricVal = metricVals[idx];
        if (prevMetricVal > 0) {
          const diff = Math.round(((currMetricVal - prevMetricVal) / prevMetricVal) * 100);
          tag = diff >= 0 ? `+${diff}%` : `${diff}%`;
        } else if (currMetricVal > 0) {
          tag = "+100%";
        } else {
          tag = "0%";
        }
      }

      const isPeak = idx === peakIdx;
      return {
        ...b,
        sub: isPeak ? (isEnglish ? `Week ${idx + 1} (Peak)` : `Semaine ${idx + 1} (Pic)`) : b.sub,
        tag,
      };
    });
  }, [leads, isEnglish, chartMetric]);

  // Dynamic Spline Calculations & Curve Coordinates
  const chartComputed = useMemo(() => {
    const rawValues = chartData.map((d) => (chartMetric === "leads" ? d.leads : chartMetric === "tours" ? d.tours : d.revenue));
    
    // Total pipeline revenue across all leads
    const totalRev = leads.reduce((acc, l) => {
      if (l.type === "private-office") {
        if (l.officeSize?.includes("28") || l.officeSize?.includes("25")) return acc + 1200;
        if (l.officeSize?.includes("17") || l.officeSize?.includes("21")) return acc + 950;
        return acc + 850;
      }
      if (l.type === "open-space") {
        const stations = l.workstationCount || 1;
        return acc + (l.openSpacePlan === "flexible" ? 180 : 250) * stations;
      }
      if (l.type === "meeting-room") {
        return acc + (l.timeSlot === "full-day" ? 200 : 120);
      }
      return acc + 150;
    }, 0);

    const isRev = chartMetric === "revenue";
    const peakVal = Math.max(...rawValues, 1);

    // Dynamic scale scaling with luxury padding
    let maxScale: number;
    if (isRev) {
      maxScale = Math.max(Math.ceil((peakVal * 1.15) / 1000) * 1000, 5000);
    } else {
      const ceil15 = Math.ceil(peakVal * 1.15);
      maxScale = ceil15 <= 10 ? Math.max(ceil15, 6) : Math.ceil(ceil15 / 5) * 5;
    }

    const peakIndex = rawValues.indexOf(Math.max(...rawValues));

    // SVG coordinate space: 600 wide, 160 tall (uniform non-distorting coordinate system)
    // 5 X positions with proper left Y-axis margin:
    const xPositions = [75, 195, 315, 435, 555];
    const yTop = 38;
    const yBaseline = 138;
    const yRange = yBaseline - yTop; // 100

    const points: SplinePoint[] = rawValues.map((val, idx) => {
      const normalized = Math.min(val / maxScale, 1.0);
      const y = yBaseline - normalized * yRange;
      return { x: xPositions[idx], y: Math.round(y * 10) / 10 };
    });

    const curvePath = computeBezierSpline(points);
    const areaPath = `${curvePath} L ${xPositions[xPositions.length - 1]} ${yBaseline} L ${xPositions[0]} ${yBaseline} Z`;

    // Dynamic Growth Rate: compare latest week with previous week (WoW)
    const prevWeekVal = rawValues[3] || 0;
    const currWeekVal = rawValues[4] || 0;
    let growthPercent = "0.0";
    if (prevWeekVal > 0) {
      growthPercent = (((currWeekVal - prevWeekVal) / prevWeekVal) * 100).toFixed(1);
    } else if (currWeekVal > 0) {
      growthPercent = "+100.0";
    }
    const growthDisplay = Number(growthPercent) >= 0 ? `+${growthPercent}%` : `${growthPercent}%`;

    // Dynamic 5-level Y ticks configuration (100%, 75%, 50%, 25%, 0%)
    const tickSteps = 4;
    const yTicks = Array.from({ length: tickSteps + 1 }, (_, i) => {
      const factor = (tickSteps - i) / tickSteps;
      const val = Math.round(maxScale * factor);
      const y = yBaseline - factor * yRange;
      const label = isRev
        ? val % 1000 === 0
          ? `${val / 1000} k€`
          : `${(val / 1000).toFixed(1)} k€`
        : `${val}`;
      return { label, y: Math.round(y * 10) / 10 };
    });

    const formattedLabels = rawValues.map((v) => {
      if (chartMetric === "leads") return `${v} lead${v > 1 ? "s" : ""}`;
      if (chartMetric === "tours") return `${v} ${isEnglish ? "tour" : "visite"}${v > 1 ? "s" : ""}`;
      return `${v.toLocaleString()} € HT`;
    });

    return {
      rawValues,
      points,
      curvePath,
      areaPath,
      peakIndex,
      growthDisplay,
      maxScale,
      yTicks,
      totalRev,
      formattedLabels,
      yBaseline,
    };
  }, [chartData, chartMetric, leads, isEnglish]);

  // Tab & Status Filtering
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        (l.message && l.message.toLowerCase().includes(q)) ||
        l.id.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "new" && l.status !== "new" && l.status !== "contacted") return false;
        if (statusFilter === "tour_scheduled" && l.status !== "tour_scheduled" && l.status !== "qualified") return false;
        if (statusFilter === "visited" && l.status !== "visited" && l.status !== "viewing") return false;
        if (statusFilter === "negotiating" && l.status !== "negotiating") return false;
        if (statusFilter === "won" && l.status !== "won") return false;
        if (statusFilter === "closed" && l.status !== "closed" && l.status !== "lost") return false;
      }

      // Tab filter
      if (activeTab === "tours") {
        return l.visitRequested || l.source.toLowerCase().includes("tour") || l.source.toLowerCase().includes("visit");
      }
      if (activeTab === "offices") {
        return l.type === "private-office";
      }
      if (activeTab === "open-space") {
        return l.type === "open-space";
      }
      if (activeTab === "meeting") {
        return l.type === "meeting-room";
      }
      if (activeTab === "won") {
        return l.status === "won";
      }

      return true;
    });
  }, [leads, searchQuery, statusFilter, activeTab]);

  return (
    <AdminLayout
      title={t("dashboard.title")}
      subtitle={t("dashboard.subtitle")}
      onSearch={setSearchQuery}
      onRefresh={fetchDashboardData}
      fullWidth={true}
      headerAction={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/pipeline"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold transition-all shadow-2xs"
          >
            <Kanban className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("nav.pipeline")}</span>
          </Link>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-calve-border hover:border-calve-slate text-xs font-semibold text-calve-charcoal transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-calve-slate" />
            <span>{t("dashboard.export_csv")}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6" ref={menuContainerRef}>
        {/* ========================================================== */}
        {/* 1. EXECUTIVE METRIC CARDS                                  */}
        {/* ========================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Active Suites */}
          <Link
            href="/admin/spaces"
            className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-2 hover:border-calve-slate/40 transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-calve-muted">
              <span>{t("dashboard.metric.suites")}</span>
              <Building2 className="w-4 h-4 text-calve-slate" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-calve-charcoal">
                {availableOfficesCount} / {totalOfficesCount}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-800">{suitesSubtext}</p>
          </Link>

          {/* 2. Client Rating */}
          <div className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-2 hover:border-calve-slate/40 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-calve-muted">
              <span>{t("dashboard.metric.rating")}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-calve-charcoal">
                {stats?.clientRating?.replace(/\s+/g, "") || "4.9/5"}
              </span>
            </div>
            <p className="text-[11px] text-calve-muted">{t("dashboard.metric.rating_sub")}</p>
          </div>

          {/* 3. Retention Rate */}
          <div className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-2 hover:border-calve-slate/40 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-calve-muted">
              <span>{t("dashboard.metric.retention")}</span>
              <TrendingUp className="w-4 h-4 text-calve-slate" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-calve-charcoal">
                {retentionStats.rate}
              </span>
            </div>
            <p className="text-[11px] text-calve-muted">{retentionStats.sub}</p>
          </div>

          {/* 4. Total Inbound Leads */}
          <Link
            href="/admin/pipeline"
            className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-2 hover:border-calve-slate/40 transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-calve-muted">
              <span>{t("dashboard.metric.leads")}</span>
              <Kanban className="w-4 h-4 text-calve-slate" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-calve-charcoal">{leads.length}</span>
              <span className="text-xs font-bold text-emerald-800">{chartComputed.growthDisplay}</span>
            </div>
            <p className="text-[11px] text-emerald-800 font-semibold">{t("dashboard.metric.leads_sub")}</p>
          </Link>
        </div>

        {/* ========================================================== */}
        {/* 2. MIDDLE SECTION: DYNAMIC SPLINE CHART & SHORTCUTS        */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 cols: Spline Growth Chart */}
          <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white border border-calve-border/80 shadow-xs flex flex-col justify-start space-y-4">
            {/* Executive Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200/80">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <span>{isEnglish ? "CRM TELEMETRY" : "TÉLÉMÉTRIE CRM"}</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600">
                    {chartComputed.growthDisplay} {isEnglish ? "acceleration" : "accélération"}
                  </span>
                </div>

                {/* Big Metric Display */}
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-calve-charcoal tracking-tight">
                    {chartMetric === "leads" && `${leads.length}`}
                    {chartMetric === "tours" && `${tabCounts.tours}`}
                    {chartMetric === "revenue" && `${chartComputed.totalRev.toLocaleString()} €`}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-calve-muted">
                    {chartMetric === "leads" && (isEnglish ? "Active CRM Inquiries" : "Demandes Enregistrées")}
                    {chartMetric === "tours" && (isEnglish ? "Private Tours & Visits" : "Visites Privées Demandées")}
                    {chartMetric === "revenue" && (isEnglish ? "HT / Monthly Pipeline Value" : "Valeur Mensuelle Pipeline (HT)")}
                  </span>
                </div>
                <p className="text-xs text-calve-muted mt-1">
                  {isEnglish
                    ? `Rolling 5-week trajectory · Live synchronization with booking engine`
                    : `Trajectoire sur 5 cycles · Synchronisation temps réel moteur de réservation`}
                </p>
              </div>

              {/* Metric Switcher Capsule */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-bold shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => setChartMetric("leads")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    chartMetric === "leads" ? "bg-white text-calve-charcoal shadow-xs font-extrabold" : "text-calve-muted hover:text-calve-charcoal"
                  }`}
                >
                  {t("dashboard.chart.btn.leads")}
                </button>
                <button
                  onClick={() => setChartMetric("tours")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    chartMetric === "tours" ? "bg-white text-emerald-800 shadow-xs font-extrabold" : "text-calve-muted hover:text-calve-charcoal"
                  }`}
                >
                  {t("dashboard.chart.btn.tours")}
                </button>
                <button
                  onClick={() => setChartMetric("revenue")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    chartMetric === "revenue" ? "bg-white text-calve-charcoal shadow-xs font-extrabold" : "text-calve-muted hover:text-calve-charcoal"
                  }`}
                >
                  {t("dashboard.chart.btn.revenue")}
                </button>
              </div>
            </div>

            {/* High-Fidelity SVG Chart Canvas with Interactive Tooltip */}
            <div className="relative w-full aspect-[2.4/1] sm:aspect-[2.8/1] md:aspect-[3.2/1] max-h-52 pt-1">
              {/* Floating Executive Tooltip Card */}
              {hoveredPointIdx !== null && chartComputed.points[hoveredPointIdx] && (
                <div
                  className="absolute pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full z-30"
                  style={{
                    left: `${(chartComputed.points[hoveredPointIdx].x / 600) * 100}%`,
                    top: `${(chartComputed.points[hoveredPointIdx].y / 160) * 100}%`,
                    marginTop: "-14px",
                  }}
                >
                  <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl p-3 shadow-2xl border border-slate-700/80 min-w-[170px]">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>{chartData[hoveredPointIdx].label}</span>
                      <span className="text-emerald-400 font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        {chartData[hoveredPointIdx].tag}
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{chartComputed.formattedLabels[hoveredPointIdx]}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-300 flex items-center justify-between">
                      <span>{isEnglish ? "Tours requested" : "Visites demandées"}</span>
                      <span className="font-bold text-white">{chartData[hoveredPointIdx].tours}</span>
                    </div>
                    <div className="text-[10px] text-slate-300 flex items-center justify-between mt-0.5">
                      <span>{isEnglish ? "Est. Pipeline" : "Pipeline est."}</span>
                      <span className="font-bold text-emerald-300">{chartData[hoveredPointIdx].revenue.toLocaleString()} € HT</span>
                    </div>
                    {chartData[hoveredPointIdx].officeCount > 0 && (
                      <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
                        <span>{isEnglish ? "Private offices" : "Bureaux privatifs"}</span>
                        <span>{chartData[hoveredPointIdx].officeCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160">
                <defs>
                  <linearGradient id="leadSplineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2D4B49" stopOpacity="0.22" />
                    <stop offset="50%" stopColor="#2D4B49" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#2D4B49" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Tick Labels & Horizontal Reference Gridlines */}
                {chartComputed.yTicks.map((tick, i) => (
                  <g key={i}>
                    <text
                      x="40"
                      y={tick.y + 3.5}
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="500"
                    >
                      {tick.label}
                    </text>
                    <line
                      x1="48"
                      y1={tick.y}
                      x2="575"
                      y2={tick.y}
                      stroke={i === chartComputed.yTicks.length - 1 ? "#cbd5e1" : "#f1f5f9"}
                      strokeDasharray={i === chartComputed.yTicks.length - 1 ? "none" : "4 4"}
                      strokeWidth={i === chartComputed.yTicks.length - 1 ? "1.2" : "1"}
                    />
                  </g>
                ))}

                {/* Shaded Area */}
                <path d={chartComputed.areaPath} fill="url(#leadSplineGradient)" className="transition-all duration-500 ease-out" />

                {/* Active Hover Crosshair Line */}
                {hoveredPointIdx !== null && chartComputed.points[hoveredPointIdx] && (
                  <line
                    x1={chartComputed.points[hoveredPointIdx].x}
                    y1="22"
                    x2={chartComputed.points[hoveredPointIdx].x}
                    y2={chartComputed.yBaseline}
                    stroke="#2D4B49"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    className="transition-all duration-150"
                  />
                )}

                {/* Smooth Bezier Spline Stroke */}
                <path
                  d={chartComputed.curvePath}
                  fill="none"
                  stroke="#2D4B49"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-500 ease-out"
                />

                {/* Data Points strictly located on the curve */}
                {chartComputed.points.map((pt, idx) => {
                  const isHovered = hoveredPointIdx === idx;
                  const isPeak = idx === chartComputed.peakIndex;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPointIdx(idx)}
                      onMouseLeave={() => setHoveredPointIdx(null)}
                    >
                      {/* Pulse halo on Hover or Peak */}
                      {isHovered ? (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={14}
                          fill="#2D4B49"
                          opacity={0.18}
                          className="transition-all duration-200"
                        />
                      ) : isPeak ? (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={8}
                          fill="#2D4B49"
                          opacity={0.15}
                          className="animate-pulse"
                        />
                      ) : null}

                      {/* Main Node Circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : isPeak ? 5 : 4.5}
                        fill="#ffffff"
                        stroke="#2D4B49"
                        strokeWidth={isHovered ? 3.5 : 2.5}
                        className="transition-all duration-200"
                      />

                      {/* Discreet Peak Pill when NOT hovered */}
                      {isPeak && hoveredPointIdx === null && (
                        <g transform={`translate(${pt.x}, ${pt.y - 14})`} className="pointer-events-none transition-all duration-300">
                          <rect
                            x="-28"
                            y="-16"
                            width="56"
                            height="18"
                            rx="5"
                            fill="#1e293b"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
                          />
                          <text
                            x="0"
                            y="-4"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="bold"
                            letterSpacing="0.5"
                          >
                            {isEnglish ? "PEAK" : "PIC"}
                          </text>
                        </g>
                      )}

                      {/* Hit target for effortless hovering */}
                      <circle cx={pt.x} cy={pt.y} r={24} fill="transparent" />
                    </g>
                  );
                })}
              </svg>

              {/* Weekly Timeline Labels - Responsive compact format on mobile */}
              <div className="flex justify-between text-xs font-semibold text-calve-muted pl-10 sm:pl-12 pr-2 sm:pr-4 pt-2">
                {chartData.map((d, idx) => {
                  const isPeak = idx === chartComputed.peakIndex;
                  return (
                    <div
                      key={d.key}
                      className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity text-center min-w-0"
                      onMouseEnter={() => setHoveredPointIdx(idx)}
                      onMouseLeave={() => setHoveredPointIdx(null)}
                    >
                      <span className={`text-[11px] sm:text-xs truncate ${isPeak ? "text-calve-charcoal font-extrabold" : "text-calve-muted"}`}>
                        <span className="inline sm:hidden">{d.shortLabel}</span>
                        <span className="hidden sm:inline">{d.label}</span>
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-calve-muted/70 font-medium">
                        <span className="inline sm:hidden">{d.shortSub}</span>
                        <span className="hidden sm:inline">{d.sub}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>


          </div>
          {/* Right 4 cols: Modules & Shortcuts */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white border border-calve-border/80 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-calve-charcoal mb-4">
                  {t("dashboard.shortcuts.title")}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/admin/pipeline"
                    className="p-3.5 rounded-2xl bg-calve-slate text-white text-left hover:bg-calve-slate-dark transition-all shadow-xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-white/80">CRM Pipeline</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-base font-extrabold mt-1">{leads.length} leads</div>
                  </Link>

                  <Link
                    href="/admin/pipeline?filter=tours"
                    className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-200 text-left hover:bg-emerald-100 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-emerald-800">
                        {isEnglish ? "Tours / Visits" : "Tours / Visites"}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700/60 group-hover:text-emerald-900 transition-colors" />
                    </div>
                    <div className="text-base font-extrabold mt-1">
                      {tabCounts.tours} {isEnglish ? "tours" : "visites"}
                    </div>
                  </Link>

                  <Link
                    href="/admin/spaces"
                    className="p-3.5 rounded-2xl bg-calve-stone/40 border border-calve-border text-left hover:bg-calve-stone transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-calve-muted">
                        {isEnglish ? "Offices 17-28 m²" : "Bureaux 17-28 m²"}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-calve-muted/60 group-hover:text-calve-charcoal transition-colors" />
                    </div>
                    <div className="text-base font-extrabold mt-1">
                      {availableOfficesCount} {isEnglish ? "available" : "disponible"}{availableOfficesCount > 1 ? "s" : ""}
                    </div>
                  </Link>

                  <Link
                    href="/admin/tenants"
                    className="p-3.5 rounded-2xl bg-calve-stone/40 border border-calve-border text-left hover:bg-calve-stone transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-calve-muted">
                        {isEnglish ? "Residents" : "Résidents"}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-calve-muted/60 group-hover:text-calve-charcoal transition-colors" />
                    </div>
                    <div className="text-base font-extrabold mt-1">
                      {tenants.length} {isEnglish ? (tenants.length > 1 ? "companies" : "company") : (tenants.length > 1 ? "sociétés" : "société")}
                    </div>
                  </Link>

                  <Link
                    href="/admin/cms"
                    className="p-3.5 rounded-2xl bg-calve-stone/40 border border-calve-border text-left hover:bg-calve-stone transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-calve-muted">
                        {isEnglish ? "Homepage CMS" : "Éditeur Accueil"}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-calve-muted/60 group-hover:text-calve-charcoal transition-colors" />
                    </div>
                    <div className="text-base font-extrabold mt-1">
                      {isEnglish ? "Live Editor" : "Visuel Direct"}
                    </div>
                  </Link>

                  <Link
                    href="/admin/media"
                    className="p-3.5 rounded-2xl bg-calve-stone/40 border border-calve-border text-left hover:bg-calve-stone transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-calve-muted">
                        {isEnglish ? "Media Library" : "Médiathèque"}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-calve-muted/60 group-hover:text-calve-charcoal transition-colors" />
                    </div>
                    <div className="text-base font-extrabold mt-1">
                      {isEnglish ? "4K Assets" : "Photos 4K"}
                    </div>
                  </Link>
                </div>
              </div>

            <div className="pt-4 mt-4 border-t border-calve-border/60">
              <div className="flex items-center justify-between text-xs text-calve-muted">
                <span>{t("dashboard.shortcuts.cloud")}</span>
                <span className="font-mono text-emerald-800 font-semibold">{t("dashboard.shortcuts.cloud_status")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* 3. EXECUTIVE CRM LEADS DATA TABLE                          */}
        {/* ========================================================== */}
        <div className="rounded-3xl bg-white border border-calve-border/80 shadow-xs overflow-hidden">
          {/* Table Header Strip with Search & Filters */}
          <div className="p-5 sm:p-6 border-b border-calve-border/80 bg-slate-50/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base sm:text-lg font-extrabold text-calve-charcoal">
                  {t("dashboard.table.title")}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-calve-slate text-white text-xs font-bold font-mono">
                  {leads.length}
                </span>
              </div>
              <p className="text-xs text-calve-muted mt-0.5">{t("dashboard.table.subtitle")}</p>
            </div>

            {/* Search Input & Status Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Live Search */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-calve-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="dashboard-search-leads"
                  name="dashboardSearchLeads"
                  aria-label={t("dashboard.table.search_placeholder")}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("dashboard.table.search_placeholder")}
                  className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-white border border-calve-border text-xs font-medium text-calve-charcoal placeholder:text-calve-muted focus:border-calve-slate focus:outline-none transition-colors"
                />
              </div>

              {/* Status Select */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-calve-border text-xs">
                <Filter className="w-3.5 h-3.5 text-calve-muted shrink-0" />
                <select
                  id="dashboard-status-filter"
                  name="dashboardStatusFilter"
                  aria-label={t("dashboard.filter.all_statuses")}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-semibold text-calve-charcoal focus:outline-none cursor-pointer"
                >
                  <option value="all">{t("dashboard.filter.all_statuses")}</option>
                  <option value="new">{isEnglish ? "New Arrival" : "Nouvel arrivant"}</option>
                  <option value="tour_scheduled">{isEnglish ? "Tour Scheduled" : "Visite programmée"}</option>
                  <option value="visited">{isEnglish ? "Tour Completed" : "Visite effectuée"}</option>
                  <option value="negotiating">{isEnglish ? "In Negotiation" : "En négociation"}</option>
                  <option value="won">{isEnglish ? "Contract Signed" : "Contrat signé"}</option>
                  <option value="closed">{isEnglish ? "Closed / Cancelled" : "Sans suite / Annulé"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs Strip */}
          <div className="px-5 py-3 border-b border-calve-border/60 bg-white flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "all"
                  ? "bg-calve-slate text-white shadow-2xs"
                  : "bg-slate-50 text-calve-muted hover:text-calve-charcoal border border-calve-border/60"
              }`}
            >
              {t("dashboard.tab.all")} ({tabCounts.all})
            </button>

            <button
              onClick={() => setActiveTab("tours")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "tours"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {t("dashboard.tab.tours")} ({tabCounts.tours})
              </span>
            </button>

            <button
              onClick={() => setActiveTab("offices")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "offices"
                  ? "bg-calve-slate text-white shadow-2xs"
                  : "bg-slate-50 text-calve-muted hover:text-calve-charcoal border border-calve-border/60"
              }`}
            >
              {t("dashboard.tab.offices")} ({tabCounts.offices})
            </button>

            <button
              onClick={() => setActiveTab("open-space")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "open-space"
                  ? "bg-calve-slate text-white shadow-2xs"
                  : "bg-slate-50 text-calve-muted hover:text-calve-charcoal border border-calve-border/60"
              }`}
            >
              {t("dashboard.tab.open_space")} ({tabCounts.openSpace})
            </button>

            <button
              onClick={() => setActiveTab("meeting")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "meeting"
                  ? "bg-calve-slate text-white shadow-2xs"
                  : "bg-slate-50 text-calve-muted hover:text-calve-charcoal border border-calve-border/60"
              }`}
            >
              {t("dashboard.tab.meeting")} ({tabCounts.meeting})
            </button>

            <button
              onClick={() => setActiveTab("won")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "won"
                  ? "bg-teal-700 text-white shadow-2xs"
                  : "bg-teal-50/60 text-teal-900 hover:bg-teal-100 border border-teal-200"
              }`}
            >
              {t("dashboard.tab.won")} ({tabCounts.won})
            </button>
          </div>

          {/* Desktop Table Column Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/80 border-b border-calve-border/70 text-[11px] font-extrabold uppercase tracking-wider text-calve-muted">
            <div className="col-span-4">{t("dashboard.table.col_prospect")}</div>
            <div className="col-span-3">{t("dashboard.table.col_space")}</div>
            <div className="col-span-2">{t("dashboard.table.col_source")}</div>
            <div className="col-span-2">{t("dashboard.table.col_status")}</div>
            <div className="col-span-1 text-right">{t("dashboard.table.col_actions")}</div>
          </div>

          {/* Leads Rows */}
          {filteredLeads.length === 0 ? (
            <div className="p-14 text-center text-calve-muted space-y-2">
              <AlertCircle className="w-8 h-8 text-calve-muted/50 mx-auto" />
              <p className="font-semibold text-sm">{t("dashboard.empty")}</p>
            </div>
          ) : (
            <div className="divide-y divide-calve-border/60">
              {filteredLeads.map((lead) => {
                const isExpanded = expandedLeadId === lead.id;
                const isMenuOpen = openStatusMenuId === lead.id;
                const statusBadge = getStatusBadgeConfig(lead.status, isEnglish);
                const financials = getLeadFinancials(lead, isEnglish);
                const isTour =
                  lead.visitRequested ||
                  lead.source.toLowerCase().includes("tour") ||
                  lead.source.toLowerCase().includes("visit");

                return (
                  <div
                    key={lead.id}
                    className={`transition-colors ${
                      lead.status === "new" ? "bg-amber-50/15 hover:bg-amber-50/30" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="p-4 sm:p-5 lg:px-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        {/* Col 1 (4 cols): Prospect Identity */}
                        <div className="lg:col-span-4 flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-calve-slate/10 text-calve-slate font-extrabold text-sm flex items-center justify-center shrink-0 border border-calve-slate/20">
                            {lead.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-sm text-calve-charcoal hover:text-calve-slate transition-colors">
                                {lead.name}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono text-slate-500">
                                {lead.id}
                              </span>
                            </div>

                            {lead.company && (
                              <div className="text-xs font-semibold text-calve-slate/80 truncate mt-0.5">
                                {lead.company}
                              </div>
                            )}

                            {/* Contact icons strip */}
                            <div className="flex items-center gap-3 text-xs text-calve-muted mt-1.5 flex-wrap">
                              <a
                                href={`mailto:${lead.email}`}
                                className="flex items-center gap-1 hover:text-calve-slate hover:underline"
                              >
                                <Mail className="w-3.5 h-3.5 text-calve-muted/80" />
                                <span className="truncate max-w-[170px]">{lead.email}</span>
                              </a>
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex items-center gap-1 hover:text-calve-slate hover:underline font-mono"
                              >
                                <Phone className="w-3.5 h-3.5 text-calve-muted/80" />
                                <span>{lead.phone}</span>
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Col 2 (3 cols): Space & Estimated Rate */}
                        <div className="lg:col-span-3">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-calve-stone/60 border border-calve-border/80 font-semibold text-xs text-calve-slate">
                            {lead.type === "private-office" ? (
                              <span>🏢 {financials.label}</span>
                            ) : lead.type === "open-space" ? (
                              <span>🌿 {financials.label}</span>
                            ) : (
                              <span>🎤 {financials.label}</span>
                            )}
                          </div>
                          <div className="text-xs font-extrabold text-calve-charcoal mt-1 flex items-center gap-1.5">
                            <span className="text-[11px] text-calve-muted font-medium">
                              {isEnglish ? "Est. budget:" : "Budget est. :"}
                            </span>
                            <span>{financials.rate}</span>
                          </div>
                        </div>

                        {/* Col 3 (2 cols): Source & Scheduled Date */}
                        <div className="lg:col-span-2 space-y-1">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold ${
                              isTour
                                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {isTour ? (
                              <Calendar className="w-3 h-3 text-emerald-700" />
                            ) : (
                              <MapPin className="w-3 h-3 text-slate-500" />
                            )}
                            <span className="truncate max-w-[140px]">{lead.source}</span>
                          </div>

                          {lead.date ? (
                            <div className="text-[11px] font-semibold text-calve-charcoal flex items-center gap-1">
                              <Clock className="w-3 h-3 text-calve-muted" />
                              <span>{lead.date}</span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-calve-muted">
                              {new Date(lead.createdAt).toLocaleDateString(isEnglish ? "en-US" : "fr-FR", {
                                day: "numeric",
                                month: "short"
                              })}
                            </div>
                          )}
                        </div>

                        {/* Col 4 (2 cols): Custom Pipeline Status Dropdown */}
                        <div className="lg:col-span-2 relative">
                          <button
                            type="button"
                            onClick={() => setOpenStatusMenuId(isMenuOpen ? null : lead.id)}
                            className={`w-full sm:w-auto inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer ${statusBadge.bg} ${statusBadge.border} ${statusBadge.text}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                              <span>{statusBadge.label}</span>
                            </div>
                            <ChevronDown
                              className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                                isMenuOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {/* Floating Luxury Status Popover */}
                          {isMenuOpen && (
                            <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-56 bg-white rounded-2xl border border-calve-border/80 shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95">
                              <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-calve-muted border-b border-calve-border/40 mb-1">
                                {isEnglish ? "Move Pipeline Stage" : "Changer d'étape"}
                              </div>
                              <div className="space-y-0.5">
                                {STATUS_STAGES.map((st) => {
                                  const isSelected = lead.status === st.id;
                                  return (
                                    <button
                                      key={st.id}
                                      onClick={() => handleStatusChange(lead.id, st.id)}
                                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                                        isSelected
                                          ? "bg-calve-slate text-white"
                                          : "hover:bg-slate-100 text-calve-charcoal"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : st.dot}`} />
                                        <span>{isEnglish ? st.labelEn : st.labelFr}</span>
                                      </div>
                                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Col 5 (1 col): Actions & Accordion Toggle */}
                        <div className="lg:col-span-1 flex items-center justify-end gap-2">
                          <button
                            onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-calve-stone text-xs font-bold text-calve-slate transition-colors cursor-pointer"
                          >
                            <span>{t("dashboard.table.details")}</span>
                            {lead.notes && lead.notes.length > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full bg-calve-slate text-white text-[10px] font-mono">
                                {lead.notes.length}
                              </span>
                            )}
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail Accordion Drawer */}
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 bg-slate-50/70 border-t border-calve-border/60 space-y-4 animate-in fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                          {/* Left (6 cols): Message & Lead Specifications */}
                          <div className="lg:col-span-6 space-y-3">
                            {lead.message ? (
                              <div className="p-4 rounded-2xl bg-white border border-calve-border text-xs text-calve-charcoal leading-relaxed shadow-2xs overflow-hidden min-w-0">
                                <span className="font-extrabold text-calve-slate block mb-1.5">
                                  {t("dashboard.lead.message_title")}
                                </span>
                                <p className="italic text-slate-700 break-words [overflow-wrap:anywhere] whitespace-pre-wrap leading-relaxed select-text">
                                  &quot;{lead.message}&quot;
                                </p>
                              </div>
                            ) : (
                              <div className="p-4 rounded-2xl bg-white border border-calve-border text-xs text-calve-muted italic shadow-2xs">
                                {isEnglish ? "No initial message provided by contact." : "Aucun message initial transmis."}
                              </div>
                            )}

                            {/* Quick metadata details */}
                            <div className="p-4 rounded-2xl bg-white border border-calve-border text-xs space-y-2 shadow-2xs">
                              <span className="font-extrabold text-calve-slate block">
                                {isEnglish ? "Specification Summary" : "Récapitulatif de la Demande"}
                              </span>
                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                  <span className="text-calve-muted block">
                                    {isEnglish ? "Space:" : "Espace :"}
                                  </span>
                                  <span className="font-bold text-calve-charcoal">{financials.label}</span>
                                </div>
                                <div>
                                  <span className="text-calve-muted block">
                                    {isEnglish ? "Indicative rate:" : "Tarif indicatif :"}
                                  </span>
                                  <span className="font-bold text-calve-charcoal">{financials.rate}</span>
                                </div>
                                {lead.workstationCount && (
                                  <div>
                                    <span className="text-calve-muted block">
                                      {isEnglish ? "Desired workstations:" : "Postes souhaités :"}
                                    </span>
                                    <span className="font-bold text-calve-charcoal">
                                      {lead.workstationCount} {isEnglish ? "people" : "personnes"}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-calve-muted block">
                                    {isEnglish ? "Inbound channel:" : "Canal d'entrée :"}
                                  </span>
                                  <span className="font-bold text-calve-charcoal">{lead.source}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right (6 cols): Internal Follow-up Notes Timeline */}
                          <div className="lg:col-span-6 space-y-2">
                            <span className="text-xs font-bold text-calve-slate flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{t("dashboard.lead.notes_title")}</span>
                            </span>

                            {lead.notes && lead.notes.length > 0 ? (
                              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                {lead.notes.map((note) => (
                                  <div
                                    key={note.id}
                                    className="p-3 rounded-xl bg-white border border-calve-border/60 text-xs flex justify-between items-start shadow-2xs"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <span className="font-bold text-calve-charcoal">{note.author} :</span>{" "}
                                      <span className="text-calve-charcoal/90 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">{note.text}</span>
                                    </div>
                                    <span className="text-[10px] text-calve-muted shrink-0 ml-2 font-mono">
                                      {new Date(note.createdAt).toLocaleDateString(isEnglish ? "en-US" : "fr-FR", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-calve-muted italic bg-white p-3 rounded-xl border border-calve-border/60">
                                {t("dashboard.lead.no_notes")}
                              </p>
                            )}

                            {/* Note Input */}
                            <div className="flex gap-2 pt-1">
                              <input
                                id={`lead-note-${lead.id}`}
                                name={`leadNote_${lead.id}`}
                                aria-label={t("dashboard.lead.note_placeholder")}
                                type="text"
                                value={noteInputs[lead.id] || ""}
                                onChange={(e) =>
                                  setNoteInputs((prev) => ({ ...prev, [lead.id]: e.target.value }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleAddNote(lead.id);
                                }}
                                placeholder={t("dashboard.lead.note_placeholder")}
                                className="flex-1 px-3 py-2 rounded-xl bg-white border border-calve-border text-xs focus:border-calve-slate focus:outline-none"
                              />
                              <button
                                onClick={() => handleAddNote(lead.id)}
                                className="px-4 py-2 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                              >
                                {t("dashboard.lead.save_note")}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Footer Strip with Quick Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-calve-border/40 text-xs">
                          <span className="text-calve-muted text-[11px]">
                            {t("dashboard.lead.received_on")}{" "}
                            {new Date(lead.createdAt).toLocaleString(isEnglish ? "en-US" : "fr-FR")}
                          </span>

                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${lead.phone}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-calve-border text-xs font-bold text-calve-charcoal hover:border-calve-slate transition-colors shadow-2xs"
                            >
                              <Phone className="w-3.5 h-3.5 text-calve-slate" />
                              <span>{t("dashboard.table.call")}</span>
                            </a>

                            <a
                              href={`mailto:${lead.email}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-calve-border text-xs font-bold text-calve-charcoal hover:border-calve-slate transition-colors shadow-2xs"
                            >
                              <Mail className="w-3.5 h-3.5 text-calve-slate" />
                              <span>{t("dashboard.table.email")}</span>
                            </a>

                            <Link
                              href="/admin/pipeline"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors shadow-2xs"
                            >
                              <Kanban className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{t("dashboard.table.view_kanban")}</span>
                            </Link>

                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-bold cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{t("dashboard.lead.delete")}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Won Lead Toast with Quick Links */}
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

            <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
              <Link
                href="/admin/tenants"
                className="flex-1 text-center px-2.5 py-1.5 rounded-lg bg-calve-gold hover:bg-[#b89155] text-calve-charcoal text-[11px] font-bold transition-all shadow-xs"
              >
                {isEnglish ? "View Residents →" : "Voir Résidents →"}
              </Link>
              <Link
                href="/admin/spaces"
                className="flex-1 text-center px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold transition-all"
              >
                {isEnglish ? "View Spaces →" : "Voir Espaces →"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
