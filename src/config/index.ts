import { MathSymbol } from '../types';

export const FUNCTION_COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#E7E9ED',
  '#7CB342',
  '#F57C00',
  '#5C6BC0',
];

export const MATH_SYMBOLS: MathSymbol[] = [
  { label: '加法 (+)', value: '+', category: '运算符' },
  { label: '减法 (-)', value: '-', category: '运算符' },
  { label: '乘法 (*)', value: '*', category: '运算符' },
  { label: '除法 (/)', value: '/', category: '运算符' },
  { label: '幂 (^)', value: '^', category: '运算符' },
  { label: '左括号 (', value: '(', category: '运算符' },
  { label: '右括号 )', value: ')', category: '运算符' },
  { label: '逗号 ,', value: ',', category: '运算符' },
  { label: 'sin', value: 'sin()', category: '三角函数' },
  { label: 'cos', value: 'cos()', category: '三角函数' },
  { label: 'tan', value: 'tan()', category: '三角函数' },
  { label: 'asin', value: 'asin()', category: '三角函数' },
  { label: 'acos', value: 'acos()', category: '三角函数' },
  { label: 'atan', value: 'atan()', category: '三角函数' },
  { label: 'exp', value: 'exp()', category: '指数对数' },
  { label: 'log', value: 'log()', category: '指数对数' },
  { label: 'ln', value: 'ln()', category: '指数对数' },
  { label: 'sqrt', value: 'sqrt()', category: '指数对数' },
  { label: 'π', value: 'pi', category: '常量' },
  { label: 'e', value: 'e', category: '常量' },
  { label: '绝对值 |x|', value: 'abs()', category: '其他' },
  { label: '阶乘 !', value: '!', category: '其他' },
  { label: '分号 ;', value: ';', category: '其他' },
];

export const DEFAULT_COORDINATE_RANGE = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
};

export const GRAPH_DEFAULTS = {
  width: 800,
  height: 600,
  grid: true,
};

export interface FunctionPreset {
  name: string;
  expression: string;
  description: string;
}

export const FUNCTION_PRESETS: FunctionPreset[] = [
  { name: '线性函数', expression: 'x', description: '简单的一次函数' },
  { name: '二次函数', expression: 'x^2', description: '抛物线' },
  { name: '三次函数', expression: 'x^3', description: '三次曲线' },
  { name: '正弦函数', expression: 'sin(x)', description: '正弦波' },
  { name: '余弦函数', expression: 'cos(x)', description: '余弦波' },
  { name: '正切函数', expression: 'tan(x)', description: '正切曲线' },
  { name: '指数函数', expression: 'exp(x)', description: '自然指数' },
  { name: '对数函数', expression: 'log(x)', description: '自然对数' },
  { name: '平方根', expression: 'sqrt(x)', description: '平方根函数' },
  { name: '绝对值', expression: 'abs(x)', description: '绝对值函数' },
];