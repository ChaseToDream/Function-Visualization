import { useCallback } from 'react';
import { FunctionItem } from '../types';
import { FUNCTION_COLORS } from '../config';
import { useHistory } from './useHistory';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'function-visualization-data';

export function useFunctions() {
  const [savedFunctions] = useLocalStorage<FunctionItem[]>(STORAGE_KEY, []);

  const {
    state: functions,
    set: setFunctions,
    undo,
    canUndo,
    redo,
    canRedo,
  } = useHistory<FunctionItem[]>(savedFunctions);

  const addFunction = useCallback(
    (expression: string) => {
      const color = FUNCTION_COLORS[functions.length % FUNCTION_COLORS.length];
      setFunctions((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          expression,
          color,
        },
      ]);
    },
    [functions.length, setFunctions]
  );

  const removeFunction = useCallback(
    (id: string) => {
      setFunctions((prev) => prev.filter((func) => func.id !== id));
    },
    [setFunctions]
  );

  const clearAllFunctions = useCallback(() => {
    setFunctions([]);
  }, [setFunctions]);

  return {
    functions,
    addFunction,
    removeFunction,
    clearAllFunctions,
    undo,
    canUndo,
    redo,
    canRedo,
  };
}
