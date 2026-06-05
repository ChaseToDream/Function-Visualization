import React, { useCallback, useState } from 'react';
import FunctionInput from '../components/FunctionInput';
import FunctionList from '../components/FunctionList';
import FunctionEvaluator from '../components/FunctionEvaluator';
import Graph from '../components/Graph';
import Controls from '../components/Controls';
import CoordinatePresets from '../components/CoordinatePresets';
import KeyboardShortcutsHelp from '../components/KeyboardShortcutsHelp';
import { useFunctionStore } from '../stores/functionStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const VisualizationPage: React.FC = () => {
  const {
    functions,
    coordinateRange,
    isLoading,
    showShortcutsHelp,
    addFunction,
    removeFunction,
    clearAllFunctions,
    undo,
    canUndo,
    updateCoordinateRange,
    setIsLoading,
    setShowShortcutsHelp,
  } = useFunctionStore();

  const [showEvaluator, setShowEvaluator] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  const handleAddFunction = useCallback(
    (expression: string) => {
      setIsLoading(true);
      addFunction(expression);
      setTimeout(() => setIsLoading(false), 100);
    },
    [addFunction, setIsLoading]
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Panel - Controls */}
      <div className="lg:col-span-4 xl:col-span-3 space-y-4">
        {/* Function Input Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">添加函数</h2>
            <span className="badge">v2.1</span>
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
          <FunctionList 
            functions={functions} 
            onRemoveFunction={removeFunction}
            onSelectFunction={setSelectedFunction}
            selectedFunctionId={selectedFunction}
          />
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-surface-100">
            {canUndo() && (
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
              <>
                <button
                  onClick={() => setShowEvaluator(!showEvaluator)}
                  className={`flex-1 btn-secondary text-xs py-2 gap-1.5 ${showEvaluator ? 'bg-primary-50 border-primary-200 text-primary-700' : ''}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  求值
                </button>
                <button
                  onClick={clearAllFunctions}
                  className="btn-danger text-xs py-2 px-3 gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  清空
                </button>
              </>
            )}
          </div>
        </div>

        {/* Function Evaluator */}
        {showEvaluator && selectedFunction && (
          <div className="card">
            <h2 className="section-title">函数求值</h2>
            <FunctionEvaluator expression={selectedFunction} />
          </div>
        )}

        {/* Coordinate Settings */}
        <div className="card">
          <h2 className="section-title">坐标设置</h2>
          <Controls coordinateRange={coordinateRange} onUpdateCoordinateRange={updateCoordinateRange} />
          <div className="mt-4 pt-3 border-t border-surface-100">
            <CoordinatePresets currentRange={coordinateRange} onSelect={updateCoordinateRange} />
          </div>
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
              <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
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
                {functions.slice(0, 5).map((func) => (
                  <div 
                    key={func.id} 
                    className={`flex items-center gap-1 cursor-pointer px-1.5 py-0.5 rounded transition-colors ${
                      selectedFunction === func.expression 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'hover:bg-surface-100'
                    }`}
                    onClick={() => setSelectedFunction(func.expression)}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: func.color }}
                    />
                    <span className="max-w-[60px] truncate font-mono">{func.expression}</span>
                  </div>
                ))}
                {functions.length > 5 && (
                  <span className="text-surface-300">+{functions.length - 5}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Shortcuts Help Modal */}
      {showShortcutsHelp && (
        <KeyboardShortcutsHelp onClose={() => setShowShortcutsHelp(false)} />
      )}
    </div>
  );
};

export default VisualizationPage;
