import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { analyzeRoute } from "../api/routeAnalysisApi";
import type {
  RouteGoal,
} from "../types/routeAnalysis.types";

const LIVE_ROUTE_GOAL: RouteGoal = "HUNDRED_PERCENT";

export const routeAnalysisQueryKeys = {
  all: ["route-analysis"] as const,

  detail: (
    gameCode: string,
    goal: RouteGoal,
    stageOrder: string[],
  ) =>
    [
      ...routeAnalysisQueryKeys.all,
      gameCode,
      goal,
      [...stageOrder],
    ] as const,
};

export function useRouteAnalysisQuery(
  gameCode: string,
  stageOrder: string[],
) {
  return useQuery({
    queryKey: routeAnalysisQueryKeys.detail(
      gameCode,
      LIVE_ROUTE_GOAL,
      stageOrder,
    ),

    queryFn: ({ signal }) => {
      return analyzeRoute(
        {
          gameCode,
          stageOrder,
          goal: LIVE_ROUTE_GOAL,
        },
        {
          signal,
        },
      );
    },

    enabled:
      gameCode.length > 0 &&
      stageOrder.length > 0,

    placeholderData: keepPreviousData,

    staleTime: Infinity,
    gcTime: 15 * 60_000,
    retry: 1,
  });
}