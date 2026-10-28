"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Mail, Clock, Shield, Sparkles } from "lucide-react";
import MaisonLogo from "@/components/brand/MaisonLogo";
import { Language, CONTENT } from "@/data/content";

interface FooterProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenEnquiry: (spaceId?: string) => void;
}

export default function Footer({
  language,
  onLanguageChange,
  onOpenEnquiry
}: FooterProps) {
  const t = CONTENT[language].footer;

  return (
    <footer className="bg-calve-charcoal text-white pt-20 pb-12 border-t border-calve-slate-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand & Address */}
          <div className="lg:col-span-5 space-y-4">
            <MaisonLogo size="lg" light withTagline />
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              {t.brandTagline}
            </p>

            <div className="space-y-2 pt-2 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-calve-slate-light shrink-0" />
                <span>{t.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-calve-slate-light shrink-0" />
                <span>{t.hoursDetail}</span>
              </div>
            </div>

            {/* Social Link */}
            <div className="pt-2">
              <a
                href="https://www.instagram.com/maisoncalvebordeaux"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
              >
                <svg
                  className="w-4 h-4 text-calve-accent fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@maisoncalvebordeaux</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-calve-slate-light">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <a href="#espaces" className="hover:text-white transition-colors">
                  {language === "en"
                    ? "Private offices (17–25 sqm)"
                    : language === "es"
                    ? "Despachos privados (17–25 m²)"
                    : "Bureaux privatifs (17–25 m²)"}
                </a>
              </li>
              <li>
                <a href="#espaces" className="hover:text-white transition-colors">
                  {language === "en"
                    ? "Dedicated desk (€250 Excl. VAT)"
                    : language === "es"
                    ? "Puesto fijo (250€ sin IVA)"
                    : "Open space fixe (250€ HT)"}
                </a>
              </li>
              <li>
                <a href="#espaces" className="hover:text-white transition-colors">
                  {language === "en"
                    ? "Nomad desk (€20 / €10 Excl. VAT)"
                    : language === "es"
                    ? "Pase nómada (20€ / 10€ sin IVA)"
                    : "Poste nomade (20€ / 10€ HT)"}
                </a>
              </li>
              <li>
                <a href="#espaces" className="hover:text-white transition-colors">
                  {language === "en"
                    ? "Meeting room 30 sqm"
                    : language === "es"
                    ? "Sala de reuniones 30 m²"
                    : "Salle de réunion 30 m²"}
                </a>
              </li>
              <li>
                <a href="#positionnement" className="hover:text-white transition-colors">
                  {language === "en"
                    ? "Our Positioning"
                    : language === "es"
                    ? "Nuestro Posicionamiento"
                    : "Notre Positionnement"}
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-white transition-colors">
                  {language === "en"
                    ? "Transparent pricing"
                    : language === "es"
                    ? "Tarifas detalladas"
                    : "Grille tarifaire détaillée"}
                </a>
              </li>
              <li>
                <a href="#localisation" className="hover:text-white transition-colors">
                  {language === "en"
                    ? "Location & Tram D Access"
                    : language === "es"
                    ? "Ubicación & Tranvía D"
                    : "Plan d'accès & Tram D"}
                </a>
              </li>
            </ul>
          </div>

          {/* CTA & Visit */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-calve-slate-light">
              {language === "en"
                ? "Tours & Inquiries"
                : language === "es"
                ? "Visitas & Consultas"
                : "Visites & Renseignements"}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              {language === "en"
                ? "Come discover the space, experience the serene acoustics, and meet our residents. Bespoke tours by appointment with Paul and the team."
                : language === "es"
                ? "Venga a descubrir el espacio, comprobar la acústica serena y conocer a los residentes. Visitas guiadas con cita previa con Paul y el equipo."
                : "Venez découvrir les lieux, tester l'acoustique feutrée et rencontrer les résidents. Visites personnalisées sur rendez-vous avec Paul et l'équipe."}
            </p>
            <div>
              <button
                onClick={() => onOpenEnquiry("office")}
                className="w-full py-3.5 px-6 rounded-xl bg-calve-slate hover:bg-calve-slate-light text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                {language === "en"
                  ? "Schedule a tour at 48 rue Calvé"
                  : language === "es"
                  ? "Planificar una visita en 48 rue Calvé"
                  : "Planifier une visite au 48 rue Calvé"}
              </button>
            </div>
            <div className="text-[11px] text-stone-500 pt-1">
              {language === "en"
                ? "Resident partner: Goizet Gestion."
                : language === "es"
                ? "Socio residente: Goizet Gestion."
                : "Partenaire résident : Goizet Gestion."}
            </div>
          </div>
        </div>

        {/* SEO Keyword Anchor Matrix (Natural, non-spammy) */}
        <div className="py-8 border-b border-white/10 text-[11px] text-stone-400 leading-relaxed">
          <span className="font-semibold text-stone-300 block mb-1">
            {language === "en"
              ? "Related searches in Bordeaux Fondaudège:"
              : language === "es"
              ? "Búsquedas relacionadas en Burdeos Fondaudège:"
              : "Recherches associées à Bordeaux Fondaudège :"}
          </span>
          <p>{t.bordeauxSeoText}</p>
        </div>

        {/* Bottom Bar: Copyright & Language Selector */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span>© {new Date().getFullYear()} Maison Calvé Bordeaux. {t.rights}</span>
            <span className="text-stone-600">·</span>
            <Link
              href="/admin/login"
              className="text-stone-500 hover:text-stone-300 transition-colors underline decoration-stone-700 underline-offset-4"
            >
              {language === "en" ? "Admin Portal" : language === "es" ? "Portal Admin" : "Portail Admin"}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-stone-400">
              {language === "en" ? "Language:" : language === "es" ? "Idioma:" : "Langue :"}
            </span>
            {(["fr", "en", "es"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`uppercase px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  language === lang
                    ? "bg-calve-slate text-white"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Giant Architectural Typographic Watermark */}
      <div className="w-full overflow-hidden select-none pointer-events-none text-center pt-8 sm:pt-12 -mb-8 sm:-mb-10">
        <span className="block text-[13vw] sm:text-[15vw] font-black uppercase tracking-tighter text-white/[0.04] leading-none whitespace-nowrap">
          MAISON CALVÉ
        </span>
      </div>
    </footer>
  );
}
