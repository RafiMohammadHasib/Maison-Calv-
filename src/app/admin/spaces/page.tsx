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
  UserCheck
} from "lucide-react";

export default function SpacesInventoryPage() {
  const { language, t, isEnglish } = useLanguage();
  const [spaces, setSpaces] = useState<SpaceInventoryRecord[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const toggleStatus = (id: string) => {
    setSpaces((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextStatus = s.status === "available" ? "occupied" : "available";
        const nextText =
          nextStatus === "available"
            ? "Disponible immédiatement"
            : "Occupé / Réservé manuellement";
        return {
          ...s,
          status: nextStatus,
          statusText: nextText
        };
      })
    );
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
      {/* Top Notification Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-calve-charcoal to-[#1a2332] text-white shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-calve-gold/20 border border-calve-gold/40 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-calve-gold" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-2">
              <span>{isEnglish ? "Automated Space Booking System" : "Attribution Automatisée des Espaces"}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {isEnglish ? "Live Synced" : "Synchro Directe"}
              </span>
            </div>
            <p className="text-xs text-white/70">
              {isEnglish
                ? "When an opportunity is marked as 'Won' in the CRM, its requested space immediately locks as Booked / Occupied."
                : "Dès qu'un prospect passe en statut 'Gagné' dans le CRM, son espace est instantanément verrouillé comme Réservé / Occupé."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={fetchSpaces}
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
            href="/admin/tenants"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition-all shadow-xs"
          >
            <span>{isEnglish ? "View Tenants" : "Voir Résidents"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Private Offices" : "Bureaux Privatifs"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {loading
              ? "..."
              : isEnglish
              ? `${metrics?.availableSuitesCount ?? 1} available out of 5`
              : `${metrics?.availableSuitesCount ?? 1} disponible${(metrics?.availableSuitesCount ?? 1) > 1 ? "s" : ""} sur 5`}
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold">
            {isEnglish ? "17 m² (€750 HT) · 25 m² (€1,000 HT) · Partner Suite" : "17 m² (750€ HT) · 25 m² (1 000€ HT) · Suite Partenaire"}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Open Space Desks" : "Postes Open Space Résidents"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {loading
              ? "..."
              : isEnglish
              ? `${metrics?.openSpaceOccupiedCount ?? 5} / 10 desks occupied`
              : `${metrics?.openSpaceOccupiedCount ?? 5} / 10 postes occupés`}
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold">
            {isEnglish ? "Fixed dedicated desks with secure pedestal" : "Postes fixes attitrés avec caisson sécurisé"}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-calve-muted">
            {isEnglish ? "Courtyard & Parking" : "Cour & Parking Privé"}
          </div>
          <div className="text-2xl font-black text-calve-charcoal">
            {loading
              ? "..."
              : isEnglish
              ? `${metrics?.assignedCourtyardBays ?? 4} / 9 bays assigned`
              : `${metrics?.assignedCourtyardBays ?? 4} / 9 places attribuées`}
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            {isEnglish ? "Automated motorized gate with RFID keycard" : "Portail motorisé automatique avec badge RFID"}
          </p>
        </div>
      </div>

      {/* Spaces Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-sm text-calve-muted">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-calve-slate" />
          <span>{isEnglish ? "Loading live spaces inventory..." : "Chargement de l'inventaire en direct..."}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => {
            const isOccupied = space.status === "occupied";
            const isLimited = space.status === "limited";

            return (
              <div
                key={space.id}
                className={`rounded-3xl bg-white border overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between ${
                  isOccupied
                    ? "border-calve-slate/30 ring-1 ring-calve-slate/15"
                    : "border-calve-border/80"
                }`}
              >
                <div>
                  {/* Space Photo Preview */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={space.image}
                      alt={space.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Status Badge in Top Right */}
                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm border ${
                          isOccupied
                            ? "bg-[#1f2937] text-white border-slate-700/80 shadow-md ring-1 ring-white/20"
                            : isLimited
                            ? "bg-amber-500 text-white border-amber-600"
                            : "bg-emerald-600 text-white border-emerald-700"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOccupied
                              ? "bg-rose-400 animate-pulse"
                              : isLimited
                              ? "bg-amber-200"
                              : "bg-emerald-200"
                          }`}
                        />
                        {isOccupied
                          ? isEnglish
                            ? "BOOKED / OCCUPIED"
                            : "RÉSERVÉ / OCCUPÉ"
                          : isLimited
                          ? isEnglish
                            ? "LIMITED AVAILABILITY"
                            : "DERNIÈRES PLACES"
                          : isEnglish
                          ? "AVAILABLE"
                          : "DISPONIBLE"}
                      </span>
                    </div>

                    {/* Bottom overlay title */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-calve-gold">
                        {space.category === "private"
                          ? isEnglish
                            ? "Private Executive Suite"
                            : "Suite Bureautique Privative"
                          : space.category === "open"
                          ? isEnglish
                            ? "Coworking Space"
                            : "Espace Coworking Résident"
                          : isEnglish
                          ? "Conference & Meeting"
                          : "Salle de Réunion Équipée"}
                      </div>
                      <h3 className="font-extrabold text-base text-white drop-shadow-sm truncate">
                        {space.name}
                      </h3>
                    </div>
                  </div>

                  {/* Space Content */}
                  <div className="p-6 space-y-4">
                    {/* Area & Capacity */}
                    <div className="flex items-center justify-between text-xs text-calve-muted">
                      <span className="font-semibold">{space.area}</span>
                      <span>·</span>
                      <span className="font-medium text-calve-charcoal">{space.capacity}</span>
                    </div>

                    {/* Price & Parking */}
                    <div className="py-2.5 border-y border-slate-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-black text-calve-slate">{space.price}</span>
                        <span className="text-xs text-calve-muted block mt-0.5">{space.period}</span>
                      </div>
                      {space.parkingIncluded && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                          <Car className="w-3.5 h-3.5 text-emerald-700" />
                          {isEnglish ? "Parking bay incl." : "Place cour incluse"}
                        </span>
                      )}
                    </div>

                    {/* OCCUPANT DETAILS BANNER (When Occupied / Booked) */}
                    {isOccupied && space.currentTenant && (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#1e293b] text-white border border-slate-700/80 shadow-xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-calve-gold uppercase tracking-wider">
                            <UserCheck className="w-3.5 h-3.5 text-calve-gold" />
                            <span>{isEnglish ? "Current Resident / Booked By" : "Locataire / Réservé Par"}</span>
                          </div>
                          <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/80">
                            {space.currentTenant.leadId || "Résident"}
                          </span>
                        </div>

                        <div>
                          <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                            <span>{space.currentTenant.company}</span>
                            <span className="text-xs text-white/70 font-normal">
                              ({space.currentTenant.name})
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5 mt-1.5 text-[11px] text-white/80">
                            <a
                              href={`mailto:${space.currentTenant.email}`}
                              className="flex items-center gap-1.5 hover:text-calve-gold truncate"
                            >
                              <Mail className="w-3 h-3 text-white/60 shrink-0" />
                              <span className="truncate">{space.currentTenant.email}</span>
                            </a>
                            <a
                              href={`tel:${space.currentTenant.phone}`}
                              className="flex items-center gap-1.5 hover:text-calve-gold font-mono"
                            >
                              <Phone className="w-3 h-3 text-white/60 shrink-0" />
                              <span>{space.currentTenant.phone}</span>
                            </a>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/70">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {isEnglish ? "Booking / Lease Date: " : "Prise d'effet / Date : "}
                              {space.currentTenant.leaseStart}
                            </span>
                          </span>
                          <Link
                            href="/admin/tenants"
                            className="font-bold text-calve-gold hover:underline flex items-center gap-0.5"
                          >
                            <span>{isEnglish ? "View Directory" : "Voir fiche"}</span>
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* MEETING ROOM SCHEDULE (if multiple bookings) */}
                    {space.activeBookings && space.activeBookings.length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                        <div className="font-bold text-[11px] uppercase tracking-wider text-calve-charcoal flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-calve-slate" />
                          <span>{isEnglish ? "Confirmed Sessions:" : "Sessions Confirmées :"}</span>
                        </div>
                        <div className="divide-y divide-slate-200/70">
                          {space.activeBookings.map((b) => (
                            <div key={b.leadId} className="py-1.5 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-calve-charcoal">{b.company}</span>
                                <span className="text-calve-muted ml-1 font-mono text-[11px]">({b.date})</span>
                              </div>
                              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                {b.slot || "Confirmé"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Text Description */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-semibold text-calve-charcoal">
                        {isEnglish
                          ? isOccupied
                            ? `Status: ${space.statusText}`
                            : `Availability: ${space.statusText}`
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
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleStatus(space.id)}
                    className="text-xs font-bold text-calve-slate hover:text-calve-slate-dark hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>{isEnglish ? "Toggle status" : "Basculer statut"}</span>
                  </button>
                  <a
                    href={`/#espaces`}
                    target="_blank"
                    className="text-xs font-semibold text-calve-muted hover:text-calve-charcoal flex items-center gap-1"
                  >
                    <span>{isEnglish ? "View on site" : "Voir sur le site"}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
