import { useEffect } from "react";
import { useLocation } from "react-router";
import { LandingHero } from "../components/LandingHero";
import { CapabilitiesSection } from "../components/CapabilitiesSection";
import { DemoSection } from "../components/DemoSection";
import { EngineSection } from "../components/EngineSection";
import { ApiSection } from "../components/ApiSection";
import { ArchitectureSection } from "../components/ArchitectureSection";
import { RoadmapSection } from "../components/RoadmapSection";
import { ScrollReveal } from "../components/ScrollReveal";

export function LandingPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      return;
    }

    const target = document.getElementById(hash.slice(1));

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    target?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [hash]);

  return (
    <article>
      <ScrollReveal>
        <LandingHero />
      </ScrollReveal>

      <ScrollReveal>
        <CapabilitiesSection />
      </ScrollReveal>

      <ScrollReveal>
        <DemoSection />
      </ScrollReveal>

      <ScrollReveal>
        <EngineSection />
      </ScrollReveal>

      <ScrollReveal>
        <ApiSection />
      </ScrollReveal>

      <ScrollReveal>
        <ArchitectureSection />
      </ScrollReveal>

      <ScrollReveal>
        <RoadmapSection />
      </ScrollReveal>
    </article>
  );
}
