"use client";

import React from "react";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { Language, CONTENT } from "@/data/content";

interface PricingSectionProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string) => void;
}

export default function PricingSection({ language, onOpenEnquiry }: PricingSectionProps) {
  const t = CONTENT[language].pricingSection;

  const plans = [
    {
      id: "open-space-flexible",
      name: language === "fr" ? "Option Flexible Nomade" : language === "en" ? "Flexible Nomad Pass" : "Opción Flexible Nómada",
      tagline: language === "fr" ? "Idéal pour télétravailleurs & indépendants" : language === "en" ? "Ideal for remote workers & founders" : "Ideal para nómadas y remotos",
      price: "20€ / 10€",
      tax: "HT",
      period: language === "fr" ? "journée (20€) / demi-journée (10€)" : language === "en" ? "day (€20) / half-day (€10)" : "día (20€) / media jornada (10€)",
      popular: false,
      features: language === "fr" ? [
        "Accessible pendant 24h",
        "Accès illimité aux espaces communs",
        "Cuisine, sanitaires & espace détente",
        "Boissons chaudes/froides & snacks inclus",
        "Internet fibre haut débit sécurisé",
        "Accès phonebox pour appels confidentiels"
      ] : language === "en" ? [
        "24-hour pass validity",
        "Unlimited access to common areas",
        "Equipped kitchen, amenities & lounge",
        "Complimentary hot/cold drinks & snacks",
        "Secure high-speed fiber internet",
        "Phone booth access for private calls"
      ] : [
        "Validez de pase 24 horas",
        "Acceso ilimitado a zonas comunes",
        "Cocina equipada, aseos y descanso",
        "Bebidas frías/calientes y snacks incluidos",
        "Fibra óptica de alta velocidad y segura",
        "Cabina phonebox para llamadas privadas"
      ]
    },
    {
      id: "open-space-fixe",
      name: language === "fr" ? "Option Fixe Open Space" : language === "en" ? "Dedicated Desk Resident" : "Puesto Fijo Residente",
      tagline: language === "fr" ? "Votre bureau attitré dans un calme absolu" : language === "en" ? "Your dedicated desk in quiet calm" : "Tu escritorio asignado en calma total",
      price: "250€",
      tax: "HT",
      period: language === "fr" ? "par mois pour un poste fixe" : language === "en" ? "per month for a dedicated desk" : "al mes por un puesto fijo",
      popular: true,
      features: language === "fr" ? [
        "Ameublement personnalisé de qualité",
        "Accessible 7j/7 et 24h/24",
        "Accès illimité espaces communs (cuisine, sanitaires)",
        "Salle de réunion en accès partagé",
        "Boissons chaudes/froides & snacks inclus",
        "Possibilité de domiciliation d'entreprise"
      ] : language === "en" ? [
        "High-quality personalized desk & chair",
        "24/7 keyless secure access",
        "Unlimited common area access (kitchen, amenities)",
        "Shared meeting room booking privileges",
        "All beverages and snacks included",
        "Company business domiciliation option"
      ] : [
        "Mobiliario de calidad personalizado",
        "Acceso seguro 24/7",
        "Acceso ilimitado a zonas comunes (cocina, aseos)",
        "Acceso a sala de reuniones compartida",
        "Bebidas frías/calientes y snacks incluidos",
        "Opción de domiciliación de empresa"
      ]
    },
    {
      id: "office-17m",
      name: language === "fr" ? "Bureaux Privatifs" : language === "en" ? "Private Office Suites" : "Despachos Privados",
      tagline: language === "fr" ? "Pour équipes de 3 à 6 collaborateurs" : language === "en" ? "For teams of 3 to 6 members" : "Para equipos de 3 a 6 personas",
      price: "750€ à 1200€",
      tax: "HT",
      period: language === "fr" ? "par mois (21 m² à 28 m²)" : language === "en" ? "per month (21 sqm to 28 sqm)" : "al mes (21 m² a 28 m²)",
      popular: false,
      features: language === "fr" ? [
        "Bureaux privatifs fermés de 21 à 28 m²",
        "Ameublement personnalisé complet",
        "Accessible 7j/7 et 24h/24",
        "Accès illimité aux espaces communs",
        "Boissons chaudes/froides & snacks inclus",
        "Domiciliation d'entreprise comprise (1ère année)",
        "Accès prioritaire aux 9 places de parking"
      ] : language === "en" ? [
        "Enclosed private offices 21 to 28 sqm",
        "Complete bespoke furniture provided",
        "24/7 keyless secure access",
        "Unlimited access to common areas",
        "All beverages and snacks included",
        "Business domiciliation included (1st year)",
        "Priority access to 9 courtyard parking spaces"
      ] : [
        "Despachos privados cerrados de 21 a 28 m²",
        "Mobiliario completo a medida",
        "Acceso seguro 24/7",
        "Acceso ilimitado a zonas comunes",
        "Bebidas frías/calientes y snacks incluidos",
        "Domiciliación de empresa incluida (1er año)",
        "Acceso preferente a las 9 plazas de parking"
      ]
    },
    {
      id: "meeting-room",
      name: language === "fr" ? "Salle de Réunion 30 m²" : language === "en" ? "Meeting Room 30 sqm" : "Sala de Reuniones 30 m²",
      tagline: language === "fr" ? "Comités, formations & séminaires" : language === "en" ? "Board meetings, trainings & workshops" : "Reuniones de consejo y formaciones",
      price: "120€ / 200€",
      tax: "HT",
      period: language === "fr" ? "demi-journée (120€) / journée (200€)" : language === "en" ? "half-day (€120) / full day (€200)" : "media jornada (120€) / día (200€)",
      popular: false,
      features: language === "fr" ? [
        "Salle de 30 m² full équipée",
        "Écran 4K visioconférence & AirPlay",
        "Internet très haut débit dédié",
        "Boissons chaudes/froides & collations",
        "Capacité jusqu'à 14 participants",
        "Stationnement facile dans la cour privée"
      ] : language === "en" ? [
        "30 sqm fully-equipped boardroom",
        "4K display with video conf & AirPlay",
        "Ultra high-speed dedicated fiber",
        "Hot & cold drinks and refreshments",
        "Capacity up to 14 participants",
        "Courtyard parking available for attendees"
      ] : [
        "Sala de 30 m² totalmente equipada",
        "Pantalla 4K con videoconferencia y AirPlay",
        "Fibra óptica ultrarrápida dedicada",
        "Bebidas y aperitivos para asistentes",
        "Capacidad hasta 14 participantes",
        "Parking en el patio disponible"
      ]
    }
  ];

  return (
    <section id="tarifs" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12" data-reveal="fade-up">
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

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" data-reveal="stagger">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? "bg-calve-cream border-2 border-calve-slate shadow-md relative"
                  : "bg-white border border-calve-border hover:border-calve-slate/50 shadow-2xs hover:shadow-xs"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-calve-slate text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
                  {language === "en" ? "Recommended" : language === "es" ? "Recomendado" : "Recommandé"}
                </div>
              )}

              <div>
                <div className="mb-4">
                  <h3 className="font-bold text-xl tracking-tight text-calve-charcoal">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-calve-muted mt-1">
                    {plan.tagline}
                  </p>
                </div>

                <div className="py-4 my-2 border-y border-calve-border/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-calve-charcoal">
                      {plan.price}
                    </span>
                    <span className="text-xs font-semibold text-calve-slate">
                      {plan.tax}
                    </span>
                  </div>
                  <span className="text-[11px] text-calve-muted block mt-1">
                    {plan.period}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 py-4 text-xs text-calve-charcoal/90">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-calve-slate shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onOpenEnquiry(plan.id)}
                  className={`w-full py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    plan.popular
                      ? "bg-calve-slate hover:bg-calve-slate-dark text-white shadow-xs"
                      : "bg-calve-stone/60 hover:bg-calve-slate hover:text-white text-calve-charcoal"
                  }`}
                >
                  <span>
                    {language === "en" ? "Enquire" : language === "es" ? "Solicitar" : "Demander"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer / Transparency Box */}
        <div className="mt-8 sm:mt-10 p-6 rounded-2xl bg-calve-stone/40 border border-calve-border text-xs text-calve-muted leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <p className="text-calve-charcoal font-medium">
                {t.disclaimer}
              </p>
              <p className="text-[11px] text-calve-muted mt-0.5">
                {t.commitmentNote}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenEnquiry("office")}
            className="shrink-0 px-4 py-2 rounded-lg bg-white border border-calve-border hover:border-calve-slate text-calve-charcoal text-xs font-medium cursor-pointer"
          >
            {language === "en"
              ? "Speak with the team"
              : language === "es"
              ? "Contactar con el equipo"
              : "Échanger avec l'équipe"}
          </button>
        </div>
      </div>
    </section>
  );
}
