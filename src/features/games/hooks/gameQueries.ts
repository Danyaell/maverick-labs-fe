import { useQuery } from "@tanstack/react-query";
import { fetchGameDetail, fetchGames } from "../api/gameApi";

export const gameQueryKeys = {
  all: ["games"] as const,

  list: () => [...gameQueryKeys.all, "list"] as const,

  detail: (gameCode: string) =>
    [...gameQueryKeys.all, "detail", gameCode] as const,
};

export function useGamesQuery() {
  return useQuery({
    queryKey: gameQueryKeys.list(),

    queryFn: ({ signal }) => {
      return fetchGames({ signal });
    },

    staleTime: 5 * 60_000,
  });
}

export function useGameDetailQuery(gameCode?: string) {
  const normalizedGameCode = gameCode ?? "";

  return useQuery({
    queryKey: gameQueryKeys.detail(normalizedGameCode),

    queryFn: ({ signal }) => {
      return fetchGameDetail(normalizedGameCode, {
        signal,
      });
    },

    enabled: normalizedGameCode.length > 0,
    staleTime: 5 * 60_000,
  });
}