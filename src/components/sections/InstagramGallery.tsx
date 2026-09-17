"use client";

import React, { useState } from "react";
import { ArrowUpRight, Sparkles, MapPin, X } from "lucide-react";
import { Language } from "@/data/content";

interface InstagramGalleryProps {
  language: Language;
}

interface GalleryItem {
  id: string;
  image: string;
  tag: {
    fr: string;
    en: string;
    es: string;
  };
  title: {
    fr: string;
    en: string;
    es: string;
  };
  caption: {
    fr: string;
    en: string;
    es: string;
  };
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "badge",
    image: "/images/real/maison-calve-access-badge.jpg",
    tag: {
      fr: "Accès Membre 24/7",
      en: "24/7 Member Badge",
      es: "Acceso Miembro 24/7",
    },
    title: {
      fr: "Badge sécurisé individuel",
      en: "Personal keyless entry card",
      es: "Tarjeta de acceso individual",
    },
    caption: {
      fr: "Accédez en toute liberté à vos bureaux et à la cour pavée à toute heure.",
      en: "Seamless round-the-clock access to your workspace and private courtyard.",
      es: "Acceso con total autonomía a sus oficinas y patio privado a cualquier hora.",
    },
  },
  {
    id: "signage",
    image: "/images/real/maison-calve-signage.jpg",
    tag: {
      fr: "Architecture Intérieure",
      en: "Interior Architecture",
      es: "Arquitectura Interior",
    },
    title: {
      fr: "Signalétique épurée",
      en: "Minimal architectural signage",
      es: "Señalética depurada",
    },
    caption: {
      fr: "Murs en moellons de Gironde et signalétique gravée sobre.",
      en: "Authentic Gironde blonde stonework with refined directional markers.",
      es: "Piedra vista de Gironde y señalética grabada elegante.",
    },
  },
  {
    id: "drinks",
    image: "/images/real/maison-calve-coffee-matcha.jpg",
    tag: {
      fr: "Art de Vivre & Pause",
      en: "Lifestyle & Coffee Bar",
      es: "Estilo de Vida & Café",
    },
    title: {
      fr: "Café de barista & matcha latte",
      en: "Specialty coffee & fresh matcha",
      es: "Café de barista y matcha latte",
    },
    caption: {
      fr: "Gobelets siglés, grains fraîchement torréfiés et infusions biologiques offerts.",
      en: "Branded takeaway cups, locally roasted beans, and complimentary organic teas.",
      es: "Café recién tostado, tés biológicos y bebidas de calidad incluidas.",
    },
  },
  {
    id: "tram",
    image: "/images/real/maison-calve-tram-station.jpg",
    tag: {
      fr: "Mobilité Douce",
      en: "Effortless Transit",
      es: "Movilidad Fácil",
    },
    title: {
      fr: "Arrêt de Tram D à 2 min à pied",
      en: "Tramway line D within 2 min walk",
      es: "Parada de Tranvía D a 2 min a pie",
    },
    caption: {
      fr: "Connexion directe avec les Quinconces, la Gare Saint-Jean et Mérignac.",
      en: "Direct link to Place des Quinconces, Saint-Jean Station, and Mérignac airport.",
      es: "Conexión directa con Quinconces, Estación Saint-Jean y el centro.",
    },
  },
  {
    id: "poster",
    image: "/images/real/maison-calve-street-poster.jpg",
    tag: {
      fr: "Quartier Fondaudège",
      en: "Fondaudège Neighborhood",
      es: "Barrio Fondaudège",
    },
    title: {
      fr: "Affichage local & contact direct",
      en: "Neighborhood signage & direct reach",
      es: "Presencia en el barrio & contacto",
    },
    caption: {
      fr: "Une présence discrète et bien ancrée au 48 rue Calvé, 33000 Bordeaux.",
      en: "A discreet, established presence at 48 rue Calvé, 33000 Bordeaux.",
      es: "Una presencia cuidada y arraigada en el 48 de la calle Calvé, Burdeos.",
    },
  },
  {
    id: "stencil",
    image: "/images/real/maison-calve-street-stencil.jpg",
    tag: {
      fr: "Écosystème Local",
      en: "Local Ecosystem",
      es: "Ecosistema Local",
    },
    title: {
      fr: "« Près de chez toi »",
      en: "Close to home",
      es: "Cerca de tu hogar",
    },
    caption: {
      fr: "Un lieu à taille humaine pensé pour les professionnels du centre de Bordeaux.",
      en: "A human-scale sanctuary designed for central Bordeaux professionals.",
      es: "Un espacio a escala humana pensado para profesionales de Burdeos.",
    },
  },
];

export default function InstagramGallery({ language }: InstagramGalleryProps) {
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const t = {
    fr: {
      tag: "Vrai Quotidien — @maisoncalvebordeaux",
      title: "La Maison Calvé en photos réelles",
      subtitle:
        "Découvrez l'ambiance authentique, les détails architecturaux et la vie quotidienne de nos résidents au 48 rue Calvé.",
      viewInsta: "Voir le profil Instagram officiel",
      cardClick: "Agrandir la photo",
    },
    en: {
      tag: "Authentic Life — @maisoncalvebordeaux",
      title: "Maison Calvé in Real Photographs",
      subtitle:
        "Experience the authentic atmosphere, architectural craft, and daily rhythm of our members at 48 rue Calvé.",
      viewInsta: "View Official Instagram Profile",
      cardClick: "Zoom photograph",
    },
    es: {
      tag: "Vida Real — @maisoncalvebordeaux",
      title: "Maison Calvé en Fotografías Reales",
      subtitle:
        "Descubra la atmósfera genuina, los detalles arquitectónicos y la vida diaria de nuestros residentes en el 48 rue Calvé.",
      viewInsta: "Ver perfil oficial de Instagram",
      cardClick: "Ampliar fotografía",
    },
  }[language];

  return (
    <section className="py-24 bg-white border-t border-calve-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-calve-stone text-xs font-semibold uppercase tracking-wider text-calve-slate mb-3 border border-calve-border">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.tag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-calve-charcoal leading-tight tracking-tight">
              {t.title}
            </h2>
            <p className="text-sm sm:text-base text-calve-muted mt-3 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div>
            <a
              href="https://www.instagram.com/maisoncalvebordeaux/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-calve-charcoal hover:bg-calve-slate text-white text-xs font-semibold tracking-wide shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>@maisoncalvebordeaux</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* 6-Grid Authentic Photo Mosaic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative rounded-3xl overflow-hidden bg-calve-cream border border-calve-border hover:border-calve-slate/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative aspect-square sm:aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-calve-charcoal/75 via-calve-charcoal/15 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-semibold text-calve-charcoal shadow-2xs">
                    {item.tag[language]}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <h4 className="text-base sm:text-lg font-bold tracking-tight drop-shadow-xs">
                    {item.title[language]}
                  </h4>
                  <p className="text-xs text-stone-200/90 line-clamp-2 mt-0.5 leading-snug">
                    {item.caption[language]}
                  </p>
                </div>
              </div>

              {/* Card Footer with Details link */}
              <div className="px-5 py-3.5 bg-white flex items-center justify-between border-t border-calve-border/40">
                <span className="text-[11px] font-medium text-calve-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-calve-slate" />
                  <span>48 rue Calvé, Bordeaux</span>
                </span>
                <span className="text-[11px] font-semibold text-calve-slate group-hover:text-calve-charcoal flex items-center gap-1 transition-colors">
                  <span>{t.cardClick}</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square sm:aspect-4/3 bg-black">
              <img
                src={activePhoto.image}
                alt={activePhoto.title[language]}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label={language === "en" ? "Close" : language === "es" ? "Cerrar" : "Fermer"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-7 bg-white">
              <span className="text-xs font-bold uppercase tracking-wider text-calve-slate">
                {activePhoto.tag[language]}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-calve-charcoal mt-1">
                {activePhoto.title[language]}
              </h3>
              <p className="text-sm text-calve-muted mt-2 leading-relaxed">
                {activePhoto.caption[language]}
              </p>
              <div className="mt-5 pt-4 border-t border-calve-border flex items-center justify-between">
                <span className="text-xs text-calve-muted">
                  48 rue Calvé, Bordeaux Fondaudège
                </span>
                <a
                  href="https://www.instagram.com/maisoncalvebordeaux/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-calve-slate hover:text-calve-charcoal flex items-center gap-1"
                >
                  <span>@maisoncalvebordeaux</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
