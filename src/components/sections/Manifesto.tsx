"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Coffee, Shield, Zap, Car } from "lucide-react";
import { Language, CONTENT } from "@/data/content";

interface ManifestoProps {
  language: Language;
}

export default function Manifesto({ language }: ManifestoProps) {
  const t = CONTENT[language].manifesto;

  return (
    <section className="py-20 sm:py-28 bg-white border-y border-calve-border/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tag & Main Editorial Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-calve-stone text-xs font-semibold uppercase tracking-wider text-calve-slate mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-calve-charcoal leading-tight tracking-tight">
            {t.heading}
          </h2>
        </div>

        {/* Two-column storytelling: Editorial text + Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-base sm:text-lg text-calve-charcoal/90 leading-relaxed font-normal">
              {t.paragraph1}
            </p>
            <p className="text-sm sm:text-base text-calve-muted leading-relaxed">
              {t.paragraph2}
            </p>

            {/* Signature Quote Card */}
            <div className="p-6 rounded-2xl bg-calve-cream border-l-4 border-calve-slate border border-calve-border/80 my-6 shadow-xs">
              <blockquote className="font-semibold text-lg sm:text-xl text-calve-charcoal mb-3">
                “{t.quote}”
              </blockquote>
              <cite className="not-italic text-xs font-bold uppercase tracking-wider text-calve-slate block">
                — {t.quoteAuthor}
              </cite>
            </div>

            {/* Core Values List */}
            <div className="space-y-4 pt-4">
              {t.values.map((v, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-calve-stone flex items-center justify-center text-calve-slate shrink-0 mt-0.5 font-bold text-sm">
                    0{i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-calve-charcoal">
                      {v.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-calve-muted mt-0.5 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photographic Presentation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-calve-border aspect-4/3 group">
              <img
                src="/images/real/maison-calve-kitchen.jpg"
                alt="Espace cuisine & convivialité Maison Calvé"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-calve-charcoal/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-xs uppercase tracking-widest text-calve-stone/90 block font-medium">
                    {language === "en"
                      ? "Hospitality & Community"
                      : language === "es"
                      ? "Convivialidad & Servicios"
                      : "Convivialité & Prestations"}
                  </span>
                  <p className="text-lg sm:text-xl font-bold tracking-tight">
                    {language === "en"
                      ? "Communal kitchen, specialty coffee & peaceful lunch breaks"
                      : language === "es"
                      ? "Cocina comunitaria, café de barista y pausas agradables"
                      : "Cuisine partagée, café de spécialité & pauses déjeuners sereines"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-calve-border aspect-4/3">
                <img
                  src="/images/calve-exterior.jpg"
                  alt="Façade pierre de taille 48 rue Calvé"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 rounded-2xl bg-calve-stone/40 border border-calve-border flex flex-col justify-between">
                <div className="flex items-center gap-2 text-calve-slate">
                  <Car className="w-5 h-5 text-emerald-700" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {language === "en"
                      ? "Private Parking"
                      : language === "es"
                      ? "Aparcamiento"
                      : "Stationnement"}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-calve-charcoal">
                    {language === "en" ? "9 Bays" : language === "es" ? "9 Plazas" : "9 Places"}
                  </div>
                  <p className="text-xs text-calve-muted mt-1">
                    {language === "en"
                      ? "Enclosed courtyard with direct keycard access and EV chargers."
                      : language === "es"
                      ? "Patio adoquinado cerrado con acceso directo por tarjeta y cargadores VE."
                      : "Cour pavée close avec accès direct par badge et bornes EV."}
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
