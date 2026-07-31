import { useEffect, useState } from "react";

interface QueryState<T> {
  queryKey: string | null;
  data: T | null;
  error: string | null;
}

interface UseApiQueryOptions<T> {
  queryKey: string;
  queryFn: (signal: AbortSignal) => Promise<T>;
  enabled?: boolean;
  fallbackErrorMessage?: string;
}

export interface QueryResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useApiQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
  fallbackErrorMessage = "Unable to load data.",
}: UseApiQueryOptions<T>): QueryResult<T> {
  const [state, setState] = useState<QueryState<T>>({
    queryKey: null,
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();

    void queryFn(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          queryKey,
          data,
          error: null,
        });
      })
      .catch((queryError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          queryKey,
          data: null,
          error:
            queryError instanceof Error
              ? queryError.message
              : fallbackErrorMessage,
        });
      });

    return () => controller.abort();
  }, [enabled, fallbackErrorMessage, queryFn, queryKey]);

  if (!enabled) {
    return {
      data: null,
      error: null,
      isLoading: false,
    };
  }

  const isCurrentQuery = state.queryKey === queryKey;

  return {
    data: isCurrentQuery ? state.data : null,
    error: isCurrentQuery ? state.error : null,
    isLoading: !isCurrentQuery,
  };
}