import { useEffect } from "react";
import { useLocation } from "react-router";
import { LandingHero } from "../components/LandingHero";
import { CapabilitiesSection } from "../components/CapabilitiesSection";
import { DemoSection } from "../components/DemoSection";
import { EngineSection } from "../components/EngineSection";
import { ApiSection } from "../components/ApiSection";
import { ArchitectureSection } from "../components/ArchitectureSection";
import { RoadmapSection } from "../components/RoadmapSection";

export function LandingPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      return;
    }

    // cross-route hash links need a manual scroll since this is client-side routing
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <article>
      <LandingHero />
      <CapabilitiesSection />
      <DemoSection />
      <EngineSection />
      <ApiSection />
      <ArchitectureSection />
      <RoadmapSection />
    </article>
  );
}
