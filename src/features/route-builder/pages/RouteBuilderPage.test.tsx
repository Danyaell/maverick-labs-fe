import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { RouteBuilderPage } from "./RouteBuilderPage";
import type { GameDetail } from "../../games/types/game.types";
import { RouteBuilder } from "../components/RouteBuilder";
import { renderWithQueryClient } from "../../../test/renderWithQueryClient";

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

    renderWithQueryClient(
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

    expect(await screen.findByText(/DIFFICULTY/)).toBeInTheDocument();
    expect(await screen.findByText(/71 \/ 100/i)).toBeInTheDocument();
    expect(screen.getByText(/BACKTRACKING/i)).toBeInTheDocument();
    expect(screen.getByText(/64 \/ 100/i)).toBeInTheDocument();
    expect(screen.getByText(/ESTIMATED TIME/i)).toBeInTheDocument();
    expect(screen.getByText(/89 MIN/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/This route order is stable for first attempts/i),
    ).toHaveLength(2);
    expect(screen.getByText(/Missing Requirement/)).toBeInTheDocument();
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

    const user = userEvent.setup();

    renderWithQueryClient(
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

    await screen.findByText(/DIFFICULTY/);
    await screen.findByText(/80 \/ 100/i);

    mockAnalyzeRoute.mockRejectedValueOnce(new Error("Analyzer unavailable"));
    await user.click(screen.getByRole("button", { name: /analyze route/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Analyzer unavailable",
    );
  });

  test("moves a stage down using accessible controls", async () => {
    const user = userEvent.setup();

    render(<RouteBuilder game={createGameDetail()} />);

    await user.click(
      screen.getByRole("button", {
        name: /move chill penguin stage down/i,
      }),
    );

    expect(getRenderedStageNames()).toEqual(["Chill Penguin"]);
  });

  test("disables movement controls at list boundaries", () => {
    render(<RouteBuilder game={createGameDetail()} />);

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
    render(<RouteBuilder game={createGameDetail()} />);
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: /Reset to default order/i,
      }),
    );

    expect(getRenderedStageNames()).toEqual([
      "Chill Penguin",
    ]);
  });
});
