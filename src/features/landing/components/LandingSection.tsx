import type { ReactNode } from "react";
import styles from "./LandingSection.module.css";

export type LandingSectionTone = "default" | "raised" | "deep" | "accent";

interface LandingSectionProps {
  id?: string;
  labelledBy: string;
  tone?: LandingSectionTone;
  children: ReactNode;
}

export function LandingSection({
  id,
  labelledBy,
  tone = "default",
  children,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${styles.section} ${styles[tone]}`}
    >
      <div className={styles.content}>{children}</div>
    </section>
  );
}
