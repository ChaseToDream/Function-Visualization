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
        <label htmlFor="function" className="block text-xs font-mono text-neon-blue tracking-wider uppercase mb-2">
          EXPRESSION
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            id="function"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="e.g. sin(x) or x^2"
            className={`input-field pr-24 ${
              isValid === false ? 'border-neon-pink focus:border-neon-pink focus:shadow-neon-pink' : 
              isValid === true ? 'border-neon-green focus:border-neon-green focus:shadow-neon-green' : ''
            }`}
            aria-label="输入函数表达式"
            aria-invalid={isValid === false}
            aria-describedby={isValid === false ? 'validation-error' : undefined}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            <button
              type="button"
              onClick={togglePresets}
              className="px-2 py-1 text-xs font-mono bg-dark-700 text-gray-400 hover:text-neon-blue hover:bg-dark-600 border border-dark-500 hover:border-neon-blue/30 rounded-sm transition-all duration-200"
              aria-label="选择预设函数"
            >
              PRESETS
            </button>
            <button
              type="button"
              onClick={toggleSymbols}
              className="px-2 py-1 text-xs font-mono bg-dark-700 text-gray-400 hover:text-neon-purple hover:bg-dark-600 border border-dark-500 hover:border-neon-purple/30 rounded-sm transition-all duration-200"
              aria-label="插入数学符号"
            >
              SYMBOLS
            </button>
          </div>
        </div>
        
        {/* Validation Status */}
        <div className="mt-2 h-5">
          {isValid === true && (
            <p className="text-xs font-mono text-neon-green flex items-center gap-1 animate-fade-in">
              <span>✓</span> VALID EXPRESSION
            </p>
          )}
          {isValid === false && (
            <p id="validation-error" className="text-xs font-mono text-neon-pink flex items-center gap-1 animate-fade-in" role="alert">
              <span>✕</span> {errorMessage?.toUpperCase() || 'INVALID EXPRESSION'}
            </p>
          )}
          {!checkBracketBalance && (
            <p className="text-xs font-mono text-neon-yellow flex items-center gap-1 animate-fade-in" role="alert">
              <span>⚠</span> BRACKETS MISMATCH
            </p>
          )}
        </div>
      </div>

      {/* Symbols Panel */}
      {showSymbols && (
        <div className="absolute z-10 left-0 right-0 bg-dark-800 border border-dark-500 rounded-sm shadow-glow p-4 max-h-80 overflow-y-auto animate-slide-up">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-display tracking-wider text-neon-purple uppercase">SYMBOLS</h3>
            <button
              type="button"
              onClick={toggleSymbols}
              className="text-gray-500 hover:text-neon-pink transition-colors duration-200 text-lg"
              aria-label="关闭符号面板"
            >
              ×
            </button>
          </div>
          {categories.map((category) => (
            <div key={category} className="mb-4">
              <h4 className="text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">{category}</h4>
              <div className="flex flex-wrap gap-1.5">
                {MATH_SYMBOLS.filter((symbol) => symbol.category === category).map(
                  (symbol, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertSymbol(symbol.value)}
                      className="px-2.5 py-1.5 text-xs font-mono bg-dark-700 text-gray-300 border border-dark-500 hover:border-neon-blue/50 hover:text-neon-blue hover:bg-dark-600 rounded-sm transition-all duration-200"
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
        <div className="absolute z-10 left-0 right-0 bg-dark-800 border border-dark-500 rounded-sm shadow-glow p-4 max-h-80 overflow-y-auto animate-slide-up">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-display tracking-wider text-neon-green uppercase">PRESETS</h3>
            <button
              type="button"
              onClick={togglePresets}
              className="text-gray-500 hover:text-neon-pink transition-colors duration-200 text-lg"
              aria-label="关闭预设面板"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FUNCTION_PRESETS.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectPreset(preset.expression)}
                className="text-left p-3 bg-dark-700 border border-dark-500 hover:border-neon-green/50 hover:bg-dark-600 rounded-sm transition-all duration-200 group"
                aria-label={`选择预设函数 ${preset.name}`}
              >
                <div className="font-body text-sm text-gray-200 group-hover:text-neon-green transition-colors">{preset.name}</div>
                <div className="font-mono text-xs text-neon-blue mt-1">{preset.expression}</div>
                <div className="text-xs text-gray-500 mt-0.5">{preset.description}</div>
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
          className="flex-1 btn-secondary text-xs"
        >
          FORMAT
        </button>
        <button
          type="submit"
          className="flex-1 btn-primary text-xs"
          disabled={!isValid}
        >
          ADD FUNCTION
        </button>
      </div>
    </form>
  );
};

export default React.memo(FunctionInput);
