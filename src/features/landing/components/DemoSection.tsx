import styles from "./DemoSection.module.css";
import { RouteAnalysisComparison } from "./RouteAnalysisComparison";

export function DemoSection() {
  return (
    <section id="demo" className={styles.section} aria-labelledby="demo-heading">
      <p className="eyebrow">Route analysis demo</p>
      <h2 id="demo-heading" tabIndex={-1}>See how one stage-order change affects the route</h2>
      <p>
        A curated Mega Man X comparison using captured analyzer responses.
      </p>
      <RouteAnalysisComparison />
    </section>
  );
}
