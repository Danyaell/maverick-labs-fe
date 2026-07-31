import { useCallback } from "react";
import { useApiQuery } from "../../../shared/hooks/useApiQuery";
import { fetchGameDetail, fetchGames } from "../api/gameApi";

const loadGames = (signal: AbortSignal) => {
  return fetchGames({ signal });
};

export function useGamesQuery() {
  return useApiQuery({
    queryKey: "games",
    queryFn: loadGames,
    fallbackErrorMessage: "Unable to load games.",
  });
}

export function useGameDetailQuery(gameCode?: string) {
  const normalizedGameCode = gameCode ?? "";

  const loadGameDetail = useCallback(
    (signal: AbortSignal) => {
      return fetchGameDetail(normalizedGameCode, { signal });
    },
    [normalizedGameCode],
  );

  return useApiQuery({
    queryKey: `game-detail:${normalizedGameCode}`,
    queryFn: loadGameDetail,
    enabled: normalizedGameCode.length > 0,
    fallbackErrorMessage: "Unable to load game data.",
  });
}