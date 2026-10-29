"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  Building2,
  Users,
  FileEdit,
  FolderOpen,
  Settings,
  Search,
  Bell,
  RefreshCw,
  Plus,
  ExternalLink,
  LogOut,
  ShieldCheck,
  X,
  Menu,
  CheckCircle2,
  Clock,
  Globe
} from "lucide-react";
import { Lead, LeadPriority } from "@/lib/leads";
import { useLanguage } from "@/lib/languageContext";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  fullWidth?: boolean;
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
  headerAction?: React.ReactNode;
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  fullWidth = false,
  onSearch,
  onRefresh,
  headerAction
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { language, setLanguage, t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "12m">("30d");
  const [searchVal, setSearchVal] = useState("");
  const [leadsCount, setLeadsCount] = useState<number>(7);
  const [toursCount, setToursCount] = useState<number>(6);
  const [refreshing, setRefreshing] = useState(false);

  // New Lead Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "private-office" as "private-office" | "open-space" | "meeting-room",
    officeSize: "25 m² (5-6 postes)",
    date: "",
    timeSlot: "morning",
    source: "Book a Private Tour (Admin)",
    priority: "high" as LeadPriority,
    message: "",
    initialNote: ""
  });

  // Fetch count stats
  const fetchCounts = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.success && data.leads) {
        setLeadsCount(data.leads.length);
        const tours = data.leads.filter(
          (l: Lead) => l.visitRequested || l.source.toLowerCase().includes("tour") || l.source.toLowerCase().includes("visit")
        ).length;
        setToursCount(tours);
      }
    } catch (err) {
      console.error("Error fetching admin counts:", err);
    } finally {
      setRefreshing(false);
      if (onRefresh) onRefresh();
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      localStorage.removeItem("mc_admin_logged");
      localStorage.removeItem("mc_admin_user");
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    if (onSearch) onSearch(val);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modalForm)
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setModalForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          type: "private-office",
          officeSize: "25 m² (5-6 postes)",
          date: "",
          timeSlot: "morning",
          source: "Book a Private Tour (Admin)",
          priority: "high",
          message: "",
          initialNote: ""
        });
        fetchCounts();
      }
    } catch (err) {
      console.error("Error submitting lead:", err);
    }
  };

  interface NavItem {
    label: string;
    href: string;
    icon: any;
    badge?: number;
    badgeColor?: string;
    detail?: string;
  }

  interface NavGroup {
    group: string;
    items: NavItem[];
  }

  // Nav Items definition
  const navItems: NavGroup[] = [
    {
      group: t("nav.overview"),
      items: [
        { label: t("nav.dashboard"), href: "/admin", icon: LayoutDashboard }
      ]
    },
    {
      group: t("nav.crm"),
      items: [
        { label: t("nav.pipeline"), href: "/admin/pipeline", icon: Kanban, badge: leadsCount },
        { label: t("nav.spaces"), href: "/admin/spaces", icon: Building2, detail: t("nav.spaces.avail") },
        { label: t("nav.tenants"), href: "/admin/tenants", icon: Users, detail: t("nav.tenants.active") }
      ]
    },
    {
      group: t("nav.content"),
      items: [
        { label: t("nav.cms"), href: "/admin/cms", icon: FileEdit },
        { label: t("nav.media"), href: "/admin/media", icon: FolderOpen }
      ]
    },
    {
      group: t("nav.system"),
      items: [
        { label: t("nav.seo"), href: "/admin/settings?tab=seo", icon: Globe },
        { label: t("nav.settings"), href: "/admin/settings", icon: Settings }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-calve-charcoal font-sans selection:bg-calve-slate selection:text-white">
      {/* ========================================================== */}
      {/* 1. PERSISTENT LEFT SIDEBAR                                 */}
      {/* ========================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-calve-border/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-calve-border/60 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-calve-slate text-white flex items-center justify-center font-bold text-sm shadow-xs">
                MC
              </div>
              <div>
                <div className="font-extrabold text-sm tracking-tight text-calve-charcoal leading-tight">
                  MAISON CALVÉ
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                  ADMIN OS
                </div>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-calve-stone text-calve-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navItems.map((group, gIdx) => (
              <div key={gIdx}>
                <div className="px-3 mb-1.5 text-[10px] font-bold tracking-widest uppercase text-calve-muted">
                  {group.group}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href.includes("?") && pathname === item.href.split("?")[0]);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-calve-slate text-white shadow-xs font-bold"
                            : "text-calve-charcoal hover:bg-calve-stone/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-calve-slate"}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : item.badgeColor || "bg-calve-stone text-calve-slate"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.detail && !item.badge && (
                          <span className={`text-[10px] ${isActive ? "text-white/80" : "text-calve-muted"}`}>
                            {item.detail}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom User & Live Site Link */}
        <div className="p-4 border-t border-calve-border/60 bg-calve-cream/30 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-calve-border/70 hover:border-calve-slate text-xs font-medium text-calve-charcoal transition-all shadow-2xs"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-calve-slate" />
              <span>{t("nav.view_site")}</span>
            </span>
            <span className="text-[10px] text-calve-muted font-mono">maisoncalve.fr ↗</span>
          </Link>

          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-calve-slate text-white text-xs font-bold flex items-center justify-center">
                P
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-calve-charcoal leading-none">
                  {t("nav.admin_user")}
                </div>
                <div className="text-[10px] text-calve-muted mt-0.5 font-mono">
                  admin@maisoncalve.fr
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title={t("tooltip.logout")}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-calve-muted hover:text-rose-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-calve-charcoal/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ========================================================== */}
      {/* 2. MAIN ADMIN CONTENT CONTAINER                            */}
      {/* ========================================================== */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Floating App Bar */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-calve-border/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-calve-stone text-calve-charcoal"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Input with ⌘K Badge */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-calve-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchVal}
                onChange={handleSearchChange}
                placeholder={t("search.placeholder")}
                className="w-full pl-9 pr-12 py-2 rounded-xl bg-slate-100/90 border border-transparent focus:border-calve-slate focus:bg-white text-xs text-calve-charcoal transition-all placeholder:text-calve-muted/70"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none px-1.5 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-mono text-slate-400 font-bold shadow-2xs">
                ⌘K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Refresh Button */}
            <button
              onClick={fetchCounts}
              disabled={refreshing}
              title={t("tooltip.refresh")}
              className="p-2 rounded-xl hover:bg-calve-stone text-calve-slate transition-colors cursor-pointer border border-calve-border/60 bg-white shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 text-[11px] font-bold border border-slate-200/60">
              <button
                onClick={() => setLanguage("fr")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  language === "fr" ? "bg-white text-calve-charcoal shadow-2xs" : "text-calve-muted hover:text-calve-charcoal"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  language === "en" ? "bg-white text-calve-charcoal shadow-2xs" : "text-calve-muted hover:text-calve-charcoal"
                }`}
              >
                EN
              </button>
            </div>

            {/* + New Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t("btn.new")}</span>
            </button>

            {/* Notification Bell */}
            <button
              title={t("tooltip.notifications")}
              className="p-2 rounded-xl text-slate-500 hover:text-calve-charcoal hover:bg-slate-100 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>

            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              title={t("tooltip.logout")}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dashboard Main Scrollable Body */}
        <main className={`w-full min-w-0 ${fullWidth ? "p-4 sm:p-6 lg:p-7 space-y-4 max-w-none" : "p-4 sm:p-8 space-y-6 max-w-7xl mx-auto"}`}>
          {title && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 flex items-center gap-2 mb-1">
                  <span>MAISON CALVÉ SAAS OS</span>
                  <span>•</span>
                  <span className="text-emerald-700">FONDAUDÈGE TERMINAL</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-calve-charcoal tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-calve-muted mt-1">
                    {subtitle}
                  </p>
                )}
              </div>

              {headerAction && (
                <div className="flex items-center gap-2 shrink-0">
                  {headerAction}
                </div>
              )}
            </div>
          )}

          {children}
        </main>
      </div>

      {/* ========================================================== */}
      {/* 3. GLOBAL MODAL: CREATE LEAD / TOUR BOOKING                */}
      {/* ========================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-calve-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-calve-border space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-calve-border pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-calve-charcoal">
                  {t("modal.title")}
                </h3>
                <p className="text-xs text-calve-muted">
                  {t("modal.subtitle")}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full hover:bg-calve-stone text-calve-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                  {t("modal.field.name")}
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  placeholder="Jean Dupont"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs focus:border-calve-slate"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                    {t("modal.field.email")}
                  </label>
                  <input
                    type="email"
                    required
                    value={modalForm.email}
                    onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })}
                    placeholder="contact@entreprise.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs focus:border-calve-slate"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                    {t("modal.field.phone")}
                  </label>
                  <input
                    type="tel"
                    required
                    value={modalForm.phone}
                    onChange={(e) => setModalForm({ ...modalForm, phone: e.target.value })}
                    placeholder="06 12 34 56 78"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs focus:border-calve-slate"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                  {t("modal.field.company")}
                </label>
                <input
                  type="text"
                  value={modalForm.company}
                  onChange={(e) => setModalForm({ ...modalForm, company: e.target.value })}
                  placeholder="Cabinet / Société"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs focus:border-calve-slate"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                    {t("modal.field.type")}
                  </label>
                  <select
                    value={modalForm.type}
                    onChange={(e: any) => setModalForm({ ...modalForm, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs focus:border-calve-slate font-medium"
                  >
                    <option value="private-office">Bureau Privatif (17 ou 25m²)</option>
                    <option value="open-space">Open Space (Fixe ou Nomade)</option>
                    <option value="meeting-room">Salle de Réunion 30 m²</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                    Source
                  </label>
                  <select
                    value={modalForm.source}
                    onChange={(e) => setModalForm({ ...modalForm, source: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs focus:border-calve-slate font-medium"
                  >
                    <option value="Book a Private Tour (Admin)">Book a Private Tour</option>
                    <option value="Book a Visit (Admin)">Book a Visit</option>
                    <option value="Appel téléphonique direct">Appel téléphonique direct</option>
                    <option value="Recommandation / Partenaire">Recommandation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                  {t("modal.field.date")}
                </label>
                <input
                  type="date"
                  value={modalForm.date}
                  onChange={(e) => setModalForm({ ...modalForm, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-calve-border text-xs focus:border-calve-slate"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                  {t("modal.field.note")}
                </label>
                <textarea
                  rows={2}
                  value={modalForm.initialNote}
                  onChange={(e) => setModalForm({ ...modalForm, initialNote: e.target.value })}
                  placeholder="Ex: Intéressé par le bureau 25m², visite fixée ce vendredi..."
                  className="w-full px-3.5 py-2 rounded-xl border border-calve-border text-xs focus:border-calve-slate"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-calve-border text-xs font-semibold text-calve-charcoal hover:bg-calve-stone cursor-pointer"
                >
                  {t("modal.btn.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
                >
                  {t("modal.btn.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
