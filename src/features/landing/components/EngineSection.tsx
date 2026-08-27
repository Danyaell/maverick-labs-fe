import styles from "./EngineSection.module.css";

export function EngineSection() {
  return (
    <section id="engine" className={styles.section}>
      <h2>Route analysis engine</h2>
      <p>
        A route-analysis engine scores every stage ordering for difficulty
        and backtracking, so you can see the trade-offs of a route before
        committing to it.
      </p>
    </section>
  );
}
