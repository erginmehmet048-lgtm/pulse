import { useCallback, useEffect, useState } from "react";
import { getDemoNews, getNews } from "../services/newsService";

export function useNews({ symbol, limit = 10 } = {}) {
  const [state, setState] = useState({
    news: [],
    isLoading: true,
    error: null,
    isFallback: false,
  });
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    if (!symbol) {
      setState({ news: [], isLoading: false, error: null, isFallback: false });
      return undefined;
    }

    const controller = new AbortController();
    let isActive = true;
    setState((current) => ({ ...current, isLoading: true, error: null }));

    getNews({ symbol, limit, signal: controller.signal })
      .then((news) => {
        if (!isActive) return;
        setState({
          news,
          isLoading: false,
          error: null,
          isFallback: false,
        });
      })
      .catch((error) => {
        if (!isActive || error?.name === "AbortError") return;
        setState({
          news: getDemoNews({ symbol }),
          isLoading: false,
          error,
          isFallback: true,
        });
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [limit, requestVersion, symbol]);

  return { ...state, retry };
}
