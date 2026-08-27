import styles from "./ArchitectureSection.module.css";

export function ArchitectureSection() {
  return (
    <section id="architecture" className={styles.section}>
      <h2>Architecture</h2>
      <p>
        Maverick Labs is a React and TypeScript single-page app backed by a
        Java 21 and Spring Boot API, deployed as static assets with SPA
        rewrites for client-side routing.
      </p>
    </section>
  );
}
