# 数学函数可视化项目重构计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 优化性能、改进代码架构、增强用户体验

**Architecture:** 采用模块化设计，分离关注点，使用自定义 hooks 管理状态和副作用，优化 math.js 的加载方式，改进组件结构和错误处理。

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, mathjs (动态导入), function-plot

---

## 当前状态分析

### 优点
- 功能完整：支持函数输入、实时渲染、多函数显示、坐标调整、图像导出
- 测试通过：15个测试全部通过
- 代码质量：ESLint 通过，无警告
- 响应式设计：支持移动端

### 问题
1. **性能问题**：math.js 包太大（637 kB），影响加载速度
2. **代码架构**：App.tsx 职责过重，包含过多状态和逻辑
3. **错误处理**：错误提示简单，缺乏详细的错误信息
4. **用户体验**：缺少函数预览、实时验证等功能

---

## 重构任务

### Task 1: 优化 math.js 加载性能

**目标:** 将 math.js 从主包中分离，实现动态导入

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/utils/math.ts`
- Modify: `vite.config.ts`

**Step 1: 创建动态导入的 math 工具**

```typescript
// src/utils/math.ts
import { compile } from 'mathjs';

// 缓存编译过的表达式
const compiledCache = new Map<string, ReturnType<typeof compile>>();

export const validateFunction = async (expression: string): Promise<boolean> => {
  if (!expression || expression.trim() === '') {
    return false;
  }
  try {
    const compiled = compile(expression);
    compiled.evaluate({ x: 0 });
    return true;
  } catch (error) {
    return false;
  }
};

export const evaluateFunction = async (expression: string, x: number): Promise<number> => {
  try {
    const compiled = compile(expression);
    return compiled.evaluate({ x });
  } catch (error) {
    return NaN;
  }
};

// 同步版本，用于 function-plot
export const validateFunctionSync = (expression: string): boolean => {
  if (!expression || expression.trim() === '') {
    return false;
  }
  try {
    const compiled = compile(expression);
    compiled.evaluate({ x: 0 });
    return true;
  } catch (error) {
    return false;
  }
};

export const evaluateFunctionSync = (expression: string, x: number): number => {
  try {
    const compiled = compile(expression);
    return compiled.evaluate({ x });
  } catch (error) {
    return NaN;
  }
};
```

**Step 2: 修改 FunctionInput 使用异步验证**

```typescript
// src/components/FunctionInput.tsx
const handleSubmit = useCallback(
  async (e: React.FormEvent) => {
    e.preventDefault();
    if (expression.trim()) {
      const isValid = await validateFunction(expression.trim());
      if (isValid) {
        onAddFunction(expression.trim());
        setExpression('');
        setError('');
      } else {
        setError('无效的函数表达式，请检查输入');
      }
    } else {
      setError('请输入函数表达式');
    }
  },
  [expression, onAddFunction]
);
```

**Step 3: 优化 vite.config.ts 配置**

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          plot: ['function-plot']
        }
      }
    }
  }
});
```

**Step 4: 运行测试验证**

Run: `npm run test:run`
Expected: 所有测试通过

**Step 5: 构建验证**

Run: `npm run build`
Expected: 构建成功，math.js 包大小减小

---

### Task 2: 拆分 App.tsx，提取自定义 hooks

**目标:** 将 App.tsx 中的状态和逻辑拆分到自定义 hooks

**Files:**
- Create: `src/hooks/useFunctions.ts`
- Create: `src/hooks/useCoordinateRange.ts`
- Create: `src/hooks/useLocalStorage.ts`
- Modify: `src/App.tsx`

**Step 1: 创建 useLocalStorage hook**

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
```

**Step 2: 创建 useFunctions hook**

```typescript
// src/hooks/useFunctions.ts
import { useCallback } from 'react';
import { FunctionItem } from '../types';
import { FUNCTION_COLORS } from '../config';
import { useHistory } from './useHistory';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'function-visualization-data';

export function useFunctions() {
  const [savedFunctions] = useLocalStorage<FunctionItem[]>(STORAGE_KEY, []);

  const {
    state: functions,
    set: setFunctions,
    undo,
    canUndo,
    redo,
    canRedo,
  } = useHistory<FunctionItem[]>(savedFunctions);

  const addFunction = useCallback(
    (expression: string) => {
      const color = FUNCTION_COLORS[functions.length % FUNCTION_COLORS.length];
      setFunctions((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          expression,
          color,
        },
      ]);
    },
    [functions.length, setFunctions]
  );

  const removeFunction = useCallback(
    (id: string) => {
      setFunctions((prev) => prev.filter((func) => func.id !== id));
    },
    [setFunctions]
  );

  const clearAllFunctions = useCallback(() => {
    setFunctions([]);
  }, [setFunctions]);

  return {
    functions,
    addFunction,
    removeFunction,
    clearAllFunctions,
    undo,
    canUndo,
    redo,
    canRedo,
  };
}
```

**Step 3: 创建 useCoordinateRange hook**

```typescript
// src/hooks/useCoordinateRange.ts
import { useState, useCallback } from 'react';
import { CoordinateRange } from '../types';
import { DEFAULT_COORDINATE_RANGE } from '../config';

export function useCoordinateRange() {
  const [coordinateRange, setCoordinateRange] = useState<CoordinateRange>(DEFAULT_COORDINATE_RANGE);

  const updateCoordinateRange = useCallback((range: Partial<CoordinateRange>) => {
    setCoordinateRange((prev) => ({ ...prev, ...range }));
  }, []);

  const resetCoordinateRange = useCallback(() => {
    setCoordinateRange(DEFAULT_COORDINATE_RANGE);
  }, []);

  return {
    coordinateRange,
    updateCoordinateRange,
    resetCoordinateRange,
  };
}
```

**Step 4: 重构 App.tsx**

```typescript
// src/App.tsx
import { useState } from 'react';
import FunctionInput from './components/FunctionInput';
import FunctionList from './components/FunctionList';
import Graph from './components/Graph';
import Controls from './components/Controls';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFunctions } from './hooks/useFunctions';
import { useCoordinateRange } from './hooks/useCoordinateRange';

function App() {
  const {
    functions,
    addFunction,
    removeFunction,
    clearAllFunctions,
    undo,
    canUndo,
  } = useFunctions();

  const {
    coordinateRange,
    updateCoordinateRange,
    resetCoordinateRange,
  } = useCoordinateRange();

  const [isLoading, setIsLoading] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const handleAddFunction = useCallback(
    (expression: string) => {
      setIsLoading(true);
      addFunction(expression);
      setTimeout(() => setIsLoading(false), 100);
    },
    [addFunction]
  );

  useKeyboardShortcuts({
    onAddFunction: () => {
      const input = document.querySelector<HTMLInputElement>('#function');
      if (input && input.value.trim()) {
        handleAddFunction(input.value.trim());
        input.value = '';
      }
    },
    onClearAll: clearAllFunctions,
    onUndo: undo,
  });

  return (
    // ... 保持现有 JSX 结构
  );
}

export default App;
```

**Step 5: 运行测试验证**

Run: `npm run test:run`
Expected: 所有测试通过

---

### Task 3: 改进错误处理和用户体验

**目标:** 添加详细的错误信息、函数预览、实时验证

**Files:**
- Create: `src/hooks/useValidation.ts`
- Modify: `src/components/FunctionInput.tsx`
- Modify: `src/components/Graph.tsx`

**Step 1: 创建 useValidation hook**

```typescript
// src/hooks/useValidation.ts
import { useState, useCallback, useEffect } from 'react';
import { validateFunctionSync } from '../utils/math';

export function useValidation(expression: string) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validate = useCallback(() => {
    if (!expression.trim()) {
      setIsValid(null);
      setErrorMessage('');
      return;
    }

    const valid = validateFunctionSync(expression.trim());
    setIsValid(valid);
    setErrorMessage(valid ? '' : '无效的函数表达式');
  }, [expression]);

  useEffect(() => {
    const timer = setTimeout(validate, 300);
    return () => clearTimeout(timer);
  }, [validate]);

  return { isValid, errorMessage };
}
```

**Step 2: 改进 FunctionInput 组件**

```typescript
// src/components/FunctionInput.tsx
import { useValidation } from '../hooks/useValidation';

const FunctionInput: React.FC<FunctionInputProps> = ({ onAddFunction }) => {
  const [expression, setExpression] = useState('');
  const { isValid, errorMessage } = useValidation(expression);

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
          />
          {isValid === true && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        {errorMessage && (
          <p className="mt-1 text-sm text-red-600 animate-fade-in" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
      {/* ... 其他代码 */}
    </form>
  );
};
```

**Step 3: 改进 Graph 组件的错误处理**

```typescript
// src/components/Graph.tsx
const renderGraph = useCallback(() => {
  if (graphRef.current) {
    setIsLoading(true);
    setError(null);
    try {
      const options = createGraphOptions(
        graphRef.current.clientWidth,
        graphRef.current.clientHeight
      );
      functionPlot(options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '函数图像渲染失败';
      setError(`渲染错误: ${errorMessage}`);
      console.error('Graph rendering error:', err);
    } finally {
      setIsLoading(false);
    }
  }
}, [createGraphOptions]);
```

**Step 4: 运行测试验证**

Run: `npm run test:run`
Expected: 所有测试通过

---

### Task 4: 优化组件性能

**目标:** 使用 React.memo、useMemo、useCallback 优化渲染性能

**Files:**
- Modify: `src/components/FunctionList.tsx`
- Modify: `src/components/Controls.tsx`
- Modify: `src/components/Graph.tsx`

**Step 1: 优化 FunctionList 组件**

```typescript
// src/components/FunctionList.tsx
import React, { useCallback, useMemo } from 'react';

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

export default FunctionList;
```

**Step 2: 优化 Controls 组件**

```typescript
// src/components/Controls.tsx
import React, { useCallback, useMemo } from 'react';

const Controls: React.FC<ControlsProps> = React.memo(({ coordinateRange, onUpdateCoordinateRange }) => {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      onUpdateCoordinateRange({ [name]: parseFloat(value) });
    },
    [onUpdateCoordinateRange]
  );

  const inputs = useMemo(() => [
    { id: 'xMin', label: 'X 最小值', value: coordinateRange.xMin },
    { id: 'xMax', label: 'X 最大值', value: coordinateRange.xMax },
    { id: 'yMin', label: 'Y 最小值', value: coordinateRange.yMin },
    { id: 'yMax', label: 'Y 最大值', value: coordinateRange.yMax },
  ], [coordinateRange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {inputs.map(({ id, label, value }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="number"
              id={id}
              name={id}
              value={value}
              onChange={handleInputChange}
              className="input-field"
              aria-label={`${label}轴`}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default Controls;
```

**Step 3: 运行测试验证**

Run: `npm run test:run`
Expected: 所有测试通过

---

### Task 5: 添加更多测试用例

**目标:** 提高测试覆盖率

**Files:**
- Create: `src/hooks/useLocalStorage.test.ts`
- Create: `src/hooks/useFunctions.test.ts`
- Create: `src/hooks/useValidation.test.ts`
- Modify: `src/components/FunctionInput.test.tsx`

**Step 1: 创建 useLocalStorage 测试**

```typescript
// src/hooks/useLocalStorage.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value when no stored value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value when available', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem('test-key')).toBe('"new-value"');
  });
});
```

**Step 2: 创建 useFunctions 测试**

```typescript
// src/hooks/useFunctions.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFunctions } from './useFunctions';

describe('useFunctions', () => {
  it('should add a function', () => {
    const { result } = renderHook(() => useFunctions());

    act(() => {
      result.current.addFunction('x^2');
    });

    expect(result.current.functions).toHaveLength(1);
    expect(result.current.functions[0].expression).toBe('x^2');
  });

  it('should remove a function', () => {
    const { result } = renderHook(() => useFunctions());

    act(() => {
      result.current.addFunction('x^2');
    });

    act(() => {
      result.current.removeFunction(result.current.functions[0].id);
    });

    expect(result.current.functions).toHaveLength(0);
  });

  it('should clear all functions', () => {
    const { result } = renderHook(() => useFunctions());

    act(() => {
      result.current.addFunction('x^2');
      result.current.addFunction('sin(x)');
    });

    act(() => {
      result.current.clearAllFunctions();
    });

    expect(result.current.functions).toHaveLength(0);
  });
});
```

**Step 3: 运行测试验证**

Run: `npm run test:run`
Expected: 所有测试通过，测试覆盖率提高

---

## 执行顺序

1. **Task 1**: 优化 math.js 加载性能（性能优化）
2. **Task 2**: 拆分 App.tsx，提取自定义 hooks（代码架构改进）
3. **Task 3**: 改进错误处理和用户体验（用户体验增强）
4. **Task 4**: 优化组件性能（性能优化）
5. **Task 5**: 添加更多测试用例（质量保证）

## 验证标准

1. **性能验证**：
   - math.js 包大小减小 50% 以上
   - 首次加载时间减少
   - 渲染性能提升

2. **代码质量验证**：
   - 所有测试通过
   - ESLint 无警告
   - 构建成功

3. **用户体验验证**：
   - 实时验证反馈
   - 详细的错误信息
   - 流畅的交互体验

---

## 总结

本重构计划将项目从单一的 App.tsx 架构改进为模块化的自定义 hooks 架构，优化了 math.js 的加载方式，提升了用户体验和代码质量。通过分阶段实施，确保每一步都可验证和回滚。
