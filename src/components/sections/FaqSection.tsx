"use client";

import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { Language, CONTENT } from "@/data/content";

interface FaqSectionProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string) => void;
}

export default function FaqSection({ language, onOpenEnquiry }: FaqSectionProps) {
  const t = CONTENT[language].faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-calve-slate mb-3">
            {t.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-calve-charcoal leading-tight tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-calve-muted mt-3 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {t.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-calve-border overflow-hidden transition-colors duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 bg-calve-cream/40 hover:bg-calve-cream transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-base sm:text-lg text-calve-charcoal">
                    {item.q}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white border border-calve-border flex items-center justify-center text-calve-slate shrink-0">
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 bg-white text-sm text-calve-muted leading-relaxed border-t border-calve-border/40 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Contact Prompt */}
        <div className="mt-12 text-center p-8 rounded-3xl bg-calve-cream border border-calve-border">
          <h3 className="font-bold text-xl tracking-tight text-calve-charcoal mb-2">
            {language === "en"
              ? "Have a specific question about your project?"
              : language === "es"
              ? "¿Tiene una consulta específica para su proyecto?"
              : "Une question spécifique sur votre projet ?"}
          </h3>
          <p className="text-sm text-calve-muted max-w-md mx-auto mb-6">
            {language === "en"
              ? "Paul and the Maison Calvé team are here to assist you and welcome your team for a private viewing."
              : language === "es"
              ? "Paul y el equipo de Maison Calvé están a su disposición para resolver cualquier duda y recibirle en una visita privada."
              : "Paul et l'équipe de Maison Calvé sont à votre disposition pour vous renseigner et vous accueillir pour une visite privée."}
          </p>
          <button
            onClick={() => onOpenEnquiry("office")}
            className="px-8 py-3.5 rounded-full bg-calve-slate hover:bg-calve-slate-dark text-white font-medium text-xs tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
          >
            {language === "en"
              ? "Get in touch / Book a tour"
              : language === "es"
              ? "Contactar / Visitar"
              : "Prendre contact / Visiter"}
          </button>
        </div>
      </div>
    </section>
  );
}
