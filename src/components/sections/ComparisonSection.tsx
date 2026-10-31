"use client";

import React, { useState } from "react";
import { Check, X, ShieldCheck, Car, Volume2, Landmark, Users, ArrowRight, Sparkles, Building2 } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Language } from "@/data/content";

interface ComparisonSectionProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string) => void;
}

export default function ComparisonSection({
  language,
  onOpenEnquiry,
}: ComparisonSectionProps) {
  const [mobileFilter, setMobileFilter] = useState<"all" | "calve" | "standard">("all");

  const content = {
    fr: {
      tag: "Pourquoi Choisir la Maison",
      title: "Notre positionnement face à la concurrence",
      subtitle: "Nous plaçons l'expérience client et la sérénité de travail en priorité absolue.",
      badLabel: "Coworking classique",
      goodLabel: "Maison Calvé",
      goodBadge: "Le Standard Calvé",
      cta: "Réserver votre bureau ou poste",
      ctaSub: "Venez visiter les lieux au 48 rue Calvé et constatez vous-même le calme et l'acoustique.",
      ctaTitle: "Convaincu par l'expérience Maison Calvé ?",
      filterAll: "Face à face",
      filterCalve: "Maison Calvé",
      filterStandard: "Classique",
      guaranteeTag: "Privilège Résident",
      commonTag: "Standard du Marché",
      columnCriteria: "Critères d'Excellence",
      rows: [
        {
          criteria: "Stationnement & Mobilité",
          icon: Car,
          bad: "Pas de parking disponible, arriver sur son lieu de travail devient vite un vrai casse-tête.",
          good: "Cour privative sécurisée avec 9 places réservées au pied de votre bureau.",
        },
        {
          criteria: "Atmosphère & Acoustique",
          icon: Volume2,
          bad: "Parfois trop de personnes dans une même pièce, ambiance bruyante qui empêche le focus.",
          good: "Un espace à taille humaine pensé pour le calme, la confidentialité et l'efficacité au travail.",
        },
        {
          criteria: "Cadre & Standing Architectural",
          icon: Landmark,
          bad: "Un environnement qui peut manquer d'âme et de charme pour travailler dans de bonnes conditions.",
          good: "Un parquet authentique, aménagement de standing et équipements neufs dans un hôtel particulier XIXe.",
        },
        {
          criteria: "Profil des Résidents & Réseau",
          icon: Users,
          bad: "Beaucoup de turnover, peu de relations durables et pas assez de vrai réseautage.",
          good: "Un réseau stable de dirigeants et professions libérales qui s'entraident et se développent.",
        },
        {
          criteria: "Frais cachés & Transparence",
          icon: ShieldCheck,
          bad: "Frais cachés récurrents pour la domiciliation, l'impression, les boissons ou les salles.",
          good: "Transparence contractuelle absolue : zéro frais cachés, l'ensemble des services est inclus.",
        },
      ],
    },
    en: {
      tag: "Why Choose Maison Calvé",
      title: "Our positioning against the competition",
      subtitle: "We place client experience and deep-work serenity as our absolute priority.",
      badLabel: "Standard Coworking",
      goodLabel: "Maison Calvé",
      goodBadge: "The Calvé Standard",
      cta: "Schedule a private tour",
      ctaSub: "Schedule a private viewing at 48 rue Calvé to experience the acoustic calm firsthand.",
      ctaTitle: "Ready to experience the difference?",
      filterAll: "Side by side",
      filterCalve: "Maison Calvé",
      filterStandard: "Standard",
      guaranteeTag: "Resident Privilege",
      commonTag: "Industry Norm",
      columnCriteria: "Excellence Criteria",
      rows: [
        {
          criteria: "Parking & Accessibility",
          icon: Car,
          bad: "No parking available, arriving at work quickly becomes a major headache.",
          good: "Secured private courtyard with 9 reserved spaces right at your office doorstep.",
        },
        {
          criteria: "Acoustics & Concentration",
          icon: Volume2,
          bad: "Too many people in the same room, noisy environment hindering deep focus.",
          good: "A human-scale space crafted for serenity and high daily work productivity.",
        },
        {
          criteria: "Architectural Standing",
          icon: Landmark,
          bad: "Generic setting lacking soul and charm required to work in prime conditions.",
          good: "Authentic parquet, upscale decor, and brand-new fittings in a 19th-century private mansion.",
        },
        {
          criteria: "Community & Member Profile",
          icon: Users,
          bad: "Constant turnover, fleeting interactions, and lack of real networking.",
          good: "A stable network elevating each other, where everyone connects and supports one another.",
        },
        {
          criteria: "Hidden Fees & Transparency",
          icon: ShieldCheck,
          bad: "Hidden charges for mail handling, business address, printing, beverages, or rooms.",
          good: "Absolute transparency: zero hidden fees, every key service is fully included.",
        },
      ],
    },
    es: {
      tag: "Por Qué Elegir la Maison",
      title: "Nuestro posicionamiento frente a la competencia",
      subtitle: "Situamos la experiencia del cliente y la serenidad de trabajo como prioridad absoluta.",
      badLabel: "Coworking clásico",
      goodLabel: "Maison Calvé",
      goodBadge: "El Estándar Calvé",
      cta: "Solicitar una visita privada",
      ctaSub: "Visite nuestras instalaciones en el 48 rue Calvé y compruebe usted mismo el silencio y la acústica.",
      ctaTitle: "¿Listo para notar la diferencia?",
      filterAll: "Comparativa",
      filterCalve: "Maison Calvé",
      filterStandard: "Estándar",
      guaranteeTag: "Privilegio Residente",
      commonTag: "Mercado Habitual",
      columnCriteria: "Criterios de Excelencia",
      rows: [
        {
          criteria: "Aparcamiento & Acceso",
          icon: Car,
          bad: "Sin aparcamiento disponible, llegar al trabajo se convierte en un verdadero dolor de cabeza.",
          good: "Patio privado cerrado con 9 plazas reservadas a las puertas de su oficina.",
        },
        {
          criteria: "Acústica & Concentración",
          icon: Volume2,
          bad: "Demasiada gente en la misma sala, ambiente ruidoso que impide la concentración.",
          good: "Un espacio a escala humana diseñado para la tranquilidad y la máxima eficacia.",
        },
        {
          criteria: "Patrimonio & Prestigio",
          icon: Landmark,
          bad: "Un entorno impersonal sin encanto para trabajar en buenas condiciones.",
          good: "Parqué auténtico, diseño de prestigio y equipamiento nuevo que motiva cada mañana.",
        },
        {
          criteria: "Comunidad & Perfil",
          icon: Users,
          bad: "Mucha rotación, pocas relaciones y escasas oportunidades de networking.",
          good: "Una comunidad estable que se impulsa mutuamente, ¡todos se conocen y cooperan!",
        },
        {
          criteria: "Gastos ocultos & Transparencia",
          icon: ShieldCheck,
          bad: "Gastos ocultos por domiciliación de empresa, impresión, bebidas o salas.",
          good: "La transparencia es nuestro lema: sin cargos sorpresa, ¡todo está incluido!",
        },
      ],
    },
  }[language];

  return (
    <section id="about" className="py-14 sm:py-20 bg-calve-stone/50 border-y border-calve-border relative overflow-hidden">
      <span id="positionnement" className="sr-only" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-calve-slate/10 border border-calve-slate/20 text-calve-slate text-[11px] font-bold tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-calve-slate" />
              <span>{content.tag}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-calve-charcoal tracking-tight">
              {content.title}
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-calve-muted leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* ============================================================ */}
        {/* MOBILE VIEW (< md) - Modern Executive Comparison Cards       */}
        {/* ============================================================ */}
        <div className="md:hidden space-y-4">
          {/* Subtle Segmented Filter Control */}
          <div className="p-1 rounded-2xl bg-white border border-calve-border/90 grid grid-cols-3 gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setMobileFilter("all")}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold tracking-tight transition-all cursor-pointer text-center ${
                mobileFilter === "all"
                  ? "bg-calve-slate text-white shadow-xs"
                  : "text-calve-muted hover:text-calve-charcoal"
              }`}
            >
              {content.filterAll}
            </button>
            <button
              type="button"
              onClick={() => setMobileFilter("calve")}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold tracking-tight transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                mobileFilter === "calve"
                  ? "bg-emerald-800 text-white shadow-xs font-extrabold"
                  : "text-calve-muted hover:text-calve-charcoal"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{content.filterCalve}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileFilter("standard")}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold tracking-tight transition-all cursor-pointer text-center ${
                mobileFilter === "standard"
                  ? "bg-stone-200 text-stone-800 shadow-xs font-extrabold"
                  : "text-calve-muted hover:text-calve-charcoal"
              }`}
            >
              {content.filterStandard}
            </button>
          </div>

          {/* Cards Stack */}
          <div className="space-y-4">
            {content.rows.map((row, idx) => {
              const Icon = row.icon;
              const indexStr = String(idx + 1).padStart(2, "0");

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-calve-border/90 shadow-xs p-4 sm:p-5 space-y-3 transition-all"
                >
                  {/* Card Header with Icon, Title and Counter */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-calve-border/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-calve-stone/80 border border-calve-border/60 flex items-center justify-center text-calve-slate shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-calve-charcoal">
                        {row.criteria}
                      </h3>
                    </div>
                    <span className="text-[10px] font-semibold text-calve-muted font-mono tracking-wider">
                      {indexStr} / 05
                    </span>
                  </div>

                  {/* Maison Calvé Privilege Block (Quiet Luxury) */}
                  {(mobileFilter === "all" || mobileFilter === "calve") && (
                    <div className="rounded-xl p-3.5 bg-emerald-50/70 border border-emerald-200/80 space-y-1.5 transition-all">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wider">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>{content.goodLabel}</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                          {content.guaranteeTag}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed pt-0.5">
                        {row.good}
                      </p>
                    </div>
                  )}

                  {/* Standard Coworking Drawback Block (Subtle Comparison) */}
                  {(mobileFilter === "all" || mobileFilter === "standard") && (
                    <div className="rounded-xl p-3 bg-stone-50 border border-stone-200/80 space-y-1 transition-all">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/70 text-[10px] font-bold uppercase tracking-wider">
                          <X className="w-2.5 h-2.5 stroke-[2.5]" />
                          <span>{content.badLabel}</span>
                        </span>
                        <span className="text-[10px] font-medium text-stone-600 uppercase tracking-wider">
                          {content.commonTag}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed pt-0.5">
                        {row.bad}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP VIEW (>= md) - Refined 12-Column Comparison Matrix   */}
        {/* ============================================================ */}
        <div className="hidden md:block rounded-3xl border border-calve-border/90 bg-white shadow-xs overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-12 border-b border-calve-border/90">
            {/* Col 1: Criterion */}
            <div className="col-span-4 p-5 sm:p-6 bg-slate-50/70 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-calve-charcoal">
                {content.columnCriteria}
              </span>
            </div>

            {/* Col 2: Standard Coworking */}
            <div className="col-span-4 p-5 sm:p-6 border-x border-calve-border/80 bg-stone-50/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    {content.badLabel}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-stone-600 uppercase tracking-wider">
                  {content.commonTag}
                </span>
              </div>
            </div>

            {/* Col 3: Maison Calvé (Elevated Signature Column) */}
            <div className="col-span-4 p-5 sm:p-6 bg-emerald-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-950">
                    {content.goodLabel}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold tracking-wide uppercase shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{content.goodBadge}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Criteria Rows */}
          {content.rows.map((row, idx) => {
            const Icon = row.icon;
            return (
              <div
                key={idx}
                className="grid grid-cols-12 border-b last:border-b-0 border-calve-border/70 transition-colors hover:bg-slate-50/40"
              >
                {/* Criteria Title */}
                <div className="col-span-4 p-5 sm:p-6 flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-calve-stone/80 border border-calve-border/60 flex items-center justify-center text-calve-slate shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-calve-charcoal">
                      {row.criteria}
                    </span>
                  </div>
                </div>

                {/* Standard / Bad side */}
                <div className="col-span-4 p-5 sm:p-6 border-x border-calve-border/80 flex items-start gap-3 bg-stone-50/20">
                  <div className="w-5 h-5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {row.bad}
                  </p>
                </div>

                {/* Maison Calvé / Good side (Signature Light Emerald Highlight) */}
                <div className="col-span-4 p-5 sm:p-6 flex items-start gap-3 bg-emerald-50/30">
                  <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed">
                    {row.good}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/90 shadow-xs">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-extrabold text-calve-charcoal">
              {content.ctaTitle}
            </h4>
            <p className="text-xs sm:text-sm text-calve-muted leading-relaxed max-w-2xl">
              {content.ctaSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenEnquiry("office")}
            className="w-full sm:w-auto shrink-0 px-6 py-3.5 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xs hover:shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{content.cta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
