import React, { useState, useCallback } from 'react';
import { evaluateFunction } from '../utils/math';

interface FunctionEvaluatorProps {
  expression: string;
}

const FunctionEvaluator: React.FC<FunctionEvaluatorProps> = ({ expression }) => {
  const [xValue, setXValue] = useState<string>('0');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = useCallback(() => {
    const x = parseFloat(xValue);
    if (isNaN(x)) {
      setError('请输入有效的数字');
      setResult(null);
      return;
    }

    try {
      const y = evaluateFunction(expression, x);
      if (isNaN(y) || !isFinite(y)) {
        setError('函数在此点无定义或发散');
        setResult(null);
      } else {
        setResult(y);
        setError(null);
      }
    } catch {
      setError('计算失败');
      setResult(null);
    }
  }, [expression, xValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEvaluate();
    }
  };

  const quickValues = [-2, -1, 0, 1, 2, Math.PI, Math.E];

  return (
    <div className="p-3 bg-surface-50 rounded-lg border border-surface-100">
      <div className="text-xs font-medium text-surface-500 mb-2">函数求值</div>
      <div className="font-mono text-sm text-primary-600 mb-3 bg-primary-50 px-2 py-1 rounded">
        f(x) = {expression}
      </div>
      
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <label className="text-xs text-surface-400 mb-1 block">x =</label>
          <input
            type="number"
            value={xValue}
            onChange={(e) => setXValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-field text-sm py-1.5"
            placeholder="输入 x 值"
            step="any"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleEvaluate}
            className="btn-primary text-xs py-1.5 px-3"
          >
            计算
          </button>
        </div>
      </div>

      {/* Quick value buttons */}
      <div className="flex flex-wrap gap-1 mb-3">
        {quickValues.map((val) => (
          <button
            key={val}
            onClick={() => {
              setXValue(val.toString());
              const y = evaluateFunction(expression, val);
              if (!isNaN(y) && isFinite(y)) {
                setResult(y);
                setError(null);
              }
            }}
            className="px-2 py-0.5 text-[11px] font-mono bg-white border border-surface-200 rounded hover:bg-surface-50 hover:border-primary-200 transition-colors"
          >
            {val === Math.PI ? 'π' : val === Math.E ? 'e' : val.toString()}
          </button>
        ))}
      </div>

      {/* Result */}
      {result !== null && (
        <div className="p-2 bg-success-50 border border-success-200 rounded-lg">
          <div className="text-xs text-success-600 mb-0.5">结果</div>
          <div className="font-mono text-sm text-success-700">
            f({xValue}) = {result.toFixed(6)}
          </div>
        </div>
      )}

      {error && (
        <div className="p-2 bg-accent-50 border border-accent-200 rounded-lg">
          <div className="text-xs text-accent-600">{error}</div>
        </div>
      )}
    </div>
  );
};

export default FunctionEvaluator;
