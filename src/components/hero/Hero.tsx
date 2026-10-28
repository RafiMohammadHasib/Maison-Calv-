"use client";

import React from "react";
import { ArrowDown, Calendar, Sparkles, MapPin, CheckCircle2, ShieldCheck, Car } from "lucide-react";
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
    <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 overflow-hidden bg-gradient-to-b from-calve-stone/40 via-calve-cream to-white">
      {/* Background Subtle Architectural Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#172123_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Heritage Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-calve-border shadow-2xs text-[11px] sm:text-xs font-bold tracking-widest uppercase text-calve-slate">
            <span className="w-2 h-2 rounded-full bg-calve-slate animate-pulse" />
            <span>{t.badge}</span>
          </div>
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
        <p className="max-w-2xl mx-auto text-center text-sm sm:text-base text-calve-charcoal/80 font-normal leading-relaxed mb-8">
          {t.description}
        </p>

        {/* Real-time availability indicator pill */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-calve-border shadow-xs text-xs font-medium text-calve-charcoal">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="font-semibold text-emerald-800">
              {t.urgentBadge}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
          <button
            onClick={() => onOpenEnquiry("office", "Book a Private Tour (Hero)")}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-calve-slate hover:bg-calve-slate-dark text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
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

        {/* Grand Architectural Showcase: 3 Pictures */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-calve-border shadow-md aspect-4/3 bg-calve-stone group">
            <img
              src="/images/hero/hero-kitchen.jpg"
              alt={
                language === "en"
                  ? "Maison Calvé - Bright open space with oak floor and authentic stone"
                  : language === "es"
                  ? "Maison Calvé - Espacio abierto luminoso con parqué de roble"
                  : "Maison Calvé - Open space lumineux avec parquet chêne et pierre blonde"
              }
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
            />
          </div>

          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-calve-border shadow-md aspect-4/3 bg-calve-stone group">
            <img
              src="/images/hero/hero-open-space.jpg"
              alt={
                language === "en"
                  ? "Maison Calvé - Fully equipped resident kitchen"
                  : language === "es"
                  ? "Maison Calvé - Cocina equipada"
                  : "Maison Calvé - Cuisine équipée chaleureuse et moderne"
              }
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
            />
          </div>

          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-calve-border shadow-md aspect-4/3 bg-calve-stone group">
            <img
              src="/images/hero/hero-meeting.jpg"
              alt={
                language === "en"
                  ? "Maison Calvé - Executive meeting room"
                  : language === "es"
                  ? "Maison Calvé - Sala de reuniones ejecutiva"
                  : "Maison Calvé - Grande salle de réunion équipée"
              }
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
            />
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
