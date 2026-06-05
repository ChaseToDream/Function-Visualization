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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="function" className="block text-sm font-medium text-gray-700 mb-1">
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
            className={`input-field ${
              isValid === false ? 'border-red-500' : 
              isValid === true ? 'border-green-500' : ''
            }`}
            aria-label="输入函数表达式"
            aria-invalid={isValid === false}
            aria-describedby={isValid === false ? 'validation-error' : undefined}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            <button
              type="button"
              onClick={togglePresets}
              className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-sm transition-colors duration-200"
              aria-label="选择预设函数"
            >
              预设
            </button>
            <button
              type="button"
              onClick={toggleSymbols}
              className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-sm transition-colors duration-200"
              aria-label="插入数学符号"
            >
              符号
            </button>
          </div>
        </div>
        {errorMessage && (
          <p id="validation-error" className="mt-1 text-sm text-red-600 animate-fade-in" role="alert">
            {errorMessage}
          </p>
        )}
        {!checkBracketBalance && (
          <p className="mt-1 text-sm text-amber-600 animate-fade-in" role="alert">
            括号不匹配，请检查
          </p>
        )}
      </div>

      {showSymbols && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-80 max-h-96 overflow-y-auto mt-1 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">选择数学符号</h3>
            <button
              type="button"
              onClick={toggleSymbols}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="关闭符号面板"
            >
              ×
            </button>
          </div>
          {categories.map((category) => (
            <div key={category} className="mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">{category}</h4>
              <div className="flex flex-wrap gap-1">
                {MATH_SYMBOLS.filter((symbol) => symbol.category === category).map(
                  (symbol, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertSymbol(symbol.value)}
                      className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100 transition-colors duration-200"
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

      {showPresets && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-80 max-h-96 overflow-y-auto mt-1 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">预设函数</h3>
            <button
              type="button"
              onClick={togglePresets}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="关闭预设面板"
            >
              ×
            </button>
          </div>
          <div className="space-y-2">
            {FUNCTION_PRESETS.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectPreset(preset.expression)}
                className="w-full text-left p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors duration-200"
                aria-label={`选择预设函数 ${preset.name}`}
              >
                <div className="font-medium text-sm">{preset.name}</div>
                <div className="text-xs text-gray-500">{preset.expression}</div>
                <div className="text-xs text-gray-400">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={formatExpression}
          className="flex-1 btn-secondary"
        >
          格式化
        </button>
        <button
          type="submit"
          className="flex-1 btn-primary"
        >
          添加函数
        </button>
      </div>
    </form>
  );
};

export default React.memo(FunctionInput);