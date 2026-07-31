import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { RouteBuilderPage } from "./RouteBuilderPage";
import type { GameDetail } from "../../games/types/game.types";

const { mockFetchGameDetail } = vi.hoisted(() => ({
  mockFetchGameDetail: vi.fn(),
}));

const { mockAnalyzeRoute } = vi.hoisted(() => ({
  mockAnalyzeRoute: vi.fn(),
}));

vi.mock("../../games/api/gameApi", () => ({
  fetchGameDetail: mockFetchGameDetail,
}));

vi.mock("../../route-builder/api/routeAnalysisApi", () => ({
  analyzeRoute: mockAnalyzeRoute,
}));

function createGameDetail(): GameDetail {
  return {
    code: "MMX",
    title: "Mega Man X",
    releaseOrder: 1,
    stages: [
      {
        slug: "chill-penguin",
        name: "Chill Penguin Stage",
        stageOrder: 1,
        imageAssetKey: "mmx.stage.chill-penguin",
        boss: {
          slug: "chill-penguin",
          name: "Chill Penguin",
          imageAssetKey: "mmx.boss.chill-penguin",
        },
        weaponReward: {
          slug: "shotgun-ice",
          name: "Shotgun Ice",
          description: "Fires ice projectiles.",
          imageAssetKey: "mmx.weapon.shotgun-ice",
        },
        collectibles: [],
      },
    ],
  };
}

describe("RouteBuilderPage", () => {
  beforeEach(() => {
    mockFetchGameDetail.mockReset();
    mockAnalyzeRoute.mockReset();
  });

  test("should render loading state while fetching game detail", () => {
    mockFetchGameDetail.mockReturnValue(new Promise<never>(() => undefined));

    render(
      <MemoryRouter initialEntries={["/games/MMX/route-builder"]}>
        <Routes>
          <Route
            path="/games/:gameCode/route-builder"
            element={<RouteBuilderPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading route builder...")).toBeInTheDocument();
  });

  test("should render error state when API fails", async () => {
    mockFetchGameDetail.mockRejectedValue(new Error("Request failed"));

    render(
      <MemoryRouter initialEntries={["/games/MMX/route-builder"]}>
        <Routes>
          <Route
            path="/games/:gameCode/route-builder"
            element={<RouteBuilderPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Request failed")).toBeInTheDocument();
  });

  test("should render route builder when game detail loads", async () => {
    mockFetchGameDetail.mockResolvedValue(createGameDetail());

    render(
      <MemoryRouter initialEntries={["/games/MMX/route-builder"]}>
        <Routes>
          <Route
            path="/games/:gameCode/route-builder"
            element={<RouteBuilderPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Mega Man X Route Builder"),
    ).toBeInTheDocument();
    expect(screen.getByText("Current Route")).toBeInTheDocument();
  });

  test("analyzes route only when clicking the button and uses visual stage order", async () => {
    const gameDetail: GameDetail = {
      code: "MMX",
      title: "Mega Man X",
      releaseOrder: 1,
      stages: [
        {
          slug: "storm-eagle",
          name: "Storm Eagle Stage",
          stageOrder: 2,
          imageAssetKey: "mmx.stage.storm-eagle",
          boss: {
            slug: "storm-eagle",
            name: "Storm Eagle",
            imageAssetKey: "mmx.boss.storm-eagle",
          },
          weaponReward: null,
          collectibles: [],
        },
        {
          slug: "chill-penguin",
          name: "Chill Penguin Stage",
          stageOrder: 1,
          imageAssetKey: "mmx.stage.chill-penguin",
          boss: {
            slug: "chill-penguin",
            name: "Chill Penguin",
            imageAssetKey: "mmx.boss.chill-penguin",
          },
          weaponReward: null,
          collectibles: [],
        },
      ],
    };

    mockFetchGameDetail.mockResolvedValue(gameDetail);
    mockAnalyzeRoute.mockResolvedValue({
      gameCode: "MMX",
      difficultyScore: 71,
      difficultyLabel: "MEDIUM",
      backtrackingScore: 64,
      estimatedMinutes: 89,
      warnings: [
        {
          type: "MISSING_REQUIREMENT",
          message: "You are missing a required item.",
          stageSlug: "storm-eagle",
        },
      ],
      recommendations: [
        {
          type: "BOSS_ORDER",
          severity: "INFO",
          message: "This route order is stable for first attempts.",
          relatedStages: ["chill-penguin"],
        },
      ],
      breakdown: {
        bossDifficulty: 36,
        weaknessOptimization: 28,
        baseDifficulty: -9,
        timePenalty: -7,
      },
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/games/MMX"]}>
        <Routes>
          <Route path="/games/:gameCode" element={<RouteBuilderPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByRole("button", { name: /analyze route/i });
    expect(mockAnalyzeRoute).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /analyze route/i }));

    await waitFor(() =>
      expect(mockAnalyzeRoute).toHaveBeenCalledWith({
        gameCode: "MMX",
        stageOrder: ["chill-penguin", "storm-eagle"],
        goal: "HUNDRED_PERCENT",
      }),
    );

    expect(
      await screen.findByText(/difficulty: 71 \/ 100/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/backtracking: 64 \/ 100/i)).toBeInTheDocument();
    expect(screen.getByText(/estimated time: 89 min/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();
    expect(
      screen.getByText(/This route order is stable for first attempts/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/MISSING_REQUIREMENT/)).toBeInTheDocument();
    expect(screen.getByText(/Base Difficulty/)).toBeInTheDocument();
    expect(screen.getByText(/Combat Difficulty/)).toBeInTheDocument();
    expect(screen.getByText(/Weakness Reduction/)).toBeInTheDocument();
    expect(screen.getByText(/Time Penalty/)).toBeInTheDocument();
    expect(screen.getByText(/Route Efficiency/)).toBeInTheDocument();
  });

  test("shows loading and error states for route analysis", async () => {
    const gameDetail: GameDetail = {
      code: "MMX",
      title: "Mega Man X",
      releaseOrder: 1,
      stages: [
        {
          slug: "chill-penguin",
          name: "Chill Penguin Stage",
          stageOrder: 1,
          imageAssetKey: "mmx.stage.chill-penguin",
          boss: {
            slug: "chill-penguin",
            name: "Chill Penguin",
            imageAssetKey: "mmx.boss.chill-penguin",
          },
          weaponReward: null,
          collectibles: [],
        },
      ],
    };

    mockFetchGameDetail.mockResolvedValue(gameDetail);

    let resolveRequest: (value: unknown) => void = () => {
      throw new Error("Resolve handler not initialized");
    };
    mockAnalyzeRoute.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/games/MMX"]}>
        <Routes>
          <Route path="/games/:gameCode" element={<RouteBuilderPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByRole("button", { name: /analyze route/i });
    await user.click(screen.getByRole("button", { name: /analyze route/i }));

    expect(
      screen.getByRole("button", { name: /analyzing route/i }),
    ).toBeDisabled();

    resolveRequest({
      gameCode: "MMX",
      difficultyScore: 80,
      difficultyLabel: "HARD",
      backtrackingScore: 50,
      estimatedMinutes: 95,
      warnings: [],
      recommendations: [],
      breakdown: {
        bossDifficulty: 50,
        weaknessOptimization: 20,
        baseDifficulty: -10,
        timePenalty: -10,
      },
    });

    await screen.findByText(/difficulty: 80 \/ 100/i);

    mockAnalyzeRoute.mockRejectedValueOnce(new Error("Analyzer unavailable"));
    await user.click(screen.getByRole("button", { name: /analyze route/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Analyzer unavailable",
    );
  });
});
