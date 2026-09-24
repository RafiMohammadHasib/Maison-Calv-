import React from "react";

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
  const sizeClasses = {
    sm: "text-lg leading-[0.88]",
    md: "text-2xl leading-[0.85]",
    lg: "text-4xl leading-[0.82]",
    xl: "text-6xl sm:text-7xl lg:text-8xl leading-[0.82]"
  };

  const textColor = light ? "text-white" : "text-calve-slate";
  const calveColor = light ? "text-white/90" : "text-calve-slate";

  return (
    <div className={`flex flex-col select-none tracking-tight font-extrabold lowercase font-sans ${className}`}>
      <div className={`flex flex-col ${sizeClasses[size]}`}>
        <span className={textColor}>maison</span>
        <span className={calveColor}>calvé</span>
      </div>
    </div>
  );
}
