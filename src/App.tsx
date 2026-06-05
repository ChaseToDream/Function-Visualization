import { useState, useCallback, useEffect } from 'react';
import FunctionInput from './components/FunctionInput';
import FunctionList from './components/FunctionList';
import Graph from './components/Graph';
import Controls from './components/Controls';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import { FunctionItem, CoordinateRange } from './types';
import { FUNCTION_COLORS, DEFAULT_COORDINATE_RANGE } from './config';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useHistory } from './hooks/useHistory';

const STORAGE_KEY = 'function-visualization-data';

function App() {
  const [savedFunctions] = useState<FunctionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const {
    state: functions,
    set: setFunctions,
    undo,
    canUndo,
  } = useHistory<FunctionItem[]>(savedFunctions);

  const [coordinateRange, setCoordinateRange] = useState<CoordinateRange>(DEFAULT_COORDINATE_RANGE);
  const [isLoading, setIsLoading] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(functions));
  }, [functions]);

  const addFunction = useCallback(
    (expression: string) => {
      setIsLoading(true);
      const color = FUNCTION_COLORS[functions.length % FUNCTION_COLORS.length];
      setFunctions((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          expression,
          color,
        },
      ]);
      setTimeout(() => setIsLoading(false), 100);
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

  const updateCoordinateRange = useCallback((range: Partial<CoordinateRange>) => {
    setCoordinateRange((prev) => ({ ...prev, ...range }));
  }, []);

  useKeyboardShortcuts({
    onAddFunction: () => {
      const input = document.querySelector<HTMLInputElement>('#function');
      if (input && input.value.trim()) {
        addFunction(input.value.trim());
        input.value = '';
      }
    },
    onClearAll: clearAllFunctions,
    onUndo: undo,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">数学函数可视化</h1>
              <p className="mt-1 text-sm text-gray-500">输入数学函数，实时查看函数图像</p>
            </div>
            <button
              onClick={() => setShowShortcutsHelp(true)}
              className="btn-secondary text-sm"
              title="键盘快捷键"
            >
              ⌨️ 快捷键
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">函数输入</h2>
              <FunctionInput onAddFunction={addFunction} />
              <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-4">函数列表</h2>
              <FunctionList functions={functions} onRemoveFunction={removeFunction} />
              {canUndo && (
                <button
                  onClick={undo}
                  className="w-full mt-2 btn-secondary text-sm"
                >
                  撤销上一步操作
                </button>
              )}
              {functions.length > 0 && (
                <button
                  onClick={clearAllFunctions}
                  className="w-full mt-2 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 text-sm"
                >
                  清空所有函数
                </button>
              )}
              <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-4">坐标设置</h2>
              <Controls coordinateRange={coordinateRange} onUpdateCoordinateRange={updateCoordinateRange} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">函数图像</h2>
                {isLoading && (
                  <div className="flex items-center text-sm text-blue-600">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    更新中...
                  </div>
                )}
              </div>
              <Graph functions={functions} coordinateRange={coordinateRange} />
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white shadow-sm mt-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">© 2026 数学函数可视化</p>
        </div>
      </footer>

      {showShortcutsHelp && (
        <KeyboardShortcutsHelp onClose={() => setShowShortcutsHelp(false)} />
      )}
    </div>
  );
}

export default App;