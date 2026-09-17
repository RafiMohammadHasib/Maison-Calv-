"use client";

import React, { useState } from "react";
import { Briefcase, Scale, Compass, Users2, CheckCircle2, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Language } from "@/data/content";

interface AudienceSectionProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string) => void;
}

export default function AudienceSection({
  language,
  onOpenEnquiry,
}: AudienceSectionProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const content = {
    fr: {
      tag: "Pour Qui ?",
      title: "Des solutions pensées pour chaque profil d'exigence.",
      subtitle:
        "Que vous soyez dirigeant d'entreprise, professionnel du droit ou consultant indépendant, découvrez comment Maison Calvé s'adapte à votre pratique quotidienne.",
      tabs: [
        {
          id: "executives",
          label: "Dirigeants & PME",
          icon: Briefcase,
          heading: "Le prestige d'un siège social avec parking privatif",
          description:
            "Offrez à votre entreprise une adresse de standing au cœur de Bordeaux. Recevez vos clients, partenaires et investisseurs dans un cadre d'exception tout en bénéficiant de places de parking privatives dans la cour sécurisée.",
          recommendedSpace: "Bureaux privatifs (17–30 m²)",
          recommendedId: "office",
          highlights: [
            "Accès direct en voiture avec place réservée en cour fermée",
            "Bureaux fermés sécurisés avec contrôle d'accès",
            "Domiciliation commerciale et réception du courrier",
            "Accès 24/7 pour vos équipes et créneaux flexibles",
          ],
        },
        {
          id: "lawyers",
          label: "Avocats & Juristes",
          icon: Scale,
          heading: "Confidentialité absolue et proximité du centre",
          description:
            "Idéalement situé à quelques minutes du Palais de Justice et du centre d'affaires, Maison Calvé garantit le secret professionnel grâce à son isolation acoustique de haute volée et ses cabines téléphoniques insonorisées.",
          recommendedSpace: "Bureau privatif ou Salle de réunion",
          recommendedId: "meeting",
          highlights: [
            "Isolation phonique renforcée (<42 dB dans les espaces)",
            "Cabines phonebox individuelles pour entretiens confidentiels",
            "Salle de réunion 30 m² pour plaidoiries et médiations",
            "Accès Tram D direct (station Fondaudège - Muséum)",
          ],
        },
        {
          id: "consultants",
          label: "Consultants & Indépendants",
          icon: Compass,
          heading: "La concentration d'un bureau privé au tarif de l'open space",
          description:
            "Rompez avec l'isolement du télétravail sans subir le vacarme des tiers-lieux ouverts. Travaillez dans une atmosphère sereine avec café de spécialité illimité et mobilier ergonomique.",
          recommendedSpace: "Open space fixe ou nomade",
          recommendedId: "open-space",
          highlights: [
            "Poste dédié avec rangements sécurisés ou accès nomade à la carte",
            "Fibre optique 1 Gb/s symétrique & Wi-Fi 6 Cisco",
            "Café en grains et thés biologiques offerts en continu",
            "Formule flexible sans engagement longue durée",
          ],
        },
        {
          id: "teams",
          label: "Équipes & Conseils",
          icon: Users2,
          heading: "Vos journées d'étude et comités de direction au vert",
          description:
            "Réunissez vos équipes stratégiques dans un salon de 30 m² baigné de lumière naturelle ouvrant sur la cour. Équipement audiovisuel 4K, paperboard et formules petit-déjeuner sur mesure.",
          recommendedSpace: "Salle de réunion 30 m²",
          recommendedId: "meeting",
          highlights: [
            "Capacité jusqu'à 12 personnes assises",
            "Écran 4K 65'', visioconférence haute définition",
            "Possibilité de réserver des places de parking pour vos invités",
            "Accueil personnalisé par Paul et l'équipe",
          ],
        },
      ],
      cta: "Découvrir la formule adaptée",
    },
    en: {
      tag: "Tailored For You",
      title: "Workspace solutions engineered for discerning professionals.",
      subtitle:
        "Whether you are an executive founder, a legal practitioner, or a strategic consultant, see how Maison Calvé elevates your day-to-day work.",
      tabs: [
        {
          id: "executives",
          label: "Founders & SMEs",
          icon: Briefcase,
          heading: "The prestige of a private mansion with on-site parking",
          description:
            "Host partners, clients, and board members in an architecturally refined setting while securing on-site courtyard parking in downtown Bordeaux.",
          recommendedSpace: "Private Offices (17–30 m²)",
          recommendedId: "office",
          highlights: [
            "Direct courtyard vehicle access with assigned bay",
            "Secure keycard offices with high-spec security",
            "Corporate business address and mail handling",
            "24/7 keyless access for your core leadership",
          ],
        },
        {
          id: "lawyers",
          label: "Attorneys & Advisors",
          icon: Scale,
          heading: "Absolute client confidentiality minutes from city center",
          description:
            "Minutes from the Bordeaux courts and business hubs, Maison Calvé guarantees discretion through premium acoustic baffles and private soundproof call pods.",
          recommendedSpace: "Private Suite or Boardroom",
          recommendedId: "meeting",
          highlights: [
            "Reinforced sound attenuation (<42 dB throughout)",
            "Private phone booths for sensitive client calls",
            "30 m² boardroom for confidential negotiations",
            "Immediate Tram Line D connectivity",
          ],
        },
        {
          id: "consultants",
          label: "Consultants & Freelancers",
          icon: Compass,
          heading: "Deep focus environment without traditional coworking noise",
          description:
            "Escape the distractions of home without suffering the chaos of massive open-plan spaces. Work in quiet elegance with unlimited barista coffee.",
          recommendedSpace: "Dedicated or Nomad Desk",
          recommendedId: "open-space",
          highlights: [
            "Fixed desk with secure locker or flexible day passes",
            "Symmetrical 1 Gbps fiber & enterprise Wi-Fi 6",
            "Artisanal specialty coffee & organic herbal teas included",
            "Flexible monthly or daily billing without lock-in",
          ],
        },
        {
          id: "teams",
          label: "Executive Offsites",
          icon: Users2,
          heading: "Offsites, strategy days, and executive board meetings",
          description:
            "Bring your board or leadership team together in a sun-drenched 30 m² room overlooking the courtyard. Ultra HD 4K displays and custom catering.",
          recommendedSpace: "30 m² Meeting Room",
          recommendedId: "meeting",
          highlights: [
            "Comfortable seating for up to 12 delegates",
            "65'' 4K video conferencing display & high-speed casting",
            "On-site courtyard parking reservations for your guests",
            "Personalized hosting by Paul and the team",
          ],
        },
      ],
      cta: "Enquire about this solution",
    },
    es: {
      tag: "A Su Medida",
      title: "Soluciones pensadas para profesionales exigentes.",
      subtitle:
        "Ya sea directivo de empresa, abogado o consultor independiente, Maison Calvé se adapta a su ritmo y requerimientos.",
      tabs: [
        {
          id: "executives",
          label: "Directivos & PYMEs",
          icon: Briefcase,
          heading: "El prestigio de un palacete con aparcamiento privado",
          description:
            "Reciba a sus clientes e inversores en un entorno distinguido con la ventaja única de aparcar en el patio privado.",
          recommendedSpace: "Despachos privados (17–30 m²)",
          recommendedId: "office",
          highlights: [
            "Acceso en coche directo con plaza reservada en patio cerrado",
            "Oficinas cerradas y seguras con acceso 24/7",
            "Domiciliación de empresas y recepción postal",
            "Ambiente representativo de alto standing",
          ],
        },
        {
          id: "lawyers",
          label: "Abogados & Asesores",
          icon: Scale,
          heading: "Confidencialidad absoluta y proximidad al centro judicial",
          description:
            "A pocos minutos de los juzgados y del centro de Burdeos, garantizamos la discreción necesaria para el ejercicio legal.",
          recommendedSpace: "Despacho o Sala de reuniones",
          recommendedId: "meeting",
          highlights: [
            "Aislamiento acústico de primer nivel (<42 dB)",
            "Cabinas telefónicas insonorizadas para llamadas privadas",
            "Sala de 30 m² para juntas y mediaciones",
            "Conexión directa con Tranvía Línea D",
          ],
        },
        {
          id: "consultants",
          label: "Consultores & Autónomos",
          icon: Compass,
          heading: "Concentración total al precio de un coworking abierto",
          description:
            "Trabaje en una atmósfera tranquila con café de especialidad ilimitado, fibra óptica simétrica y mobiliario ergonómico.",
          recommendedSpace: "Open space fijo o flexible",
          recommendedId: "open-space",
          highlights: [
            "Puesto fijo o bono nómada sin permanencia",
            "Fibra óptica simétrica 1 Gb/s y Wi-Fi 6",
            "Café artesanal y tés biológicos incluidos",
            "Flexibilidad total sin sorpresas",
          ],
        },
        {
          id: "teams",
          label: "Jornadas de Dirección",
          icon: Users2,
          heading: "Reuniones estratégicas y comités en un marco exclusivo",
          description:
            "Reúna a su equipo en una sala de 30 m² con luz natural hacia el patio, pantalla 4K y servicio de café personalizado.",
          recommendedSpace: "Sala de reuniones 30 m²",
          recommendedId: "meeting",
          highlights: [
            "Capacidad para hasta 12 asistentes",
            "Pantalla 4K 65'' para presentaciones y videoconferencias",
            "Posibilidad de reservar aparcamiento para invitados",
            "Atención directa y personalizada",
          ],
        },
      ],
      cta: "Solicitar información",
    },
  }[language];

  const currentTab = content.tabs[activeTab] || content.tabs[0];

  return (
    <section className="py-24 bg-calve-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-calve-stone text-calve-slate border border-calve-border mb-3">
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

        {/* Tab Buttons Pill Strip */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {content.tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-calve-charcoal text-white shadow-sm scale-105"
                    : "bg-white text-calve-muted hover:text-calve-charcoal hover:bg-calve-stone/70 border border-calve-border"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-calve-slate-light" : "text-stone-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Card */}
        <div className="bg-white rounded-3xl border border-calve-border p-8 sm:p-12 shadow-xs transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-calve-stone text-calve-slate text-xs font-semibold">
                <span>
                  {language === "en"
                    ? "Recommended solution:"
                    : language === "es"
                    ? "Espacio recomendado:"
                    : "Formule recommandée :"}
                </span>
                <span className="text-calve-charcoal font-bold">{currentTab.recommendedSpace}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-calve-charcoal tracking-tight">
                {currentTab.heading}
              </h3>

              <p className="text-sm sm:text-base text-calve-muted leading-relaxed">
                {currentTab.description}
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentTab.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-calve-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-calve-cream border border-calve-stone p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-calve-slate text-white mx-auto flex items-center justify-center shadow-xs">
                  <currentTab.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-calve-charcoal uppercase tracking-wider">
                    {currentTab.label}
                  </h4>
                  <p className="text-xs text-calve-muted mt-1">
                    {language === "en"
                      ? "Personalized tour & quote within 24h with Paul."
                      : language === "es"
                      ? "Visita guiada y presupuesto en 24h con Paul."
                      : "Visite personnalisée et devis sous 24h avec Paul."}
                  </p>
                </div>
                <button
                  onClick={() => onOpenEnquiry(currentTab.recommendedId)}
                  className="w-full py-3.5 px-5 rounded-xl bg-calve-slate hover:bg-calve-slate-light text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{content.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
