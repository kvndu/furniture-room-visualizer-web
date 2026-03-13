import { useCallback, useMemo, useState } from "react";

export function useUndoRedo(initialPresent) {
  const [history, setHistory] = useState({
    past: [],
    present: initialPresent,
    future: []
  });

  const set = useCallback((nextValue) => {
    setHistory((current) => {
      const resolvedValue = typeof nextValue === "function"
        ? nextValue(current.present)
        : nextValue;

      if (JSON.stringify(resolvedValue) === JSON.stringify(current.present)) {
        return current;
      }

      return {
        past: [...current.past, current.present],
        present: resolvedValue,
        future: []
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((current) => {
      if (current.past.length === 0) return current;
      const previous = current.past[current.past.length - 1];
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      if (current.future.length === 0) return current;
      const next = current.future[0];
      return {
        past: [...current.past, current.present],
        present: next,
        future: current.future.slice(1)
      };
    });
  }, []);

  const reset = useCallback((value) => {
    setHistory({ past: [], present: value, future: [] });
  }, []);

  return useMemo(() => ({
    state: history.present,
    set,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0
  }), [history, redo, reset, set, undo]);
}
