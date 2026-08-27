import { Link } from "react-router";
import styles from "./DemoSection.module.css";

export function DemoSection() {
  return (
    <section id="demo" className={styles.section}>
      <h2>Live demo</h2>
      <p>
        Pick a game from the catalog and open its Route Builder to reorder
        stages and watch difficulty, backtracking, and estimated time update
        as you go.
      </p>
      <Link className="button--primary" to="/games">
        Explore games
      </Link>
    </section>
  );
}
