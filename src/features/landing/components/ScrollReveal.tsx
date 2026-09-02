import { type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./ScrollReveal.module.css";

interface ScrollRevealProps {
  children: ReactNode;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function shouldRevealImmediately(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  const prefersReducedMotion =
    window.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false;

  return prefersReducedMotion || typeof IntersectionObserver === "undefined";
}

export function ScrollReveal({ children }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  const [isRevealed, setIsRevealed] = useState(shouldRevealImmediately);

  useEffect(() => {
    if (isRevealed) {
      return;
    }

    const element = elementRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setIsRevealed(true);
        observer.disconnect();
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -30% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isRevealed]);

  return (
    <div ref={elementRef} className={styles.reveal} data-revealed={isRevealed}>
      {children}
    </div>
  );
}
