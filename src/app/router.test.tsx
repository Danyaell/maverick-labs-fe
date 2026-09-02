import { screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { routeConfig } from "./router";
import { renderWithQueryClient } from "../test/renderWithQueryClient";
import {
  createGameDetail,
  createRouteAnalysis,
} from "../test/fixtures/routeBuilderFixtures";
import type {
  fetchGameDetail,
  fetchGames,
} from "../features/games/api/gameApi";
import type { analyzeRoute } from "../features/route-builder/api/routeAnalysisApi";

const { mockFetchGames, mockFetchGameDetail } = vi.hoisted(() => ({
  mockFetchGames: vi.fn<
    Parameters<typeof fetchGames>,
    ReturnType<typeof fetchGames>
  >(),
  mockFetchGameDetail: vi.fn<
    Parameters<typeof fetchGameDetail>,
    ReturnType<typeof fetchGameDetail>
  >(),
}));

const { mockAnalyzeRoute } = vi.hoisted(() => ({
  mockAnalyzeRoute: vi.fn<
    Parameters<typeof analyzeRoute>,
    ReturnType<typeof analyzeRoute>
  >(),
}));

vi.mock("../features/games/api/gameApi", () => ({
  fetchGames: mockFetchGames,
  fetchGameDetail: mockFetchGameDetail,
}));

vi.mock("../features/route-builder/api/routeAnalysisApi", () => ({
  analyzeRoute: mockAnalyzeRoute,
}));

function renderAt(path: string) {
  const router = createMemoryRouter(routeConfig, { initialEntries: [path] });
  return renderWithQueryClient(<RouterProvider router={router} />);
}

describe("router", () => {
  beforeEach(() => {
    mockFetchGames.mockReset();
    mockFetchGameDetail.mockReset();
    mockAnalyzeRoute.mockReset();
    mockFetchGames.mockResolvedValue([
      { code: "MMX", title: "Mega Man X", releaseOrder: 1 },
    ]);
    mockFetchGameDetail.mockResolvedValue(createGameDetail());
    mockAnalyzeRoute.mockResolvedValue(createRouteAnalysis());
  });

  test("renders the landing page at the root path", async () => {
    renderAt("/");

    expect(
      await screen.findByRole("heading", {
        name: "Plan smarter Mega Man X routes",
      }),
    ).toBeInTheDocument();
  });

  test("renders the game catalog at /games", async () => {
    renderAt("/games");

    expect(
      await screen.findByRole("heading", { name: /choose a mega man x game/i }),
    ).toBeInTheDocument();
  });

  test("renders the game detail page at /games/:gameCode", async () => {
    renderAt("/games/MMX");

    expect(await screen.findByAltText("Mega Man X")).toBeInTheDocument();
  });

  test("renders the route builder page at /games/:gameCode/route-builder", async () => {
    renderAt("/games/MMX/route-builder");

    expect(
      await screen.findByRole("heading", { name: /route builder/i }),
    ).toBeInTheDocument();
  });

  test("renders the 404 page for unknown paths", async () => {
    renderAt("/does-not-exist");

    expect(
      await screen.findByRole("heading", { name: "404" }),
    ).toBeInTheDocument();
  });

  test("keeps the landing useful when the backend is unavailable", async () => {
    mockFetchGames.mockRejectedValue(new Error("Backend unavailable"));
    mockFetchGameDetail.mockRejectedValue(new Error("Backend unavailable"));
    mockAnalyzeRoute.mockRejectedValue(new Error("Backend unavailable"));

    renderAt("/");

    expect(
      await screen.findByRole("heading", {
        name: "Plan smarter Mega Man X routes",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /see how one stage-order change/i,
      }),
    ).toBeInTheDocument();

    expect(mockFetchGames).not.toHaveBeenCalled();
    expect(mockFetchGameDetail).not.toHaveBeenCalled();
    expect(mockAnalyzeRoute).not.toHaveBeenCalled();
  });
});
