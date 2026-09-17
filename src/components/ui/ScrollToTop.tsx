"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Language } from "@/data/content";

interface ScrollToTopProps {
  language?: Language;
}

export default function ScrollToTop({ language = "fr" }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight > 0) {
        const progress = (scrollY / docHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }

      if (scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Circle SVG dimensions
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ease-out ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label={
          language === "en"
            ? "Scroll to top of page"
            : language === "es"
            ? "Volver arriba"
            : "Retour en haut de page"
        }
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl border border-calve-stone text-calve-charcoal hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
      >
        {/* Background hover fill */}
        <div className="absolute inset-0 rounded-full bg-calve-slate opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Circular Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1"
          viewBox="0 0 44 44"
        >
          {/* Background circle track */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-stone-200/60 dark:stroke-stone-700/40"
            strokeWidth="2.5"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-calve-slate group-hover:stroke-white transition-all duration-150"
            strokeWidth="2.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Up Arrow Icon */}
        <ArrowUp className="relative z-10 w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
      </button>
    </div>
  );
}
