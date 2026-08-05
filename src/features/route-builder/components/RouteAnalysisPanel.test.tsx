import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { RouteAnalysisPanel } from "./RouteAnalysisPanel";
import userEvent from "@testing-library/user-event";
import { createRouteAnalysis } from "../../../test/fixtures/routeBuilderFixtures";

describe("RouteAnalysisPanel", async () => {
  const user = userEvent.setup();
  render(
      <RouteAnalysisPanel
        analysis={{
          gameCode: "MMX",
          difficultyScore: 70,
          difficultyLabel: "MEDIUM",
          backtrackingScore: 55,
          estimatedMinutes: 90,
          warnings: [
            {
              type: "BACKTRACKING",
              message: "You should avoid this heavy backtracking path.",
              stageSlug: null,
            },
          ],
          recommendations: [
            {
              type: "BACKTRACKING",
              severity: "WARNING",
              message: "You should avoid this heavy backtracking path.",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 1",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 2",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 3",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 4",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 5",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 6",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 7",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 8",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 9",
              relatedStages: null,
            },
          ],
          breakdown: {
            combatDifficulty: 35,
            weaknessReduction: 30,
            baseDifficultyAverage: -5,
            timePenaltyMinutes: -10,
            routeEfficiencyScore: 0,
          },
        }}
      />,
    );

  await user.click(
    screen.getByRole("tab", {
      name: /recommendations/i,
    }),
  );

  const recommendationsPanel = screen.getByRole("tabpanel", {
    name: /recommendations/i,
  });

  expect(
    within(recommendationsPanel).getByText(
      "Recommendation 8",
    ),
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole("tab", {
      name: /breakdown/i,
    }),
  );

  const breakdownPanel = screen.getByRole("tabpanel", {
    name: /breakdown/i,
  });

  expect(
    within(breakdownPanel).getByText("Base Difficulty"),
  ).toBeInTheDocument();

  test("deduplicates recommendations and limits the list to 8", () => {
    render(
      <RouteAnalysisPanel
        analysis={{
          gameCode: "MMX",
          difficultyScore: 70,
          difficultyLabel: "MEDIUM",
          backtrackingScore: 55,
          estimatedMinutes: 90,
          warnings: [
            {
              type: "BACKTRACKING",
              message: "You should avoid this heavy backtracking path.",
              stageSlug: null,
            },
          ],
          recommendations: [
            {
              type: "BACKTRACKING",
              severity: "WARNING",
              message: "You should avoid this heavy backtracking path.",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 1",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 2",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 3",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 4",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 5",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 6",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 7",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 8",
              relatedStages: null,
            },
            {
              type: "BOSS_ORDER",
              severity: "INFO",
              message: "Recommendation 9",
              relatedStages: null,
            },
          ],
          breakdown: {
            combatDifficulty: 35,
            weaknessReduction: 30,
            baseDifficultyAverage: -5,
            timePenaltyMinutes: -10,
            routeEfficiencyScore: 0,
          },
        }}
      />,
    );

    expect(
      within(recommendationsPanel).getByText("Recommendation 8"),
    ).toBeInTheDocument();

    expect(
      within(recommendationsPanel).queryByText("Recommendation 9"),
    ).not.toBeInTheDocument();
  });

  test("changes tabs using keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<RouteAnalysisPanel analysis={createRouteAnalysis()} />);

    const summary = screen.getByRole("tab", {
      name: /summary/i,
    });
    const recommendations = screen.getByRole("tab", {
      name: /recommendations/i,
    });
    const breakdown = screen.getByRole("tab", {
      name: /breakdown/i,
    });

    summary.focus();

    await user.keyboard("{ArrowRight}");

    expect(recommendations).toHaveFocus();
    expect(recommendations).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{End}");

    expect(breakdown).toHaveFocus();

    await user.keyboard("{Home}");

    expect(summary).toHaveFocus();
  });
});
