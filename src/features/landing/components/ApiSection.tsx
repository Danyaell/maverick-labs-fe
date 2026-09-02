import styles from "./ApiSection.module.css";
import {
  API_OPERATIONS,
  apiExampleRequest,
  apiExampleResponseExcerpt,
} from "../data/apiShowcase.fixture";
import {
  API_DOCS_URL,
  BACKEND_REPOSITORY_URL,
} from "../../../shared/config/env";
import { LandingSection } from "./LandingSection";

export function ApiSection() {
  return (
    <LandingSection id="api" labelledBy="api-heading" tone="raised">
      <p className={`${styles.subtitle} eyebrow`}>API</p>
      <h2 className={styles.heading} id="api-heading" tabIndex={-1}>
        Three operations power everything on screen
      </h2>
      <p>
        The catalog, game detail, and Route Builder are all backed by a small,
        typed REST API. Here is the full public surface.
      </p>

      <ol className={styles.operationList}>
        {API_OPERATIONS.map((operation) => (
          <li
            key={`${operation.method}-${operation.path}`}
            className={styles.operation}
          >
            <span
              className={`${styles.method} ${
                operation.method === "GET"
                  ? styles.methodGet
                  : styles.methodPost
              }`}
            >
              {operation.method}
            </span>
            <code className={styles.path}>{operation.path}</code>
            <p className={styles.purpose}>{operation.purpose}</p>
          </li>
        ))}
      </ol>

      <div className={styles.exampleGrid}>
        <figure className={styles.codeFigure}>
          <figcaption id="api-request-caption">
            Example request &mdash; POST /api/v1/routes/analyze
          </figcaption>
          <pre
            className={styles.codeBlock}
            tabIndex={0}
            aria-labelledby="api-request-caption"
          >
            <code>{JSON.stringify(apiExampleRequest, null, 2)}</code>
          </pre>
        </figure>

        <figure className={styles.codeFigure}>
          <figcaption id="api-response-caption">
            Response excerpt &mdash; trimmed for length; real responses can
            include more warnings and recommendations
          </figcaption>
          <pre
            className={styles.codeBlock}
            tabIndex={0}
            aria-labelledby="api-response-caption"
          >
            <code>{JSON.stringify(apiExampleResponseExcerpt, null, 2)}</code>
          </pre>
        </figure>
      </div>

      <div className={styles.actions}>
        <a
          className="button button--primary"
          href={API_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Open Swagger UI</span>
          <span> ↗</span>
          <span className="visually-hidden">— opens in a new tab</span>
        </a>
        <a
          className="button button--secondary"
          href={BACKEND_REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>View backend repository</span>
          <span> ↗</span>
          <span className="visually-hidden">— opens in a new tab</span>
        </a>
      </div>
    </LandingSection>
  );
}
