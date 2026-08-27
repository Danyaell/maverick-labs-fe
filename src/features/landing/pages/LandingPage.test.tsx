import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";
import { LandingPage } from "./LandingPage";

const SECTION_IDS = [
  "capabilities",
  "demo",
  "engine",
  "api",
  "architecture",
  "roadmap",
];

describe("LandingPage", () => {
  test("renders a hero CTA linking to the game catalog", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    const cta = screen.getByRole("link", { name: /choose a game/i });
    expect(cta).toHaveAttribute("href", "/games");
  });

  test("renders a stable anchor for every landing section", () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    for (const id of SECTION_IDS) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
  });

  test("scrolls the matching section into view when the URL has a hash", () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    render(
      <MemoryRouter initialEntries={["/#architecture"]}>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(scrollIntoView).toHaveBeenCalled();
  });
});
