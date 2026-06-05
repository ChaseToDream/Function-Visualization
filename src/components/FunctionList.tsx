import React, { useCallback, useMemo } from 'react';
import { FunctionItem } from '../types';

interface FunctionListProps {
  functions: FunctionItem[];
  onRemoveFunction: (id: string) => void;
}

const FunctionListItem: React.FC<{
  func: FunctionItem;
  index: number;
  onRemove: (id: string) => void;
}> = React.memo(({ func, index, onRemove }) => {
  const handleRemove = useCallback(() => {
    onRemove(func.id);
  }, [func.id, onRemove]);

  return (
    <li
      className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center min-w-0">
        <span
          className="inline-block w-4 h-4 rounded-full mr-3 flex-shrink-0"
          style={{ backgroundColor: func.color }}
          aria-hidden="true"
        />
        <span className="text-sm font-medium truncate">{func.expression}</span>
      </div>
      <button
        onClick={handleRemove}
        className="text-red-600 hover:text-red-800 focus:outline-none ml-2 flex-shrink-0 transition-colors duration-200"
        aria-label={`删除函数 ${func.expression}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </li>
  );
});

FunctionListItem.displayName = 'FunctionListItem';

const FunctionList: React.FC<FunctionListProps> = React.memo(({ functions, onRemoveFunction }) => {
  const handleRemove = useCallback(
    (id: string) => {
      onRemoveFunction(id);
    },
    [onRemoveFunction]
  );

  const isEmpty = useMemo(() => functions.length === 0, [functions.length]);

  if (isEmpty) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">暂无函数，请添加函数表达式</p>
        <p className="text-sm text-gray-400 mt-1">支持数学表达式如 sin(x)、x^2 等</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2" aria-label="已添加的函数列表">
      {functions.map((func, index) => (
        <FunctionListItem
          key={func.id}
          func={func}
          index={index}
          onRemove={handleRemove}
        />
      ))}
    </ul>
  );
});

FunctionList.displayName = 'FunctionList';

export default FunctionList;