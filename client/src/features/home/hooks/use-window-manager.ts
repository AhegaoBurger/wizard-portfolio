import { useState, useCallback } from "react";

export function useWindowManager(initialOrder: string[]) {
  const [windowOrder, setWindowOrder] = useState<string[]>(initialOrder);
  const [minimizedWindows, setMinimizedWindows] = useState<Set<string>>(
    () => new Set()
  );

  const bringToFront = useCallback((id: string) => {
    setWindowOrder((prev) => {
      const filtered = prev.filter((w) => w !== id);
      return [...filtered, id];
    });
  }, []);

  const minimize = useCallback((id: string) => {
    setMinimizedWindows((prev) => new Set(prev).add(id));
  }, []);

  const restore = useCallback((id: string) => {
    setMinimizedWindows((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const getZIndex = useCallback(
    (id: string) => {
      const index = windowOrder.indexOf(id);
      return index === -1 ? 10 : 10 + index;
    },
    [windowOrder]
  );

  const isMinimized = useCallback(
    (id: string) => minimizedWindows.has(id),
    [minimizedWindows]
  );

  return { bringToFront, minimize, restore, getZIndex, isMinimized, minimizedWindows };
}
