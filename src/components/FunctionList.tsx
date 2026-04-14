import React from 'react';

interface FunctionItem {
  id: string;
  expression: string;
  color: string;
}

interface FunctionListProps {
  functions: FunctionItem[];
  onRemoveFunction: (id: string) => void;
}

const FunctionList: React.FC<FunctionListProps> = ({ functions, onRemoveFunction }) => {
  if (functions.length === 0) {
    return <p className="text-gray-500">暂无函数，请添加函数表达式</p>;
  }

  return (
    <ul className="space-y-2">
      {functions.map((func) => (
        <li key={func.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
          <div className="flex items-center">
            <span 
              className="inline-block w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: func.color }}
            />
            <span className="text-sm font-medium">{func.expression}</span>
          </div>
          <button
            onClick={() => onRemoveFunction(func.id)}
            className="text-red-600 hover:text-red-800 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FunctionList;