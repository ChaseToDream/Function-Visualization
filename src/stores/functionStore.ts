import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FunctionItem, CoordinateRange } from '../types';
import { FUNCTION_COLORS, DEFAULT_COORDINATE_RANGE } from '../config';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface FunctionStore {
  functions: FunctionItem[];
  history: HistoryState<FunctionItem[]>;
  coordinateRange: CoordinateRange;
  isLoading: boolean;
  showShortcutsHelp: boolean;
  
  addFunction: (expression: string) => void;
  removeFunction: (id: string) => void;
  clearAllFunctions: () => void;
  
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  updateCoordinateRange: (range: Partial<CoordinateRange>) => void;
  resetCoordinateRange: () => void;
  
  setIsLoading: (loading: boolean) => void;
  setShowShortcutsHelp: (show: boolean) => void;
  
  exportAsJSON: () => string;
  exportAsCSV: () => string;
}

const MAX_HISTORY = 30;

export const useFunctionStore = create<FunctionStore>()(
  persist(
    (set, get) => ({
      functions: [],
      history: { past: [], present: [], future: [] },
      coordinateRange: DEFAULT_COORDINATE_RANGE,
      isLoading: false,
      showShortcutsHelp: false,
      
      addFunction: (expression: string) => {
        const { functions, history } = get();
        const color = FUNCTION_COLORS[functions.length % FUNCTION_COLORS.length];
        const newFunction: FunctionItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          expression,
          color,
        };
        const newFunctions = [...functions, newFunction];
        
        set({
          functions: newFunctions,
          history: {
            past: [...history.past, functions].slice(-MAX_HISTORY),
            present: newFunctions,
            future: [],
          },
        });
      },
      
      removeFunction: (id: string) => {
        const { functions, history } = get();
        const newFunctions = functions.filter((func) => func.id !== id);
        
        set({
          functions: newFunctions,
          history: {
            past: [...history.past, functions].slice(-MAX_HISTORY),
            present: newFunctions,
            future: [],
          },
        });
      },
      
      clearAllFunctions: () => {
        const { functions, history } = get();
        
        set({
          functions: [],
          history: {
            past: [...history.past, functions].slice(-MAX_HISTORY),
            present: [],
            future: [],
          },
        });
      },
      
      undo: () => {
        const { history } = get();
        if (history.past.length === 0) return;
        
        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, -1);
        
        set({
          functions: previous,
          history: {
            past: newPast,
            present: previous,
            future: [history.present, ...history.future],
          },
        });
      },
      
      redo: () => {
        const { history } = get();
        if (history.future.length === 0) return;
        
        const next = history.future[0];
        const newFuture = history.future.slice(1);
        
        set({
          functions: next,
          history: {
            past: [...history.past, history.present],
            present: next,
            future: newFuture,
          },
        });
      },
      
      canUndo: () => get().history.past.length > 0,
      canRedo: () => get().history.future.length > 0,
      
      updateCoordinateRange: (range: Partial<CoordinateRange>) => {
        set((state) => ({
          coordinateRange: { ...state.coordinateRange, ...range },
        }));
      },
      
      resetCoordinateRange: () => {
        set({ coordinateRange: DEFAULT_COORDINATE_RANGE });
      },
      
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),
      setShowShortcutsHelp: (show: boolean) => set({ showShortcutsHelp: show }),
      
      exportAsJSON: () => {
        const { functions, coordinateRange } = get();
        return JSON.stringify({
          version: '2.1',
          timestamp: new Date().toISOString(),
          functions: functions.map(({ expression, color }) => ({ expression, color })),
          coordinateRange,
        }, null, 2);
      },
      
      exportAsCSV: () => {
        const { functions } = get();
        return [
          'Expression,Color',
          ...functions.map((f) => `${f.expression},${f.color}`),
        ].join('\n');
      },
    }),
    {
      name: 'funcviz-data',
      partialize: (state) => ({
        functions: state.functions,
        coordinateRange: state.coordinateRange,
      }),
    }
  )
);

// 细粒度选择器 hooks
export const useFunctions = () => useFunctionStore((s) => s.functions);
export const useCoordinateRange = () => useFunctionStore((s) => s.coordinateRange);
export const useIsLoading = () => useFunctionStore((s) => s.isLoading);
export const useShowShortcutsHelp = () => useFunctionStore((s) => s.showShortcutsHelp);
