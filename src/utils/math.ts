import { compile, EvalFunction } from 'mathjs';

// 缓存编译过的表达式
const compiledCache = new Map<string, EvalFunction>();

const getCompiled = (expression: string): EvalFunction => {
  if (!compiledCache.has(expression)) {
    compiledCache.set(expression, compile(expression));
  }
  return compiledCache.get(expression)!;
};

export const validateFunction = (expression: string): boolean => {
  if (!expression || expression.trim() === '') {
    return false;
  }
  try {
    const compiled = getCompiled(expression.trim());
    compiled.evaluate({ x: 0 });
    return true;
  } catch (error) {
    return false;
  }
};

export const evaluateFunction = (expression: string, x: number): number => {
  try {
    const compiled = getCompiled(expression);
    return compiled.evaluate({ x }) as number;
  } catch (error) {
    return NaN;
  }
};

export const evaluateMultiplePoints = (
  expression: string,
  xValues: number[]
): number[] => {
  try {
    const compiled = getCompiled(expression);
    return xValues.map((x) => compiled.evaluate({ x }) as number);
  } catch (error) {
    return xValues.map(() => NaN);
  }
};

export const getFunctionDescription = (expression: string): string => {
  const patterns: Record<string, string> = {
    '^x\\^2$': '二次函数（抛物线）',
    '^x\\^3$': '三次函数',
    '^sin\\(x\\)$': '正弦函数',
    '^cos\\(x\\)$': '余弦函数',
    '^tan\\(x\\)$': '正切函数',
    '^exp\\(x\\)$': '指数函数',
    '^log\\(x\\)$': '对数函数',
    '^sqrt\\(x\\)$': '平方根函数',
    '^abs\\(x\\)$': '绝对值函数',
    '^x$': '线性函数',
  };

  for (const [pattern, description] of Object.entries(patterns)) {
    if (new RegExp(pattern).test(expression.trim())) {
      return description;
    }
  }

  return '自定义函数';
};