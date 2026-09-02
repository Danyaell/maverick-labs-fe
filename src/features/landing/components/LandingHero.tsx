import { Link } from "react-router";
import styles from "./LandingHero.module.css";
import megaManImage from "../../../assets/mega-man/mega-man-complete.png";

export function LandingHero() {
  return (
    <section className={styles.hero} aria-labelledby="landing-heading">
      <div className={styles.copy}>
        <span>Plan smarter Mega Man X routes</span>
        <h1 className={styles.heading} id="landing-heading" tabIndex={-1}>
          MAVERICK LABS
        </h1>
        <p>
          Reorder the eight Mega Man X stages and see how boss weaknesses and
          collectible requirements affect difficulty, backtracking, estimated
          time, and recommendations.
        </p>
        <div className={styles.ctaRow}>
          <Link
            className="button button--primary"
            to="/games/MMX/route-builder"
          >
            Try the MMX Route Builder
          </Link>
          <Link className="button button--secondary" to="/#api">
            See the API &amp; engineering
          </Link>
        </div>
        <Link className={styles.catalogLink} to="/games">
          Browse all games
        </Link>
      </div>

      <figure className={styles.visual}>
        <img
          className={styles.frame}
          src={megaManImage}
          width={256}
          height={224}
          alt=""
          aria-hidden="true"
        />
      </figure>
    </section>
  );
}
