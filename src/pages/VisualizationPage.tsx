import React, { useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FunctionInput from '../components/FunctionInput';
import FunctionList from '../components/FunctionList';
import FunctionEvaluator from '../components/FunctionEvaluator';
import FunctionAnalysisPanel from '../components/FunctionAnalysisPanel';
import AnimationPlayer from '../components/AnimationPlayer';
import Graph from '../components/Graph';
import Controls from '../components/Controls';
import CoordinatePresets from '../components/CoordinatePresets';
import KeyboardShortcutsHelp from '../components/KeyboardShortcutsHelp';
import { useFunctionStore, useFunctions, useCoordinateRange, useIsLoading, useShowShortcutsHelp } from '../stores/functionStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const VisualizationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const functions = useFunctions();
  const coordinateRange = useCoordinateRange();
  const isLoading = useIsLoading();
  const showShortcutsHelp = useShowShortcutsHelp();
  const {
    addFunction,
    removeFunction,
    clearAllFunctions,
    undo,
    canUndo,
    updateCoordinateRange,
    setIsLoading,
    setShowShortcutsHelp,
  } = useFunctionStore();

  // 解析 URL 参数
  useEffect(() => {
    const urlFunctions = searchParams.getAll('f');
    const xmin = searchParams.get('xmin');
    const xmax = searchParams.get('xmax');
    const ymin = searchParams.get('ymin');
    const ymax = searchParams.get('ymax');
    
    if (urlFunctions.length > 0) {
      urlFunctions.forEach((expr) => addFunction(expr));
    }
    
    if (xmin && xmax && ymin && ymax) {
      updateCoordinateRange({
        xMin: parseFloat(xmin),
        xMax: parseFloat(xmax),
        yMin: parseFloat(ymin),
        yMax: parseFloat(ymax),
      });
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const [showEvaluator, setShowEvaluator] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [animationParam, setAnimationParam] = useState(0);

  const handleAddFunction = useCallback(
    (expression: string) => {
      setIsLoading(true);
      addFunction(expression);
      setTimeout(() => setIsLoading(false), 100);
    },
    [addFunction, setIsLoading]
  );

  const handleAnimationParamChange = useCallback((value: number) => {
    setAnimationParam(value);
  }, []);

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

  const getAnimatedExpression = () => {
    if (!selectedFunction) return '';
    // Replace 'a' parameter with current animation value
    return selectedFunction.replace(/\ba\b/g, `(${animationParam.toFixed(2)})`);
  };

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
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-surface-100">
            {canUndo() && (
              <button
                onClick={undo}
                className="btn-secondary text-xs py-2 gap-1.5"
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
                  className={`flex-1 btn-secondary text-xs py-2 gap-1 ${showEvaluator ? 'bg-primary-50 border-primary-200 text-primary-700' : ''}`}
                  title="函数求值"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  求值
                </button>
                <button
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className={`flex-1 btn-secondary text-xs py-2 gap-1 ${showAnalysis ? 'bg-primary-50 border-primary-200 text-primary-700' : ''}`}
                  title="函数分析"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  分析
                </button>
                <button
                  onClick={() => setShowAnimation(!showAnimation)}
                  className={`btn-secondary text-xs py-2 px-3 gap-1 ${showAnimation ? 'bg-primary-50 border-primary-200 text-primary-700' : ''}`}
                  title="动画演示"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={clearAllFunctions}
                  className="btn-danger text-xs py-2 px-3 gap-1"
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
            <FunctionEvaluator expression={getAnimatedExpression() || selectedFunction} />
          </div>
        )}

        {/* Function Analysis */}
        {showAnalysis && selectedFunction && (
          <div className="card">
            <h2 className="section-title">函数分析</h2>
            <FunctionAnalysisPanel 
              expression={getAnimatedExpression() || selectedFunction}
              xRange={{ min: coordinateRange.xMin, max: coordinateRange.xMax }}
            />
          </div>
        )}

        {/* Animation Player */}
        {showAnimation && selectedFunction && (
          <div className="card">
            <h2 className="section-title">动画演示</h2>
            <AnimationPlayer
              baseExpression={selectedFunction}
              parameter="a"
              onParameterChange={handleAnimationParamChange}
            />
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
            <Graph 
              functions={
                showAnimation && selectedFunction
                  ? functions.map((f) => ({
                      ...f,
                      expression: f.expression === selectedFunction 
                        ? getAnimatedExpression() 
                        : f.expression,
                    }))
                  : functions
              } 
              coordinateRange={coordinateRange} 
            />
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
