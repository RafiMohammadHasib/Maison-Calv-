"use client";

import React, { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [supportsScrollTimeline, setSupportsScrollTimeline] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && CSS.supports("animation-timeline", "scroll()")) {
      setSupportsScrollTimeline(true);
      return;
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent">
      <style>{`
        @keyframes mcCompositorScrollProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .mc-scroll-indicator {
          animation: mcCompositorScrollProgress auto linear;
          animation-timeline: scroll();
          transform-origin: 0% 50%;
        }
      `}</style>
      <div
        className={`h-full bg-gradient-to-r from-calve-slate via-[#758d91] to-emerald-400 shadow-[0_0_10px_rgba(91,112,116,0.6)] ${
          supportsScrollTimeline ? "mc-scroll-indicator w-full" : "transition-all duration-75 ease-out"
        }`}
        style={supportsScrollTimeline ? undefined : { width: `${progress}%` }}
      />
    </div>
  );
}
