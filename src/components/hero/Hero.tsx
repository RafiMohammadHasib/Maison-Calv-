"use client";

import React from "react";
import { ArrowDown, Calendar, MapPin, CheckCircle2, ShieldCheck, Car } from "lucide-react";
import { Language, CONTENT } from "@/data/content";
import { BUILDING_STATS } from "@/data/spaces";

interface HeroProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string, source?: string) => void;
}

export default function Hero({ language, onOpenEnquiry }: HeroProps) {
  const t = CONTENT[language].hero;

  const scrollToSpaces = () => {
    const el = document.getElementById("espaces");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 overflow-hidden bg-gradient-to-b from-calve-stone/40 via-calve-cream to-white">
      {/* Background Subtle Architectural Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#172123_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Heritage Overline */}
        <div className="flex justify-center mb-6">
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-calve-slate/90">
            {t.badge}
          </span>
        </div>

        {/* Authentic Brand Wordmark in Center */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex flex-col items-center justify-center font-extrabold tracking-tighter lowercase leading-[0.82] text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
            <span className="text-calve-slate">maison</span>
            <span className="text-calve-slate">calvé</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-calve-muted font-medium pt-2">
            <MapPin className="w-3.5 h-3.5 text-calve-slate" />
            <span>
              {language === "en"
                ? "48 rue Calvé, 33000 Bordeaux (Fondaudège District)"
                : language === "es"
                ? "48 rue Calvé, 33000 Burdeos (Barrio Fondaudège)"
                : "48 rue Calvé, 33000 Bordeaux (Quartier Fondaudège)"}
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="max-w-2xl mx-auto text-center text-sm sm:text-base text-calve-charcoal/80 font-normal leading-relaxed mb-10">
          {t.description}
        </p>

        {/* Action Buttons & Direct Connection Touchpoint */}
        <div className="flex flex-col items-center mb-14">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4">
            <button
              onClick={() => onOpenEnquiry("office", "Book a Private Tour (Hero)")}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-calve-charcoal hover:bg-calve-slate text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.ctaVisit}</span>
            </button>

            <button
              onClick={scrollToSpaces}
              className="flex items-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-calve-stone text-calve-charcoal border border-calve-border hover:border-calve-slate/60 font-semibold text-xs tracking-wider uppercase transition-all shadow-2xs cursor-pointer"
            >
              <span>{t.ctaExplore}</span>
              <ArrowDown className="w-4 h-4 text-calve-slate" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-calve-muted font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
            <span>
              {language === "en"
                ? "Direct contact with resident team: +33 6 95 57 70 33 · Tours on appointment"
                : language === "es"
                ? "Atención directa con el equipo: +33 6 95 57 70 33 · Visitas con cita previa"
                : "Échange direct avec l'équipe résidente : 06 95 57 70 33 · Visites sur rendez-vous"}
            </span>
          </div>
        </div>

        {/* Grand Architectural Showcase: 3 Authentic 4K Photographs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Photo 1: Authentic Exposed Blonde Stone Open Space */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-calve-border shadow-md aspect-4/3 bg-calve-stone group">
            <img
              src="/images/hero/hero-open-space.jpg"
              alt={
                language === "en"
                  ? "Maison Calvé - Exposed blonde limestone loft open space with ergonomic desks"
                  : language === "es"
                  ? "Maison Calvé - Open space con auténtica pared de piedra bordelesa y mobiliario ergonómico"
                  : "Maison Calvé - Open space avec authentique pierre blonde bordelaise et mobilier ergonomique"
              }
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-bold text-white drop-shadow-sm uppercase tracking-wider">
                {language === "en" ? "Exposed Stone Open Space" : language === "es" ? "Open Space Piedra Vista" : "Open Space Pierre Blonde"}
              </span>
            </div>
          </div>

          {/* Photo 2: Authentic Resident Kitchen & Café */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-calve-border shadow-md aspect-4/3 bg-calve-stone group">
            <img
              src="/images/hero/hero-kitchen.jpg"
              alt={
                language === "en"
                  ? "Maison Calvé - Fully equipped resident kitchen, organic coffee and tea corner"
                  : language === "es"
                  ? "Maison Calvé - Cocina totalmente equipada y rincón de café"
                  : "Maison Calvé - Cuisine équipée contemporaine et espace café des résidents"
              }
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-bold text-white drop-shadow-sm uppercase tracking-wider">
                {language === "en" ? "Resident Kitchen & Café" : language === "es" ? "Cocina & Café de Residentes" : "Cuisine & Café Résidents"}
              </span>
            </div>
          </div>

          {/* Photo 3: Authentic 30m² Boardroom */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-calve-border shadow-md aspect-4/3 bg-calve-stone group">
            <img
              src="/images/hero/hero-meeting.jpg"
              alt={
                language === "en"
                  ? "Maison Calvé - 30 sqm executive boardroom with 4K screen and video conferencing"
                  : language === "es"
                  ? "Maison Calvé - Sala de juntas de 30 m² con pantalla 4K y videoconferencia"
                  : "Maison Calvé - Grande salle de réunion 30 m² équipée d'écran 4K et visioconférence"
              }
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-bold text-white drop-shadow-sm uppercase tracking-wider">
                {language === "en" ? "Executive Boardroom (30 sqm)" : language === "es" ? "Sala de Juntas (30 m²)" : "Salle de Réunion (30 m²)"}
              </span>
            </div>
          </div>
        </div>

        {/* Clean Key Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {BUILDING_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-calve-border shadow-2xs text-center space-y-1"
            >
              <div className="text-3xl font-extrabold tracking-tight text-calve-charcoal">
                {stat.number}
                {stat.unit && <span className="text-lg font-bold ml-0.5 text-calve-slate">{stat.unit}</span>}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-calve-slate">
                {stat.label[language]}
              </div>
              <div className="text-[11px] text-calve-muted font-medium">
                {stat.detail[language]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
