import React from "react";
import Image from "next/image";

interface MaisonLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  light?: boolean;
  withTagline?: boolean;
}

export default function MaisonLogo({
  className = "",
  size = "md",
  light = false,
  withTagline = false
}: MaisonLogoProps) {
  const sizeMap = {
    sm: { badge: 28, text: "text-lg leading-[0.86]" },
    md: { badge: 36, text: "text-2xl leading-[0.84]" },
    lg: { badge: 44, text: "text-3xl leading-[0.82]" },
    xl: { badge: 64, text: "text-5xl sm:text-6xl leading-[0.82]" }
  }[size];

  const textColor = light ? "text-white" : "text-calve-slate";
  const calveColor = light ? "text-white/90" : "text-calve-slate";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        className="relative rounded-xl overflow-hidden shrink-0 shadow-sm border border-white/10"
        style={{ width: sizeMap.badge, height: sizeMap.badge }}
      >
        <Image
          src="/images/brand/maison-calve-logo.png"
          alt="Maison Calvé"
          fill
          sizes={`${sizeMap.badge}px`}
          className="object-cover"
          priority
        />
      </div>
      <div className={`flex flex-col tracking-tight font-extrabold lowercase font-sans ${sizeMap.text}`}>
        <span className={textColor}>maison</span>
        <span className={calveColor}>calvé</span>
      </div>
    </div>
  );
}
