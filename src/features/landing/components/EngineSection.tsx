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
    summary: "You submit a stage order and a goal.",
    detail:
      "The request carries a game code, the eight-stage order you chose, and a goal such as HUNDRED_PERCENT.",
  },
  {
    id: "validation",
    title: "Validation & data loading",
    summary: "The backend checks the request and loads game data.",
    detail:
      "The stage order must contain exactly eight valid, unique stage slugs for the requested game before the stage, boss, weapon, and collectible data for that game is loaded.",
  },
  {
    id: "simulation",
    title: "Progression simulation",
    summary: "The engine plays through your order stage by stage.",
    detail:
      "Each stage's weapon reward becomes available only after that stage is cleared, and a boss's weakness reduction is only applied if you already acquired the required weapon by the time you reach that boss.",
  },
  {
    id: "scores",
    title: "Scores & warnings",
    summary: "The simulation produces scores and flags risk.",
    detail:
      "Difficulty, backtracking, estimated time, and a route-efficiency breakdown are calculated from the simulation. Warnings are raised when a collectible's requirement, such as a weapon or upgrade, isn't available yet, since that forces a return trip later.",
  },
  {
    id: "recommendations",
    title: "Prioritized recommendations",
    summary: "Rule-based suggestions surface the highest-impact changes.",
    detail:
      "Boss-order, backtracking, and route-efficiency recommendations are generated from the analyzed route and ranked so the most impactful change is easy to find.",
  },
] as const;

export function EngineSection() {
  return (
    <section id="engine" className={styles.section}>
      <h2>How the route-analysis engine works</h2>
      <p>
        Every submitted route moves through the same five stages before you
        see a result. Expand a stage for the technical detail behind it.
      </p>

      <ol className={styles.stageList}>
        {ENGINE_STAGES.map((stage, index) => (
          <li key={stage.id} className={styles.stageItem}>
            <details className={styles.stageDetails}>
              <summary className={styles.stageSummary} tabIndex={0}>
                <span className={styles.stageNumber}>{index + 1}</span>
                <span className={styles.stageTitle}>{stage.title}</span>
                <span className={styles.stageSummaryText}>
                  {stage.summary}
                </span>
              </summary>
              <p className={styles.stageDetailText}>{stage.detail}</p>
            </details>
          </li>
        ))}
      </ol>

      <p className={styles.example}>
        <strong>In practice: </strong>
        In the captured comparison above, moving Chill Penguin before Spark
        Mandrill made Shotgun Ice available before that fight. The real
        analyzer response showed backtracking drop from{" "}
        {initialOrderResponse.backtrackingScore} to{" "}
        {adjustedOrderResponse.backtrackingScore} and estimated time drop
        from {initialOrderResponse.estimatedMinutes} to{" "}
        {adjustedOrderResponse.estimatedMinutes} minutes.
      </p>

      <p className={styles.caveat}>
        Estimated time is a model output from the simulation, not a
        speedrun prediction or a guaranteed clear time.
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
