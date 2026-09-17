import React from "react";
import MaisonApp from "@/components/MaisonApp";
import JsonLd from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <MaisonApp />
    </>
  );
}
