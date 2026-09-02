import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, test } from "vitest";
import { LandingHero } from "./LandingHero";

function renderHero() {
  return render(
    <MemoryRouter>
      <LandingHero />
    </MemoryRouter>,
  );
}

describe("LandingHero", () => {
  test("renders a single clear headline", () => {
    renderHero();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "MAVERICK LABS",
      }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  test("primary CTA opens the MMX Route Builder", () => {
    renderHero();

    const primaryCta = screen.getByRole("link", { name: /route builder/i });
    expect(primaryCta).toHaveAttribute("href", "/games/MMX/route-builder");
  });

  test("secondary CTA links to the API section", () => {
    renderHero();

    const secondaryCta = screen.getByRole("link", { name: /api/i });
    expect(secondaryCta).toHaveAttribute("href", "/#api");
  });

  test("exposes the game catalog without needing to scroll", () => {
    renderHero();

    const catalogLink = screen.getByRole("link", {
      name: /browse all games/i,
    });
    expect(catalogLink).toHaveAttribute("href", "/games");
  });
});
