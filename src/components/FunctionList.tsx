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
      className="flex items-center justify-between p-2.5 bg-dark-800 border border-dark-500/50 hover:border-neon-blue/30 rounded-sm transition-all duration-200 animate-slide-in-right group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center min-w-0 gap-2.5">
        <div className="relative flex-shrink-0">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: func.color }}
            aria-hidden="true"
          />
          <div 
            className="absolute -inset-0.5 rounded-sm opacity-50 blur-sm"
            style={{ backgroundColor: func.color }}
          />
        </div>
        <span className="text-sm font-mono text-gray-300 truncate">{func.expression}</span>
      </div>
      <button
        onClick={handleRemove}
        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-neon-pink focus:outline-none ml-2 flex-shrink-0 transition-all duration-200"
        aria-label={`删除函数 ${func.expression}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
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
      <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto mb-3 rounded-sm bg-dark-700 border border-dark-500 flex items-center justify-center">
          <span className="text-2xl text-gray-600">∅</span>
        </div>
        <p className="text-sm font-mono text-gray-500">NO FUNCTIONS</p>
        <p className="text-xs text-gray-600 mt-1">Add an expression above</p>
      </div>
    );
  }

  return (
    <ul className="space-y-1.5" aria-label="已添加的函数列表">
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
