import styles from "./RoadmapSection.module.css";

export function RoadmapSection() {
  return (
    <section id="roadmap" className={styles.section}>
      <h2>Roadmap</h2>
      <p>
        Upcoming: saved routes, shareable route links, and expanded stats
        across every game in the saga.
      </p>
    </section>
  );
}
