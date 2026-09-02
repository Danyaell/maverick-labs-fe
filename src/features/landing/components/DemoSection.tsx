import styles from "./DemoSection.module.css";
import { LandingSection } from "./LandingSection";
import { RouteAnalysisComparison } from "./RouteAnalysisComparison";

export function DemoSection() {
  return (
    <LandingSection id="demo" labelledBy="demo-heading" tone="deep">
      <p className={`${styles.subtitle} eyebrow`}>Route analysis demo</p>
      <h2 className={styles.heading} id="demo-heading" tabIndex={-1}>
        See how one stage-order change affects the route
      </h2>
      <p>A curated Mega Man X comparison using captured analyzer responses.</p>
      <RouteAnalysisComparison />
    </LandingSection>
  );
}
