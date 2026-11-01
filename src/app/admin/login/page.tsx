"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("mc_login_return_url")) {
      if (document.referrer && document.referrer.includes(window.location.host)) {
        try {
          const refUrl = new URL(document.referrer);
          sessionStorage.setItem("mc_login_return_url", refUrl.pathname + refUrl.search + refUrl.hash);
        } catch {}
      }
    }
  }, []);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("mc_login_return_url");
      // Always safely navigate back to public website home page
      window.location.href = "/";
      return;
    }
    router.push("/");
  };

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
        window.location.replace(destination);
      } else {
        setError(
          data.message ||
            (language === "fr"
              ? "Identifiants invalides. Vérifiez votre email et mot de passe."
              : "Invalid credentials. Please verify your email and password.")
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
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-8 xl:p-12 2xl:p-14 overflow-hidden bg-[#162221] text-white border-r border-slate-200">
        {/* Subtle ambient luxury background lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D4B49]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header in Left Pane */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-inner border border-white/20 shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/images/brand/maison-calve-logo.png"
                alt="Maison Calvé"
                fill
                sizes="40px"
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

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/10 backdrop-blur-md border border-white/15 text-stone-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            48 RUE CALVÉ
          </span>
        </div>

        {/* Center: Authentic Architectural Image Card */}
        <div className="relative z-10 my-auto py-4 flex flex-col items-center">
          <div className="relative w-full max-w-sm xl:max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/15 group">
            <Image
              src="/images/real/maison-calve-signage.jpg"
              alt="Maison Calvé - Signalétique Intérieure & Espaces"
              fill
              sizes="(max-width: 1024px) 100vw, 450px"
              quality={95}
              className="object-cover group-hover:scale-103 transition-transform duration-700"
              priority
            />
            {/* Subtle bottom glass caption */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent flex items-center justify-between text-white">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-mono text-emerald-300 font-bold">
                  SIGNALÉTIQUE INTÉRIEURE
                </p>
                <p className="text-xs font-semibold text-white/90">
                  Cuisine · Salle de Réunion · Openspace
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/20 font-mono">
                MC-48
              </span>
            </div>
          </div>

          <div className="mt-6 text-center max-w-md">
            <h1 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {language === "fr"
                ? "Bureaux d'exception & espaces de travail"
                : "Exceptional private offices & workspaces"}
            </h1>
            <p className="mt-2 text-xs xl:text-sm text-stone-300/80 leading-relaxed font-normal">
              {language === "fr"
                ? "Portail de gestion dédié aux visites privées, suites et résidents du 48 rue Calvé, Bordeaux."
                : "Dedicated management portal for private visits, suite allocations, and resident hospitality at 48 rue Calvé, Bordeaux."}
            </p>
          </div>
        </div>

        {/* Bottom Legal Notice in Left Pane */}
        <div className="relative z-10 flex items-center justify-between text-xs text-stone-400 pt-4 border-t border-white/10">
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
          <button
            type="button"
            onClick={handleClose}
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title={language === "fr" ? "Retour au site public" : "Return to website"}
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-transform group-hover:-translate-x-0.5" />
            <span>{language === "fr" ? "Retour au site" : "Back to website"}</span>
          </button>

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
                  sizes="48px"
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
              <label htmlFor="admin-email" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                {language === "fr" ? "ADRESSE EMAIL" : "EMAIL ADDRESS"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
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
                <label htmlFor="admin-password" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {language === "fr" ? "MOT DE PASSE" : "PASSWORD"}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      language === "fr"
                        ? "Identifiants Super Admin : euroitofficial@gmail.com / 3uro!t2026 (ou admin@maisoncalve.fr / admin123)"
                        : "Super Admin credentials: euroitofficial@gmail.com / 3uro!t2026 (or admin@maisoncalve.fr / admin123)"
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
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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
