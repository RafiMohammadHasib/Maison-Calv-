"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import BentoGrid from "@/components/sections/BentoGrid";
import Manifesto from "@/components/sections/Manifesto";
import SpacesSection from "@/components/spaces/SpacesSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import ParkingFeature from "@/components/sections/ParkingFeature";
import AudienceSection from "@/components/sections/AudienceSection";
import PricingSection from "@/components/sections/PricingSection";
import InstagramGallery from "@/components/sections/InstagramGallery";
import LocationMap from "@/components/sections/LocationMap";
import FaqSection from "@/components/sections/FaqSection";
import Footer from "@/components/layout/Footer";
import EnquiryModal from "@/components/enquiry/EnquiryModal";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Language } from "@/data/content";

export default function MaisonApp() {
  const [language, setLanguage] = useState<Language>("fr");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  const handleOpenEnquiry = (spaceId?: string) => {
    setSelectedSpaceId(spaceId || null);
    setModalOpen(true);
  };

  const handleCloseEnquiry = () => {
    setModalOpen(false);
    setSelectedSpaceId(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-calve-cream text-calve-charcoal selection:bg-calve-slate selection:text-white">
      {/* Top Thin Scroll Progress Bar */}
      <ScrollProgress />

      {/* Floating Modern Header Capsule */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onOpenEnquiry={handleOpenEnquiry}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Architectural Magazine Hero */}
        <Hero language={language} onOpenEnquiry={handleOpenEnquiry} />

        {/* Modern Bento Grid Ecosystem */}
        <BentoGrid language={language} onOpenEnquiry={handleOpenEnquiry} />

        {/* Manifesto / Human-Scale Philosophy */}
        <Manifesto language={language} />

        {/* Workspaces Showcase */}
        <SpacesSection language={language} onOpenEnquiry={handleOpenEnquiry} />

        {/* Executive Comparison: Coworking Usine vs Maison Calvé */}
        <ComparisonSection language={language} onOpenEnquiry={handleOpenEnquiry} />

        {/* Major Visual Spotlight on 9 Courtyard Parking Spaces */}
        <ParkingFeature language={language} onOpenEnquiry={handleOpenEnquiry} />

        {/* Interactive Audience & Profile Solutions */}
        <AudienceSection language={language} onOpenEnquiry={handleOpenEnquiry} />

        {/* Transparent Pricing Table */}
        <PricingSection language={language} onOpenEnquiry={handleOpenEnquiry} />

        {/* Real Life & Atmosphere from @maisoncalvebordeaux */}
        <InstagramGallery language={language} />

        {/* Location & Fondaudège District Access */}
        <LocationMap language={language} />

        {/* FAQ with Rich Schema */}
        <FaqSection language={language} onOpenEnquiry={handleOpenEnquiry} />
      </main>

      {/* Footer with Giant Typographic Watermark */}
      <Footer
        language={language}
        onLanguageChange={setLanguage}
        onOpenEnquiry={handleOpenEnquiry}
      />

      {/* Circular Progress Scroll-To-Top Button */}
      <ScrollToTop language={language} />

      {/* High-Conversion Enquiry / Viewing Modal */}
      <EnquiryModal
        isOpen={modalOpen}
        onClose={handleCloseEnquiry}
        language={language}
        initialSpaceId={selectedSpaceId}
      />
    </div>
  );
}
