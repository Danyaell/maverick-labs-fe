import { Link } from "react-router";
import styles from "./LandingHero.module.css";

export function LandingHero() {
  return (
    <section className={styles.hero}>
      <h1>Maverick Labs</h1>
      <p>
        A companion toolkit for the Mega Man X saga: browse stage data,
        bosses, and rewards, then build and analyze a custom stage order
        before you play.
      </p>
      <Link className="button--primary" to="/games">
        Choose a game
      </Link>
    </section>
  );
}
