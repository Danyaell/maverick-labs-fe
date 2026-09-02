import { Link } from "react-router";
import styles from "./CapabilitiesSection.module.css";
import { CAPABILITIES } from "../data/capabilities.data";
import { getGameAssetUrl } from "../../../utils/assets";
import { LandingSection } from "./LandingSection";

export function CapabilitiesSection() {
  return (
    <LandingSection
      id="capabilities"
      labelledBy="capabilities-heading"
      tone="raised"
    >
      <p className={`${styles.subtitle} eyebrow`}>Product journey</p>
      <h2 className={styles.heading} id="capabilities-heading" tabIndex={-1}>
        From catalog to route analysis
      </h2>
      <p>
        Explore all eight main Mega Man X titles, then use the complete Mega Man
        X route-planning experience to inspect stages, build a route, and
        analyze every decision.
      </p>

      <ol
        className={styles.capabilityList}
        role="list"
        aria-label="Product capabilities"
      >
        {CAPABILITIES.map((capability) => (
          <li key={capability.id} className={styles.card}>
            <img
              className={styles.icon}
              src={getGameAssetUrl(capability.iconAssetKey)}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <h3>{capability.title}</h3>
            <p>{capability.description}</p>
            <Link className={styles.link} to={capability.link.to}>
              {capability.link.label}
            </Link>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
}
