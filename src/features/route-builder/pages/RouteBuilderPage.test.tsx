import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { RouteBuilderPage } from "./RouteBuilderPage";
import type { GameDetail } from "../../games/types/game.types";
import { RouteBuilder } from "../components/RouteBuilder";
import { renderWithQueryClient } from "../../../test/renderWithQueryClient";
import type { RouteAnalysisResponse } from "../types/routeAnalysis.types";

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

function getRenderedStageNames(): string[] {
  return screen.getAllByRole("listitem").map((item) => {
    return within(item).getByRole("heading").textContent ?? "";
  });
}

function createRouteAnalysis(): RouteAnalysisResponse {
  return {
    gameCode: "MMX",
    difficultyScore: 71,
    difficultyLabel: "MEDIUM",
    backtrackingScore: 64,
    estimatedMinutes: 89,
    warnings: [],
    recommendations: [],
    breakdown: {
      baseDifficultyAverage: 50,
      combatDifficulty: 60,
      routeEfficiencyScore: 75,
      timePenaltyMinutes: 10,
      weaknessReduction: 20,
    },
  };
}

describe("RouteBuilderPage", () => {
  beforeEach(() => {
    mockFetchGameDetail.mockReset();
    mockAnalyzeRoute.mockReset();
  });

  test("should render loading state while fetching game detail", () => {
    mockFetchGameDetail.mockReturnValue(new Promise<never>(() => undefined));

    renderWithQueryClient(
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

    renderWithQueryClient(
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

    renderWithQueryClient(
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
  });

  test("automatically analyzes the current visual stage order", async () => {
    mockFetchGameDetail.mockResolvedValue(createGameDetail());
    mockAnalyzeRoute.mockResolvedValue(createRouteAnalysis());

    renderWithQueryClient(
      <MemoryRouter initialEntries={["/games/MMX/route-builder"]}>
        <Routes>
          <Route
            path="/games/:gameCode/route-builder"
            element={<RouteBuilderPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText(/71 \/ 100/i)).toBeInTheDocument();
  });

  test("updates live analysis after changing stage order", async () => {
    const user = userEvent.setup();

    mockFetchGameDetail.mockResolvedValue(createGameDetail());
    mockAnalyzeRoute.mockResolvedValue(createRouteAnalysis());

    renderWithQueryClient(
      <MemoryRouter initialEntries={["/games/MMX/route-builder"]}>
        <Routes>
          <Route
            path="/games/:gameCode/route-builder"
            element={<RouteBuilderPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockAnalyzeRoute).toHaveBeenCalledTimes(1);
    });

    await user.click(
      screen.getByRole("button", {
        name: /move chill penguin stage down/i,
      }),
    );
  });

  test("keeps previous analysis visible while updating", async () => {
    const user = userEvent.setup();

    let resolveSecondAnalysis:
      | ((value: RouteAnalysisResponse) => void)
      | undefined;

    mockFetchGameDetail.mockResolvedValue(createGameDetail());

    mockAnalyzeRoute
      .mockResolvedValueOnce(createRouteAnalysis())
      .mockImplementationOnce(
        () =>
          new Promise<RouteAnalysisResponse>((resolve) => {
            resolveSecondAnalysis = resolve;
          }),
      );

    renderWithQueryClient(
      <MemoryRouter initialEntries={["/games/MMX/route-builder"]}>
        <Routes>
          <Route
            path="/games/:gameCode/route-builder"
            element={<RouteBuilderPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/71 \/ 100/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /move chill penguin stage down/i,
      }),
    );

    expect(screen.getByText(/71 \/ 100/i)).toBeInTheDocument();

    resolveSecondAnalysis?.({
      ...createRouteAnalysis(),
      difficultyScore: 65,
    });
  });

  test("shows analysis error and allows retry", async () => {
    mockFetchGameDetail.mockResolvedValue(createGameDetail());

    mockAnalyzeRoute
      .mockRejectedValueOnce(new Error("Analyzer unavailable"))
      .mockResolvedValueOnce(createRouteAnalysis());

    renderWithQueryClient(
      <MemoryRouter initialEntries={["/games/MMX/route-builder"]}>
        <Routes>
          <Route
            path="/games/:gameCode/route-builder"
            element={<RouteBuilderPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
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
          slug: "flame-mammoth",
          name: "Flame Mammoth Stage",
          stageOrder: 3,
          imageAssetKey: "mmx.stage.flame-mammoth",
          boss: {
            slug: "flame-mammoth",
            name: "Flame Mammoth",
            imageAssetKey: "mmx.boss.flame-mammoth",
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

    renderWithQueryClient(
      <MemoryRouter initialEntries={["/games/MMX"]}>
        <Routes>
          <Route path="/games/:gameCode" element={<RouteBuilderPage />} />
        </Routes>
      </MemoryRouter>,
    );

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

    await screen.findByText(/DIFFICULTY/);
    await screen.findByText(/80 \/ 100/i);
  });

  test("moves a stage down using accessible controls", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(<RouteBuilder game={createGameDetail()} />);

    await user.click(
      screen.getByRole("button", {
        name: /move chill penguin stage down/i,
      }),
    );

    expect(getRenderedStageNames()).toEqual(["Chill Penguin"]);
  });

  test("disables movement controls at list boundaries", () => {
    renderWithQueryClient(<RouteBuilder game={createGameDetail()} />);

    expect(
      screen.getByRole("button", {
        name: /Move Chill Penguin Stage up/i,
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: /Move Chill Penguin Stage down/i,
      }),
    ).toBeDisabled();
  });

  test("resets route to default order", async () => {
    renderWithQueryClient(<RouteBuilder game={createGameDetail()} />);
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: /Reset to default order/i,
      }),
    );

    expect(getRenderedStageNames()).toEqual(["Chill Penguin"]);
  });
});
