import { useState, useCallback, useRef } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>(initialState: T, maxHistory: number = 50) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const isUndoRedo = useRef(false);

  const set = useCallback(
    (newState: T | ((prev: T) => T)) => {
      setState((currentState) => {
        const resolvedState =
          typeof newState === 'function'
            ? (newState as (prev: T) => T)(currentState.present)
            : newState;

        if (isUndoRedo.current) {
          isUndoRedo.current = false;
          return { ...currentState, present: resolvedState };
        }

        const newPast = [...currentState.past, currentState.present].slice(-maxHistory);

        return {
          past: newPast,
          present: resolvedState,
          future: [],
        };
      });
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    setState((currentState) => {
      if (currentState.past.length === 0) return currentState;

      const previous = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, -1);

      isUndoRedo.current = true;

      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((currentState) => {
      if (currentState.future.length === 0) return currentState;

      const next = currentState.future[0];
      const newFuture = currentState.future.slice(1);

      isUndoRedo.current = true;

      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const clear = useCallback(() => {
    setState((currentState) => ({
      past: [...currentState.past, currentState.present],
      present: initialState,
      future: [],
    }));
  }, [initialState]);

  return {
    state: state.present,
    set,
    undo,
    redo,
    clear,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    historyLength: state.past.length,
  };
}