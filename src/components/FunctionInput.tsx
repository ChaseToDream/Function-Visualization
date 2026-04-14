import React, { useState, useRef } from 'react';
import { validateFunction } from '../utils/math';

interface FunctionInputProps {
  onAddFunction: (expression: string) => void;
}

interface MathSymbol {
  label: string;
  value: string;
  category: string;
}

const mathSymbols: MathSymbol[] = [
  { label: '加法 (+)', value: '+', category: '运算符' },
  { label: '减法 (-)', value: '-', category: '运算符' },
  { label: '乘法 (*)', value: '*', category: '运算符' },
  { label: '除法 (/)', value: '/', category: '运算符' },
  { label: '幂 (^)', value: '^', category: '运算符' },
  { label: '左括号 (', value: '(', category: '运算符' },
  { label: '右括号 )', value: ')', category: '运算符' },
  { label: '逗号 ,', value: ',', category: '运算符' },
  { label: 'sin', value: 'sin()', category: '三角函数' },
  { label: 'cos', value: 'cos()', category: '三角函数' },
  { label: 'tan', value: 'tan()', category: '三角函数' },
  { label: 'asin', value: 'asin()', category: '三角函数' },
  { label: 'acos', value: 'acos()', category: '三角函数' },
  { label: 'atan', value: 'atan()', category: '三角函数' },
  { label: 'exp', value: 'exp()', category: '指数对数' },
  { label: 'log', value: 'log()', category: '指数对数' },
  { label: 'ln', value: 'ln()', category: '指数对数' },
  { label: 'sqrt', value: 'sqrt()', category: '指数对数' },
  { label: 'π', value: 'pi', category: '常量' },
  { label: 'e', value: 'e', category: '常量' },
  { label: '绝对值 |x|', value: 'abs()', category: '其他' },
  { label: '阶乘 !', value: '!', category: '其他' },
  { label: '分号 ;', value: ';', category: '其他' },
];

const categories = Array.from(new Set(mathSymbols.map(symbol => symbol.category)));

const FunctionInput: React.FC<FunctionInputProps> = ({ onAddFunction }) => {
  const [expression, setExpression] = useState('');
  const [error, setError] = useState('');
  const [showSymbols, setShowSymbols] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expression.trim()) {
      if (validateFunction(expression.trim())) {
        onAddFunction(expression.trim());
        setExpression('');
        setError('');
      } else {
        setError('无效的函数表达式，请检查输入');
      }
    } else {
      setError('请输入函数表达式');
    }
  };

  const insertSymbol = (symbol: string) => {
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
  };

  const formatExpression = () => {
    // 简单的表达式格式化逻辑
    let formatted = expression
      .replace(/\s+/g, ' ')
      .replace(/\s*([+\-*/^()])\s*/g, ' $1 ')
      .trim();
    setExpression(formatted);
  };

  const toggleSymbols = () => {
    setShowSymbols(!showSymbols);
  };

  // 点击外部关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSymbols && !target.closest('.relative') && !target.closest('.z-10')) {
        setShowSymbols(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSymbols]);

  // 括号匹配检查
  const checkBracketBalance = () => {
    const openBrackets = (expression.match(/\(/g) || []).length;
    const closeBrackets = (expression.match(/\)/g) || []).length;
    return openBrackets === closeBrackets;
  };

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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !checkBracketBalance() ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={toggleSymbols}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-sm"
          >
            数学符号
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {!checkBracketBalance() && (
          <p className="mt-1 text-sm text-amber-600">括号不匹配，请检查</p>
        )}
      </div>
      
      {showSymbols && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-80 max-h-96 overflow-y-auto mt-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">选择数学符号</h3>
            <button
              type="button"
              onClick={toggleSymbols}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          {categories.map(category => (
            <div key={category} className="mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">{category}</h4>
              <div className="flex flex-wrap gap-1">
                {mathSymbols
                  .filter(symbol => symbol.category === category)
                  .map((symbol, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertSymbol(symbol.value)}
                      className="px-2 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100"
                    >
                      {symbol.label}
                    </button>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          type="button"
          onClick={formatExpression}
          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          格式化表达式
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          添加函数
        </button>
      </div>
    </form>
  );
};

export default FunctionInput;