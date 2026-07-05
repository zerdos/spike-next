import { EngagementSteps } from "@/components/sections/EngagementSteps";
import { FinalCta } from "@/components/sections/FinalCta";
import { Founder } from "@/components/sections/Founder";
import { Hero } from "@/components/sections/Hero";
import { MethodSummary } from "@/components/sections/MethodSummary";
import { Proof } from "@/components/sections/Proof";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { TheShift } from "@/components/sections/TheShift";
import { home } from "@/content/copy/home";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      name: "spike.land",
      url: "https://spike.land",
      description:
        "AI-native digital agency helping companies with digital transformation in the agentic era.",
      email: home.footer.email,
      areaServed: "GB",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Brighton",
        addressCountry: "GB",
      },
      founder: { "@id": "https://spike.land/#founder" },
    },
    {
      "@type": "Person",
      "@id": "https://spike.land/#founder",
      name: home.founder.name,
      jobTitle: "Founder",
      url: "https://spike.land/about",
      sameAs: [home.footer.linkedin, home.footer.github],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from typed copy
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <TheShift />
      <ServicesGrid />
      <Proof />
      <MethodSummary />
      <EngagementSteps />
      <Founder />
      <FinalCta />
    </>
  );
}
