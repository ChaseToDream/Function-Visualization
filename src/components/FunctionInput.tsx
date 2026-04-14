import React, { useState } from 'react';
import { validateFunction } from '../utils/math';

interface FunctionInputProps {
  onAddFunction: (expression: string) => void;
}

const FunctionInput: React.FC<FunctionInputProps> = ({ onAddFunction }) => {
  const [expression, setExpression] = useState('');
  const [error, setError] = useState('');

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="function" className="block text-sm font-medium text-gray-700 mb-1">
          函数表达式
        </label>
        <input
          type="text"
          id="function"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="例如: sin(x) 或 x^2"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        添加函数
      </button>
    </form>
  );
};

export default FunctionInput;