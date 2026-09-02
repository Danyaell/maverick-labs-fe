import styles from "./ArchitectureSection.module.css";
import {
  APPLICATION_BOUNDARIES,
  DATA_AND_TESTING,
  DELIVERY_AND_HOSTING,
  RUNTIME_FLOW,
  STACK_GROUPS,
} from "../data/architecture.data";
import {
  BACKEND_REPOSITORY_URL,
  FRONTEND_REPOSITORY_URL,
} from "../../../shared/config/env";
import { LandingSection } from "./LandingSection";

export function ArchitectureSection() {
  return (
    <LandingSection
      id="architecture"
      labelledBy="architecture-heading"
      tone="deep"
    >
      <h2 className={styles.heading} id="architecture-heading" tabIndex={-1}>
        Architecture &amp; stack
      </h2>
      <p>
        A React client talks to a Spring Boot API backed by MySQL. Schema,
        testing, and delivery concerns are handled separately from that runtime
        path.
      </p>

      <h3>Runtime request flow</h3>
      <ol className={styles.flow} aria-label="Runtime request flow" role="list">
        {RUNTIME_FLOW.map((node) => (
          <li key={node.id} className={styles.flowNode}>
            <span className={styles.flowLabel}>{node.label}</span>
            <p className={styles.flowDetail}>{node.detail}</p>
          </li>
        ))}
      </ol>

      <h3>Internal application boundaries</h3>
      <ul className={styles.conceptList} role="list">
        {APPLICATION_BOUNDARIES.map((concept) => (
          <li key={concept.id}>
            <strong>{concept.title}:</strong> {concept.description}
          </li>
        ))}
      </ul>

      <h3>Data, schema &amp; testing</h3>
      <ul className={styles.conceptList} role="list">
        {DATA_AND_TESTING.map((concept) => (
          <li key={concept.id}>
            <strong>{concept.title}:</strong> {concept.description}
          </li>
        ))}
      </ul>

      <h3>Delivery &amp; hosting</h3>
      <ul className={styles.conceptList} role="list">
        {DELIVERY_AND_HOSTING.map((concept) => (
          <li key={concept.id}>
            <strong>{concept.title}:</strong> {concept.description}
          </li>
        ))}
      </ul>

      <h3>Technology stack</h3>
      <div className={styles.stackGrid}>
        {STACK_GROUPS.map((group) => (
          <div key={group.id} className={styles.stackGroup}>
            <h4>{group.title}</h4>
            <ul role="list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <a
          className="button button--secondary"
          href={FRONTEND_REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>View frontend repository</span>
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
