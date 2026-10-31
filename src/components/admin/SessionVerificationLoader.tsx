"use client";

import React from "react";
import Image from "next/image";

export default function SessionVerificationLoader() {
  const brandName = "MAISON CALVÉ";
  const letters = brandName.split("");

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090D0E] text-white selection:bg-[#5b7074] selection:text-white overflow-hidden select-none">
      <style>{`
        /* Awwwards-grade GSAP / Framer Motion kinetic curves */
        @keyframes awwwardsMaskUp {
          0% {
            transform: translateY(110%);
            opacity: 0;
            filter: blur(6px);
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
            filter: blur(0px);
          }
        }

        @keyframes awwwardsSheen {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes awwwardsOrbit {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes awwwardsPulseGlow {
          0%, 100% {
            opacity: 0.25;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.55;
            transform: scale(1.05);
          }
        }

        @keyframes awwwardsHorizon {
          0%, 100% {
            width: 24px;
            opacity: 0.3;
          }
          50% {
            width: 64px;
            opacity: 0.9;
          }
        }

        .kinetic-sheen {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.85) 0%,
            rgba(255, 255, 255, 1) 25%,
            rgba(163, 186, 189, 1) 50%,
            rgba(255, 255, 255, 1) 75%,
            rgba(255, 255, 255, 0.85) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: awwwardsSheen 4.5s ease-in-out infinite;
        }
      `}</style>

      {/* 1. Deep Atmospheric Ambient Lighting (Awwwards dark luxury mood) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft radial brand slate glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[160px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(91, 112, 116, 0.3) 0%, rgba(20, 31, 33, 0.12) 65%, transparent 100%)",
            animation: "awwwardsPulseGlow 6s ease-in-out infinite"
          }}
        />
        {/* Whisper-light film grain */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />
      </div>

      {/* 2. Pure Brand Composition (Clean, uncluttered, high-fashion luxury) */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Kinetic Orbital Crest */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-8">
          {/* Hairline kinetic orbital ring with glowing accent node */}
          <div
            className="absolute inset-0 rounded-full border border-white/10"
            style={{ animation: "awwwardsOrbit 12s cubic-bezier(0.4, 0, 0.2, 1) infinite" }}
          >
            {/* Specular orbital light dot */}
            <span className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          </div>

          {/* Secondary counter-rotating dashed ring */}
          <div
            className="absolute inset-2 rounded-full border border-[#5b7074]/20 border-dashed"
            style={{ animation: "awwwardsOrbit 24s linear infinite reverse" }}
          />

          {/* Centered Brand Squircle Emblem */}
          <div className="relative w-15 h-15 rounded-2xl p-[1px] bg-gradient-to-b from-white/30 via-white/10 to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="relative w-full h-full rounded-[15px] overflow-hidden bg-[#11191B] border border-white/10 flex items-center justify-center backdrop-blur-xl">
              <Image
                src="/images/brand/maison-calve-logo.png"
                alt="Maison Calvé"
                fill
                sizes="60px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Masked Kinetic Split-Text Typography: MAISON CALVÉ */}
        <div className="flex items-center justify-center text-2xl sm:text-3xl font-extrabold tracking-[0.42em] pl-[0.42em] font-sans">
          {letters.map((char, index) => (
            <span key={index} className="inline-block overflow-hidden py-1">
              <span
                className="inline-block kinetic-sheen"
                style={{
                  animation: `awwwardsMaskUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.045}s both`
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            </span>
          ))}
        </div>

        {/* Breathing Minimalist Horizon Beam */}
        <div className="mt-6 flex items-center justify-center">
          <span
            className="h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-[#758d91] to-transparent block"
            style={{ animation: "awwwardsHorizon 3.6s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
