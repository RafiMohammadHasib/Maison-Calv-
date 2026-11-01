"use client";

import React, { useState } from "react";
import Image from "next/image";
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
          image: "/images/spaces/real-office-21m-4k.jpg",
          heading: "Le prestige d'un siège social avec parking privatif",
          description:
            "Offrez à votre entreprise une adresse de standing au cœur de Bordeaux. Recevez vos clients, partenaires et investisseurs dans un cadre d'exception tout en bénéficiant de places de parking privatives dans la cour sécurisée.",
          recommendedSpace: "Bureaux privatifs (21–28 m²)",
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
          image: "/images/spaces/real-office-21m-4k.jpg",
          heading: "The prestige of a private mansion with on-site parking",
          description:
            "Host partners, clients, and board members in an architecturally refined setting while securing on-site courtyard parking in downtown Bordeaux.",
          recommendedSpace: "Private Offices (21–28 m²)",
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
          recommendedSpace: "Despachos privados (21–28 m²)",
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

        {/* Tab Buttons Pill Strip (Modern Segmented Pill Design) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 pt-1 scrollbar-none snap-x mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-stone-200/80 border border-stone-300/60 backdrop-blur-md shadow-2xs">
            {content.tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === index;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 snap-start whitespace-nowrap ${
                    isActive
                      ? "bg-[#2D4B49] text-white shadow-sm"
                      : "text-stone-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-stone-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* CINEMATIC EDITORIAL SHOWCASE CARD                        */}
        {/* Real 4K Photography + Subtle Left Blur & Vignette        */}
        {/* ======================================================== */}
        <div className="relative rounded-3xl lg:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_24px_60px_rgba(23,33,35,0.18)] min-h-[580px] lg:min-h-[620px] flex flex-col justify-between p-6 sm:p-10 lg:p-14 group transition-all duration-500 bg-slate-950 text-white">
          
          {/* Background Real 4K Space Photo */}
          <img
            key={currentTab.id}
            src={currentTab.image}
            alt={currentTab.heading}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-102"
          />

          {/* Left Side Frosted Glass Blur Mask Layer */}
          <div
            className="absolute inset-y-0 left-0 w-full md:w-3/4 lg:w-3/5 backdrop-blur-[3px] pointer-events-none"
            style={{
              maskImage: "linear-gradient(to right, black 40%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 40%, transparent 100%)",
            }}
          />

          {/* Architectural Vignette: smooth, deep left gradient that lets natural daylight & room shine through on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/94 via-slate-950/80 sm:via-slate-950/55 to-slate-950/15 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/35 pointer-events-none" />

          {/* Top Bar Badges (Editorial Journal Style) */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/15 text-[11px] font-semibold tracking-wider uppercase text-stone-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>{currentTab.badge}</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-300 font-normal">{currentTab.label}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/15 text-[11px] font-medium text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>48 Rue Calvé · Bordeaux Fondaudège</span>
            </div>
          </div>

          {/* Main Editorial Content: Bold Headline, Description, Elegant Highlights, Primary CTA */}
          <div className="relative z-10 my-auto py-4 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-white tracking-tight leading-[1.14] drop-shadow-sm">
              {currentTab.heading}
            </h3>

            <p className="mt-4 text-sm sm:text-base text-stone-200/90 leading-relaxed max-w-xl font-normal drop-shadow-xs">
              {currentTab.description}
            </p>

            {/* High-End Feature Highlights (Clean & Delicate Line Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 pt-6 max-w-xl">
              {currentTab.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-[13px] text-stone-200">
                  <div className="w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="leading-snug text-stone-200/95">{item}</span>
                </div>
              ))}
            </div>

            {/* Action Lockup: Primary Button + Host Guarantee */}
            <div className="pt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={() => onOpenEnquiry(currentTab.recommendedId)}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-slate-950 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{content.cta}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <div className="text-xs text-stone-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>
                  {language === "en"
                    ? "Private tour & quote within 24h with Paul"
                    : language === "es"
                    ? "Visita privada y presupuesto en 24h con Paul"
                    : "Visite privée & devis sous 24h avec Paul"}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Lockup (Editorial Signature) */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-300/80">
            <div className="flex items-center gap-3">
              <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/20 shrink-0 shadow-inner">
                <Image
                  src="/images/brand/maison-calve-logo.png"
                  alt="Maison Calvé"
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wide">MAISON CALVÉ</span>
                <span className="text-stone-500">·</span>
                <span className="text-stone-300 font-normal">
                  {currentTab.recommendedSpace}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-300/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Accès sécurisé &amp; 9 places de parking privatives</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
