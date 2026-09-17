"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Sparkles, Users, Car, Coffee } from "lucide-react";
import { SPACES, SpaceItem } from "@/data/spaces";
import { Language, CONTENT } from "@/data/content";

interface SpacesSectionProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string) => void;
}

export default function SpacesSection({ language, onOpenEnquiry }: SpacesSectionProps) {
  const [filter, setFilter] = useState<"all" | "private-office" | "open-space" | "meeting-room" | "common-areas">("all");
  const t = CONTENT[language].spacesSection;

  const filteredSpaces = SPACES.filter((space) => {
    if (filter === "all") return space.category !== "parking";
    return space.category === filter;
  });

  const commonLabels = {
    fr: "Espaces Communs & Cuisine",
    en: "Common Areas & Kitchen",
    es: "Zonas Comunes & Cocina",
  }[language];

  const urgencyText = {
    fr: "Disponibilités actuelles : seulement 2 bureaux privatifs disponibles & quelques postes en open space",
    en: "Current availability: only 2 private offices available & a few open-space desks",
    es: "Disponibilidad actual: solo 2 oficinas privadas disponibles y pocos puestos en open space",
  }[language];

  return (
    <section id="espaces" className="py-24 sm:py-32 bg-calve-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Availability & Urgency Pill */}
        <div className="flex justify-start mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>{urgencyText}</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-calve-stone text-xs font-semibold uppercase tracking-wider text-calve-slate mb-3 border border-calve-border">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.tag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-calve-charcoal leading-tight tracking-tight">
              {t.title}
            </h2>
            <p className="text-sm sm:text-base text-calve-muted mt-3 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Filter Navigation Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: t.filterAll },
              { id: "private-office", label: t.filterOffices },
              { id: "open-space", label: t.filterOpenSpace },
              { id: "meeting-room", label: t.filterMeeting },
              { id: "common-areas", label: commonLabels },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  filter === tab.id
                    ? "bg-calve-slate text-white shadow-xs"
                    : "bg-white/80 hover:bg-white text-calve-charcoal border border-calve-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Space Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {filteredSpaces.map((space) => (
            <article
              key={space.id}
              className="bg-white rounded-3xl overflow-hidden border border-calve-border hover:border-calve-slate/60 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                {/* Photo Header */}
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                  <img
                    src={space.image}
                    alt={space.name[language]}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-semibold text-calve-charcoal shadow-xs">
                      {space.area}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${space.availability.badgeClass}`}
                    >
                      {space.availability.status[language]}
                    </span>
                  </div>

                  {/* Bottom Image Caption */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-medium flex items-center gap-1.5 drop-shadow-sm">
                      <Users className="w-3.5 h-3.5" />
                      {space.capacity[language]}
                    </span>

                    {/* Parking highlight tag */}
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-white/90 border border-white/20 flex items-center gap-1">
                      <Car className="w-3 h-3 text-emerald-400" />
                      <span>
                        {language === "en"
                          ? "Courtyard parking reservable"
                          : language === "es"
                          ? "Parking en patio reservable"
                          : "Parking en cour réservable"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-calve-charcoal">
                      {space.name[language]}
                    </h3>
                    <div className="text-left sm:text-right">
                      <div className="text-xl font-extrabold text-calve-slate">
                        {space.pricing.amount}
                        <span className="text-xs font-semibold text-calve-muted ml-1">
                          {space.pricing.tax}
                        </span>
                      </div>
                      <span className="text-xs text-calve-muted block">
                        {space.pricing.period[language]}
                      </span>
                    </div>
                  </div>

                  {/* Note about long-term or features */}
                  {space.pricing.note && (
                    <div className="text-[11px] text-calve-slate font-medium mb-3">
                      ✦ {space.pricing.note[language]}
                    </div>
                  )}

                  <p className="text-sm text-calve-charcoal/80 leading-relaxed mb-6">
                    {space.description[language]}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-4 border-t border-calve-border/60">
                    <span className="text-xs font-semibold uppercase tracking-wider text-calve-muted block mb-1">
                      {t.featuresIncluded}
                    </span>
                    {space.features[language].map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-calve-charcoal/90"
                      >
                        <div className="w-4 h-4 rounded-full bg-calve-stone flex items-center justify-center shrink-0 text-calve-slate">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-6 sm:p-8 pt-0">
                <button
                  onClick={() => onOpenEnquiry(space.id)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>
                    {space.category === "common-areas"
                      ? language === "en"
                        ? "Schedule a discovery tour"
                        : language === "es"
                        ? "Planificar una visita guiada"
                        : "Planifier une visite découverte"
                      : t.ctaEnquire}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
