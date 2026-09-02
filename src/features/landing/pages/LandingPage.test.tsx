import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";
import { LandingPage } from "./LandingPage";

const LANDING_SECTIONS = [
  {
    id: "capabilities",
    name: "From catalog to route analysis",
  },
  {
    id: "demo",
    name: "See how one stage-order change affects the route",
  },
  {
    id: "engine",
    name: "How the route-analysis engine works",
  },
  {
    id: "api",
    name: "Three operations power everything on screen",
  },
  {
    id: "architecture",
    name: "Architecture & stack",
  },
  {
    id: "roadmap",
    name: "Available today and planned next",
  },
] as const;

describe("LandingPage", () => {
  test("renders a stable anchor for every landing section", () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    for (const { id } of LANDING_SECTIONS) {
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
