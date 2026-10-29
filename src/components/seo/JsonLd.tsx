import React from "react";
import { CONTENT } from "@/data/content";

export default function JsonLd() {
  const faqItems = CONTENT.fr.faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a
    }
  }));

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "CoworkingSpace"],
    name: "Maison Calvé - Coworking Bordeaux",
    alternateName: "Maison Calvé",
    description:
      "Espace de coworking haut de gamme et bureaux privatifs à Bordeaux Fondaudège avec 9 places de parking privatives sécurisées.",
    url: "https://maisoncalve.fr",
    telephone: "+33695577033",
    email: "contact@maisoncalve.fr",
    address: {
      "@type": "PostalAddress",
      streetAddress: "48 rue Calvé",
      addressLocality: "Bordeaux",
      postalCode: "33000",
      addressCountry: "FR"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 44.8488,
      longitude: -0.5843
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        opens: "00:00",
        closes: "23:59"
      }
    ],
    priceRange: "10€ - 1100€",
    image: [
      "https://maisoncalve.fr/images/spaces/real-open-space-fixe-4k.jpg",
      "https://maisoncalve.fr/images/real/maison-calve-open-space.jpg",
      "https://maisoncalve.fr/images/spaces/real-office-17m-4k.jpg",
      "https://maisoncalve.fr/images/real/maison-calve-meeting-room.jpg",
      "https://maisoncalve.fr/images/real/maison-calve-kitchen.jpg",
      "https://maisoncalve.fr/images/calve-parking.jpg"
    ],
    sameAs: [
      "https://www.instagram.com/maisoncalvebordeaux"
    ],
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Parking privé sécurisé 9 places",
        value: true
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Fibre optique haut débit",
        value: true
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Accès 24/7",
        value: true
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Salle de réunion équipée 30m²",
        value: true
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Phonebox insonorisée",
        value: true
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
