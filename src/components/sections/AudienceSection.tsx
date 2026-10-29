"use client";

import React, { useState } from "react";
import { Briefcase, Scale, Compass, Users2, CheckCircle2, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
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
          image: "/images/spaces/real-office-25m-4k.jpg",
          heading: "Le prestige d'un siège social avec parking privatif",
          description:
            "Offrez à votre entreprise une adresse de standing au cœur de Bordeaux. Recevez vos clients, partenaires et investisseurs dans un cadre d'exception tout en bénéficiant de places de parking privatives dans la cour sécurisée.",
          recommendedSpace: "Bureaux privatifs (17–25 m²)",
          recommendedId: "office",
          badge: "Espaces Dirigeants",
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
          image: "/images/spaces/real-meeting-room-30m-4k.jpg",
          heading: "Confidentialité absolue et proximité du centre",
          description:
            "Idéalement situé à quelques minutes du Palais de Justice et du centre d'affaires, Maison Calvé garantit le secret professionnel grâce à son isolation acoustique de haute volée et ses cabines téléphoniques insonorisées.",
          recommendedSpace: "Bureau privatif ou Salle de réunion",
          recommendedId: "meeting",
          badge: "Discrétion & Acoustique",
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
          image: "/images/spaces/real-open-space-fixe-4k.jpg",
          heading: "La concentration d'un bureau privé au tarif de l'open space",
          description:
            "Rompez avec l'isolement du télétravail sans subir le vacarme des tiers-lieux ouverts. Travaillez dans une atmosphère sereine avec café de spécialité illimité et mobilier ergonomique.",
          recommendedSpace: "Open space fixe ou nomade",
          recommendedId: "open-space",
          badge: "Sérénité & Réseau",
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
          image: "/images/spaces/real-meeting-room-30m-4k.jpg",
          heading: "Vos journées d'étude et comités de direction au vert",
          description:
            "Réunissez vos équipes stratégiques dans un salon de 30 m² baigné de lumière naturelle ouvrant sur la cour. Équipement audiovisuel 4K, paperboard et formules petit-déjeuner sur mesure.",
          recommendedSpace: "Salle de réunion 30 m²",
          recommendedId: "meeting",
          badge: "Comités & Séminaires",
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
          image: "/images/spaces/real-office-25m-4k.jpg",
          heading: "The prestige of a private mansion with on-site parking",
          description:
            "Host partners, clients, and board members in an architecturally refined setting while securing on-site courtyard parking in downtown Bordeaux.",
          recommendedSpace: "Private Offices (17–25 m²)",
          recommendedId: "office",
          badge: "Executive Suites",
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
          image: "/images/spaces/real-meeting-room-30m-4k.jpg",
          heading: "Absolute client confidentiality minutes from city center",
          description:
            "Minutes from the Bordeaux courts and business hubs, Maison Calvé guarantees discretion through premium acoustic baffles and private soundproof call pods.",
          recommendedSpace: "Private Suite or Boardroom",
          recommendedId: "meeting",
          badge: "Discretion & Acoustics",
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
          image: "/images/spaces/real-open-space-fixe-4k.jpg",
          heading: "Deep focus environment without traditional coworking noise",
          description:
            "Escape the distractions of home without suffering the chaos of massive open-plan spaces. Work in quiet elegance with unlimited barista coffee.",
          recommendedSpace: "Dedicated or Nomad Desk",
          recommendedId: "open-space",
          badge: "Serenity & Focus",
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
          image: "/images/spaces/real-meeting-room-30m-4k.jpg",
          heading: "Offsites, strategy days, and executive board meetings",
          description:
            "Bring your board or leadership team together in a sun-drenched 30 m² room overlooking the courtyard. Ultra HD 4K displays and custom catering.",
          recommendedSpace: "30 m² Meeting Room",
          recommendedId: "meeting",
          badge: "Board & Offsites",
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
          image: "/images/spaces/real-office-25m-4k.jpg",
          heading: "El prestigio de un palacete con aparcamiento privado",
          description:
            "Reciba a sus clientes e inversores en un entorno distinguido con la ventaja única de aparcar en el patio privado.",
          recommendedSpace: "Despachos privados (17–25 m²)",
          recommendedId: "office",
          badge: "Despachos de Dirección",
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
          image: "/images/spaces/real-meeting-room-30m-4k.jpg",
          heading: "Confidencialidad absoluta y proximidad al centro judicial",
          description:
            "A pocos minutos de los juzgados y del centro de Burdeos, garantizamos la discreción necesaria para el ejercicio legal.",
          recommendedSpace: "Despacho o Sala de reuniones",
          recommendedId: "meeting",
          badge: "Discreción & Acústica",
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
          image: "/images/spaces/real-open-space-fixe-4k.jpg",
          heading: "Concentración total al precio de un coworking abierto",
          description:
            "Trabaje en una atmósfera tranquila con café de especialidad ilimitado, fibra óptica simétrica y mobiliario ergonómico.",
          recommendedSpace: "Open space fijo o flexible",
          recommendedId: "open-space",
          badge: "Tranquilidad & Red",
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
          image: "/images/spaces/real-meeting-room-30m-4k.jpg",
          heading: "Reuniones estratégicas y comités en un marco exclusivo",
          description:
            "Reúna a su equipo en una sala de 30 m² con luz natural hacia el patio, pantalla 4K y servicio de café personalizado.",
          recommendedSpace: "Sala de reuniones 30 m²",
          recommendedId: "meeting",
          badge: "Comités & Seminarios",
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
    <section className="py-14 sm:py-20 bg-calve-cream relative overflow-hidden">
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

        {/* Tab Buttons Pill Strip (Responsive Scroll on Mobile) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x mb-8 sm:mb-10 px-1">
          {content.tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 snap-start whitespace-nowrap ${
                  isActive
                    ? "bg-calve-charcoal text-white shadow-sm border border-calve-charcoal"
                    : "bg-white/90 text-calve-charcoal/80 hover:text-calve-charcoal hover:bg-white border border-calve-border"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-calve-slate-light" : "text-calve-slate"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* CINEMATIC EDITORIAL SHOWCASE CARD (Inspired by Reference) */}
        {/* Real 4K Photography Background + Left Frosted Blur & Gradient */}
        {/* ======================================================== */}
        <div className="relative rounded-3xl lg:rounded-[2.25rem] overflow-hidden border border-calve-charcoal/10 shadow-[0_24px_60px_rgba(23,33,35,0.14)] min-h-[560px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 group transition-all duration-500 bg-calve-charcoal text-white">
          
          {/* Background Real 4K Space Photo */}
          <img
            key={currentTab.id}
            src={currentTab.image}
            alt={currentTab.heading}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-102"
          />

          {/* Left Side Frosted Glass Blur Mask Layer (Smoothly fades from blur on left to sharp on right) */}
          <div
            className="absolute inset-y-0 left-0 w-full md:w-3/4 lg:w-3/5 backdrop-blur-md pointer-events-none"
            style={{
              maskImage: "linear-gradient(to right, black 40%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 40%, transparent 100%)",
            }}
          />

          {/* Cinematic Dark Vignette & Gradients to guarantee 100% text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-calve-charcoal/95 via-calve-charcoal/85 sm:via-calve-charcoal/75 md:via-calve-charcoal/60 to-calve-charcoal/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-calve-charcoal/95 via-transparent to-calve-charcoal/40 pointer-events-none" />

          {/* Top Bar Badges (Editorial Journal Style) */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-bold tracking-wider uppercase text-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
              <span>
                {language === "en"
                  ? "Recommended Solution"
                  : language === "es"
                  ? "Espacio Recomendado"
                  : "Formule Recommandée"}{" "}
                — {currentTab.recommendedSpace}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] font-medium text-stone-200">
              <MapPin className="w-3 h-3 text-calve-slate-light" />
              <span>48 Rue Calvé · Bordeaux Fondaudège</span>
            </div>
          </div>

          {/* Main Grid: Editorial Typography on the Left, Glassmorphism CTA on the Right */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
            
            {/* Left Column: Bold Editorial Title, Description, and Feature Chips */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-extrabold text-white tracking-tight leading-[1.14] drop-shadow-sm max-w-2xl">
                {currentTab.heading}
              </h3>

              <p className="text-sm sm:text-base text-stone-200/95 leading-relaxed max-w-2xl font-normal drop-shadow-xs">
                {currentTab.description}
              </p>

              {/* High-Spec Feature Pills */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl">
                {currentTab.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs text-white font-medium transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: High-End Frosted Glass Action Capsule */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-black/45 backdrop-blur-xl border border-white/20 p-6 sm:p-7 text-center space-y-4 shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 text-white mx-auto flex items-center justify-center shadow-inner">
                  <currentTab.icon className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {currentTab.label}
                  </h4>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    {language === "en"
                      ? "Personalized tour & quote within 24h with Paul."
                      : language === "es"
                      ? "Visita guiada y presupuesto en 24h con Paul."
                      : "Visite personnalisée et devis sous 24h avec Paul."}
                  </p>
                </div>

                <button
                  onClick={() => onOpenEnquiry(currentTab.recommendedId)}
                  className="w-full py-4 px-6 rounded-xl bg-white hover:bg-stone-100 text-calve-charcoal text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{content.cta}</span>
                  <ArrowRight className="w-4 h-4 text-calve-charcoal" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Footer Lockup inside Card (Matches Editorial Reference) */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-300/80">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center text-[11px] font-black text-white">
                MC
              </span>
              <span className="font-semibold text-white/90">
                Maison Calvé · Coworking & Siège Social
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-stone-300/80">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Accès sécurisé & 9 places de parking</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
