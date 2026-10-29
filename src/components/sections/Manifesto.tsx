"use client";

import React from "react";
import { ArrowRight, Car } from "lucide-react";
import { Language, CONTENT } from "@/data/content";

interface ManifestoProps {
  language: Language;
  onOpenEnquiry?: (spaceId?: string, source?: string) => void;
}

export default function Manifesto({ language, onOpenEnquiry }: ManifestoProps) {
  const t = CONTENT[language].manifesto;

  return (
    <section id="about" className="py-20 sm:py-28 lg:py-32 bg-white border-y border-calve-border/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ======================================================== */}
        {/* EDITORIAL HEADER: Pure French Architectural Typography */}
        {/* ======================================================== */}
        <div className="max-w-3xl mb-12 sm:mb-18">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-calve-slate mb-3">
            {language === "en" ? "Townhouse Heritage & Philosophy" : language === "es" ? "Patrimonio y Filosofía" : "Hôtel Particulier & Philosophie"}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-calve-charcoal leading-[1.12] tracking-tight">
            {t.heading}
          </h2>
        </div>

        {/* ======================================================== */}
        {/* MAIN EDITORIAL GRID: Storytelling + Prestige Photography */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ---------------------------------------------------- */}
          {/* LEFT: Curated Narrative & Pull-Quote */}
          {/* ---------------------------------------------------- */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-5 text-base sm:text-lg text-calve-charcoal/85 leading-relaxed font-normal">
              <p>{t.paragraph1}</p>
              <p className="text-sm sm:text-base text-calve-muted leading-relaxed">
                {t.paragraph2}
              </p>
            </div>

            {/* Architectural Open Pull-Quote (No bulky box borders) */}
            <div className="pt-2 pb-4 border-l-2 border-calve-slate/60 pl-6 sm:pl-8 my-6">
              <blockquote className="font-serif italic text-lg sm:text-2xl text-calve-charcoal leading-snug">
                “{t.quote}”
              </blockquote>
              <cite className="not-italic text-xs font-bold uppercase tracking-[0.18em] text-calve-slate mt-3 block">
                — {t.quoteAuthor}
              </cite>
            </div>

            {/* Three Architectural Pillars */}
            <div className="space-y-4 pt-2 border-t border-calve-border/70">
              {t.values.map((v, i) => (
                <div key={i} className="flex items-start gap-4 py-2">
                  <span className="font-mono text-xs font-bold text-calve-slate/80 shrink-0 mt-0.5">
                    0{i + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-calve-charcoal tracking-tight">
                      {v.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-calve-muted mt-0.5 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Discovery CTA */}
            {onOpenEnquiry && (
              <div className="pt-4">
                <button
                  onClick={() => onOpenEnquiry("office", "About Us Discovery CTA")}
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-calve-charcoal hover:bg-calve-slate text-white text-xs font-bold tracking-[0.16em] uppercase transition-all shadow-sm hover:shadow-md cursor-pointer group"
                >
                  <span>
                    {language === "en"
                      ? "Book a Private Tour of the Mansion"
                      : language === "es"
                      ? "Reservar una visita privada del palacete"
                      : "Planifier une visite privée de la Maison"}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------- */}
          {/* RIGHT: Authentic 4K Architectural Photography Diptych */}
          {/* ---------------------------------------------------- */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Primary Hero: The Authentic 25m² Private Suite */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-calve-border/80 aspect-4/3 sm:aspect-16/11 group bg-stone-100">
              <img
                src="/images/spaces/real-office-25m-4k.jpg"
                alt="Bureau privatif 25 m² Maison Calvé avec mur d'accent bleu cobalt et parquet chaleureux"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

              {/* Minimalist Floating Label */}
              <div className="absolute top-5 left-5 z-10 pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-calve-charcoal shadow-xs border border-white/60">
                  {language === "en" ? "Private Suite 25 sqm" : language === "es" ? "Despacho Privado 25 m²" : "Bureau Privatif 25 m²"}
                </span>
              </div>

              {/* Architectural Caption at Bottom */}
              <div className="absolute bottom-5 inset-x-5 z-10 pointer-events-none text-white">
                <p className="text-base sm:text-lg font-bold tracking-tight">
                  {language === "en"
                    ? "Cobalt blue accent wall, authentic hardwood floor & woven rattan lighting"
                    : language === "es"
                    ? "Pared azul cobalto, suelo de madera auténtica y lámparas de ratán"
                    : "Mur bleu cobalt, parquet authentique & luminaires en rotin tissé"}
                </p>
                <span className="text-[11px] text-white/80 uppercase tracking-widest mt-1 block">
                  48 Rue Calvé · Bordeaux Fondaudège
                </span>
              </div>
            </div>

            {/* Secondary Diptych: Authentic Exposed Blonde Stone Loft + Courtyard Bays */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
              {/* Authentic Exposed Blonde Bordeaux Limestone Open Space */}
              <div className="sm:col-span-7 rounded-2xl overflow-hidden border border-calve-border/80 aspect-16/10 sm:aspect-auto sm:h-full relative group bg-stone-100">
                <img
                  src="/images/spaces/real-open-space-fixe-4k.jpg"
                  alt="Espace de travail partagé avec authentique mur en pierre blonde bordelaise"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-semibold text-white drop-shadow-sm">
                    {language === "en" ? "Authentic exposed Bordeaux blonde limestone" : language === "es" ? "Piedra bordelesa vista auténtica" : "Pierre blonde bordelaise apparente"}
                  </span>
                </div>
              </div>

              {/* Courtyard Parking Privilege Card */}
              <div className="sm:col-span-5 p-5 rounded-2xl bg-calve-cream/60 border border-calve-border/80 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2 text-calve-slate">
                  <Car className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {language === "en" ? "Private Courtyard" : language === "es" ? "Patio Privado" : "Cour Privative"}
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-extrabold tracking-tight text-calve-charcoal">
                    {language === "en" ? "9 Bays" : language === "es" ? "9 Plazas" : "9 Places"}
                  </div>
                  <p className="text-xs text-calve-muted mt-1 leading-relaxed">
                    {language === "en"
                      ? "Enclosed cobblestone courtyard with keycard gate & EV charging."
                      : language === "es"
                      ? "Patio adoquinado cerrado con portón automático y puntos VE."
                      : "Cour pavée fermée avec portail automatique et bornes de recharge."}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
