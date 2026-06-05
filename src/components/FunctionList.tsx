import React, { useCallback, useMemo } from 'react';
import { FunctionItem } from '../types';

interface FunctionListProps {
  functions: FunctionItem[];
  onRemoveFunction: (id: string) => void;
  onSelectFunction?: (expression: string) => void;
  selectedFunctionId?: string | null;
}

const FunctionListItem: React.FC<{
  func: FunctionItem;
  index: number;
  onRemove: (id: string) => void;
  onSelect?: (expression: string) => void;
  isSelected?: boolean;
}> = React.memo(({ func, index, onRemove, onSelect, isSelected }) => {
  const handleRemove = useCallback(() => {
    onRemove(func.id);
  }, [func.id, onRemove]);

  const handleSelect = useCallback(() => {
    onSelect?.(func.expression);
  }, [func.expression, onSelect]);

  return (
    <li
      className={`flex items-center justify-between p-2.5 border rounded-xl transition-all duration-150 group cursor-pointer ${
        isSelected
          ? 'bg-primary-50 border-primary-200'
          : 'bg-white border-surface-100 hover:border-primary-200 hover:bg-primary-50/30'
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={handleSelect}
    >
      <div className="flex items-center min-w-0 gap-2.5">
        <div className="relative flex-shrink-0">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: func.color }}
            aria-hidden="true"
          />
          {isSelected && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary-500 rounded-full" />
          )}
        </div>
        <span className={`text-[13px] font-medium truncate font-mono ${
          isSelected ? 'text-primary-700' : 'text-surface-700'
        }`}>
          {func.expression}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemove();
        }}
        className="opacity-0 group-hover:opacity-100 text-surface-300 hover:text-accent-500 focus:outline-none ml-2 flex-shrink-0 transition-all duration-150 p-1 hover:bg-accent-50 rounded-md"
        aria-label={`删除函数 ${func.expression}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
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

const FunctionList: React.FC<FunctionListProps> = React.memo(({ 
  functions, 
  onRemoveFunction, 
  onSelectFunction,
  selectedFunctionId 
}) => {
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
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-surface-50 border border-surface-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <p className="text-[13px] font-medium text-surface-500">暂无函数</p>
        <p className="text-[11px] text-surface-400 mt-0.5">在上方输入表达式添加</p>
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
          onSelect={onSelectFunction}
          isSelected={selectedFunctionId === func.expression}
        />
      ))}
    </ul>
  );
});

FunctionList.displayName = 'FunctionList';

export default FunctionList;
