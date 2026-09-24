"use client";

import React, { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Language, CONTENT } from "@/data/content";

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenEnquiry: (spaceId?: string) => void;
}

export default function Navbar({
  language,
  onLanguageChange,
  onOpenEnquiry
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = CONTENT[language].nav;

  const languages: { code: Language; label: string }[] = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" }
  ];

  return (
    <header className="fixed top-4 sm:top-6 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        {/* Floating Minimalist Capsule */}
        <div className="bg-white/90 backdrop-blur-2xl border border-white/90 shadow-[0_8px_30px_rgba(23,33,35,0.06)] rounded-full py-2 px-3 sm:px-5 flex items-center justify-between transition-all duration-300">
          {/* Brand Logo */}
          <a href="#" className="flex items-center pl-1 sm:pl-2 py-0.5 group">
            <div className="flex flex-col leading-[0.84] text-lg sm:text-xl font-extrabold tracking-tighter lowercase select-none">
              <span className="text-calve-slate">
                maison
              </span>
              <span className="text-calve-slate">
                calvé
              </span>
            </div>
          </a>

          {/* Essential Core Navigation (Only 3 clean links) */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-calve-charcoal/80">
            <a
              href="#espaces"
              className="px-3.5 py-1.5 rounded-full hover:bg-calve-stone/70 hover:text-calve-charcoal transition-all"
            >
              {t.spaces}
            </a>
            <a
              href="#tarifs"
              className="px-3.5 py-1.5 rounded-full hover:bg-calve-stone/70 hover:text-calve-charcoal transition-all"
            >
              {t.pricing}
            </a>
            <a
              href="#localisation"
              className="px-3.5 py-1.5 rounded-full hover:bg-calve-stone/70 hover:text-calve-charcoal transition-all"
            >
              {t.location}
            </a>
          </nav>

          {/* Right Essential Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Minimalist Language Switcher */}
            <div className="flex items-center bg-calve-stone/60 p-0.5 rounded-full border border-calve-border/40 text-[10px] font-bold">
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => onLanguageChange(item.code)}
                  className={`px-2 py-0.5 rounded-full uppercase transition-all cursor-pointer ${
                    language === item.code
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
              onClick={() => onOpenEnquiry("office")}
              className="group whitespace-nowrap flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-calve-slate hover:bg-calve-slate-dark text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <span>{t.requestVisit}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full hover:bg-calve-stone text-calve-charcoal"
              aria-label={language === "en" ? "Toggle menu" : language === "es" ? "Menú" : "Menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Minimal Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 bg-white/95 backdrop-blur-2xl border border-calve-border/80 rounded-3xl shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-1 text-xs font-bold uppercase tracking-wider text-calve-charcoal">
              <a
                href="#espaces"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-calve-stone/60 transition-colors"
              >
                {t.spaces}
              </a>
              <a
                href="#tarifs"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-calve-stone/60 transition-colors"
              >
                {t.pricing}
              </a>
              <a
                href="#localisation"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-calve-stone/60 transition-colors"
              >
                {t.location}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
