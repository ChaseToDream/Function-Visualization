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
    <div className="min-h-screen bg-dark-900 grid-bg">
      {/* Header */}
      <header className="relative border-b border-dark-500/50 bg-dark-900/90 backdrop-blur-sm">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                  <span className="font-display text-lg font-bold text-dark-900">F</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-neon-blue to-neon-purple rounded-sm opacity-30 blur-sm -z-10" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wider">
                  <span className="gradient-text">FUNC</span>
                  <span className="text-gray-100">VIZ</span>
                </h1>
                <p className="text-xs font-mono text-gray-500 tracking-[0.3em] uppercase">
                  Mathematical Function Visualizer
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-dark-800 border border-dark-500/50 rounded-sm">
                <span className="status-active" />
                <span className="text-xs font-mono text-neon-green">ONLINE</span>
              </div>
              <button
                onClick={() => setShowShortcutsHelp(true)}
                className="btn-secondary text-xs"
                title="键盘快捷键"
              >
                <span className="mr-1">⌨</span>
                <span className="hidden sm:inline">SHORTCUTS</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            {/* Function Input Section */}
            <div className="card-glow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title mb-0 pb-0 border-0">INPUT</h2>
                <span className="tag">v2.0</span>
              </div>
              <FunctionInput onAddFunction={handleAddFunction} />
            </div>

            {/* Function List Section */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title mb-0 pb-0 border-0">FUNCTIONS</h2>
                <span className="text-xs font-mono text-gray-500">
                  {functions.length} active
                </span>
              </div>
              <FunctionList functions={functions} onRemoveFunction={removeFunction} />
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                {canUndo && (
                  <button
                    onClick={undo}
                    className="flex-1 btn-secondary text-xs"
                  >
                    ↩ UNDO
                  </button>
                )}
                {functions.length > 0 && (
                  <button
                    onClick={clearAllFunctions}
                    className="flex-1 btn-danger text-xs"
                  >
                    ✕ CLEAR ALL
                  </button>
                )}
              </div>
            </div>

            {/* Coordinate Settings */}
            <div className="card">
              <h2 className="section-title">COORDINATES</h2>
              <Controls coordinateRange={coordinateRange} onUpdateCoordinateRange={updateCoordinateRange} />
            </div>
          </div>

          {/* Right Panel - Graph */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="card-glow h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="section-title mb-0 pb-0 border-0">VISUALIZATION</h2>
                  {isLoading && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-sm">
                      <svg className="animate-spin h-3 w-3 text-neon-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-xs font-mono text-neon-blue">RENDERING</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="status-active" />
                  <span className="text-xs font-mono text-gray-500">LIVE</span>
                </div>
              </div>
              
              {/* Graph Container */}
              <div className="relative bg-dark-900 border border-dark-500/30 rounded-sm overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-50" />
                <Graph functions={functions} coordinateRange={coordinateRange} />
              </div>
              
              {/* Graph Info */}
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-gray-500">
                <span>RANGE: [{coordinateRange.xMin}, {coordinateRange.xMax}] × [{coordinateRange.yMin}, {coordinateRange.yMax}]</span>
                <span>FPS: 60</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-dark-500/50 bg-dark-900/90 backdrop-blur-sm mt-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs font-mono text-gray-500">
              © 2026 FUNCVIZ — Mathematical Function Visualizer
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-600">v2.0.0</span>
              <span className="text-xs font-mono text-gray-600">|</span>
              <span className="text-xs font-mono text-gray-600">React + TypeScript</span>
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
