import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { EngineSection } from "./EngineSection";
import {
  adjustedOrderResponse,
  initialOrderResponse,
} from "../data/routeAnalysisDemo.fixture";

const STAGE_TITLES = [
  "Route request",
  "Validation & data loading",
  "Progression simulation",
  "Scores & warnings",
  "Prioritized recommendations",
];

describe("EngineSection", () => {
  test("presents the end-to-end flow in five stages, in order", () => {
    const { container } = render(<EngineSection />);

    const details = container.querySelectorAll("details");
    expect(details).toHaveLength(5);

    STAGE_TITLES.forEach((title, index) => {
      expect(details[index]).toHaveTextContent(title);
    });
  });

  test("all stages start collapsed and can be expanded via their disclosure control", async () => {
    const user = userEvent.setup();
    const { container } = render(<EngineSection />);

    const details = Array.from(container.querySelectorAll("details"));
    for (const item of details) {
      expect(item).not.toHaveAttribute("open");
    }

    const firstSummary = screen.getByText("Route request").closest("summary");
    expect(firstSummary).not.toBeNull();

    await user.click(firstSummary!);

    expect(details[0]).toHaveAttribute("open");
  });

  test("all five stage controls are reachable via Tab, in order", async () => {
    const user = userEvent.setup();
    const { container } = render(<EngineSection />);

    const summaries = Array.from(container.querySelectorAll("summary"));
    expect(summaries).toHaveLength(5);

    for (const summary of summaries) {
      await user.tab();
      expect(summary).toHaveFocus();
    }
  });

  test("connects a concrete MMX stage-order decision to real calculated outcomes", () => {
    render(<EngineSection />);

    expect(
      screen.getByText(/chill penguin before spark mandrill/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(
          `${initialOrderResponse.backtrackingScore} to ${adjustedOrderResponse.backtrackingScore}`,
        ),
      ),
    ).toBeInTheDocument();
  });

  test("describes estimated time as a model output, not a guarantee", () => {
    render(<EngineSection />);

    expect(
      screen.getByText(/not a speedrun prediction or a guaranteed clear time/i),
    ).toBeInTheDocument();
  });

  test("links to the backend engine repository", () => {
    render(<EngineSection />);

    const link = screen.getByRole("link", {
      name: /view the backend engine source/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/Danyaell/maverick-labs-be",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
