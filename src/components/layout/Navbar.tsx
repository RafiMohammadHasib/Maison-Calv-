"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";
import { Language, CONTENT } from "@/data/content";

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenEnquiry: (spaceId?: string, source?: string) => void;
}

export default function Navbar({
  language,
  onLanguageChange,
  onOpenEnquiry
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = CONTENT[language].nav;

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const languages: { code: Language; label: string }[] = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" }
  ];

  const mobileSections = [
    {
      num: "01",
      id: "#espaces",
      title: t.spaces,
      subtitle: {
        fr: "Bureaux privatifs, postes calmes & salle de réunion",
        en: "Private suites, quiet workstations & boardroom",
        es: "Oficinas privadas, puestos tranquilos y sala"
      }[language]
    },
    {
      num: "02",
      id: "#about",
      title: t.about,
      subtitle: {
        fr: "Hôtel particulier bordelais du XIXe & vision feutrée",
        en: "19th-century bourgeois townhouse & calm sanctuary",
        es: "Palacete bordelés del s. XIX y santuario de trabajo"
      }[language]
    },
    {
      num: "03",
      id: "#tarifs",
      title: t.pricing,
      subtitle: {
        fr: "Transparence totale sans aucun frais caché",
        en: "All-inclusive transparent rates, zero hidden fees",
        es: "Tarifas transparentes todo incluido, sin sorpresas"
      }[language]
    },
    {
      num: "04",
      id: "#localisation",
      title: t.location,
      subtitle: {
        fr: "Tram D Fondaudège & 9 places de parking privatives",
        en: "Tram D Fondaudège & 9 private on-site parking spots",
        es: "Tranvía D Fondaudège y 9 plazas privadas"
      }[language]
    }
  ];

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-3 sm:top-6 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        {/* Floating Minimalist Capsule */}
        <div className="bg-white/92 backdrop-blur-2xl border border-white/90 shadow-[0_8px_32px_rgba(23,33,35,0.08)] rounded-full py-2 px-3 sm:px-5 flex items-center justify-between transition-all duration-300">
          {/* Brand Logo */}
          <a href="#" className="flex items-center pl-1 sm:pl-2 py-0.5 group shrink-0">
            <div className="flex flex-col leading-[0.84] text-lg sm:text-xl font-extrabold tracking-tighter lowercase select-none">
              <span className="text-calve-slate transition-colors group-hover:text-calve-charcoal">
                maison
              </span>
              <span className="text-calve-slate transition-colors group-hover:text-calve-charcoal">
                calvé
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold tracking-wider uppercase text-calve-charcoal/80">
            <a
              href="#espaces"
              className="px-3 py-1.5 rounded-full hover:bg-calve-stone/70 hover:text-calve-charcoal transition-all whitespace-nowrap"
            >
              {t.spaces}
            </a>
            <a
              href="#about"
              className="px-3 py-1.5 rounded-full hover:bg-calve-stone/70 hover:text-calve-charcoal transition-all whitespace-nowrap"
            >
              {t.about}
            </a>
            <a
              href="#tarifs"
              className="px-3 py-1.5 rounded-full hover:bg-calve-stone/70 hover:text-calve-charcoal transition-all whitespace-nowrap"
            >
              {t.pricing}
            </a>
            <a
              href="#localisation"
              className="px-3 py-1.5 rounded-full hover:bg-calve-stone/70 hover:text-calve-charcoal transition-all whitespace-nowrap"
            >
              {t.location}
            </a>
          </nav>

          {/* Right Essential Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Minimalist Language Switcher */}
            <div className="flex items-center bg-calve-stone/70 p-0.5 rounded-full border border-calve-border/40 text-[10px] font-bold">
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => onLanguageChange(item.code)}
                  className={`px-2 py-0.5 rounded-full uppercase transition-all cursor-pointer ${language === item.code
                      ? "bg-white text-calve-charcoal shadow-2xs font-extrabold"
                      : "text-calve-muted hover:text-calve-charcoal"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Visit CTA Pill */}
            <button
              onClick={() => onOpenEnquiry("office", "Book a Visit (Header)")}
              className="group whitespace-nowrap flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-full bg-calve-slate hover:bg-calve-slate-dark text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all shadow-xs hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t.requestVisit}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-calve-stone text-calve-charcoal transition-colors cursor-pointer"
              aria-label={language === "en" ? "Toggle menu" : language === "es" ? "Menú" : "Menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-calve-charcoal" />
              ) : (
                <Menu className="w-5 h-5 text-calve-charcoal" />
              )}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* EDITORIAL HIGH-END MOBILE NAVIGATION MENU */}
        {/* ======================================================== */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-[#F9F8F6] text-calve-charcoal flex flex-col p-6 sm:p-8 overflow-y-auto animate-in fade-in duration-200">
            {/* Top Bar inside Menu */}
            <div className="flex items-center justify-between pb-5 border-b border-calve-border/80 shrink-0">
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col leading-[0.84] text-xl font-extrabold tracking-tighter lowercase select-none text-calve-charcoal"
              >
                <span>maison</span>
                <span>calvé</span>
              </a>

              <div className="flex items-center gap-3">
                {/* Language Switcher in Mobile Header */}
                <div className="flex items-center bg-calve-stone/60 p-0.5 rounded-full border border-calve-border text-[11px] font-bold">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => onLanguageChange(item.code)}
                      className={`px-3 py-1 rounded-full uppercase transition-all ${language === item.code
                          ? "bg-white text-calve-charcoal font-black shadow-2xs"
                          : "text-calve-muted hover:text-calve-charcoal"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Minimalist Close Button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-white hover:bg-calve-stone border border-calve-border flex items-center justify-center text-calve-charcoal transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Editorial Vertical Navigation Links (Magazine-grade) */}
              <nav className="pt-4 pb-2 space-y-1">
                <div className="text-[10px] font-mono uppercase font-bold tracking-[0.25em] text-calve-slate mb-3">
                  {language === "en" ? "Navigation Index" : language === "es" ? "Índice" : "Sommaire"}
                </div>

                {mobileSections.map((sec) => (
                  <a
                    key={sec.id}
                    href={sec.id}
                    onClick={handleMobileNavClick}
                    className="group flex items-baseline justify-between py-3.5 border-b border-calve-border/60 transition-all cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs font-bold text-calve-slate/70">
                          {sec.num}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-calve-charcoal group-hover:text-calve-slate group-hover:translate-x-1 transition-all">
                          {sec.title}
                        </h3>
                      </div>
                      {sec.subtitle && (
                        <p className="text-xs text-calve-muted pl-7">
                          {sec.subtitle}
                        </p>
                      )}
                    </div>

                    <ArrowUpRight className="w-5 h-5 text-calve-muted group-hover:text-calve-charcoal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                  </a>
                ))}
              </nav>

                {/* Action Hub - Flowing directly after Navigation */}
                <div className="pt-5 border-t border-calve-border/80 space-y-4 shrink-0 pb-6">
                  {/* Primary Book a Visit CTA */}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenEnquiry("office", "Mobile Menu CTA");
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-calve-charcoal hover:bg-calve-slate text-white text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span>{t.requestVisit}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>

                  {/* Direct Inquiries & Address */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-calve-charcoal/80 pt-1">
                    <a
                      href="tel:+33695577033"
                      className="flex items-center gap-2 hover:text-calve-slate transition-colors font-medium"
                    >
                      <Phone className="w-3.5 h-3.5 text-calve-slate" />
                      <span>+33 6 95 57 70 33</span>
                    </a>

                    <a
                      href="mailto:contact@maisoncalve.fr"
                      className="flex items-center gap-2 hover:text-calve-slate transition-colors font-medium"
                    >
                      <Mail className="w-3.5 h-3.5 text-calve-slate" />
                      <span>contact@maisoncalve.fr</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-calve-muted pt-1">
                    <MapPin className="w-3.5 h-3.5 text-calve-slate shrink-0" />
                    <span>48 Rue Calvé, 33000 Bordeaux · Cour privée & parking 9 places</span>
                  </div>
                </div>
              </div>
        )}
          </div>
    </header>
  );
}
