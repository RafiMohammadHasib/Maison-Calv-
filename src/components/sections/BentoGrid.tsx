"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Car,
  Volume2,
  Coffee,
  Wifi,
  ShieldCheck,
  Copy,
  Check,
  Sparkles,
  ArrowUpRight,
  Lock,
  PhoneCall,
  Users,
  Building2,
  Zap,
  MapPin
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Language } from "@/data/content";

interface BentoGridProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string) => void;
}

export default function BentoGrid({ language, onOpenEnquiry }: BentoGridProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("48 rue Calvé, 33000 Bordeaux");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const content = {
    fr: {
      tag: "Écosystème & Art de Vivre",
      title: "L'exigence d'un hôtel particulier, l'agilité d'un espace moderne.",
      subtitle:
        "Découvrez l'équilibre parfait entre patrimoine architectural bordelais, sérénité de travail et commodités introuvables en hyper-centre.",
      mansion: {
        tag: "Hôtel Particulier XIXe",
        title: "Le 48 rue Calvé, écrin de caractère",
        desc: "Façade en pierre blonde de taille, cour pavée secrète et boiseries d'origine préservées.",
        copyBtn: copied ? "Adresse copiée !" : "Copier l'adresse",
        quarter: "Triangle d'Or · Fondaudège",
        transitLink: "Tram D & Accès",
      },
      parking: {
        tag: "Privilège Rare à Bordeaux",
        title: "Cour pavée & 9 places réservées",
        desc: "Fini la quête d'une place en voirie ou les parkings souterrains à 35€/jour. Entrez directement au bureau.",
        feature1: "9 places privatives en cour pavée fermée",
        feature2: "Bornes de recharge VE 22 kW connectées",
        feature3: "Accès sécurisé 24/7 par portail motorisé & badge",
        detailsBtn: "Découvrir le parking",
      },
      acoustic: {
        tag: "Atmosphère Feutrée",
        title: "Silence & Concentration (<42 dB)",
        desc: "Panneaux acoustiques d'architecte, doubles vitrages isolants et politique de courtoisie. L'opposé des plateaux bruyants.",
        statLabel: "Niveau sonore moyen",
        statValue: "< 42 dB",
        comparison: "vs 75 dB en coworking usine",
      },
      coffee: {
        tag: "Moments de Partage",
        title: "Cuisine d'hôtes & Café de spécialité",
        desc: "Café en grains fraîchement moulu, thés bios, vaisselle en céramique et grande table pour déjeuner au calme ou en terrasse.",
        item1: "Café artisanal illimité",
        item2: "Table d'hôtes en chêne",
      },
      tech: {
        tag: "Haute Disponibilité",
        title: "Fibre 1 Gb/s & Phonebox privative",
        desc: "Wi-Fi 6 Cisco Meraki sécurisé, double réseau de secours et cabines acoustiques individuelles pour vos appels confidentiels.",
        metric1: "1 Gb/s symétrique",
        metric2: "Isolation phonique 34 dB",
        metricLabel1: "Fibre symétrique",
        metricLabel2: "Cabines phonebox",
      },
      community: {
        tag: "Réseau Choisie",
        title: "Un écosystème pérenne, zéro rotation impersonnelle.",
        desc: "Avocats, consultants de direction, dirigeants de PME et fondateurs exigeants. Une ambiance bienveillante et professionnelle où chacun se connaît et se respecte.",
        pill1: "94% de fidélité annuelle",
        pill2: "Contrats flexibles sans mauvaise surprise",
        pill3: "Domiciliation commerciale prestigieuse",
        cta: "Découvrir la vie à la Maison",
      },
    },
    en: {
      tag: "Ecosystem & Living Heritage",
      title: "The refinement of a private mansion, the agility of modern work.",
      subtitle:
        "Experience the singular balance between 19th-century Bordeaux stone heritage, deep focus, and downtown amenities you won't find anywhere else.",
      mansion: {
        tag: "19th-Century Private Mansion",
        title: "48 rue Calvé, timeless character",
        desc: "Classic Bordeaux blonde stone facade, private cobblestone courtyard, and preserved original wood mouldings.",
        copyBtn: copied ? "Address copied!" : "Copy address",
        quarter: "Golden Triangle · Fondaudège",
        transitLink: "Tram D & Access",
      },
      parking: {
        tag: "Ultra-Rare in Downtown Bordeaux",
        title: "Courtyard & 9 private parking bays",
        desc: "No more circling for on-street parking or €35/day underground garages. Drive straight through the private gate.",
        feature1: "9 private bays in enclosed cobblestone courtyard",
        feature2: "Connected 22 kW EV charging stations",
        feature3: "24/7 keycard & motorized remote gate access",
        detailsBtn: "Explore parking",
      },
      acoustic: {
        tag: "Deep Focus Atmosphere",
        title: "Quietude & Privacy (<42 dB)",
        desc: "Architectural acoustic panels, high-spec insulation, and a culture of quiet respect. The antidote to factory-style coworking.",
        statLabel: "Average sound level",
        statValue: "< 42 dB",
        comparison: "vs 75 dB in open-space chains",
      },
      coffee: {
        tag: "Convivial Living",
        title: "Resident kitchen & specialty coffee",
        desc: "Locally roasted specialty beans, organic teas, artisanal tableware, and a solid oak communal dining table.",
        item1: "Unlimited specialty coffee",
        item2: "Solid oak dining table",
      },
      tech: {
        tag: "Enterprise-Grade IT",
        title: "1 Gbps Fiber & Soundproof Phonebox",
        desc: "Enterprise Cisco Meraki Wi-Fi 6, dual-WAN redundancy, and private acoustic phone booths for confidential calls.",
        metric1: "1 Gbps symmetrical",
        metric2: "34 dB sound attenuation",
        metricLabel1: "Symmetrical fiber",
        metricLabel2: "Phone booths",
      },
      community: {
        tag: "Curated Circle",
        title: "A lasting community, zero transient turnover.",
        desc: "Attorneys, management consultants, SME leaders, and visionary founders. A respectful, high-trust circle where members thrive long-term.",
        pill1: "94% annual retention",
        pill2: "Transparent, flexible terms",
        pill3: "Prestigious corporate address",
        cta: "Explore residency options",
      },
    },
    es: {
      tag: "Ecosistema & Estilo de Vida",
      title: "La distinción de un palacete, la agilidad del trabajo moderno.",
      subtitle:
        "Descubra el equilibrio entre el patrimonio de piedra bordelesa, serenidad de trabajo y comodidades exclusivas en pleno centro.",
      mansion: {
        tag: "Palacete del Siglo XIX",
        title: "48 rue Calvé, carácter atemporal",
        desc: "Fachada en piedra rubia bordelesa, patio adoquinado privado y molduras originales conservadas.",
        copyBtn: copied ? "¡Dirección copiada!" : "Copiar dirección",
        quarter: "Triángulo de Oro · Fondaudège",
        transitLink: "Tranvía D & Acceso",
      },
      parking: {
        tag: "Privilegio Único en Burdeos",
        title: "Patio interior & 9 plazas privadas",
        desc: "Olvídese del aparcamiento en la calle o los garajes públicos a 35€/día. Aparque directamente en su oficina.",
        feature1: "9 plazas privadas en patio empedrado cerrado",
        feature2: "Puntos de recarga de vehículos eléctricos 22 kW",
        feature3: "Acceso seguro 24/7 con portón motorizado y badge",
        detailsBtn: "Descubrir el parking",
      },
      acoustic: {
        tag: "Atmósfera Tranquila",
        title: "Silencio & Concentración (<42 dB)",
        desc: "Aislamiento acústico de alto nivel y cultura de respeto mutuo. Lo opuesto a los coworkings ruidosos de masas.",
        statLabel: "Nivel sonoro medio",
        statValue: "< 42 dB",
        comparison: "frente a 75 dB en cadenas masivas",
      },
      coffee: {
        tag: "Espacio Convivial",
        title: "Cocina comunitaria & café gourmet",
        desc: "Café en grano recién molido, tés biológicos y mesa comunitaria de roble para comer o relajarse.",
        item1: "Café de barista ilimitado",
        item2: "Gran mesa de roble",
      },
      tech: {
        tag: "Alta Disponibilidad",
        title: "Fibra 1 Gb/s & Cabina Phonebox privada",
        desc: "Wi-Fi 6 Cisco Meraki seguro, redundancia de red y cabinas acústicas individuales para llamadas confidenciales.",
        metric1: "1 Gb/s simétrico",
        metric2: "Aislamiento acústico 34 dB",
        metricLabel1: "Fibra simétrica",
        metricLabel2: "Cabinas phonebox",
      },
      community: {
        tag: "Comunidad Selecta",
        title: "Un ecosistema estable, cero rotación impersonal.",
        desc: "Abogados, consultores estratégicos y directivos que valoran la estabilidad y la privacidad.",
        pill1: "94% de fidelidad anual",
        pill2: "Tarifas claras sin gastos ocultos",
        pill3: "Domiciliación de prestigio",
        cta: "Descubrir la vida en la Maison",
      },
    },
  }[language];

  return (
    <section id="bento" className="py-24 bg-calve-cream relative overflow-hidden">
      {/* Background architectural grid lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#5b7074_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="max-w-3xl mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-calve-stone text-calve-slate mb-3 border border-calve-border">
              <Sparkles className="w-3.5 h-3.5 text-calve-slate" />
              {content.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-calve-charcoal tracking-tight leading-tight">
              {content.title}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-calve-muted leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Large Hotel Particulier (Col 12, lg:Col 8) */}
          <div className="md:col-span-12 lg:col-span-8 group relative rounded-3xl overflow-hidden border border-calve-border bg-white shadow-xs hover:shadow-md transition-all duration-300 min-h-[420px] flex flex-col justify-between p-7 sm:p-9">
            {/* Background Image with Dark Vignette */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/calve-exterior.jpg"
                alt="Façade hôtel particulier Maison Calvé Bordeaux"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-calve-charcoal/95 via-calve-charcoal/60 to-calve-charcoal/20" />
            </div>

            {/* Top Bar inside Card */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/20">
                {content.mansion.tag}
              </span>
              <span className="text-xs text-white/80 font-medium px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                {content.mansion.quarter}
              </span>
            </div>

            {/* Bottom Content inside Card */}
            <div className="relative z-10 mt-auto pt-16">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {content.mansion.title}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-stone-200/90 max-w-xl leading-relaxed">
                {content.mansion.desc}
              </p>

              {/* Interactive Address Copy Bar */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-calve-charcoal text-xs font-semibold tracking-wide shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-calve-slate" />
                  )}
                  <span>48 rue Calvé, 33000 Bordeaux</span>
                  <span className="text-[10px] text-calve-slate-light ml-1 font-normal">
                    ({content.mansion.copyBtn})
                  </span>
                </button>

                <a
                  href="#localisation"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-medium border border-white/20 transition-colors"
                >
                  <span>{content.mansion.transitLink}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Cour Pavée & 9 Parkings (Col 12, lg:Col 4) */}
          <div className="md:col-span-12 lg:col-span-4 group relative rounded-3xl overflow-hidden border border-calve-border bg-calve-charcoal shadow-xs hover:shadow-md transition-all duration-300 min-h-[420px] flex flex-col justify-between p-7 sm:p-8">
            {/* Real Background Image with Dark Vignette */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/calve-parking.jpg"
                alt="Cour pavée et parking privé sécurisé Maison Calvé Bordeaux"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-calve-charcoal/95 via-calve-charcoal/80 to-calve-charcoal/45" />
            </div>

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 backdrop-blur-md">
                <Zap className="w-3 h-3 text-emerald-400" />
                {content.parking.tag}
              </span>
              <span className="text-xs text-white/90 font-bold px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shrink-0">
                9 {language === "en" ? "Bays" : language === "es" ? "Plazas" : "Places"}
              </span>
            </div>

            {/* Content & Features */}
            <div className="relative z-10 mt-auto pt-8">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {content.parking.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-200/90 leading-relaxed">
                {content.parking.desc}
              </p>

              {/* 3 Luxury Feature Cards instead of the fake 3x3 button wireframe */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-stone-200 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                  <Car className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{content.parking.feature1}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-200 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                  <Zap className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{content.parking.feature2}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-200 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-calve-slate-light shrink-0" />
                  <span>{content.parking.feature3}</span>
                </div>
              </div>

              {/* Footer action */}
              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
                <span className="text-xs text-stone-300 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-calve-slate-light" />
                  <span>48 rue Calvé, Bordeaux</span>
                </span>
                <a
                  href="#parking"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-calve-slate-light transition-colors"
                >
                  <span>{content.parking.detailsBtn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Acoustique Feutrée & Silence (Col 12, sm:Col 6, lg:Col 4) */}
          <div className="md:col-span-6 lg:col-span-4 rounded-3xl p-7 bg-white border border-calve-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-calve-stone flex items-center justify-center text-calve-slate mb-4">
                <Volume2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-calve-slate">
                {content.acoustic.tag}
              </span>
              <h3 className="mt-2 text-xl font-bold text-calve-charcoal tracking-tight">
                {content.acoustic.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-calve-muted leading-relaxed">
                {content.acoustic.desc}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-calve-stone">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-calve-muted font-medium">
                  {content.acoustic.statLabel}
                </span>
                <span className="text-2xl font-black text-calve-slate">
                  {content.acoustic.statValue}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {content.acoustic.comparison}
              </p>
            </div>
          </div>

          {/* Card 4: Cuisine & Café de Spécialité (Col 12, sm:Col 6, lg:Col 4) */}
          <div className="md:col-span-6 lg:col-span-4 rounded-3xl p-7 bg-white border border-calve-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-calve-stone flex items-center justify-center text-calve-slate mb-4">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-calve-slate">
                {content.coffee.tag}
              </span>
              <h3 className="mt-2 text-xl font-bold text-calve-charcoal tracking-tight">
                {content.coffee.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-calve-muted leading-relaxed">
                {content.coffee.desc}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-calve-stone space-y-2">
              <div className="flex items-center gap-2 text-xs text-calve-charcoal font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{content.coffee.item1}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-calve-charcoal font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{content.coffee.item2}</span>
              </div>
            </div>
          </div>

          {/* Card 5: Fibre 1 Gb/s & Phonebox (Col 12, sm:Col 6, lg:Col 4) */}
          <div className="md:col-span-6 lg:col-span-4 rounded-3xl p-7 bg-white border border-calve-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-calve-stone flex items-center justify-center text-calve-slate mb-4">
                <Wifi className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-calve-slate">
                {content.tech.tag}
              </span>
              <h3 className="mt-2 text-xl font-bold text-calve-charcoal tracking-tight">
                {content.tech.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-calve-muted leading-relaxed">
                {content.tech.desc}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-calve-stone grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-calve-cream border border-calve-stone">
                <span className="block text-xs font-bold text-calve-charcoal">
                  {content.tech.metric1}
                </span>
                <span className="text-[10px] text-calve-muted">{content.tech.metricLabel1}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-calve-cream border border-calve-stone">
                <span className="block text-xs font-bold text-calve-charcoal">
                  {content.tech.metric2}
                </span>
                <span className="text-[10px] text-calve-muted">{content.tech.metricLabel2}</span>
              </div>
            </div>
          </div>

          {/* Card 6: Communauté Choisie & Banner (Col 12) */}
          <div className="md:col-span-12 rounded-3xl p-8 sm:p-10 bg-calve-charcoal text-white border border-calve-slate-deep shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-stone-300 mb-3">
                <Users className="w-3.5 h-3.5 text-calve-slate-light" />
                {content.community.tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {content.community.title}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed">
                {content.community.desc}
              </p>

              {/* Badges strip */}
              <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-stone-200">
                  {content.community.pill1}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-stone-200">
                  {content.community.pill2}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-stone-200">
                  {content.community.pill3}
                </span>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <button
                onClick={() => onOpenEnquiry("office")}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-calve-slate hover:bg-calve-slate-light text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{content.community.cta}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
