import { useState, useCallback } from 'react';
import FunctionInput from './components/FunctionInput';
import FunctionList from './components/FunctionList';
import Graph from './components/Graph';
import Controls from './components/Controls';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFunctions } from './hooks/useFunctions';
import { useCoordinateRange } from './hooks/useCoordinateRange';

function App() {
  const {
    functions,
    addFunction,
    removeFunction,
    clearAllFunctions,
    undo,
    canUndo,
  } = useFunctions();

  const {
    coordinateRange,
    updateCoordinateRange,
  } = useCoordinateRange();

  const [isLoading, setIsLoading] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const handleAddFunction = useCallback(
    (expression: string) => {
      setIsLoading(true);
      addFunction(expression);
      setTimeout(() => setIsLoading(false), 100);
    },
    [addFunction]
  );

  useKeyboardShortcuts({
    onAddFunction: () => {
      const input = document.querySelector<HTMLInputElement>('#function');
      if (input && input.value.trim()) {
        handleAddFunction(input.value.trim());
        input.value = '';
      }
    },
    onClearAll: clearAllFunctions,
    onUndo: undo,
  });

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-surface-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base">F</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-surface-900 leading-none">
                  Func<span className="text-primary-600">Viz</span>
                </h1>
                <p className="text-[10px] text-surface-400 hidden sm:block mt-0.5">函数可视化工具</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-success-50 rounded-full">
                <span className="status-active" />
                <span className="text-[11px] font-medium text-success-700">就绪</span>
              </div>
              <button
                onClick={() => setShowShortcutsHelp(true)}
                className="btn-ghost text-xs gap-1.5 py-1.5 px-3"
                title="键盘快捷键"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
                <span className="hidden sm:inline">快捷键</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            {/* Function Input Section */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title mb-0">添加函数</h2>
                <span className="badge">v2.0</span>
              </div>
              <FunctionInput onAddFunction={handleAddFunction} />
            </div>

            {/* Function List Section */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="section-title mb-0">函数列表</h2>
                {functions.length > 0 && (
                  <span className="text-[11px] text-surface-400 font-medium">
                    {functions.length} 个
                  </span>
                )}
              </div>
              <FunctionList functions={functions} onRemoveFunction={removeFunction} />
              
              {/* Action Buttons */}
              {(canUndo || functions.length > 0) && (
                <div className="flex gap-2 mt-4 pt-3 border-t border-surface-100">
                  {canUndo && (
                    <button
                      onClick={undo}
                      className="flex-1 btn-secondary text-xs py-2 gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      撤销
                    </button>
                  )}
                  {functions.length > 0 && (
                    <button
                      onClick={clearAllFunctions}
                      className="flex-1 btn-danger text-xs py-2 gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      清空
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Coordinate Settings */}
            <div className="card">
              <h2 className="section-title">坐标设置</h2>
              <Controls coordinateRange={coordinateRange} onUpdateCoordinateRange={updateCoordinateRange} />
            </div>
          </div>

          {/* Right Panel - Graph */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="card h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <h2 className="section-title mb-0">函数图像</h2>
                  {isLoading && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary-50 rounded-full">
                      <svg className="animate-spin h-3 w-3 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-[11px] font-medium text-primary-600">渲染中</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-surface-400">
                  <span>实时更新</span>
                  <span className="status-active" />
                </div>
              </div>
              
              {/* Graph Container */}
              <div className="relative bg-surface-50/50 border border-surface-100 rounded-xl overflow-hidden">
                <Graph functions={functions} coordinateRange={coordinateRange} />
              </div>
              
              {/* Graph Info */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-surface-400">
                <div className="flex items-center gap-3">
                  <span>X: [{coordinateRange.xMin}, {coordinateRange.xMax}]</span>
                  <span className="text-surface-200">|</span>
                  <span>Y: [{coordinateRange.yMin}, {coordinateRange.yMax}]</span>
                </div>
                {functions.length > 0 && (
                  <div className="flex items-center gap-2">
                    {functions.slice(0, 3).map((func) => (
                      <div key={func.id} className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: func.color }}
                        />
                        <span className="max-w-[60px] truncate font-mono">{func.expression}</span>
                      </div>
                    ))}
                    {functions.length > 3 && (
                      <span className="text-surface-300">+{functions.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-100 bg-white mt-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-1 text-[11px] text-surface-400">
            <p>© 2026 FuncViz</p>
            <div className="flex items-center gap-3">
              <span>React + TypeScript</span>
              <span className="text-surface-200">•</span>
              <span>v2.0.0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Shortcuts Help Modal */}
      {showShortcutsHelp && (
        <KeyboardShortcutsHelp onClose={() => setShowShortcutsHelp(false)} />
      )}
    </div>
  );
}

export default App;
