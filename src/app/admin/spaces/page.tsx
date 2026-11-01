"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useLanguage } from "@/lib/languageContext";
import { SpaceInventoryRecord } from "@/lib/inventorySync";
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  Car,
  Wifi,
  Coffee,
  Edit,
  Eye,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  Trash2,
  Plus,
  X,
  Save
} from "lucide-react";

export default function SpacesInventoryPage() {
  const { language, t, isEnglish } = useLanguage();
  const [spaces, setSpaces] = useState<SpaceInventoryRecord[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Edit space modal state
  const [editingSpace, setEditingSpace] = useState<SpaceInventoryRecord | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "private" as "private" | "open" | "meeting" | "parking",
    area: "",
    capacity: "",
    price: "",
    period: "par mois",
    status: "available" as "available" | "limited" | "occupied",
    statusText: ""
  });

  // Create space modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    id: "",
    name: "",
    category: "private" as "private" | "open" | "meeting" | "parking",
    area: "",
    capacity: "",
    price: "",
    period: "par mois",
    status: "available" as "available" | "limited" | "occupied",
    statusText: "Disponible immédiatement",
    image: "/images/spaces/bureau-privatif-21m.png"
  });

  const fetchSpaces = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/spaces");
      const data = await res.json();
      if (data.success) {
        setSpaces(data.spaces || []);
        setMetrics(data.metrics || null);
      }
    } catch (err) {
      console.error("Error loading spaces:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  // Quick toggle status and save directly to Database
  const toggleStatus = async (id: string) => {
    const space = spaces.find((s) => s.id === id);
    if (!space) return;

    const nextStatus = space.status === "available" ? "occupied" : "available";
    const nextText =
      nextStatus === "available"
        ? (isEnglish ? "Available immediately" : "Disponible immédiatement")
        : (isEnglish ? "Occupied / Manually reserved" : "Occupé / Réservé manuellement");

    // Optimistic UI update
    setSpaces((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: nextStatus, statusText: nextText } : s))
    );

    try {
      await fetch("/api/admin/spaces", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus, statusText: nextText })
      });
    } catch (err) {
      console.error("Error toggling space status in DB:", err);
      fetchSpaces();
    }
  };

  // Open Edit Modal
  const openEditModal = (space: SpaceInventoryRecord) => {
    setEditingSpace(space);
    setEditForm({
      name: space.name,
      category: space.category,
      area: space.area,
      capacity: space.capacity,
      price: space.price,
      period: space.period,
      status: space.status,
      statusText: space.statusText
    });
  };

  // Submit Edit to Database
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpace) return;

    try {
      const res = await fetch("/api/admin/spaces", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSpace.id,
          ...editForm
        })
      });

      const data = await res.json();
      if (data.success) {
        setSpaces((prev) =>
          prev.map((s) => (s.id === editingSpace.id ? { ...s, ...editForm } : s))
        );
        setEditingSpace(null);
      }
    } catch (err) {
      console.error("Error updating space:", err);
    }
  };

  // Delete space from Database
  const handleDeleteSpace = async (id: string, name: string) => {
    const confirmMsg = isEnglish
      ? `Confirm deletion of "${name}" from inventory and database?`
      : `Confirmer la suppression de "${name}" de l'inventaire et de la base de données ?`;
    if (!confirm(confirmMsg)) return;

    setSpaces((prev) => prev.filter((s) => s.id !== id));

    try {
      await fetch(`/api/admin/spaces?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("Error deleting space:", err);
      fetchSpaces();
    }
  };

  // Submit Create new Space to Database
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name) return;

    const newId = createForm.id || `space-${Date.now()}`;
    const newSpacePayload = {
      ...createForm,
      id: newId,
      parkingIncluded: createForm.category === "private" || createForm.category === "meeting",
      features: [
        "Ameublement haut de gamme",
        "Accès sécurisé par badge RFID",
        "Fibre optique ultra haut débit",
        "Accès illimité cuisine équipée"
      ],
      activeBookings: []
    };

    try {
      const res = await fetch("/api/admin/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSpacePayload)
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateOpen(false);
        fetchSpaces();
        setCreateForm({
          id: "",
          name: "",
          category: "private",
          area: "",
          capacity: "",
          price: "",
          period: "par mois",
          status: "available",
          statusText: "Disponible immédiatement",
          image: "/images/spaces/bureau-privatif-21m.png"
        });
      }
    } catch (err) {
      console.error("Error creating space:", err);
    }
  };

  return (
    <AdminLayout
      title={isEnglish ? "Spaces & Offices Inventory" : "Inventaire des Espaces & Bureaux"}
      subtitle={
        isEnglish
          ? "Live real-time occupancy, automated booking sync with CRM won deals, and lease tracking."
          : "Disponibilité en temps réel, synchronisation automatique des réservations et suivi des baux."
      }
    >
      {/* Executive Quick Actions & Real-Time Sync Bar */}
      <div className="bg-white border border-calve-border/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info & Live Sync Status */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-calve-stone/80 border border-calve-border/70 flex items-center justify-center text-calve-slate shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-calve-charcoal flex items-center gap-2 flex-wrap">
              <span>{isEnglish ? "Automated Space Booking System" : "Attribution Automatisée des Espaces"}</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isEnglish ? "Live Synced" : "Synchro Directe"}
              </span>
            </div>
            <p className="text-xs text-calve-muted mt-0.5 leading-relaxed">
              {isEnglish
                ? "When an opportunity is marked as 'Won' in the CRM, its requested space immediately locks as Booked / Occupied."
                : "Dès qu'un prospect passe en statut 'Gagné' dans le CRM, son espace est instantanément verrouillé comme Réservé / Occupé."}
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
            <span>{isEnglish ? "New Space" : "Nouvel Espace"}</span>
          </button>
          <button
            onClick={fetchSpaces}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-calve-stone/60 border border-calve-border/80 text-xs font-semibold text-calve-slate transition-all shadow-2xs cursor-pointer disabled:opacity-50 active:scale-95"
            title={isEnglish ? "Refresh database" : "Actualiser la base"}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isEnglish ? "Refresh" : "Actualiser"}</span>
          </button>
          <Link
            href="/admin/tenants"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-calve-stone/60 border border-calve-border/80 text-xs font-semibold text-calve-charcoal transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <span>{isEnglish ? "View Tenants" : "Voir Résidents"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-calve-muted" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Private Offices */}
        <div className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Private Offices" : "Bureaux Privatifs"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {metrics?.availablePrivateOffices ?? 2} {isEnglish ? "available out of" : "dispos sur"}{" "}
            {metrics?.totalPrivateOffices ?? 5}
          </div>
          <p className="text-xs text-calve-muted">
            21 m² (750 € HT) · 28 m² (1 200 € HT) · Suite Partenaire
          </p>
        </div>

        {/* KPI 2: Open Space Desks */}
        <div className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Open Space Desks" : "Postes Open Space"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {metrics?.occupiedDesks ?? 5} / {metrics?.totalDesks ?? 10} {isEnglish ? "desks occupied" : "postes occupés"}
          </div>
          <p className="text-xs text-emerald-700 font-medium">
            {isEnglish ? "Fixed dedicated desks with secure pedestal" : "Postes dédiés avec caissons sécurisés"}
          </p>
        </div>

        {/* KPI 3: Parking Bays */}
        <div className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Courtyard & Parking" : "Cour Privée & Stationnement"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {metrics?.assignedParkingBays ?? 2} / {metrics?.totalParkingBays ?? 9} {isEnglish ? "bays assigned" : "places attribuées"}
          </div>
          <p className="text-xs text-calve-muted">
            {isEnglish ? "Automated motorized gate with RFID keycard" : "Portail motorisé automatique avec badge RFID"}
          </p>
        </div>
      </div>

      {/* Spaces Grid */}
      {loading ? (
        <div className="p-12 text-center text-sm text-calve-muted">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-calve-slate" />
          <span>{isEnglish ? "Loading inventory records..." : "Chargement des espaces en direct..."}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space, idx) => {
            const isAvailable = space.status === "available";
            const isOccupied = space.status === "occupied";
            const isLimited = space.status === "limited";

            return (
              <div
                key={space.id}
                className={`rounded-3xl bg-white border transition-all hover:shadow-md overflow-hidden flex flex-col justify-between ${
                  isOccupied
                    ? "border-red-200 bg-red-50/10"
                    : isLimited
                    ? "border-amber-200"
                    : "border-calve-border/80"
                }`}
              >
                <div>
                  {/* Image header with availability pill */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={space.image}
                      alt={space.name}
                      fill
                      priority={idx < 3}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                          isAvailable
                            ? "bg-emerald-600/90 text-white"
                            : isOccupied
                            ? "bg-rose-700/90 text-white"
                            : "bg-amber-600/90 text-white"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>
                          {isAvailable
                            ? isEnglish
                              ? "AVAILABLE"
                              : "DISPONIBLE"
                            : isOccupied
                            ? isEnglish
                              ? "OCCUPIED"
                              : "OCCUPÉ"
                            : isEnglish
                            ? "LIMITED"
                            : "LIMITÉ"}
                        </span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
                        {space.category === "private"
                          ? "Private Executive Suite"
                          : space.category === "open"
                          ? "Coworking Space"
                          : space.category === "meeting"
                          ? "Conference Room"
                          : "Courtyard & Parking"}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-calve-charcoal tracking-tight">
                        {space.name}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-calve-muted mt-1">
                        {space.area && <span>{space.area}</span>}
                        {space.capacity && (
                          <>
                            <span>•</span>
                            <span>{space.capacity}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price Block */}
                    <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-2xl font-extrabold text-calve-charcoal">
                          {space.price}
                        </span>
                        <span className="text-xs text-calve-muted ml-1">
                          {space.period}
                        </span>
                      </div>

                      {space.parkingIncluded && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-calve-slate bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Car className="w-3.5 h-3.5" />
                          <span>Parking bay incl.</span>
                        </span>
                      )}
                    </div>

                    {/* Occupant / Status Message */}
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold ${
                        isAvailable
                          ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                          : isOccupied
                          ? "bg-rose-50 text-rose-900 border border-rose-200"
                          : "bg-amber-50 text-amber-900 border border-amber-200"
                      }`}
                    >
                      <span className="block font-bold">
                        {isAvailable
                          ? isEnglish
                            ? "Availability: "
                            : "Disponibilité : "
                          : isOccupied
                          ? isEnglish
                            ? "Occupant / Booking: "
                            : "Réservation : "
                          : isEnglish
                          ? "Limited: "
                          : "Disponibilité limitée : "}
                      </span>
                      <span className="text-[11px] font-normal mt-0.5 block">
                        {space.currentTenant
                          ? `${space.currentTenant.company} (${space.currentTenant.name})`
                          : space.statusText}
                      </span>
                    </div>

                    {/* Features Checklist */}
                    <ul className="space-y-1.5 text-xs text-calve-charcoal/80">
                      {space.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Space Card Bottom Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleStatus(space.id)}
                      className="text-xs font-bold text-calve-slate hover:text-calve-slate-dark hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isEnglish ? "Toggle status" : "Basculer statut"}</span>
                    </button>
                    <button
                      onClick={() => openEditModal(space)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{isEnglish ? "Edit" : "Modifier"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteSpace(space.id, space.name)}
                      title="Supprimer de la base de données"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`/#espaces`}
                      target="_blank"
                      className="text-xs font-semibold text-calve-muted hover:text-calve-charcoal flex items-center gap-1"
                    >
                      <span>{isEnglish ? "View on site" : "Voir"}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: EDIT SPACE                                       */}
      {/* ========================================================= */}
      {editingSpace && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-calve-charcoal">
                  {isEnglish ? "Edit Space Details" : "Modifier l'Espace"}
                </h3>
                <p className="text-xs text-calve-muted mt-0.5">{editingSpace.id}</p>
              </div>
              <button
                onClick={() => setEditingSpace(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  {isEnglish ? "Space Name" : "Nom de l'espace"}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Rate (€ excl. VAT)" : "Tarif (€ HT)"}
                  </label>
                  <input
                    type="text"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Billing Period" : "Période"}
                  </label>
                  <input
                    type="text"
                    value={editForm.period}
                    onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Floor Area" : "Superficie"}
                  </label>
                  <input
                    type="text"
                    value={editForm.area}
                    onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Capacity" : "Capacité"}
                  </label>
                  <input
                    type="text"
                    value={editForm.capacity}
                    onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Availability Status" : "Statut de Disponibilité"}
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as "available" | "limited" | "occupied"
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                  >
                    <option value="available">{isEnglish ? "Available" : "Disponible"}</option>
                    <option value="limited">{isEnglish ? "Limited" : "Limité"}</option>
                    <option value="occupied">{isEnglish ? "Occupied" : "Occupé"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Display Badge Text" : "Texte affiché"}
                  </label>
                  <input
                    type="text"
                    value={editForm.statusText}
                    onChange={(e) => setEditForm({ ...editForm, statusText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSpace(null)}
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
      {/* MODAL 2: CREATE NEW SPACE                                 */}
      {/* ========================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-calve-charcoal">
                {isEnglish ? "Add New Space to Inventory" : "Ajouter un Nouvel Espace"}
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  {isEnglish ? "Space Name *" : "Nom de l'espace *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isEnglish ? "e.g. Executive Private Suite 20m²" : "Ex: Bureau Privatif Standing 20m²"}
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Category" : "Catégorie"}
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        category: e.target.value as any
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    <option value="private">{isEnglish ? "Private Office" : "Bureau Privatif"}</option>
                    <option value="open">{isEnglish ? "Dedicated Desk / Coworking" : "Open Space Fixe"}</option>
                    <option value="meeting">{isEnglish ? "Meeting Room" : "Salle de Réunion"}</option>
                    <option value="parking">{isEnglish ? "Courtyard Parking" : "Stationnement & Cour"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Rate (€ excl. VAT)" : "Tarif (€ HT)"}
                  </label>
                  <input
                    type="text"
                    placeholder="850 € HT"
                    value={createForm.price}
                    onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Floor Area" : "Superficie"}
                  </label>
                  <input
                    type="text"
                    placeholder="20 m²"
                    value={createForm.area}
                    onChange={(e) => setCreateForm({ ...createForm, area: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    {isEnglish ? "Capacity" : "Capacité"}
                  </label>
                  <input
                    type="text"
                    placeholder={isEnglish ? "4 workstations" : "4 postes de travail"}
                    value={createForm.capacity}
                    onChange={(e) => setCreateForm({ ...createForm, capacity: e.target.value })}
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
                  <span>{isEnglish ? "Create Space" : "Créer dans la Base de Données"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
