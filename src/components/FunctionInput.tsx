import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useValidation } from '../hooks/useValidation';
import { MATH_SYMBOLS, FUNCTION_PRESETS } from '../config';

interface FunctionInputProps {
  onAddFunction: (expression: string) => void;
}

const FunctionInput: React.FC<FunctionInputProps> = ({ onAddFunction }) => {
  const [expression, setExpression] = useState('');
  const [showSymbols, setShowSymbols] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isValid, errorMessage } = useValidation(expression);

  const categories = useMemo(
    () => Array.from(new Set(MATH_SYMBOLS.map((symbol) => symbol.category))),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (expression.trim() && isValid) {
        onAddFunction(expression.trim());
        setExpression('');
      }
    },
    [expression, isValid, onAddFunction]
  );

  const insertSymbol = useCallback(
    (symbol: string) => {
      const input = inputRef.current;
      if (input) {
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const newValue = expression.substring(0, start) + symbol + expression.substring(end);
        setExpression(newValue);

        setTimeout(() => {
          input.focus();
          const newPosition = start + symbol.length;
          input.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
    },
    [expression]
  );

  const selectPreset = useCallback(
    (preset: string) => {
      setExpression(preset);
      setShowPresets(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    []
  );

  const formatExpression = useCallback(() => {
    const formatted = expression
      .replace(/\s+/g, ' ')
      .replace(/\s*([+\-*/^()])\s*/g, ' $1 ')
      .trim();
    setExpression(formatted);
  }, [expression]);

  const toggleSymbols = useCallback(() => {
    setShowSymbols((prev) => !prev);
    setShowPresets(false);
  }, []);

  const togglePresets = useCallback(() => {
    setShowPresets((prev) => !prev);
    setShowSymbols(false);
  }, []);

  const checkBracketBalance = useMemo(() => {
    const openBrackets = (expression.match(/\(/g) || []).length;
    const closeBrackets = (expression.match(/\)/g) || []).length;
    return openBrackets === closeBrackets;
  }, [expression]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSymbols && !target.closest('.relative') && !target.closest('.z-10')) {
        setShowSymbols(false);
      }
      if (showPresets && !target.closest('.relative') && !target.closest('.z-10')) {
        setShowPresets(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSymbols, showPresets]);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="function" className="block text-sm font-medium text-surface-700 mb-1.5">
          函数表达式
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            id="function"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="例如: sin(x) 或 x^2"
            className={`input-field pr-24 ${
              isValid === false ? 'border-accent-300 focus:border-accent-400 focus:ring-accent-500/10' : 
              isValid === true ? 'border-success-300 focus:border-success-400 focus:ring-success-500/10' : ''
            }`}
            aria-label="输入函数表达式"
            aria-invalid={isValid === false}
            aria-describedby={isValid === false ? 'validation-error' : undefined}
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              type="button"
              onClick={togglePresets}
              className="px-2 py-1.5 text-[11px] font-medium bg-surface-50 text-surface-500 hover:bg-surface-100 hover:text-surface-700 rounded-lg transition-colors duration-150"
              aria-label="选择预设函数"
            >
              预设
            </button>
            <button
              type="button"
              onClick={toggleSymbols}
              className="px-2 py-1.5 text-[11px] font-medium bg-surface-50 text-surface-500 hover:bg-surface-100 hover:text-surface-700 rounded-lg transition-colors duration-150"
              aria-label="插入数学符号"
            >
              符号
            </button>
          </div>
        </div>
        
        {/* Validation Status */}
        <div className="mt-1.5 min-h-[18px]">
          {isValid === true && (
            <p className="text-[11px] text-success-600 flex items-center gap-1 animate-fade-in">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              表达式有效
            </p>
          )}
          {isValid === false && (
            <p id="validation-error" className="text-[11px] text-accent-600 flex items-center gap-1 animate-fade-in" role="alert">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {errorMessage || '表达式无效'}
            </p>
          )}
          {!checkBracketBalance && expression.length > 0 && (
            <p className="text-[11px] text-amber-600 flex items-center gap-1 animate-fade-in" role="alert">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              括号不匹配
            </p>
          )}
        </div>
      </div>

      {/* Symbols Panel */}
      {showSymbols && (
        <div className="absolute z-10 left-0 right-0 bg-white border border-surface-200 rounded-xl shadow-lg p-4 max-h-72 overflow-y-auto animate-slide-up">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-surface-800">数学符号</h3>
            <button
              type="button"
              onClick={toggleSymbols}
              className="text-surface-400 hover:text-surface-600 transition-colors duration-150 p-0.5"
              aria-label="关闭符号面板"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {categories.map((category) => (
            <div key={category} className="mb-3 last:mb-0">
              <h4 className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5">{category}</h4>
              <div className="flex flex-wrap gap-1">
                {MATH_SYMBOLS.filter((symbol) => symbol.category === category).map(
                  (symbol, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertSymbol(symbol.value)}
                      className="px-2 py-1 text-xs bg-surface-50 text-surface-600 border border-surface-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 rounded-md transition-all duration-150"
                      aria-label={`插入 ${symbol.label}`}
                    >
                      {symbol.label}
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Presets Panel */}
      {showPresets && (
        <div className="absolute z-10 left-0 right-0 bg-white border border-surface-200 rounded-xl shadow-lg p-4 max-h-72 overflow-y-auto animate-slide-up">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-surface-800">预设函数</h3>
            <button
              type="button"
              onClick={togglePresets}
              className="text-surface-400 hover:text-surface-600 transition-colors duration-150 p-0.5"
              aria-label="关闭预设面板"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {FUNCTION_PRESETS.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectPreset(preset.expression)}
                className="text-left p-2.5 bg-surface-50 border border-surface-100 hover:bg-primary-50 hover:border-primary-100 rounded-lg transition-all duration-150 group"
                aria-label={`选择预设函数 ${preset.name}`}
              >
                <div className="font-medium text-[13px] text-surface-800 group-hover:text-primary-700 transition-colors">{preset.name}</div>
                <div className="font-mono text-[11px] text-primary-500 mt-0.5">{preset.expression}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={formatExpression}
          className="flex-1 btn-secondary text-[13px] py-2"
        >
          格式化
        </button>
        <button
          type="submit"
          className="flex-1 btn-primary text-[13px] py-2 gap-1.5"
          disabled={!isValid || !expression.trim()}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加函数
        </button>
      </div>
    </form>
  );
};

export default React.memo(FunctionInput);
