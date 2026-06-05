import { compile } from 'mathjs';

export const validateFunction = (expression: string): boolean => {
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

export const evaluateFunction = (expression: string, x: number): number => {
  try {
    const compiled = compile(expression);
    return compiled.evaluate({ x });
  } catch (error) {
    return NaN;
  }
};

export const evaluateMultiplePoints = (
  expression: string,
  xValues: number[]
): number[] => {
  try {
    const compiled = compile(expression);
    return xValues.map((x) => compiled.evaluate({ x }));
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