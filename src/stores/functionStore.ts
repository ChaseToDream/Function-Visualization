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
  // Functions state
  functions: FunctionItem[];
  history: HistoryState<FunctionItem[]>;
  
  // Coordinate state
  coordinateRange: CoordinateRange;
  
  // UI state
  isLoading: boolean;
  showShortcutsHelp: boolean;
  
  // Actions - Functions
  addFunction: (expression: string) => void;
  removeFunction: (id: string) => void;
  clearAllFunctions: () => void;
  
  // Actions - History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Actions - Coordinate
  updateCoordinateRange: (range: Partial<CoordinateRange>) => void;
  resetCoordinateRange: () => void;
  
  // Actions - UI
  setIsLoading: (loading: boolean) => void;
  setShowShortcutsHelp: (show: boolean) => void;
  
  // Actions - Export
  exportAsJSON: () => string;
  exportAsCSV: () => string;
}

const MAX_HISTORY = 50;

export const useFunctionStore = create<FunctionStore>()(
  persist(
    (set, get) => ({
      // Initial state
      functions: [],
      history: {
        past: [],
        present: [],
        future: [],
      },
      coordinateRange: DEFAULT_COORDINATE_RANGE,
      isLoading: false,
      showShortcutsHelp: false,
      
      // Function actions
      addFunction: (expression: string) => {
        const { functions, history } = get();
        const color = FUNCTION_COLORS[functions.length % FUNCTION_COLORS.length];
        const newFunction: FunctionItem = {
          id: Date.now().toString(),
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
      
      // History actions
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
      
      canUndo: () => {
        return get().history.past.length > 0;
      },
      
      canRedo: () => {
        return get().history.future.length > 0;
      },
      
      // Coordinate actions
      updateCoordinateRange: (range: Partial<CoordinateRange>) => {
        set((state) => ({
          coordinateRange: { ...state.coordinateRange, ...range },
        }));
      },
      
      resetCoordinateRange: () => {
        set({ coordinateRange: DEFAULT_COORDINATE_RANGE });
      },
      
      // UI actions
      setIsLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      setShowShortcutsHelp: (show: boolean) => {
        set({ showShortcutsHelp: show });
      },
      
      // Export actions
      exportAsJSON: () => {
        const { functions, coordinateRange } = get();
        const data = {
          version: '2.0',
          timestamp: new Date().toISOString(),
          functions: functions.map((f) => ({
            expression: f.expression,
            color: f.color,
          })),
          coordinateRange,
        };
        return JSON.stringify(data, null, 2);
      },
      
      exportAsCSV: () => {
        const { functions } = get();
        const headers = ['Expression', 'Color'];
        const rows = functions.map((f) => [f.expression, f.color]);
        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        return csv;
      },
    }),
    {
      name: 'function-visualization-storage',
      partialize: (state) => ({
        functions: state.functions,
        coordinateRange: state.coordinateRange,
      }),
    }
  )
);
