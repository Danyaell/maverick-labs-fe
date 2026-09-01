import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ApiSection } from "./ApiSection";
import { API_DOCS_URL, BACKEND_REPOSITORY_URL } from "../../../shared/config/env";

const { mockAnalyzeRoute } = vi.hoisted(() => ({
  mockAnalyzeRoute: vi.fn(),
}));

vi.mock("../../route-builder/api/routeAnalysisApi", () => ({
  analyzeRoute: mockAnalyzeRoute,
}));

describe("ApiSection", () => {
  test("lists the three HTTP methods and paths with their purpose", () => {
    render(<ApiSection />);

    expect(screen.getByText("/api/v1/games")).toBeInTheDocument();
    expect(screen.getByText("/api/v1/games/{gameCode}")).toBeInTheDocument();
    expect(screen.getByText("/api/v1/routes/analyze")).toBeInTheDocument();

    const getBadges = screen.getAllByText("GET");
    const postBadges = screen.getAllByText("POST");
    expect(getBadges).toHaveLength(2);
    expect(postBadges).toHaveLength(1);

    expect(
      screen.getByText(/list the eight mega man x catalog entries/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /inspect the modeled stages, mavericks, weapons, and collectibles/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /analyze an ordered stage route and return modeled scores/i,
      ),
    ).toBeInTheDocument();
  });

  test("the request example contains MMX, HUNDRED_PERCENT, and all eight stage slugs", () => {
    const { container } = render(<ApiSection />);

    const [requestPre] = container.querySelectorAll("pre");
    const requestText = requestPre.textContent ?? "";

    expect(requestText).toContain('"gameCode": "MMX"');
    expect(requestText).toContain('"goal": "HUNDRED_PERCENT"');
    for (const slug of [
      "chill-penguin",
      "spark-mandrill",
      "storm-eagle",
      "flame-mammoth",
      "armored-armadillo",
      "launch-octopus",
      "boomer-kuwanger",
      "sting-chameleon",
    ]) {
      expect(requestText).toContain(slug);
    }
  });

  test("the response excerpt exposes score, warning, breakdown, and recommendation content", () => {
    const { container } = render(<ApiSection />);

    const [, responsePre] = container.querySelectorAll("pre");
    const responseText = responsePre.textContent ?? "";

    expect(responseText).toContain('"difficultyScore": 47');
    expect(responseText).toContain('"backtrackingScore": 80');
    expect(responseText).toContain('"estimatedMinutes": 140');
    expect(responseText).toContain("MISSING_REQUIREMENT");
    expect(responseText).toContain('"baseDifficultyAverage": 67');
    expect(responseText).toContain("BOSS_ORDER");

    expect(screen.getByText(/trimmed for length/i)).toBeInTheDocument();
  });

  test("the Swagger action opens the configured documentation URL safely in a new tab", () => {
    render(<ApiSection />);

    const link = screen.getByRole("link", { name: /open swagger ui/i });
    expect(link).toHaveAttribute("href", API_DOCS_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("the backend repository action opens the correct URL safely in a new tab", () => {
    render(<ApiSection />);

    const link = screen.getByRole("link", {
      name: /view backend repository/i,
    });
    expect(link).toHaveAttribute("href", BACKEND_REPOSITORY_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("code examples have accessible labels", () => {
    render(<ApiSection />);

    expect(
      screen.getByLabelText(/example request/i, { selector: "pre" }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/response excerpt/i, { selector: "pre" }),
    ).toBeInTheDocument();
  });

  test("rendering the section does not call the route-analysis API", () => {
    render(<ApiSection />);

    expect(mockAnalyzeRoute).not.toHaveBeenCalled();
  });
});
