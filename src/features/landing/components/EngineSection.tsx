import styles from "./EngineSection.module.css";
import {
  adjustedOrderResponse,
  initialOrderResponse,
} from "../data/routeAnalysisDemo.fixture";

interface EngineStage {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly detail: string;
}

const ENGINE_STAGES: readonly EngineStage[] = [
  {
    id: "request",
    title: "Route request",
    summary: "You submit a game, stage order, and analysis goal.",
    detail:
      "The request contains a game code, an ordered list of stage slugs, and the HUNDRED_PERCENT goal.",
  },
  {
    id: "validation",
    title: "Validation & data loading",
    summary: "The backend resolves the game data and verifies the route.",
    detail:
      "The backend loads the game's stage, boss, and collectible-requirement data, rejects unknown or duplicate stage slugs, and requires a HUNDRED_PERCENT route to include every game stage exactly once. It then loads the weapon rewards used by the simulation.",
  },
  {
    id: "simulation",
    title: "Progression simulation",
    summary: "The engine processes the route stage by stage.",
    detail:
      "A stage's weapon reward becomes available only after that stage is cleared. A boss weakness reduces difficulty only when its required weapon was acquired before reaching that boss.",
  },
  {
    id: "scores",
    title: "Scores & warnings",
    summary: "The simulation turns progression into model outputs.",
    detail:
      "The response includes difficulty score and label, backtracking score, modeled estimated minutes, warnings, and a breakdown of base difficulty, combat difficulty, weakness reduction, route efficiency, and time penalty. An unmet collectible requirement adds backtracking pressure and warns that a revisit may be needed.",
  },
  {
    id: "recommendations",
    title: "Prioritized recommendations",
    summary:
      "Rule-based suggestions turn route problems into ordered guidance.",
    detail:
      "Boss-order, backtracking, and route-efficiency recommendations are generated from the analyzed route, deduplicated, ordered by configured type and severity priorities, and capped before being returned.",
  },
] as const;

export function EngineSection() {
  return (
    <section id="engine" className={styles.section}>
      <h2>How the route-analysis engine works</h2>
      <p>
        Every submitted route moves through the same five stages before you see
        a result. Expand a stage for the technical detail behind it.
      </p>

      <ol className={styles.stageList}>
        {ENGINE_STAGES.map((stage, index) => (
          <li key={stage.id} className={styles.stageItem}>
            <details className={styles.stageDetails}>
              <summary className={styles.stageSummary}>
                <span className={styles.stageNumber}>{index + 1}</span>
                <span className={styles.stageTitle}>{stage.title}</span>
                <span className={styles.stageSummaryText}>{stage.summary}</span>
              </summary>
              <p className={styles.stageDetailText}>{stage.detail}</p>
            </details>
          </li>
        ))}
      </ol>

      <p className={styles.example}>
        <strong>In practice: </strong>
        In the captured MMX comparison, moving Chill Penguin before Spark
        Mandrill makes Shotgun Ice and the Leg Upgrade available first. Shotgun
        Ice lowers combat difficulty from{" "}
        {initialOrderResponse.breakdown.combatDifficulty} to{" "}
        {adjustedOrderResponse.breakdown.combatDifficulty}. The Leg Upgrade
        makes Spark Mandrill&apos;s Heart Tank available on the first visit,
        lowering modeled backtracking from{" "}
        {initialOrderResponse.backtrackingScore} to{" "}
        {adjustedOrderResponse.backtrackingScore}. The Sub Tank still requires
        Boomerang Cutter. The model&apos;s estimated time changes from{" "}
        {initialOrderResponse.estimatedMinutes} to{" "}
        {adjustedOrderResponse.estimatedMinutes} minutes.
      </p>

      <p className={styles.caveat}>
        Estimated time is a model output from the simulation, not a speedrun
        prediction or a guaranteed clear time.
      </p>

      <a
        className={styles.repoLink}
        href="https://github.com/Danyaell/maverick-labs-be"
        target="_blank"
        rel="noopener noreferrer"
      >
        View the backend engine source
      </a>
    </section>
  );
}
