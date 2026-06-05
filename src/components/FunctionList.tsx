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
      className="flex items-center justify-between p-3 bg-surface-50 border border-surface-200 hover:border-primary-200 hover:bg-primary-50/50 rounded-xl transition-all duration-200 group animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center min-w-0 gap-3">
        <div className="relative flex-shrink-0">
          <span
            className="inline-block w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: func.color }}
            aria-hidden="true"
          />
        </div>
        <span className="text-sm font-medium text-surface-700 truncate font-mono">{func.expression}</span>
      </div>
      <button
        onClick={handleRemove}
        className="opacity-0 group-hover:opacity-100 text-surface-400 hover:text-accent-600 focus:outline-none ml-2 flex-shrink-0 transition-all duration-200 p-1 hover:bg-accent-50 rounded-lg"
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
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <p className="text-sm font-medium text-surface-600">暂无函数</p>
        <p className="text-xs text-surface-400 mt-1">在上方输入表达式添加函数</p>
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
