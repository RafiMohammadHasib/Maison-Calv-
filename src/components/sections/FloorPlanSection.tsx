"use client";

import React from "react";
import { Layers } from "lucide-react";
import InteractiveFloorPlan from "@/components/three/InteractiveFloorPlan";
import { Language, CONTENT } from "@/data/content";

interface FloorPlanSectionProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string) => void;
}

export default function FloorPlanSection({ language, onOpenEnquiry }: FloorPlanSectionProps) {
  const t = CONTENT[language].floorPlanSection;

  return (
    <section id="plan-3d" className="py-24 sm:py-32 bg-calve-stone/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-calve-slate mb-3">
            {t.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-calve-charcoal leading-tight tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-calve-muted mt-3 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 3D Cutaway Floor Plan Canvas */}
        <InteractiveFloorPlan onSelectSpace={(id) => onOpenEnquiry(id)} />
      </div>
    </section>
  );
}
