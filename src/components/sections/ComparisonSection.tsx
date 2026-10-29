"use client";

import React from "react";
import { Check, X, ShieldAlert, ShieldCheck, Car, Volume2, Landmark, Users, ArrowRight } from "lucide-react";
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
  const content = {
    fr: {
      tag: "Pourquoi Choisir la Maison",
      title: "Notre positionnement face à la concurrence",
      subtitle: "Nous placons l’expérience client en priorité absolue.",
      badLabel: "Coworking classique",
      goodLabel: "MAISON CALVÉ",
      cta: "Réserver votre bureau ou poste",
      rows: [
        {
          criteria: "Stationnement & Mobilité",
          icon: Car,
          bad: "Pas de parking disponible, arriver sur son lieu de travail devient vite un vrai casse tête",
          good: "Cour privative sécurisée avec 9 places réservées au pied de votre bureau",
        },
        {
          criteria: "Atmosphère & Acoustique",
          icon: Volume2,
          bad: "Parfois trop de personnes dans une même pièce, une ambiance bruyante qui empêche le focus.",
          good: "Un espace à taille humaine pensé pour le calme et pour être efficace au travail.",
        },
        {
          criteria: "Cadre & Standing Architectural",
          icon: Landmark,
          bad: "Un environnement qui peut manquer d’âme et de charme pour travailler dans de bonnes conditions.",
          good: "Un parquet authentique, aménagement de standing et des équipements neufs sauront vous donner envie de venir ici chaque matin !",
        },
        {
          criteria: "Profil des Résidents & Réseau",
          icon: Users,
          bad: "Beaucoup de turnover, peu de relations et pas assez de réseautage...",
          good: "Un réseau stable qui se tire vers le haut, tout le monde se connaît et s’entraide si besoin !",
        },
        {
          criteria: "Frais cachés",
          icon: ShieldCheck,
          bad: "Des frais cachés comme la domiciliation d’entreprise, l’impression, les boissons...",
          good: "La transparence est notre maître mot, ici pas de frais cachés, tout est compris !",
        },
      ],
    },
    en: {
      tag: "Why Choose Maison Calvé",
      title: "Our positioning against the competition",
      subtitle: "We place client experience as our absolute priority.",
      badLabel: "Standard Coworking",
      goodLabel: "MAISON CALVÉ",
      cta: "Schedule a private tour",
      rows: [
        {
          criteria: "Parking & Accessibility",
          icon: Car,
          bad: "No parking available, arriving at work quickly becomes a major headache.",
          good: "Secured private courtyard with 9 reserved spaces right at your office doorstep.",
        },
        {
          criteria: "Acoustics & Peace of Mind",
          icon: Volume2,
          bad: "Too many people in the same room, noisy environment hindering deep focus.",
          good: "A human-scale space crafted for serenity and high daily work productivity.",
        },
        {
          criteria: "Architectural Standing",
          icon: Landmark,
          bad: "Generic setting lacking soul and charm required to work in prime conditions.",
          good: "Authentic parquet, upscale decor, and brand-new fittings to inspire you every morning!",
        },
        {
          criteria: "Community & Member Profile",
          icon: Users,
          bad: "Constant turnover, fleeting interactions, and lack of real networking...",
          good: "A stable network elevating each other, where everyone connects and supports one another!",
        },
        {
          criteria: "Hidden Fees",
          icon: ShieldCheck,
          bad: "Hidden charges for mail handling, business address, printing, beverages...",
          good: "Absolute transparency is our core promise: zero hidden fees, everything is included!",
        },
      ],
    },
    es: {
      tag: "Por Qué Elegir la Maison",
      title: "Nuestro posicionamiento frente a la competencia",
      subtitle: "Situamos la experiencia del cliente como prioridad absoluta.",
      badLabel: "Coworking clásico",
      goodLabel: "MAISON CALVÉ",
      cta: "Solicitar una visita privada",
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
          bad: "Mucha rotación, pocas relaciones y escasas oportunidades de networking...",
          good: "Una comunidad estable que se impulsa mutuamente, ¡todos se conocen y cooperan!",
        },
        {
          criteria: "Gastos ocultos",
          icon: ShieldCheck,
          bad: "Gastos ocultos por domiciliación de empresa, impresión, bebidas...",
          good: "La transparencia es nuestro lema: sin cargos sorpresa, ¡todo está incluido!",
        },
      ],
    },
  }[language];

  return (
    <section id="about" className="py-12 sm:py-16 bg-calve-stone/60 border-y border-calve-border relative overflow-hidden">
      <span id="positionnement" className="sr-only" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-calve-slate mb-3">
              {content.tag}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-calve-charcoal tracking-tight">
              {content.title}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-calve-muted leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Comparison Table / Matrix */}
        <div className="rounded-3xl border border-calve-border bg-white shadow-xs overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-calve-border bg-calve-cream/60">
            <div className="hidden md:block md:col-span-4 p-5 font-semibold text-xs uppercase tracking-wider text-calve-muted">
              {language === "en"
                ? "Comparison Criterion"
                : language === "es"
                ? "Criterio de Excelencia"
                : "Critère d'Excellence"}
            </div>
            <div className="md:col-span-4 p-5 text-center sm:text-left border-b md:border-b-0 md:border-r border-calve-border bg-stone-100/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {content.badLabel}
                </span>
              </div>
            </div>
            <div className="md:col-span-4 p-5 text-center sm:text-left bg-calve-slate/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-calve-slate">
                  {content.goodLabel}
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
                className={`grid grid-cols-1 md:grid-cols-12 border-b last:border-b-0 border-calve-border transition-colors hover:bg-calve-cream/40 ${
                  idx % 2 === 1 ? "bg-stone-50/40" : "bg-white"
                }`}
              >
                {/* Mobile or Desktop Criteria Title */}
                <div className="md:col-span-4 p-5 flex items-center gap-3 border-b md:border-b-0 border-calve-stone">
                  <div className="w-8 h-8 rounded-xl bg-calve-stone flex items-center justify-center text-calve-slate shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide text-calve-charcoal">
                      {row.criteria}
                    </span>
                  </div>
                </div>

                {/* Standard / Bad side */}
                <div className="md:col-span-4 p-5 border-b md:border-b-0 md:border-r border-calve-stone flex items-start gap-3 bg-stone-50/30">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {row.bad}
                  </p>
                </div>

                {/* Maison Calvé / Good side */}
                <div className="md:col-span-4 p-5 flex items-start gap-3 bg-calve-slate/[0.03]">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <p className="text-xs font-medium text-calve-charcoal leading-relaxed">
                    {row.good}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-white border border-calve-border shadow-xs">
          <div>
            <h4 className="text-base font-bold text-calve-charcoal">
              {language === "en"
                ? "Ready to experience the difference?"
                : language === "es"
                ? "¿Listo para notar la diferencia?"
                : "Convaincu par la différence ?"}
            </h4>
            <p className="text-xs sm:text-sm text-calve-muted mt-1">
              {language === "en"
                ? "Schedule a private viewing at 48 rue Calvé to experience the acoustic calm firsthand."
                : language === "es"
                ? "Visite nuestras instalaciones en el 48 rue Calvé y compruebe usted mismo el silencio y la acústica."
                : "Venez visiter les lieux au 48 rue Calvé et constatez vous-même le calme et l'acoustique."}
            </p>
          </div>
          <button
            onClick={() => onOpenEnquiry("office")}
            className="shrink-0 px-6 py-3 rounded-xl bg-calve-slate hover:bg-calve-slate-light text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>{content.cta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
