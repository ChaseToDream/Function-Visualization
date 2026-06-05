import React, { useMemo } from 'react';
import { analyzeFunction, FunctionAnalysis } from '../utils/analysis';

interface FunctionAnalysisPanelProps {
  expression: string;
  xRange?: { min: number; max: number };
}

const FunctionAnalysisPanel: React.FC<FunctionAnalysisPanelProps> = ({ 
  expression, 
  xRange = { min: -10, max: 10 } 
}) => {
  const analysis = useMemo<FunctionAnalysis | null>(() => {
    if (!expression) return null;
    try {
      return analyzeFunction(expression, xRange.min, xRange.max);
    } catch {
      return null;
    }
  }, [expression, xRange]);

  if (!analysis) {
    return (
      <div className="text-center py-4 text-sm text-surface-400">
        输入函数后查看分析结果
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Zeros */}
      <div className="p-3 bg-surface-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-primary-500" />
          <span className="text-xs font-semibold text-surface-600 uppercase tracking-wider">
            零点 (f(x) = 0)
          </span>
        </div>
        {analysis.zeros.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {analysis.zeros.map((x, i) => (
              <span key={i} className="px-2 py-0.5 text-xs font-mono bg-primary-50 text-primary-700 rounded">
                x = {x}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-surface-400">无零点</span>
        )}
      </div>

      {/* Extrema */}
      <div className="p-3 bg-surface-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-success-500" />
          <span className="text-xs font-semibold text-surface-600 uppercase tracking-wider">
            极值点
          </span>
        </div>
        {analysis.extrema.length > 0 ? (
          <div className="space-y-1.5">
            {analysis.extrema.map((e, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  e.type === 'max' 
                    ? 'bg-success-100 text-success-700' 
                    : 'bg-accent-100 text-accent-700'
                }`}>
                  {e.type === 'max' ? '极大' : '极小'}
                </span>
                <span className="font-mono text-surface-600">
                  ({e.x}, {e.y})
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-surface-400">无极值点</span>
        )}
      </div>

      {/* Properties */}
      <div className="p-3 bg-surface-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs font-semibold text-surface-600 uppercase tracking-wider">
            函数性质
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-xs">
            <span className="text-surface-400">定义域: </span>
            <span className="font-mono text-surface-600">
              [{analysis.domain.min}, {analysis.domain.max}]
            </span>
          </div>
          <div className="text-xs">
            <span className="text-surface-400">值域: </span>
            <span className="font-mono text-surface-600">
              [{analysis.range.min}, {analysis.range.max}]
            </span>
          </div>
          <div className="text-xs">
            <span className="text-surface-400">奇偶性: </span>
            <span className="font-mono text-surface-600">
              {analysis.isEven ? '偶函数' : analysis.isOdd ? '奇函数' : '非奇非偶'}
            </span>
          </div>
          <div className="text-xs">
            <span className="text-surface-400">零点数: </span>
            <span className="font-mono text-surface-600">{analysis.zeros.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionAnalysisPanel;
