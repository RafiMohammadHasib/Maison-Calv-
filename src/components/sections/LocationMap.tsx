"use client";

import React from "react";
import { MapPin, Navigation, Train, Car, Bike, Sparkles, ExternalLink } from "lucide-react";
import { Language, CONTENT } from "@/data/content";

interface LocationMapProps {
  language: Language;
}

export default function LocationMap({ language }: LocationMapProps) {
  const t = CONTENT[language].locationSection;

  return (
    <section id="localisation" className="py-24 sm:py-32 bg-calve-cream border-t border-calve-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-calve-stone text-xs font-semibold uppercase tracking-wider text-calve-slate mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-calve-charcoal leading-tight tracking-tight">
            {t.title}
          </h2>
          <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-calve-slate mt-2">
            <MapPin className="w-4 h-4 text-calve-slate" />
            <span>{t.address}</span>
          </div>
          <p className="text-sm sm:text-base text-calve-muted mt-3 leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Grid: Transit & Neighborhood Points + Visual Map Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Transit Details */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-calve-charcoal mb-4">
                {t.accessTitle}
              </h3>

              {t.accessItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-calve-border hover:border-calve-slate/50 transition-colors shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center gap-2.5">
                    {idx === 0 ? (
                      <Train className="w-4 h-4 text-calve-slate" />
                    ) : idx === 1 ? (
                      <Car className="w-4 h-4 text-emerald-700" />
                    ) : idx === 2 ? (
                      <Bike className="w-4 h-4 text-calve-slate" />
                    ) : (
                      <Navigation className="w-4 h-4 text-calve-accent" />
                    )}
                    <h4 className="text-xs font-bold uppercase tracking-wider text-calve-charcoal">
                      {item.mode}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-calve-muted pl-6 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=48+Rue+Calve+33000+Bordeaux"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-xs cursor-pointer"
              >
                <span>{t.ctaDirections}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive Styled Map View Card */}
          <div className="lg:col-span-6 min-h-[380px] rounded-3xl overflow-hidden border border-calve-border bg-white shadow-xs relative flex flex-col justify-between p-6 sm:p-8">
            {/* Map visual graphic representation with street coordinates */}
            <div className="absolute inset-0 bg-[#f4f2ea] opacity-90">
              {/* Stylized street lines */}
              <svg className="w-full h-full text-calve-border/70" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Major streets */}
                <line x1="0" y1="35%" x2="100%" y2="45%" stroke="#d3cdc0" strokeWidth="10" />
                <line x1="20%" y1="0" x2="30%" y2="100%" stroke="#d3cdc0" strokeWidth="8" />
                <line x1="65%" y1="0" x2="75%" y2="100%" stroke="#d3cdc0" strokeWidth="8" />
                <circle cx="48%" cy="40%" r="30" fill="#586f73" fillOpacity="0.15" />
              </svg>
            </div>

            {/* Map Pins overlay */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-calve-border shadow-xs text-xs font-semibold text-calve-charcoal">
                <span className="w-2.5 h-2.5 rounded-full bg-calve-slate animate-pulse" />
                <span>Bordeaux Fondaudège · 48 Rue Calvé</span>
              </div>
            </div>

            {/* Central Animated Marker */}
            <div className="relative z-10 self-center my-auto text-center">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-calve-slate/20 animate-ping absolute" />
                <div className="w-12 h-12 rounded-full bg-calve-slate text-white flex items-center justify-center shadow-lg relative border-2 border-white">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-calve-border shadow-md inline-block">
                <span className="text-xs font-extrabold tracking-tight text-calve-charcoal block">
                  Maison Calvé
                </span>
                <span className="text-[11px] text-calve-slate font-medium block">
                  {language === "en"
                    ? "9 private on-site parking spots"
                    : language === "es"
                    ? "9 plazas de parking privadas en el patio"
                    : "9 Places de parking privatives sur site"}
                </span>
              </div>
            </div>

            {/* Bottom Quick Card */}
            <div className="relative z-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-calve-border flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-calve-muted block">
                  {language === "en"
                    ? "Nearest transit stop"
                    : language === "es"
                    ? "Parada más cercana"
                    : "Arrêt le plus proche"}
                </span>
                <span className="text-xs font-semibold text-calve-charcoal">
                  {language === "en"
                    ? "Tram D · Fondaudège Muséum (3 min walk)"
                    : language === "es"
                    ? "Tranvía D · Fondaudège Muséum (3 min a pie)"
                    : "Tram D · Fondaudège Muséum (3 min à pied)"}
                </span>
              </div>
              <a
                href="https://maps.google.com/?q=48+Rue+Calve+33000+Bordeaux"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-calve-slate hover:underline shrink-0"
              >
                {language === "en" ? "Directions →" : language === "es" ? "Cómo llegar →" : "Itinéraire →"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
