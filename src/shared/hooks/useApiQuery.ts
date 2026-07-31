import { useEffect, useState } from "react";

interface QueryState<T> {
  queryKey: string;
  data: T | null;
  error: string | null;
  isLoading: boolean;
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
  const [state, setState] = useState<QueryState<T>>(() => ({
    queryKey,
    data: null,
    error: null,
    isLoading: enabled,
  }));

  useEffect(() => {
    if (!enabled) {
      setState({
        queryKey,
        data: null,
        error: null,
        isLoading: false,
      });

      return;
    }

    const controller = new AbortController();

    setState({
      queryKey,
      data: null,
      error: null,
      isLoading: true,
    });

    void queryFn(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          queryKey,
          data,
          error: null,
          isLoading: false,
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
          isLoading: false,
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

  if (state.queryKey !== queryKey) {
    return {
      data: null,
      error: null,
      isLoading: true,
    };
  }

  return {
    data: state.data,
    error: state.error,
    isLoading: state.isLoading,
  };
}