import styles from "./ApiSection.module.css";

export function ApiSection() {
  return (
    <section id="api" className={styles.section}>
      <h2>API</h2>
      <p>
        A typed REST API serves game, stage, and route-analysis data, which
        this front end consumes to power the catalog and Route Builder.
      </p>
    </section>
  );
}
