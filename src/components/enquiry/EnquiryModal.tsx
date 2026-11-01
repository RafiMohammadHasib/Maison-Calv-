"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, CheckCircle, Calendar, Users, Building, Mail, Phone, Clock, MapPin } from "lucide-react";
import confetti from "canvas-confetti";
import { Language, CONTENT } from "@/data/content";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialSpaceId?: string | null;
  source?: string;
}

const MODAL_STRINGS = {
  fr: {
    closeAria: "Fermer la boîte de dialogue",
    office17Title: "Bureau privatif 21 m² (~3 à 4 postes)",
    office17Price: "750€ HT / mois",
    office17Avail: "✓ Disponible immédiatement",
    office25Title: "Bureau privatif 28 m² (~5 à 6 postes)",
    office25Price: "1200€ HT / mois",
    office25Avail: "✓ 1 bureau disponible",
    teamSizeLabel: "Taille de votre équipe (postes)",
    moveInDateLabel: "Date d'emménagement souhaitée",
    officeCommitmentNotice: "💡 Engagement annuel privilégié pour préserver la quiétude de l'écosystème. Domiciliation commerciale offerte la 1ère année.",
    residentDeskTitle: "Poste Fixe Résident",
    residentDeskPrice: "250€ HT / mois · 24/7",
    residentDeskDesc: "Bureau attitré & rangements",
    nomadDeskTitle: "Poste Flexible Nomade",
    nomadDeskPrice: "20€ HT jour / 10€ demi-j",
    nomadDeskDesc: "Phonebox & boissons incluses",
    simultaneousDesks: "postes simultanés",
    singleDesk: "poste unique",
    fullDayOpenSpace: "Journée entière (20€ HT)",
    morningOpenSpace: "Matinée (10€ HT)",
    afternoonOpenSpace: "Après-midi (10€ HT)",
    desiredDateLabel: "Date souhaitée",
    slotLabel: "Créneau horaire",
    morningSlotMeeting: "Demi-journée Matin (120€ HT)",
    afternoonSlotMeeting: "Demi-journée Après-midi (120€ HT)",
    fullDaySlotMeeting: "Journée entière (200€ HT)",
    attendeesLabel: "Participants",
    eventTypeLabel: "Type d'événement",
    eventStrategic: "Réunion stratégique ou rendez-vous client",
    eventWorkshop: "Session de formation / Workshop",
    eventBoard: "Comité de direction / Séminaire",
    eventOther: "Autre projet",
    namePlaceholder: "Jean Dupont",
    companyPlaceholder: "Studio / Entreprise",
    emailPlaceholder: "contact@exemple.fr",
    phonePlaceholder: "06 12 34 56 78",
    messagePlaceholder: "Précisez votre demande, vos créneaux de visite idéaux ou vos questions sur le parking...",
    errorDefault: "Une erreur est survenue lors de l'envoi.",
    errorServer: "Impossible de joindre le serveur. Veuillez réessayer."
  },
  en: {
    closeAria: "Close dialog",
    office17Title: "Private Office 21 sqm (~3 to 4 desks)",
    office17Price: "€750 excl. VAT / mo",
    office17Avail: "✓ Immediately available",
    office25Title: "Private Office 28 sqm (~5 to 6 desks)",
    office25Price: "€1,200 excl. VAT / mo",
    office25Avail: "✓ 1 office available",
    teamSizeLabel: "Team size (workstations)",
    moveInDateLabel: "Desired start / move-in date",
    officeCommitmentNotice: "💡 1-year commitment preferred to preserve ecosystem quietude. Registered business address complimentary for the 1st year.",
    residentDeskTitle: "Dedicated Resident Desk",
    residentDeskPrice: "€250 excl. VAT / mo · 24/7",
    residentDeskDesc: "Assigned desk & personal locker storage",
    nomadDeskTitle: "Flexible Nomad Pass",
    nomadDeskPrice: "€20 excl. VAT / day · €10 half-day",
    nomadDeskDesc: "Phone booth & barista drinks included",
    simultaneousDesks: "simultaneous desks",
    singleDesk: "single desk",
    fullDayOpenSpace: "Full Day (€20 excl. VAT)",
    morningOpenSpace: "Morning (€10 excl. VAT)",
    afternoonOpenSpace: "Afternoon (€10 excl. VAT)",
    desiredDateLabel: "Preferred date",
    slotLabel: "Time slot",
    morningSlotMeeting: "Morning Half-Day (€120 excl. VAT)",
    afternoonSlotMeeting: "Afternoon Half-Day (€120 excl. VAT)",
    fullDaySlotMeeting: "Full Day (€200 excl. VAT)",
    attendeesLabel: "Attendees",
    eventTypeLabel: "Event type",
    eventStrategic: "Strategic meeting or client presentation",
    eventWorkshop: "Training session / Workshop",
    eventBoard: "Executive board meeting / Seminar",
    eventOther: "Other project",
    namePlaceholder: "John Doe",
    companyPlaceholder: "Studio / Company",
    emailPlaceholder: "contact@example.com",
    phonePlaceholder: "+33 6 12 34 56 78",
    messagePlaceholder: "Specify your request, preferred tour times, or questions about courtyard parking...",
    errorDefault: "An error occurred while submitting your enquiry.",
    errorServer: "Could not connect to the server. Please try again."
  },
  es: {
    closeAria: "Cerrar diálogo",
    office17Title: "Despacho Privado 21 m² (~3 a 4 puestos)",
    office17Price: "750€ + IVA / mes",
    office17Avail: "✓ Disponible de inmediato",
    office25Title: "Despacho Privado 28 m² (~5 a 6 puestos)",
    office25Price: "1200€ + IVA / mes",
    office25Avail: "✓ 1 despacho disponible",
    teamSizeLabel: "Tamaño de su equipo (puestos)",
    moveInDateLabel: "Fecha de entrada deseada",
    officeCommitmentNotice: "💡 Compromiso mínimo de 1 año para preservar la tranquilidad. Domiciliación comercial gratuita el 1er año.",
    residentDeskTitle: "Puesto Fijo Residente",
    residentDeskPrice: "250€ + IVA / mes · 24/7",
    residentDeskDesc: "Mesa asignada y almacenaje personal",
    nomadDeskTitle: "Puesto Flexible Nómada",
    nomadDeskPrice: "20€ + IVA día / 10€ media jornada",
    nomadDeskDesc: "Phonebox y bebidas de barista incluidas",
    simultaneousDesks: "puestos simultáneos",
    singleDesk: "puesto individual",
    fullDayOpenSpace: "Jornada completa (20€ + IVA)",
    morningOpenSpace: "Mañana (10€ + IVA)",
    afternoonOpenSpace: "Tarde (10€ + IVA)",
    desiredDateLabel: "Fecha deseada",
    slotLabel: "Franja horaria",
    morningSlotMeeting: "Media jornada Mañana (120€ + IVA)",
    afternoonSlotMeeting: "Media jornada Tarde (120€ + IVA)",
    fullDaySlotMeeting: "Jornada completa (200€ + IVA)",
    attendeesLabel: "Asistentes",
    eventTypeLabel: "Tipo de evento",
    eventStrategic: "Reunión estratégica o cita con cliente",
    eventWorkshop: "Sesión de formación / Workshop",
    eventBoard: "Comité de dirección / Seminario",
    eventOther: "Otro proyecto",
    namePlaceholder: "Carlos Gómez",
    companyPlaceholder: "Estudio / Empresa",
    emailPlaceholder: "contacto@ejemplo.es",
    phonePlaceholder: "+33 6 12 34 56 78",
    messagePlaceholder: "Detalle su consulta, fechas para visitar o preguntas sobre el parking...",
    errorDefault: "Se produjo un error al enviar el formulario.",
    errorServer: "No se pudo conectar con el servidor. Inténtelo de nuevo."
  }
};

export default function EnquiryModal({
  isOpen,
  onClose,
  language = "fr",
  initialSpaceId,
  source = "Website Enquiry"
}: EnquiryModalProps) {
  const t = CONTENT[language].enquiryModal;
  const m = MODAL_STRINGS[language];

  // Tab: 'office' | 'open-space' | 'meeting'
  const [tab, setTab] = useState<"office" | "open-space" | "meeting">("office");

  // Office Fields
  const [officeSize, setOfficeSize] = useState("17m");
  const [officeDesks, setOfficeDesks] = useState(3);
  const [officeDate, setOfficeDate] = useState("");

  // Open Space Fields
  const [openSpacePlan, setOpenSpacePlan] = useState<"fixe" | "flexible">("fixe");
  const [workstationCount, setWorkstationCount] = useState(1);
  const [openSpaceDate, setOpenSpaceDate] = useState("");
  const [openSpaceSlot, setOpenSpaceSlot] = useState<"full-day" | "morning" | "afternoon">("full-day");

  // Meeting Room Fields
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingSlot, setMeetingSlot] = useState<"full-day" | "morning" | "afternoon">("morning");
  const [attendees, setAttendees] = useState(8);
  const [meetingPurpose, setMeetingPurpose] = useState("strategic");

  // Common Contact Fields
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Form State
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initial tab when initialSpaceId changes
  useEffect(() => {
    if (!initialSpaceId) return;
    if (initialSpaceId.includes("office")) {
      setTab("office");
      if (initialSpaceId.includes("25m")) setOfficeSize("25m");
      else setOfficeSize("17m");
    } else if (initialSpaceId.includes("meeting")) {
      setTab("meeting");
    } else if (initialSpaceId.includes("open-space")) {
      setTab("open-space");
      if (initialSpaceId.includes("flexible")) setOpenSpacePlan("flexible");
      else setOpenSpacePlan("fixe");
    }
  }, [initialSpaceId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSubmitted(false);
      setError(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: any = {
      name,
      email,
      phone,
      company,
      message,
      language,
      source: source || (tab === "office" ? "Book a Private Tour (Hero)" : "Website Enquiry")
    };

    if (tab === "office") {
      payload.type = "private-office";
      payload.officeSize = officeSize === "17m" ? "21 m² (3-4 postes)" : "28 m² (5-6 postes)";
      payload.workstationCount = officeDesks;
      payload.date = officeDate;
      payload.visitRequested = true;
    } else if (tab === "open-space") {
      payload.type = "open-space";
      payload.openSpacePlan = openSpacePlan;
      payload.workstationCount = workstationCount;
      payload.date = openSpaceDate;
      payload.timeSlot = openSpaceSlot;
    } else if (tab === "meeting") {
      payload.type = "meeting-room";
      payload.date = meetingDate;
      payload.timeSlot = meetingSlot;
      payload.attendees = attendees;
      payload.meetingPurpose = meetingPurpose;
    }

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#586f73", "#c06c4e", "#233033", "#ece9e2"]
        });
      } else {
        setError(json.message || m.errorDefault);
      }
    } catch {
      setError(m.errorServer);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-calve-charcoal/75 backdrop-blur-md flex min-h-full items-start sm:items-center justify-center p-3 sm:p-6 py-6 sm:py-10 animate-in fade-in duration-200"
      data-lenis-prevent="true"
      onClick={onClose}
      style={{
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-calve-border p-5 sm:p-8 my-auto overflow-y-auto max-h-[calc(100dvh-2.5rem)] sm:max-h-[90vh] overscroll-contain"
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-calve-stone/60 text-calve-muted hover:text-calve-charcoal transition-colors cursor-pointer"
          aria-label={m.closeAria}
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-calve-charcoal">
              {t.successTitle}
            </h3>
            <p className="text-sm text-calve-muted max-w-md mx-auto leading-relaxed">
              {t.successMessage}
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-calve-slate text-white font-medium text-sm hover:bg-calve-slate-dark transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="relative w-6 h-6 rounded-md overflow-hidden shadow-2xs border border-calve-slate/15 shrink-0">
                  <Image
                    src="/images/brand/maison-calve-logo.png"
                    alt="Maison Calvé"
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-calve-slate">
                  Maison Calvé · 48 Rue Calvé
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-calve-charcoal">
                {t.title}
              </h2>
              <p className="text-xs sm:text-sm text-calve-muted mt-1">
                {t.subtitle}
              </p>
            </div>

            {/* Direct Instant Contact Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:px-4 rounded-xl bg-calve-cream/80 border border-calve-border/80 text-xs mb-5">
              <span className="text-calve-charcoal font-medium">
                {language === "en"
                  ? "Prefer to speak right now or book for today?"
                  : language === "es"
                  ? "¿Prefiere hablar directamente o reservar para hoy?"
                  : "Vous préférez échanger de vive voix ou visiter aujourd'hui ?"}
              </span>
              <a
                href="tel:+33695577033"
                className="inline-flex items-center gap-1.5 font-bold text-calve-slate hover:text-calve-charcoal transition-colors shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+33 6 95 57 70 33</span>
              </a>
            </div>

            {/* Category Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-calve-stone/50 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setTab("office")}
                className={`py-2 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
                  tab === "office"
                    ? "bg-white text-calve-charcoal shadow-xs"
                    : "text-calve-muted hover:text-calve-charcoal"
                }`}
              >
                {t.tabOffice}
              </button>
              <button
                type="button"
                onClick={() => setTab("open-space")}
                className={`py-2 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
                  tab === "open-space"
                    ? "bg-white text-calve-charcoal shadow-xs"
                    : "text-calve-muted hover:text-calve-charcoal"
                }`}
              >
                {t.tabOpenSpace}
              </button>
              <button
                type="button"
                onClick={() => setTab("meeting")}
                className={`py-2 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
                  tab === "meeting"
                    ? "bg-white text-calve-charcoal shadow-xs"
                    : "text-calve-muted hover:text-calve-charcoal"
                }`}
              >
                {t.tabMeeting}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SPECIFIC TAB FIELDS */}

              {/* 1. Office Tab */}
              {tab === "office" && (
                <div className="space-y-4 p-4 rounded-2xl bg-calve-cream border border-calve-border/60">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-calve-muted mb-2">
                      {t.fieldOfficeSelect}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setOfficeSize("17m");
                          setOfficeDesks(3);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          officeSize === "17m"
                            ? "border-calve-slate bg-calve-slate/5 ring-1 ring-calve-slate"
                            : "border-calve-border bg-white hover:border-calve-slate/40"
                        }`}
                      >
                        <div className="font-semibold text-sm text-calve-charcoal">
                          {m.office17Title}
                        </div>
                        <div className="text-xs text-calve-slate font-medium mt-0.5">
                          {m.office17Price}
                        </div>
                        <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                          {m.office17Avail}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOfficeSize("25m");
                          setOfficeDesks(5);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          officeSize === "25m"
                            ? "border-calve-slate bg-calve-slate/5 ring-1 ring-calve-slate"
                            : "border-calve-border bg-white hover:border-calve-slate/40"
                        }`}
                      >
                        <div className="font-semibold text-sm text-calve-charcoal">
                          {m.office25Title}
                        </div>
                        <div className="text-xs text-calve-slate font-medium mt-0.5">
                          {m.office25Price}
                        </div>
                        <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                          {m.office25Avail}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-calve-charcoal mb-1">
                        {m.teamSizeLabel}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={officeDesks}
                        onChange={(e) => setOfficeDesks(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-calve-charcoal mb-1">
                        {m.moveInDateLabel}
                      </label>
                      <input
                        type="date"
                        value={officeDate}
                        onChange={(e) => setOfficeDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-calve-muted bg-white/80 p-2.5 rounded-lg border border-calve-border/50">
                    <em>{m.officeCommitmentNotice}</em>
                  </div>
                </div>
              )}

              {/* 2. Open Space Tab */}
              {tab === "open-space" && (
                <div className="space-y-4 p-4 rounded-2xl bg-calve-cream border border-calve-border/60">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-calve-muted mb-2">
                      {t.fieldWorkstationType}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOpenSpacePlan("fixe")}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          openSpacePlan === "fixe"
                            ? "border-calve-slate bg-calve-slate/5 ring-1 ring-calve-slate"
                            : "border-calve-border bg-white hover:border-calve-slate/40"
                        }`}
                      >
                        <div className="font-semibold text-sm text-calve-charcoal">
                          {m.residentDeskTitle}
                        </div>
                        <div className="text-xs text-calve-slate font-medium mt-0.5">
                          {m.residentDeskPrice}
                        </div>
                        <div className="text-[11px] text-calve-muted mt-1">
                          {m.residentDeskDesc}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpenSpacePlan("flexible")}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          openSpacePlan === "flexible"
                            ? "border-calve-slate bg-calve-slate/5 ring-1 ring-calve-slate"
                            : "border-calve-border bg-white hover:border-calve-slate/40"
                        }`}
                      >
                        <div className="font-semibold text-sm text-calve-charcoal">
                          {m.nomadDeskTitle}
                        </div>
                        <div className="text-xs text-calve-slate font-medium mt-0.5">
                          {m.nomadDeskPrice}
                        </div>
                        <div className="text-[11px] text-calve-muted mt-1">
                          {m.nomadDeskDesc}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Workstation Counter */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-calve-muted mb-2">
                      {t.fieldWorkstationCount}
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 6].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setWorkstationCount(num)}
                          className={`w-11 h-11 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            workstationCount === num
                              ? "bg-calve-slate text-white shadow-xs"
                              : "bg-white border border-calve-border text-calve-charcoal hover:border-calve-slate/60"
                          }`}
                        >
                          {num === 6 ? "6+" : num}
                        </button>
                      ))}
                      <span className="text-xs text-calve-muted ml-2">
                        {workstationCount > 1 ? m.simultaneousDesks : m.singleDesk}
                      </span>
                    </div>
                  </div>

                  {/* Date & Time slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-calve-charcoal mb-1">
                        {t.fieldDate}
                      </label>
                      <input
                        type="date"
                        value={openSpaceDate}
                        onChange={(e) => setOpenSpaceDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-calve-charcoal mb-1">
                        {t.fieldSlot}
                      </label>
                      <select
                        value={openSpaceSlot}
                        onChange={(e) => setOpenSpaceSlot(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate cursor-pointer"
                      >
                        <option value="full-day">{m.fullDayOpenSpace}</option>
                        <option value="morning">{m.morningOpenSpace}</option>
                        <option value="afternoon">{m.afternoonOpenSpace}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Meeting Room Tab */}
              {tab === "meeting" && (
                <div className="space-y-4 p-4 rounded-2xl bg-calve-cream border border-calve-border/60">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-calve-charcoal mb-1">
                        {m.desiredDateLabel}
                      </label>
                      <input
                        type="date"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-calve-charcoal mb-1">
                        {m.slotLabel}
                      </label>
                      <select
                        value={meetingSlot}
                        onChange={(e) => setMeetingSlot(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate cursor-pointer"
                      >
                        <option value="morning">{m.morningSlotMeeting}</option>
                        <option value="afternoon">{m.afternoonSlotMeeting}</option>
                        <option value="full-day">{m.fullDaySlotMeeting}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-calve-charcoal mb-1">
                        {m.attendeesLabel}
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="14"
                        value={attendees}
                        onChange={(e) => setAttendees(parseInt(e.target.value) || 2)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-calve-charcoal mb-1">
                      {m.eventTypeLabel}
                    </label>
                    <select
                      value={meetingPurpose}
                      onChange={(e) => setMeetingPurpose(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate cursor-pointer"
                    >
                      <option value="strategic">{m.eventStrategic}</option>
                      <option value="workshop">{m.eventWorkshop}</option>
                      <option value="board">{m.eventBoard}</option>
                      <option value="other">{m.eventOther}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* CONTACT DETAILS (ALL TABS) */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-calve-charcoal mb-1">
                      {t.fieldName} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={m.namePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-calve-charcoal mb-1">
                      {t.fieldCompany}
                    </label>
                    <input
                      type="text"
                      placeholder={m.companyPlaceholder}
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-calve-charcoal mb-1">
                      {t.fieldEmail} *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={m.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-calve-charcoal mb-1">
                      {t.fieldPhone} *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={m.phonePlaceholder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-calve-charcoal mb-1">
                    {t.fieldMessage}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={m.messagePlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-calve-border text-sm focus:outline-hidden focus:border-calve-slate"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 pb-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>{t.submitting}</span>
                  ) : tab === "office" ? (
                    <span>{t.submitOffice}</span>
                  ) : tab === "open-space" ? (
                    <span>{t.submitOpenSpace}</span>
                  ) : (
                    <span>{t.submitMeeting}</span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
