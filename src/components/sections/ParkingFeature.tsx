"use client";

import React from "react";
import { Car, Zap, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Language, CONTENT } from "@/data/content";

interface ParkingFeatureProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string) => void;
}

export default function ParkingFeature({ language, onOpenEnquiry }: ParkingFeatureProps) {
  const t = CONTENT[language].parkingSection;

  return (
    <section id="parking" className="py-24 sm:py-32 bg-white border-y border-calve-border/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Column: Bold Editorial Pitch */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <Car className="w-3.5 h-3.5" />
                <span>{t.tag}</span>
              </div>

              {/* Big Headline with 9 Spaces Badge */}
              <div className="flex items-baseline gap-4">
                <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-calve-slate tracking-tighter">
                  {t.count}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-calve-charcoal leading-tight tracking-tight">
                  {t.title}
                </h2>
              </div>

              <p className="text-base sm:text-lg font-semibold text-calve-slate">
                {t.subtitle}
              </p>

              <p className="text-sm sm:text-base text-calve-charcoal/80 leading-relaxed font-normal">
                {t.description}
              </p>
            </div>

            {/* Value Points (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {t.points.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-calve-cream border border-calve-border/60 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-calve-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{p.title}</span>
                  </div>
                  <p className="text-[12px] text-calve-muted pl-6 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Action CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => onOpenEnquiry("parking")}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{t.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Big Prominent Visual Showcase (Fills Full Height) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col relative h-full min-h-[460px] sm:min-h-[540px] lg:min-h-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-calve-border h-full w-full min-h-[460px] sm:min-h-[540px] lg:min-h-full group flex flex-col">
              {/* Giant Full-Height Photo */}
              <img
                src="/images/calve-parking.jpg"
                alt="Cour pavée avec 9 places de parking privées Maison Calvé Bordeaux"
                className="w-full h-full min-h-[460px] sm:min-h-[540px] lg:min-h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Top-Right Badge on Photo */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-calve-charcoal/80 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/20 shadow-md">
                  {language === "en"
                    ? "Enclosed courtyard · 9 reserved bays"
                    : language === "es"
                    ? "Patio cerrado · 9 plazas reservadas"
                    : "Cour fermée · 9 places réservées"}
                </span>
              </div>

              {/* Bottom Gradient Overlay on Photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-calve-charcoal/90 via-calve-charcoal/30 to-transparent flex items-end p-6 sm:p-8 lg:p-10 pointer-events-none">
                <div className="text-white space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                    <Zap className="w-4 h-4" />
                    <span>
                      {language === "en"
                        ? "Connected EV charging stations"
                        : language === "es"
                        ? "Puntos de recarga eléctrica conectados"
                        : "Bornes de recharge électrique connectées"}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {language === "en"
                      ? "Private Gated Courtyard at 48 rue Calvé"
                      : language === "es"
                      ? "Patio señorial cerrado en 48 rue Calvé"
                      : "Cour d'honneur fermée au 48 rue Calvé"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed">
                    {language === "en"
                      ? "Automated keyfob security gate, 24/7 CCTV surveillance, and direct office entry without street parking hassle."
                      : language === "es"
                      ? "Puerta automática segura, videovigilancia 24/7 y acceso directo a oficinas sin buscar aparcamiento en la calle."
                      : "Portail automatique sécurisé, vidéosurveillance 24/7 et accès direct aux bureaux sans repasser par la voirie."}
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Guarantee Badge */}
            <div className="absolute -bottom-5 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-calve-border shadow-xl hidden sm:flex items-center gap-3.5 z-20">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shadow-2xs">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-calve-charcoal block">
                  {language === "en"
                    ? "100% Guaranteed Parking"
                    : language === "es"
                    ? "Aparcamiento 100% garantizado"
                    : "Stationnement 100% garanti"}
                </span>
                <span className="text-[11px] text-calve-muted">
                  {language === "en"
                    ? "Zero street parking stress in Fondaudège"
                    : language === "es"
                    ? "Cero estrés en el barrio Fondaudège"
                    : "Zéro stress dans le quartier Fondaudège"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
