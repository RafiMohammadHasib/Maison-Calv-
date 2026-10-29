"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { SPACES, SpaceItem } from "@/data/spaces";
import { Language, CONTENT } from "@/data/content";

interface SpacesSectionProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string, source?: string) => void;
}

export default function SpacesSection({ language, onOpenEnquiry }: SpacesSectionProps) {
  const [filter, setFilter] = useState<"all" | "private-office" | "open-space" | "meeting-room" | "common-areas">("all");
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);

  // References
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const t = CONTENT[language].spacesSection;

  const filteredSpaces = SPACES.filter((space) => {
    if (filter === "all") return space.category !== "parking";
    return space.category === filter;
  });

  // Reset active slide when filter changes
  useEffect(() => {
    setActiveSlide(0);
  }, [filter]);

  // Center active thumbnail horizontally in container only (WITHOUT scrolling the window)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const container = thumbnailsRef.current;
    if (!container) return;
    const activeThumb = container.children[activeSlide] as HTMLElement;
    if (activeThumb) {
      const scrollTarget =
        activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2;
      container.scrollTo({ left: Math.max(0, scrollTarget), behavior: "smooth" });
    }
  }, [activeSlide]);

  const totalSlides = filteredSpaces.length;
  const currentSpace = filteredSpaces[activeSlide] || filteredSpaces[0];

  const handleNext = () => {
    if (isAnimating || totalSlides <= 1) return;
    setIsAnimating(true);
    setSlideDirection("right");
    setActiveSlide((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handlePrev = () => {
    if (isAnimating || totalSlides <= 1) return;
    setIsAnimating(true);
    setSlideDirection("left");
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleSelectSlide = (idx: number) => {
    if (idx === activeSlide || isAnimating) return;
    setIsAnimating(true);
    setSlideDirection(idx > activeSlide ? "right" : "left");
    setActiveSlide(idx);
    setTimeout(() => setIsAnimating(false), 400);
  };

  // Mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Localized Category Names for Eyebrow
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "private-office":
        return language === "fr" ? "Bureau Privatif" : language === "es" ? "Oficina Privada" : "Private Suite";
      case "open-space":
        return language === "fr" ? "Poste Résident & Nomade" : language === "es" ? "Puesto de Trabajo" : "Resident & Nomad Desk";
      case "meeting-room":
        return language === "fr" ? "Salle de Réunion" : language === "es" ? "Sala de Reuniones" : "Executive Boardroom";
      case "common-areas":
        return language === "fr" ? "Espaces Partagés" : language === "es" ? "Zonas Comunes" : "Shared Amenities";
      default:
        return language === "fr" ? "Espace de Travail" : language === "es" ? "Espacio de Trabajo" : "Workspace";
    }
  };

  return (
    <section id="espaces" className="py-16 sm:py-24 bg-calve-cream/60 border-t border-b border-calve-border/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ======================================================== */}
        {/* SECTION HEADER: Pure Architectural Typography */}
        {/* ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-bold tracking-[0.25em] uppercase text-calve-slate mb-3">
              {t.tag}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-calve-charcoal leading-[1.12] tracking-tight">
              {t.title}
            </h2>
            <p className="text-sm sm:text-base text-calve-muted mt-3 leading-relaxed max-w-xl">
              {t.subtitle}
            </p>
          </div>

          {/* Minimalist Slide Counter & Nav Arrows */}
          {totalSlides > 1 && (
            <div className="flex items-center gap-4 self-start md:self-auto shrink-0">
              <div className="text-xs font-mono font-bold text-calve-charcoal">
                0{activeSlide + 1} <span className="text-calve-muted font-normal">/ 0{totalSlides}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  aria-label={language === "en" ? "Previous space" : "Espace précédent"}
                  className="w-10 h-10 rounded-full bg-white hover:bg-calve-charcoal hover:text-white border border-calve-border/90 flex items-center justify-center text-calve-charcoal shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label={language === "en" ? "Next space" : "Espace suivant"}
                  className="w-10 h-10 rounded-full bg-white hover:bg-calve-charcoal hover:text-white border border-calve-border/90 flex items-center justify-center text-calve-charcoal shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* REFINED FILTER TABS: Understated Capsule Strip */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 mb-8 sm:mb-10 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "all", label: t.filterAll },
            { id: "private-office", label: t.filterOffices },
            { id: "open-space", label: t.filterOpenSpace },
            { id: "meeting-room", label: t.filterMeeting },
            { id: "common-areas", label: t.filterCommon },
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-calve-charcoal text-white shadow-xs"
                    : "bg-white/80 hover:bg-white text-calve-charcoal/80 hover:text-calve-charcoal border border-calve-border/80"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* MAIN ATELIER SHOWCASE CARD */}
        {/* ======================================================== */}
        {currentSpace && (
          <div
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <article className="bg-white rounded-3xl lg:rounded-[2rem] overflow-hidden border border-calve-border/90 shadow-[0_16px_40px_rgba(23,33,35,0.05)] transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[580px]">
                
                {/* ---------------------------------------------------- */}
                {/* LEFT: Cinematic Architectural Visual Centerpiece */}
                {/* ---------------------------------------------------- */}
                <div className="lg:col-span-7 relative overflow-hidden bg-stone-100 min-h-[340px] sm:min-h-[420px] lg:min-h-full group">
                  <img
                    key={currentSpace.id}
                    src={currentSpace.image}
                    alt={currentSpace.name[language]}
                    className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-102 ${
                      isAnimating
                        ? slideDirection === "right"
                          ? "opacity-60 translate-x-2"
                          : "opacity-60 -translate-x-2"
                        : "opacity-100 translate-x-0"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                  {/* Top Architectural Spec Badges (Clean, Minimal Frosted Glass) */}
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between gap-3 z-10 pointer-events-none">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-calve-charcoal shadow-xs border border-white/60">
                      {currentSpace.area || getCategoryLabel(currentSpace.category)}
                    </span>
                    
                    <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-semibold text-calve-charcoal shadow-xs border border-white/60 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>{currentSpace.availability.status[language]}</span>
                    </span>
                  </div>

                  {/* Bottom Image Architectural Highlight Note */}
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-10 pointer-events-none">
                    <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-md max-w-lg">
                      {currentSpace.highlight[language]}
                    </p>
                  </div>

                  {/* Hover Nav Buttons over Image (Desktop) */}
                  <div className="hidden sm:flex absolute inset-y-0 inset-x-4 items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={handlePrev}
                      aria-label="Previous"
                      className="w-11 h-11 rounded-full bg-white/90 hover:bg-white text-calve-charcoal flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-95 pointer-events-auto cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Next"
                      className="w-11 h-11 rounded-full bg-white/90 hover:bg-white text-calve-charcoal flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-95 pointer-events-auto cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* RIGHT: Curated Architectural Specification Panel */}
                {/* ---------------------------------------------------- */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-white">
                  <div className="space-y-5">
                    
                    {/* Eyebrow & Index */}
                    <div className="flex items-center justify-between gap-2 border-b border-calve-border/70 pb-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-calve-slate font-mono">
                        {getCategoryLabel(currentSpace.category)}
                      </span>
                      <span className="text-xs font-mono text-calve-muted">
                        0{activeSlide + 1} / 0{totalSlides}
                      </span>
                    </div>

                    {/* Room Title */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-calve-charcoal tracking-tight leading-tight">
                        {currentSpace.name[language]}
                      </h3>
                      <p className="text-xs sm:text-sm text-calve-muted mt-2 leading-relaxed">
                        {currentSpace.description[language]}
                      </p>
                    </div>

                    {/* Architectural Specifications Grid (Hairline Box) */}
                    <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-calve-cream/40 border border-calve-border/80">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-calve-slate mb-0.5">
                          {t.specsLabels?.surface || "Superficie"}
                        </span>
                        <span className="font-bold text-calve-charcoal text-xs sm:text-sm">
                          {currentSpace.area || "Sur mesure"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-calve-slate mb-0.5">
                          {t.specsLabels?.capacity || "Capacité"}
                        </span>
                        <span className="font-bold text-calve-charcoal text-xs sm:text-sm">
                          {currentSpace.capacity[language]}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-calve-slate mb-0.5">
                          {t.specsLabels?.parking || "Stationnement"}
                        </span>
                        <span className="font-bold text-calve-charcoal text-xs sm:text-sm">
                          {language === "en" ? "Courtyard Parking" : language === "es" ? "Parking en patio" : "Parking en cour"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-calve-slate mb-0.5">
                          {t.specsLabels?.access || "Accès"}
                        </span>
                        <span className="font-bold text-calve-charcoal text-xs sm:text-sm">
                          {language === "en" ? "24/7 Keycard" : language === "es" ? "24/7 con tarjeta" : "Badge sécurisé 24/7"}
                        </span>
                      </div>
                    </div>

                    {/* Transparent Pricing Display */}
                    <div className="border-t border-b border-calve-border/70 py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-extrabold text-calve-charcoal tracking-tight">
                            {currentSpace.pricing.amount}
                          </span>
                          <span className="text-xs font-bold text-calve-slate uppercase">
                            {currentSpace.pricing.tax}
                          </span>
                          <span className="text-xs text-calve-muted font-medium">
                            / {currentSpace.pricing.period[language]}
                          </span>
                        </div>
                        {currentSpace.pricing.note && (
                          <div className="text-[11px] text-calve-muted mt-0.5 font-medium">
                            {currentSpace.pricing.note[language]}
                          </div>
                        )}
                      </div>
                      <div className="text-left sm:text-right text-[11px] text-calve-muted">
                        <span>{language === "en" ? "Charges & Fiber included" : language === "es" ? "Gastos y fibra incluidos" : "Charges & fibre incluses"}</span>
                      </div>
                    </div>

                    {/* Included Amenities (Clean Minimalist List) */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-calve-slate block">
                        {t.featuresIncluded}
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {currentSpace.features[language].slice(0, 4).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-xs text-calve-charcoal/90">
                            <span className="w-1.5 h-1.5 rounded-full bg-calve-slate shrink-0" />
                            <span className="font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Primary Luxury CTA & Direct Phone Touchpoint */}
                  <div className="space-y-3 pt-4 border-t border-calve-border/70">
                    <button
                      onClick={() => onOpenEnquiry(currentSpace.id, `Spaces: ${currentSpace.name[language]}`)}
                      className="w-full py-4 px-6 rounded-2xl bg-calve-charcoal hover:bg-calve-slate text-white text-xs font-bold tracking-[0.16em] uppercase transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>
                        {currentSpace.category === "common-areas"
                          ? language === "en"
                            ? "Schedule a discovery tour"
                            : language === "es"
                            ? "Planificar una visita guiada"
                            : "Planifier une visite découverte"
                          : t.ctaEnquire}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-calve-muted font-medium text-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        {language === "en"
                          ? "Private viewing on appointment · No hidden broker fees"
                          : language === "es"
                          ? "Visita privada con cita previa · Sin comisiones de agencia"
                          : "Visite privée sur rendez-vous · Sans aucun frais d'agence"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* ======================================================== */}
            {/* VISUAL ARCHITECTURAL FILMSTRIP (Photo Thumbnails) */}
            {/* Replaces the bulky text pills with an editorial gallery */}
            {/* ======================================================== */}
            <div className="mt-8 sm:mt-10">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-calve-slate font-mono">
                  {language === "en" ? "Collection Preview" : language === "es" ? "Previsualización" : "Aperçu de la Collection"}
                </span>
                <span className="text-xs text-calve-muted hidden sm:inline-block">
                  {language === "en" ? "Click to view details" : language === "es" ? "Haga clic para ver detalles" : "Cliquez sur une pièce pour afficher ses détails"}
                </span>
              </div>

              {/* Scrollable Visual Filmstrip */}
              <div
                ref={thumbnailsRef}
                className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x"
              >
                {filteredSpaces.map((space, idx) => {
                  const isActive = activeSlide === idx;
                  return (
                    <button
                      key={space.id}
                      onClick={() => handleSelectSlide(idx)}
                      className={`flex items-center gap-3 p-2 pr-4 rounded-2xl transition-all cursor-pointer shrink-0 snap-start text-left border ${
                        isActive
                          ? "bg-white border-calve-charcoal shadow-sm ring-1 ring-calve-charcoal"
                          : "bg-white/70 hover:bg-white border-calve-border/80 hover:border-calve-charcoal/40 opacity-80 hover:opacity-100"
                      }`}
                    >
                      {/* Thumbnail Image */}
                      <div className="w-16 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0 relative">
                        <img
                          src={space.image}
                          alt={space.name[language]}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Room Spec Meta */}
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-calve-charcoal line-clamp-1">
                          {space.name[language]}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-calve-muted mt-0.5">
                          <span>{space.area || getCategoryLabel(space.category)}</span>
                          <span>·</span>
                          <span className="font-semibold text-calve-slate">{space.pricing.amount}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
