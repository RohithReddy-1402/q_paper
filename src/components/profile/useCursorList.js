import { useCallback, useEffect, useRef, useState } from "react";
import { fetchHistory } from "../../services/profile";

/**
 * Keyset-paginated history list. Fetches the first page when `enabled` first
 * becomes true (so inactive tabs cost nothing), then `loadMore` appends.
 */
export default function useCursorList(kind, enabled = true) {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cursorRef = useRef(null);
  const inFlight = useRef(false);
  const started = useRef(false);

  const load = useCallback(
    async (reset) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setLoading(true);
      setError(null);
      try {
        const page = await fetchHistory(kind, { before: reset ? null : cursorRef.current });
        cursorRef.current = page.nextCursor;
        setItems((prev) => (reset ? page.items : [...prev, ...page.items]));
        setHasMore(page.hasMore);
      } catch (err) {
        setError(err.message || "Could not load history");
      } finally {
        inFlight.current = false;
        setLoading(false);
      }
    },
    [kind]
  );

  useEffect(() => {
    if (enabled && !started.current) {
      started.current = true;
      load(true);
    }
  }, [enabled, load]);

  return {
    items,
    hasMore,
    loading,
    error,
    loadMore: () => load(false),
    reload: () => load(true),
  };
}
