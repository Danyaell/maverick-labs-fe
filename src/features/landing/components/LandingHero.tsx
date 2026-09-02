import { Link } from "react-router";
import styles from "./LandingHero.module.css";
import stageSelectImage from "../../../assets/games/mmx/stage/stage-select.png";
import chillPenguinImage from "../../../assets/games/mmx/boss/chill-penguin.png";
import stormEagleImage from "../../../assets/games/mmx/boss/storm-eagle.png";
import flameMammothImage from "../../../assets/games/mmx/boss/flame-mammoth.png";

export function LandingHero() {
  return (
    <section className={styles.hero} aria-labelledby="landing-heading">
      <div className={styles.copy}>
        <h1 id="landing-heading" tabIndex={-1}>Plan smarter Mega Man X routes</h1>
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
          src={stageSelectImage}
          width={256}
          height={224}
          alt=""
          aria-hidden="true"
        />
        <ol className={styles.routeOrder} aria-hidden="true">
          <li className={styles.routeStop}>
            <img className={styles.routeIcon} src={chillPenguinImage} alt="" />
            <span className={styles.routeStopNumber}>1</span>
          </li>
          <li className={styles.routeStop}>
            <img className={styles.routeIcon} src={stormEagleImage} alt="" />
            <span className={styles.routeStopNumber}>2</span>
          </li>
          <li className={styles.routeStop}>
            <img className={styles.routeIcon} src={flameMammothImage} alt="" />
            <span className={styles.routeStopNumber}>3</span>
          </li>
        </ol>
        <figcaption className={styles.caption}>
          Sample route: Chill Penguin &rarr; Storm Eagle &rarr; Flame Mammoth
        </figcaption>
      </figure>
    </section>
  );
}
