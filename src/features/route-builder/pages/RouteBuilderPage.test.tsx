import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { RouteBuilderPage } from "./RouteBuilderPage";
import { renderWithQueryClient } from "../../../test/renderWithQueryClient";
import type { RouteAnalysisResponse } from "../types/routeAnalysis.types";
import {
  createGameDetail,
  createRouteAnalysis,
  DEFAULT_STAGE_ORDER,
} from "../../../test/fixtures/routeBuilderFixtures";
import type { fetchGameDetail } from "../../games/api/gameApi";
import type { analyzeRoute } from "../api/routeAnalysisApi";

const { mockFetchGameDetail } = vi.hoisted(() => ({
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

vi.mock("../../games/api/gameApi", () => ({
  fetchGameDetail: mockFetchGameDetail,
}));

vi.mock("../api/routeAnalysisApi", () => ({
  analyzeRoute: mockAnalyzeRoute,
}));

function renderRouteBuilderPage() {
  return renderWithQueryClient(
    <MemoryRouter initialEntries={["/games/MMX/route-builder"]}>
      <Routes>
        <Route
          path="/games/:gameCode/route-builder"
          element={<RouteBuilderPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((resolver) => {
    resolve = resolver;
  });

  return { promise, resolve };
}

describe("RouteBuilderPage", () => {
  beforeEach(() => {
    mockFetchGameDetail.mockReset();
    mockAnalyzeRoute.mockReset();
    mockAnalyzeRoute.mockResolvedValue(createRouteAnalysis());
  });

  test("automatically analyzes the initial stage order", async () => {
    mockFetchGameDetail.mockResolvedValue(createGameDetail());

    renderRouteBuilderPage();

    expect(await screen.findByText(/71 \/ 100/i)).toBeInTheDocument();

    expect(mockAnalyzeRoute).toHaveBeenCalledTimes(1);

    const firstCall = mockAnalyzeRoute.mock.calls.at(0);

    expect(firstCall).toBeDefined();

    if (!firstCall) {
      throw new Error("Expected analyzeRoute to have been called");
    }

    const [request, requestInit] = firstCall;

    expect(request).toEqual({
      gameCode: "MMX",
      stageOrder: DEFAULT_STAGE_ORDER,
      goal: "HUNDRED_PERCENT",
    });

    expect(requestInit?.signal).toBeInstanceOf(AbortSignal);
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

  test("requests a new analysis after changing stage order", async () => {
    const user = userEvent.setup();

    mockFetchGameDetail.mockResolvedValue(createGameDetail());

    renderRouteBuilderPage();

    await waitFor(() => {
      expect(mockAnalyzeRoute).toHaveBeenCalledTimes(1);
    });

    await user.click(
      screen.getByRole("button", {
        name: /move chill penguin stage down/i,
      }),
    );

    await waitFor(() => {
      expect(mockAnalyzeRoute).toHaveBeenCalledTimes(2);
    });

    const firstCall = mockAnalyzeRoute.mock.calls.at(0);

    expect(firstCall).toBeDefined();

    if (!firstCall) {
      throw new Error("Expected analyzeRoute to have been called");
    }

    const [request, requestInit] = firstCall;

    expect(request).toEqual({
      gameCode: "MMX",
      stageOrder: ["chill-penguin", "storm-eagle", "flame-mammoth"],
      goal: "HUNDRED_PERCENT",
    });

    expect(requestInit?.signal).toBeInstanceOf(AbortSignal);
  });

  test("keeps previous analysis visible while updating", async () => {
    const user = userEvent.setup();
    const secondAnalysis = createDeferred<RouteAnalysisResponse>();

    mockFetchGameDetail.mockResolvedValue(createGameDetail());

    mockAnalyzeRoute
      .mockResolvedValueOnce(createRouteAnalysis())
      .mockImplementationOnce(() => secondAnalysis.promise);

    renderRouteBuilderPage();

    expect(await screen.findByText(/71 \/ 100/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /move chill penguin stage down/i,
      }),
    );

    expect(await screen.findByText("Updating analysis...")).toBeInTheDocument();

    expect(screen.getByText(/71 \/ 100/i)).toBeInTheDocument();

    secondAnalysis.resolve(
      createRouteAnalysis({
        difficultyScore: 65,
      }),
    );

    expect(await screen.findByText(/65 \/ 100/i)).toBeInTheDocument();

    expect(
      screen.getByText("Live analysis is up to date."),
    ).toBeInTheDocument();
  });

  test("shows analysis error and recovers after retry", async () => {
    const user = userEvent.setup();

    mockFetchGameDetail.mockResolvedValue(createGameDetail());

    mockAnalyzeRoute
      .mockRejectedValueOnce(new Error("Analyzer unavailable"))
      .mockResolvedValueOnce(createRouteAnalysis());

    renderRouteBuilderPage();

    const alert = await screen.findByRole("alert");

    expect(alert).toHaveTextContent("Unable to analyze route");
    expect(alert).toHaveTextContent("Analyzer unavailable");

    await user.click(
      within(alert).getByRole("button", {
        name: /retry analysis/i,
      }),
    );

    expect(await screen.findByText(/71 \/ 100/i)).toBeInTheDocument();

    expect(mockAnalyzeRoute).toHaveBeenCalledTimes(2);
  });

  test("shows loading state while analysis is pending", async () => {
    const deferred = createDeferred<RouteAnalysisResponse>();

    mockFetchGameDetail.mockResolvedValue(createGameDetail());
    mockAnalyzeRoute.mockReturnValue(deferred.promise);

    renderRouteBuilderPage();

    expect(
      await screen.findByLabelText("Loading route analysis"),
    ).toBeInTheDocument();

    deferred.resolve(createRouteAnalysis());

    expect(await screen.findByText(/71 \/ 100/i)).toBeInTheDocument();
  });
});
