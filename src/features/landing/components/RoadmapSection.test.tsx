import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { RoadmapSection } from "./RoadmapSection";
import { GITHUB_KANBAN_URL } from "../../../shared/config/env";

describe("RoadmapSection", () => {
  test("communicates the current coverage boundary", () => {
    render(<RoadmapSection />);

    expect(
      screen.getByText(/mega man x is currently the only game/i),
    ).toBeInTheDocument();

    expect(screen.getByText("MMX2–MMX8")).toBeInTheDocument();
    expect(screen.getAllByText("Coming soon").length).toBeGreaterThan(0);
    expect(screen.getByText(/catalog entries only/i)).toBeInTheDocument();
  });

  test("renders available, next, and later in order", () => {
    render(<RoadmapSection />);

    const roadmap = screen.getByRole("list", {
      name: /product roadmap/i,
    });

    const headings = within(roadmap)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);

    expect(headings).toEqual(["Available now", "Next", "Later"]);
  });

  test("links safely to the GitHub Project", () => {
    render(<RoadmapSection />);

    const link = screen.getByRole("link", {
      name: /what's being developed/i,
    });

    expect(link).toHaveAttribute("href", GITHUB_KANBAN_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("does not present dates, quarters, or progress percentages", () => {
    const { container } = render(<RoadmapSection />);
    const content = container.textContent ?? "";

    expect(content).not.toMatch(/\b20\d{2}\b/);
    expect(content).not.toMatch(/\bQ[1-4]\b/i);
    expect(content).not.toMatch(/\d+\s*%/);
  });
});
