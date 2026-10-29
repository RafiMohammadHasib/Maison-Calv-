"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  X,
  AlertCircle
} from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  // Prefilled demo credentials for seamless access
  const [email, setEmail] = useState("admin@maisoncalve.fr");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("mc_admin_logged", "true");
          localStorage.setItem("mc_admin_user", JSON.stringify(data.user));
        }
        const destination = typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect") || "/admin/pipeline"
          : "/admin/pipeline";
        router.push(destination);
      } else {
        setError(
          data.message ||
            (language === "fr"
              ? "Identifiants invalides. Utilisez admin@maisoncalve.fr / admin123"
              : "Invalid credentials. Use admin@maisoncalve.fr / admin123")
        );
      }
    } catch {
      setError(
        language === "fr"
          ? "Impossible de joindre le serveur d'authentification."
          : "Unable to reach authentication server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-slate-900 font-sans selection:bg-[#2D4B49] selection:text-white">
      {/* ========================================================== */}
      {/* LEFT PANE: HIGH OPACITY ATMOSPHERIC WORKSPACE WITH GLASS   */}
      {/* ========================================================== */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-10 xl:p-14 2xl:p-16 overflow-hidden bg-slate-950 text-white border-r border-slate-200">
        {/* Background Authentic 4K Photography with Architectural Gradient & Subtle Left Blur */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/spaces/real-open-space-fixe-4k.jpg"
            alt="Maison Calvé - Executive Open Space & Desks"
            fill
            quality={95}
            className="object-cover object-center scale-100"
            priority
          />
          {/* Left subtle frosted blur mask so typography sits comfortably on top */}
          <div
            className="absolute inset-y-0 left-0 w-full lg:w-4/5 backdrop-blur-[3px] pointer-events-none"
            style={{
              maskImage: "linear-gradient(to right, black 35%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 35%, transparent 100%)",
            }}
          />
          {/* Architectural gradient: keeps natural daylight & stone textures visible while ensuring 100% white text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/70 sm:via-slate-950/50 to-slate-950/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30 pointer-events-none" />
        </div>

        {/* Top Header in Left Pane */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-inner border border-white/20 shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/images/brand/maison-calve-logo.png"
                alt="Maison Calvé"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2 group-hover:text-emerald-300 transition-colors">
                <span>MAISON CALVÉ</span>
              </div>
              <p className="text-[10px] uppercase font-medium tracking-widest text-stone-300">
                Hôtel Particulier · Bordeaux Fondaudège
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-white transition-all shadow-sm cursor-pointer"
            title={language === "fr" ? "Retour au site public" : "Return to website"}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === "fr" ? "Retour au site" : "Back to website"}</span>
          </Link>
        </div>

        {/* Hero Narrative in Left Pane */}
        <div className="relative z-10 my-auto py-12 max-w-xl">
          <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            {language === "fr"
              ? "Bureaux d'exception et espaces de travail au cœur de Bordeaux."
              : "Exceptional private offices and workspaces in the heart of Bordeaux."}
          </h1>

          <p className="mt-4 text-sm xl:text-base text-stone-200/90 leading-relaxed max-w-lg font-normal">
            {language === "fr"
              ? "Portail de gestion dédié aux visites privées, à l'attribution des suites et au suivi des résidents du 48 rue Calvé."
              : "Dedicated management portal for private visits, suite allocations, and resident hospitality at 48 rue Calvé."}
          </p>
        </div>

        {/* Bottom Legal Notice in Left Pane */}
        <div className="relative z-10 flex items-center justify-between text-xs text-stone-300/80 pt-6 border-t border-white/10">
          <div>© {new Date().getFullYear()} MAISON CALVÉ · 48 rue Calvé, 33000 Bordeaux</div>
          <div className="text-[10px] tracking-widest uppercase font-mono text-stone-400">
            BORDEAUX CENTRE · JARDIN PUBLIC
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* RIGHT PANE: MINIMAL LUXURY ADMIN PORTAL FORM               */}
      {/* ========================================================== */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen bg-white border-l border-slate-200">
        {/* Top Bar in Right Pane */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title={language === "fr" ? "Retour au site public" : "Return to website"}
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-transform group-hover:-translate-x-0.5" />
            <span>{language === "fr" ? "Retour au site" : "Back to website"}</span>
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Bilingual Language Switcher (Segmented Pill) */}
            <div className="flex items-center gap-0.5 p-1 rounded-full bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setLanguage("fr")}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  language === "fr"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                EN
              </button>
            </div>

            {/* Circular Cross / Close Button */}
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
              aria-label={language === "fr" ? "Fermer et retourner au site" : "Close and return to website"}
              title={language === "fr" ? "Fermer et retourner au site public" : "Close and return to website"}
            >
              <X className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Center Sign In Container (Matching Reference Image) */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center mb-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-2xs border border-calve-slate/15">
                <Image
                  src="/images/brand/maison-calve-logo.png"
                  alt="Maison Calvé"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {language === "fr" ? "Espace Administration" : "Admin Portal"}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              {language === "fr"
                ? "Veuillez saisir vos identifiants pour accéder à l'espace de gestion."
                : "Please enter your credentials to access the management workspace."}
            </p>
          </div>

          {/* Error Message if any */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field with Soft Blue-Grey Tint Background */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                {language === "fr" ? "ADRESSE EMAIL" : "EMAIL ADDRESS"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maisoncalve.fr"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#EEF3F8] border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:border-[#2D4B49] focus:ring-2 focus:ring-[#2D4B49]/10 transition-all placeholder:text-slate-400 shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field with Soft Blue-Grey Tint Background */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {language === "fr" ? "MOT DE PASSE" : "PASSWORD"}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      language === "fr"
                        ? "Pour la démo, le mot de passe est : admin123"
                        : "Demo password is: admin123"
                    )
                  }
                  className="text-[11px] text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {language === "fr" ? "Mot de passe oublié ?" : "Forgot password?"}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#EEF3F8] border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:border-[#2D4B49] focus:ring-2 focus:ring-[#2D4B49]/10 transition-all placeholder:text-slate-400 shadow-2xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#2D4B49] focus:ring-[#2D4B49] cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 font-medium cursor-pointer select-none">
                {language === "fr" ? "Mémoriser ma session pendant 24 heures" : "Remember my session for 24 hours"}
              </label>
            </div>

            {/* Primary Sign In Button (Deep Goizet / Maison Calvé Slate-Green) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#2D4B49] hover:bg-[#233B39] text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{language === "fr" ? "Se connecter au tableau de bord" : "Sign in to Dashboard"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-5 border-t border-slate-100 text-center text-xs text-slate-400">
            <p>
              {language === "fr"
                ? "Accès sécurisé réservé à l'équipe Maison Calvé."
                : "Secure access restricted to Maison Calvé team."}
            </p>
          </div>
        </div>

        {/* Bottom Minimal Watermark */}
        <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest">
          MAISON CALVÉ · 48 RUE CALVÉ, 33000 BORDEAUX
        </div>
      </div>
    </div>
  );
}
