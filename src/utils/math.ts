import * as math from 'mathjs';

export const validateFunction = (expression: string): boolean => {
  try {
    // 尝试解析函数表达式
    const compiled = math.compile(expression);
    // 尝试计算一个值，验证函数是否有效
    compiled.evaluate({ x: 0 });
    return true;
  } catch (error) {
    return false;
  }
};

export const evaluateFunction = (expression: string, x: number): number => {
  try {
    const compiled = math.compile(expression);
    return compiled.evaluate({ x });
  } catch (error) {
    return NaN;
  }
};