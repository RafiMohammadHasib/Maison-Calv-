"use client";

import React from "react";
import { Check, X, ShieldAlert, Sparkles, Car, Volume2, Landmark, Users, ArrowRight } from "lucide-react";
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
      title: "Coworking de masse ou sérénité sur-mesure ?",
      subtitle:
        "La plupart des tiers-lieux bordelais privilégient la rentabilité au mètre carré. Au 48 rue Calvé, nous cultivons le calme, le prestige architectural et la stabilité.",
      badLabel: "Coworking Usine Traditionnel",
      goodLabel: "L'Expérience Maison Calvé",
      cta: "Réserver votre bureau ou poste",
      rows: [
        {
          criteria: "Stationnement & Mobilité",
          icon: Car,
          bad: "Aucun parking. Galère quotidienne en voirie à 35€/jour ou garage public à 800m.",
          good: "Cour privative sécurisée avec 9 places réservées au pied de votre bureau + bornes VE.",
        },
        {
          criteria: "Atmosphère & Acoustique",
          icon: Volume2,
          bad: "150 personnes dans un open space bruyant (>75 dB), appels sans retenue, fatigue mentale.",
          good: "Ambiance feutrée (<42 dB), isolation acoustique d'architecte et cabines phonebox privatives.",
        },
        {
          criteria: "Cadre & Standing Architectural",
          icon: Landmark,
          bad: "Plateaux de bureaux génériques, cloisons amovibles sans âme, éclairage néon froid.",
          good: "Hôtel particulier XIXe siècle en pierre de taille, parquet point de Hongrie, cour pavée secrète.",
        },
        {
          criteria: "Profil des Résidents & Réseau",
          icon: Users,
          bad: "Turnover incessant d'étudiants et nomades de passage, communauté anonyme.",
          good: "Réseau stable de fondateurs, avocats et consultants établis. 94% de fidélité annuelle.",
        },
        {
          criteria: "Contrats & Transparence",
          icon: Sparkles,
          bad: "Frais de dossier occultes, badges payants, café surfacturé et préavis complexes.",
          good: "Tout inclus (fibre 1Gb/s, ménage, charges, café de spécialité). Préavis clair et flexible.",
        },
      ],
    },
    en: {
      tag: "Why Choose Maison Calvé",
      title: "Factory-style coworking or tailored serenity?",
      subtitle:
        "Most shared workspaces maximize density and turnover. At 48 rue Calvé, we cultivate tranquility, architectural heritage, and long-term focus.",
      badLabel: "Standard Coworking Chains",
      goodLabel: "The Maison Calvé Standard",
      cta: "Schedule a private tour",
      rows: [
        {
          criteria: "Parking & Accessibility",
          icon: Car,
          bad: "No on-site parking. Daily street parking scramble or €35/day public lots 10 mins away.",
          good: "Gated private cobblestone courtyard with 9 reserved parking spots right at your door + EV charging.",
        },
        {
          criteria: "Acoustics & Peace of Mind",
          icon: Volume2,
          bad: "150 people crowded together, persistent background chatter (>75 dB), open phone chaos.",
          good: "Quietude of a private library (<42 dB), high-grade acoustic dampening and dedicated phone booths.",
        },
        {
          criteria: "Architectural Standing",
          icon: Landmark,
          bad: "Impersonal drywall open floors, generic corporate interiors, harsh fluorescent lighting.",
          good: "Restored 19th-century private mansion, classic Bordeaux blonde limestone, chevron parquet, inner garden.",
        },
        {
          criteria: "Community & Member Profile",
          icon: Users,
          bad: "High transient turnover of casual passers-by, zero relationship building.",
          good: "Stable circle of partners, attorneys, directors, and visionary founders. 94% annual retention.",
        },
        {
          criteria: "Pricing & Contract Terms",
          icon: Sparkles,
          bad: "Hidden onboarding fees, extra charges per coffee cup, rigid notice periods.",
          good: "All-inclusive transparency (1 Gbps fiber, utilities, daily cleaning, artisan coffee). Fair and flexible terms.",
        },
      ],
    },
    es: {
      tag: "Por Qué Elegir la Maison",
      title: "¿Coworking masivo o serenidad exclusiva?",
      subtitle:
        "La mayoría de espacios compartidos maximizan la densidad. En el 48 rue Calvé cultivamos el silencio, el patrimonio arquitectónico y la estabilidad.",
      badLabel: "Coworking Masivo Tradicional",
      goodLabel: "La Experiencia Maison Calvé",
      cta: "Solicitar una visita privada",
      rows: [
        {
          criteria: "Aparcamiento & Acceso",
          icon: Car,
          bad: "Sin aparcamiento. Dificultad para aparcar en la calle o parkings públicos a 35€/día.",
          good: "Patio privado cerrado con 9 plazas reservadas junto a su oficina + cargadores VE.",
        },
        {
          criteria: "Acústica & Concentración",
          icon: Volume2,
          bad: "Más de 100 personas en espacios ruidosos (>75 dB), llamadas abiertas y fatiga mental.",
          good: "Ambiente sereno (<42 dB), paneles acústicos de arquitecto y cabinas phonebox privadas.",
        },
        {
          criteria: "Patrimonio & Prestigio",
          icon: Landmark,
          bad: "Oficinas estándar sin alma, paredes de pladur y luz blanca artificial.",
          good: "Palacete del siglo XIX en piedra de Burdeos, suelos de madera noble y patio ajardinado.",
        },
        {
          criteria: "Comunidad & Perfil",
          icon: Users,
          bad: "Rotación constante de usuarios esporádicos, ambiente impersonal.",
          good: "Ecosistema selecto de directivos, abogados y consultores. 94% de retención anual.",
        },
        {
          criteria: "Precios & Transparencia",
          icon: Sparkles,
          bad: "Gastos ocultos de gestión, suplementos por cada servicio y contratos rígidos.",
          good: "Todo incluido (fibra de alta velocidad, limpieza, suministros y café de barista).",
        },
      ],
    },
  }[language];

  return (
    <section className="py-24 bg-calve-stone/60 border-y border-calve-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white text-calve-slate border border-calve-border mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-calve-slate" />
              {content.tag}
            </span>
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
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-white border border-calve-border shadow-xs">
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
