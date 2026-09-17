"use client";

import React from "react";
import { ArrowDown, Calendar, Sparkles, MapPin, CheckCircle2, ShieldCheck, Car } from "lucide-react";
import { Language, CONTENT } from "@/data/content";
import { BUILDING_STATS } from "@/data/spaces";

interface HeroProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string) => void;
}

export default function Hero({ language, onOpenEnquiry }: HeroProps) {
  const t = CONTENT[language].hero;

  const scrollToSpaces = () => {
    const el = document.getElementById("espaces");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-28 overflow-hidden bg-gradient-to-b from-calve-stone/40 via-calve-cream to-white">
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
            <span className="text-calve-charcoal">maison</span>
            <span className="text-calve-slate">calvé</span>
          </div>

          <p className="text-xs sm:text-sm font-bold tracking-[0.32em] uppercase text-calve-charcoal/70 pt-2">
            Peaceful Coworking · Bordeaux
          </p>

          <div className="flex items-center justify-center gap-1.5 text-xs text-calve-muted font-medium pt-1">
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
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16">
          <button
            onClick={() => onOpenEnquiry("office")}
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

        {/* Grand Architectural Showcase Card */}
        <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden border border-calve-border shadow-xl aspect-16/9 md:aspect-21/9 bg-calve-stone group">
          <img
            src="/images/calve-exterior.jpg"
            alt={
              language === "en"
                ? "Maison Calvé - 19th-century private mansion facade and private courtyard at 48 rue Calvé Bordeaux"
                : language === "es"
                ? "Maison Calvé - Fachada del palacete del siglo XIX y patio privado en 48 rue Calvé Burdeos"
                : "Maison Calvé - Façade de l'hôtel particulier et cour pavée 48 rue Calvé Bordeaux"
            }
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-calve-charcoal/80 via-calve-charcoal/20 to-transparent" />

          {/* Overlay Inscription */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/80 font-bold mb-1">
                <Car className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {language === "en"
                    ? "Private Courtyard · 9 Reserved Parking Bays"
                    : language === "es"
                    ? "Patio Interior Privado · 9 Plazas de Parking"
                    : "Cour Intérieure Privative · 9 Places de Parking"}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                {language === "en"
                  ? "The elegance of a 19th-century private mansion elevated for modern work."
                  : language === "es"
                  ? "La elegancia de un palacete al servicio de su trabajo."
                  : "L'élégance d'un hôtel particulier au service de votre travail."}
              </h3>
            </div>

            <button
              onClick={() => onOpenEnquiry("office")}
              className="self-start sm:self-auto shrink-0 px-5 py-2.5 rounded-full bg-white text-calve-charcoal hover:bg-calve-slate hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {language === "en"
                ? "Book a Tour"
                : language === "es"
                ? "Organizar una visita"
                : "Organiser une visite"}
            </button>
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
