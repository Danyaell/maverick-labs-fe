import styles from "./EngineSection.module.css";

export function EngineSection() {
  return (
    <section id="engine" className={styles.section}>
      <h2>Route analysis engine</h2>
      <p>
        The route-analysis engine evaluates a submitted stage order for difficulty, backtracking, estimated time, warnings, and recommendations.
      </p>
    </section>
  );
}
