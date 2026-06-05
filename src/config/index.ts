import { MathSymbol } from '../types';

export const FUNCTION_COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#7CB342',
  '#F57C00',
  '#5C6BC0',
  '#E91E63',
  '#00BCD4',
  '#8BC34A',
  '#FF5722',
  '#607D8B',
  '#9C27B0',
];

export const MATH_SYMBOLS: MathSymbol[] = [
  // 运算符
  { label: '加法 (+)', value: '+', category: '运算符' },
  { label: '减法 (-)', value: '-', category: '运算符' },
  { label: '乘法 (*)', value: '*', category: '运算符' },
  { label: '除法 (/)', value: '/', category: '运算符' },
  { label: '幂 (^)', value: '^', category: '运算符' },
  { label: '左括号 (', value: '(', category: '运算符' },
  { label: '右括号 )', value: ')', category: '运算符' },
  { label: '逗号 ,', value: ',', category: '运算符' },
  
  // 三角函数
  { label: 'sin', value: 'sin()', category: '三角函数' },
  { label: 'cos', value: 'cos()', category: '三角函数' },
  { label: 'tan', value: 'tan()', category: '三角函数' },
  { label: 'asin', value: 'asin()', category: '三角函数' },
  { label: 'acos', value: 'acos()', category: '三角函数' },
  { label: 'atan', value: 'atan()', category: '三角函数' },
  { label: 'atan2', value: 'atan2()', category: '三角函数' },
  { label: 'sec', value: '1/cos()', category: '三角函数' },
  { label: 'csc', value: '1/sin()', category: '三角函数' },
  { label: 'cot', value: '1/tan()', category: '三角函数' },
  
  // 双曲函数
  { label: 'sinh', value: 'sinh()', category: '双曲函数' },
  { label: 'cosh', value: 'cosh()', category: '双曲函数' },
  { label: 'tanh', value: 'tanh()', category: '双曲函数' },
  { label: 'asinh', value: 'asinh()', category: '双曲函数' },
  { label: 'acosh', value: 'acosh()', category: '双曲函数' },
  { label: 'atanh', value: 'atanh()', category: '双曲函数' },
  
  // 指数对数
  { label: 'exp', value: 'exp()', category: '指数对数' },
  { label: 'log', value: 'log()', category: '指数对数' },
  { label: 'ln', value: 'ln()', category: '指数对数' },
  { label: 'log2', value: 'log2()', category: '指数对数' },
  { label: 'log10', value: 'log10()', category: '指数对数' },
  { label: 'sqrt', value: 'sqrt()', category: '指数对数' },
  { label: 'cbrt', value: 'cbrt()', category: '指数对数' },
  
  // 取整函数
  { label: 'floor', value: 'floor()', category: '取整函数' },
  { label: 'ceil', value: 'ceil()', category: '取整函数' },
  { label: 'round', value: 'round()', category: '取整函数' },
  { label: 'abs', value: 'abs()', category: '取整函数' },
  { label: 'sign', value: 'sign()', category: '取整函数' },
  
  // 常量
  { label: 'π', value: 'pi', category: '常量' },
  { label: 'e', value: 'e', category: '常量' },
  { label: '∞', value: 'Infinity', category: '常量' },
  
  // 比较运算符
  { label: 'min', value: 'min()', category: '比较函数' },
  { label: 'max', value: 'max()', category: '比较函数' },
  
  // 其他
  { label: '阶乘 !', value: '!', category: '其他' },
  { label: '随机数', value: 'random()', category: '其他' },
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
  category: string;
  tags?: string[];
}

export const PRESET_CATEGORIES = [
  '基础函数',
  '多项式',
  '三角函数',
  '反三角函数',
  '双曲函数',
  '指数对数',
  '分段函数',
  '特殊函数',
  '经典曲线',
  '历史名函数',
  '概率分布',
  '物理函数',
  '机器学习',
];

export const FUNCTION_PRESETS: FunctionPreset[] = [
  // 基础函数
  { name: '常数函数', expression: '1', description: 'y = 1，水平直线', category: '基础函数', tags: ['常数', '直线'] },
  { name: '线性函数', expression: 'x', description: 'y = x，斜率为1的直线', category: '基础函数', tags: ['一次', '直线'] },
  { name: '线性函数 (负)', expression: '-x', description: 'y = -x，斜率为-1的直线', category: '基础函数', tags: ['一次', '直线'] },
  { name: '比例函数', expression: '2*x', description: 'y = 2x，斜率为2', category: '基础函数', tags: ['一次', '直线'] },
  { name: '截距函数', expression: 'x+1', description: 'y = x+1，带截距的直线', category: '基础函数', tags: ['一次', '直线'] },
  
  // 多项式
  { name: '二次函数', expression: 'x^2', description: '抛物线，开口向上', category: '多项式', tags: ['二次', '抛物线'] },
  { name: '二次函数 (负)', expression: '-x^2', description: '抛物线，开口向下', category: '多项式', tags: ['二次', '抛物线'] },
  { name: '三次函数', expression: 'x^3', description: '三次曲线，S形', category: '多项式', tags: ['三次'] },
  { name: '四次函数', expression: 'x^4', description: '四次曲线，W形', category: '多项式', tags: ['四次'] },
  { name: '五次函数', expression: 'x^5', description: '五次曲线', category: '多项式', tags: ['五次'] },
  { name: '完全二次', expression: '(x-1)^2+2', description: '顶点在(1,2)的抛物线', category: '多项式', tags: ['二次', '平移'] },
  { name: '双二次', expression: 'x^4-5*x^2+4', description: '双二次函数，多个极值点', category: '多项式', tags: ['四次'] },
  
  // 三角函数
  { name: '正弦函数', expression: 'sin(x)', description: '标准正弦波', category: '三角函数', tags: ['周期', '波形'] },
  { name: '余弦函数', expression: 'cos(x)', description: '标准余弦波', category: '三角函数', tags: ['周期', '波形'] },
  { name: '正切函数', expression: 'tan(x)', description: '正切曲线，有渐近线', category: '三角函数', tags: ['周期', '渐近线'] },
  { name: '正弦 (2x)', expression: 'sin(2*x)', description: '频率加倍的正弦波', category: '三角函数', tags: ['周期', '频率'] },
  { name: '正弦 (x/2)', expression: 'sin(x/2)', description: '频率减半的正弦波', category: '三角函数', tags: ['周期', '频率'] },
  { name: '振幅正弦', expression: '2*sin(x)', description: '振幅为2的正弦波', category: '三角函数', tags: ['周期', '振幅'] },
  { name: '相位偏移', expression: 'sin(x-pi/2)', description: '相位偏移π/2', category: '三角函数', tags: ['周期', '相位'] },
  { name: '叠加正弦', expression: 'sin(x)+sin(2*x)', description: '两个正弦波叠加', category: '三角函数', tags: ['叠加', '谐波'] },
  { name: '正弦加余弦', expression: 'sin(x)+cos(x)', description: '正弦余弦叠加', category: '三角函数', tags: ['叠加'] },
  { name: '包络正弦', expression: 'exp(-x/10)*sin(x)', description: '指数衰减的正弦波', category: '三角函数', tags: ['衰减', '阻尼'] },
  
  // 反三角函数
  { name: '反正弦', expression: 'asin(x)', description: '反正弦函数，定义域[-1,1]', category: '反三角函数', tags: ['反三角'] },
  { name: '反余弦', expression: 'acos(x)', description: '反余弦函数，定义域[-1,1]', category: '反三角函数', tags: ['反三角'] },
  { name: '反正切', expression: 'atan(x)', description: '反正切函数，有水平渐近线', category: '反三角函数', tags: ['反三角'] },
  
  // 双曲函数
  { name: '双曲正弦', expression: 'sinh(x)', description: '双曲正弦函数', category: '双曲函数', tags: ['双曲'] },
  { name: '双曲余弦', expression: 'cosh(x)', description: '双曲余弦，悬链线', category: '双曲函数', tags: ['双曲', '悬链线'] },
  { name: '双曲正切', expression: 'tanh(x)', description: '双曲正切，S形曲线', category: '双曲函数', tags: ['双曲', 'S形'] },
  
  // 指数对数
  { name: '自然指数', expression: 'exp(x)', description: 'e^x，自然指数函数', category: '指数对数', tags: ['指数', '增长'] },
  { name: '指数衰减', expression: 'exp(-x)', description: 'e^(-x)，指数衰减', category: '指数对数', tags: ['指数', '衰减'] },
  { name: '指数增长', expression: '2^x', description: '2^x，指数增长', category: '指数对数', tags: ['指数', '增长'] },
  { name: '自然对数', expression: 'log(x)', description: 'ln(x)，自然对数', category: '指数对数', tags: ['对数'] },
  { name: '常用对数', expression: 'log10(x)', description: 'log10(x)，常用对数', category: '指数对数', tags: ['对数'] },
  { name: '平方根', expression: 'sqrt(x)', description: '√x，平方根函数', category: '指数对数', tags: ['根式'] },
  { name: '立方根', expression: 'cbrt(x)', description: '∛x，立方根函数', category: '指数对数', tags: ['根式'] },
  { name: '对数线性', expression: 'x*log(x)', description: 'x·ln(x)', category: '指数对数', tags: ['混合'] },
  { name: '高斯函数', expression: 'exp(-x^2)', description: 'e^(-x²)，钟形曲线', category: '指数对数', tags: ['高斯', '钟形'] },
  { name: '高斯分布', expression: 'exp(-x^2/2)/sqrt(2*pi)', description: '标准正态分布', category: '指数对数', tags: ['概率', '统计'] },
  
  // 分段函数
  { name: '绝对值', expression: 'abs(x)', description: '|x|，V形', category: '分段函数', tags: ['绝对值', 'V形'] },
  { name: '符号函数', expression: 'sign(x)', description: '符号函数，阶梯形', category: '分段函数', tags: ['符号', '阶梯'] },
  { name: '取整函数', expression: 'floor(x)', description: '向下取整，阶梯形', category: '分段函数', tags: ['取整', '阶梯'] },
  { name: '上取整', expression: 'ceil(x)', description: '向上取整', category: '分段函数', tags: ['取整', '阶梯'] },
  { name: '四舍五入', expression: 'round(x)', description: '四舍五入', category: '分段函数', tags: ['取整'] },
  { name: '锯齿波', expression: 'x-floor(x)', description: '锯齿波形', category: '分段函数', tags: ['周期', '锯齿'] },
  { name: '三角波', expression: 'abs(2*(x/2-floor(x/2+1/4)))-1', description: '三角波形', category: '分段函数', tags: ['周期', '三角'] },
  
  // 特殊函数
  { name: '反比例', expression: '1/x', description: '双曲线，有渐近线', category: '特殊函数', tags: ['反比例', '渐近线'] },
  { name: '反比例平方', expression: '1/x^2', description: '反比例平方', category: '特殊函数', tags: ['反比例'] },
  { name: '有理函数', expression: '(x^2-1)/(x^2+1)', description: '有理函数，有界', category: '特殊函数', tags: ['有理'] },
  { name: 'Sigmoid', expression: '1/(1+exp(-x))', description: 'S形曲线，用于机器学习', category: '特殊函数', tags: ['S形', '机器学习'] },
  { name: 'ReLU', expression: 'max(0,x)', description: 'ReLU激活函数', category: '特殊函数', tags: ['激活', '机器学习'] },
  { name: 'Softplus', expression: 'log(1+exp(x))', description: 'Softplus激活函数', category: '特殊函数', tags: ['激活', '机器学习'] },
  { name: 'Swish', expression: 'x/(1+exp(-x))', description: 'Swish激活函数', category: '特殊函数', tags: ['激活', '机器学习'] },
  { name: '心脏线', expression: '1-sin(x)', description: '心脏线（极坐标）', category: '特殊函数', tags: ['极坐标'] },
  { name: '玫瑰线', expression: 'sin(3*x)', description: '三叶玫瑰线', category: '特殊函数', tags: ['极坐标', '玫瑰'] },
  { name: '蝴蝶曲线', expression: 'sin(x)*exp(cos(x))-2*cos(4*x)+sin(x/12)^5', description: '蝴蝶曲线近似', category: '特殊函数', tags: ['曲线'] },
  
  // 复合函数
  { name: '正弦平方', expression: 'sin(x)^2', description: 'sin²(x)', category: '特殊函数', tags: ['复合'] },
  { name: '余弦平方', expression: 'cos(x)^2', description: 'cos²(x)', category: '特殊函数', tags: ['复合'] },
  { name: '指数正弦', expression: 'exp(sin(x))', description: 'e^(sin x)', category: '特殊函数', tags: ['复合'] },
  { name: '对数绝对值', expression: 'log(abs(x))', description: 'ln|x|', category: '特殊函数', tags: ['复合'] },
  { name: '正弦分之一', expression: '1/sin(x)', description: 'csc(x)，余割', category: '特殊函数', tags: ['复合', '渐近线'] },
  { name: '余弦分之一', expression: '1/cos(x)', description: 'sec(x)，正割', category: '特殊函数', tags: ['复合', '渐近线'] },
  
  // 经典曲线
  { name: '笛卡尔叶形线', expression: 'x^3/(1-x)+x^2/(1-x)^2', description: '笛卡尔叶形线变体', category: '经典曲线', tags: ['笛卡尔', '代数曲线'] },
  { name: '箕舌线', expression: '1/(1+x^2)', description: '箕舌线/Witch of Agnesi', category: '经典曲线', tags: ['阿涅西', '钟形'] },
  { name: '蛇形线', expression: '4*x/(x^2+1)', description: '蛇形线/Serpentine', category: '经典曲线', tags: ['经典'] },
  { name: '环索线', expression: 'x*(x^2-1)/(x^2+1)', description: '环索线/Strophoid', category: '经典曲线', tags: ['经典'] },
  { name: '半立方抛物线', expression: 'x^(3/2)', description: '半立方抛物线/Semicubical', category: '经典曲线', tags: ['经典', '尖点'] },
  { name: '箕舌线 (变体)', expression: '8/(4+x^2)', description: '阿涅西箕舌线', category: '经典曲线', tags: ['阿涅西'] },
  { name: '悬链线', expression: 'cosh(x)', description: '悬链线/Catenary', category: '经典曲线', tags: ['悬链', '物理'] },
  { name: '摆线 (X坐标)', expression: 'x-sin(x)', description: '摆线X坐标/Cycloid', category: '经典曲线', tags: ['摆线', '旋轮'] },
  { name: '星形线', expression: '(1-x^2)^(3/2)', description: '星形线/Astroid', category: '经典曲线', tags: ['星形', '内摆线'] },
  { name: '蔓叶线', expression: 'x^3/(2-x)', description: '蔓叶线/Cissoid', category: '经典曲线', tags: ['经典'] },
  { name: '蚌线', expression: 'sqrt(1-x^2)+2', description: '蚌线/Conchoid变体', category: '经典曲线', tags: ['经典'] },
  { name: '双纽线', expression: 'sqrt(sqrt(1+4*x^2)-x^2-1)', description: '双纽线/Lemniscate', category: '经典曲线', tags: ['双纽', '伯努利'] },
  { name: '玫瑰线 (4叶)', expression: 'cos(2*x)', description: '四叶玫瑰线', category: '经典曲线', tags: ['玫瑰', '极坐标'] },
  { name: '玫瑰线 (5叶)', expression: 'cos(2.5*x)', description: '五叶玫瑰线', category: '经典曲线', tags: ['玫瑰', '极坐标'] },
  { name: '阿基米德螺线', expression: 'x/10', description: '阿基米德螺线近似', category: '经典曲线', tags: ['螺线', '阿基米德'] },
  { name: '对数螺线', expression: 'exp(x/10)', description: '对数螺线近似', category: '经典曲线', tags: ['螺线', '对数'] },
  { name: '利萨如图形 (X)', expression: 'sin(3*x)', description: '利萨如图形X分量', category: '经典曲线', tags: ['利萨如', '参数'] },
  { name: '利萨如图形 (Y)', expression: 'sin(2*x)', description: '利萨如图形Y分量', category: '经典曲线', tags: ['利萨如', '参数'] },
  
  // 历史名函数
  { name: '魏尔斯特拉斯函数', expression: 'cos(x)+cos(3*x)/4+cos(9*x)/16+cos(27*x)/64', description: '处处连续处处不可导（近似）', category: '历史名函数', tags: ['魏尔斯特拉斯', '分形', '连续不可导'] },
  { name: '狄利克雷函数 (近似)', expression: 'sin(pi*x)^2/(sin(pi*x)^2+0.01)', description: '狄利克雷函数近似', category: '历史名函数', tags: ['狄利克雷', '处处不连续'] },
  { name: '黎曼函数', expression: 'sin(pi*x)^2', description: '黎曼函数相关', category: '历史名函数', tags: ['黎曼', '数论'] },
  { name: '高斯误差函数 (近似)', expression: 'tanh(2*x)', description: '误差函数erf近似', category: '历史名函数', tags: ['高斯', '误差函数', '统计'] },
  { name: '伽马函数 (近似)', expression: 'sqrt(2*pi/x)*(x/e)^x', description: '伽马函数斯特林近似', category: '历史名函数', tags: ['伽马', '斯特林', '阶乘'] },
  { name: '贝塞尔函数 J0 (近似)', expression: 'cos(x)/sqrt(abs(x)+0.1)', description: '第一类贝塞尔函数近似', category: '历史名函数', tags: ['贝塞尔', '振动'] },
  { name: '贝塞尔函数 J1 (近似)', expression: 'sin(x)/sqrt(abs(x)+0.1)', description: '第一类贝塞尔函数近似', category: '历史名函数', tags: ['贝塞尔', '振动'] },
  { name: '艾里函数 (近似)', expression: 'cos(x^3/3+x)', description: '艾里函数近似', category: '历史名函数', tags: ['艾里', '光学'] },
  { name: '切比雪夫多项式 T2', expression: '2*x^2-1', description: '切比雪夫多项式第二类', category: '历史名函数', tags: ['切比雪夫', '多项式'] },
  { name: '切比雪夫多项式 T3', expression: '4*x^3-3*x', description: '切比雪夫多项式第三类', category: '历史名函数', tags: ['切比雪夫', '多项式'] },
  { name: '切比雪夫多项式 T4', expression: '8*x^4-8*x^2+1', description: '切比雪夫多项式第四类', category: '历史名函数', tags: ['切比雪夫', '多项式'] },
  { name: '拉盖尔多项式', expression: '1-x+x^2/2-x^3/6', description: '拉盖尔多项式近似', category: '历史名函数', tags: ['拉盖尔', '量子力学'] },
  { name: '埃尔米特多项式', expression: '2*x', description: '埃尔米特多项式 H1', category: '历史名函数', tags: ['埃尔米特', '量子力学'] },
  { name: '勒让德多项式', expression: '(3*x^2-1)/2', description: '勒让德多项式 P2', category: '历史名函数', tags: ['勒让德', '球谐'] },
  { name: '雅可比椭圆函数 sn', expression: 'sin(x)/(1+0.1*x^2)', description: '雅可比椭圆函数近似', category: '历史名函数', tags: ['雅可比', '椭圆'] },
  { name: '雅可比椭圆函数 cn', expression: 'cos(x)/(1+0.1*x^2)', description: '雅可比椭圆函数近似', category: '历史名函数', tags: ['雅可比', '椭圆'] },
  { name: '狄拉克δ函数 (近似)', expression: 'exp(-x^2*100)/(sqrt(pi)*0.1)', description: '狄拉克δ函数高斯近似', category: '历史名函数', tags: ['狄拉克', '量子', '脉冲'] },
  { name: '亥维赛阶跃函数', expression: '0.5*(sign(x)+1)', description: '亥维赛阶跃函数', category: '历史名函数', tags: ['亥维赛', '阶跃', '信号'] },
  { name: '费米-狄拉克分布', expression: '1/(1+exp(x))', description: '费米-狄拉克分布', category: '历史名函数', tags: ['费米', '统计', '量子'] },
  { name: '玻色-爱因斯坦分布', expression: '1/(exp(x)-1)', description: '玻色-爱因斯坦分布', category: '历史名函数', tags: ['玻色', '统计', '量子'] },
  { name: '朗道函数', expression: 'log(abs(log(abs(x)+0.01)+0.01))', description: '朗道函数（双重对数）', category: '历史名函数', tags: ['朗道', '数论'] },
  { name: '黎曼ζ函数 (近似)', expression: '1+1/x+1/x^2+1/x^3', description: '黎曼ζ函数部分和', category: '历史名函数', tags: ['黎曼', 'ζ', '数论'] },
  
  // 概率分布
  { name: '标准正态分布', expression: 'exp(-x^2/2)/sqrt(2*pi)', description: '标准正态分布 PDF', category: '概率分布', tags: ['正态', '高斯', '统计'] },
  { name: '柯西分布', expression: '1/(pi*(1+x^2))', description: '柯西分布 PDF', category: '概率分布', tags: ['柯西', '洛伦兹', '统计'] },
  { name: '逻辑分布', expression: 'exp(-x)/(1+exp(-x))^2', description: '逻辑分布 PDF', category: '概率分布', tags: ['逻辑', '统计'] },
  { name: '拉普拉斯分布', expression: 'exp(-abs(x))/2', description: '拉普拉斯分布 PDF', category: '概率分布', tags: ['拉普拉斯', '统计'] },
  { name: '指数分布', expression: 'x>=0?exp(-x):0', description: '指数分布 PDF', category: '概率分布', tags: ['指数', '统计', '寿命'] },
  { name: '卡方分布 (k=2)', expression: 'x>=0?exp(-x/2)/2:0', description: '卡方分布 PDF', category: '概率分布', tags: ['卡方', '统计'] },
  { name: '瑞利分布', expression: 'x>=0?x*exp(-x^2/2):0', description: '瑞利分布 PDF', category: '概率分布', tags: ['瑞利', '信号'] },
  { name: '麦克斯韦分布', expression: 'x>=0?x^2*exp(-x^2/2)/sqrt(2/pi):0', description: '麦克斯韦分布 PDF', category: '概率分布', tags: ['麦克斯韦', '物理'] },
  { name: '帕累托分布', expression: 'x>=1?1/x^2:0', description: '帕累托分布 PDF', category: '概率分布', tags: ['帕累托', '幂律'] },
  
  // 物理函数
  { name: '简谐运动', expression: 'cos(x)', description: '简谐运动/弹簧振子', category: '物理函数', tags: ['简谐', '振动', '弹簧'] },
  { name: '阻尼振动', expression: 'exp(-0.1*x)*cos(x)', description: '阻尼振动', category: '物理函数', tags: ['阻尼', '振动', '衰减'] },
  { name: '过阻尼', expression: 'exp(-x)-exp(-2*x)', description: '过阻尼振动', category: '物理函数', tags: ['过阻尼', '振动'] },
  { name: '临界阻尼', expression: 'x*exp(-x)', description: '临界阻尼', category: '物理函数', tags: ['临界阻尼', '振动'] },
  { name: '受迫振动', expression: 'cos(x)+0.5*cos(2*x)', description: '受迫振动/拍频', category: '物理函数', tags: ['受迫', '拍频'] },
  { name: '单摆小角度', expression: 'cos(x)', description: '单摆小角度近似', category: '物理函数', tags: ['单摆', '周期'] },
  { name: '引力势能', expression: '-1/(abs(x)+0.1)', description: '引力势能', category: '物理函数', tags: ['引力', '势能'] },
  { name: '弹簧势能', expression: 'x^2/2', description: '弹簧势能', category: '物理函数', tags: ['弹簧', '势能'] },
  { name: '黑体辐射 (近似)', expression: 'x^3/(exp(x)-1)', description: '普朗克黑体辐射', category: '物理函数', tags: ['黑体', '普朗克', '辐射'] },
  { name: '多普勒效应', expression: '1/(1-x)', description: '多普勒因子', category: '物理函数', tags: ['多普勒', '相对论'] },
  { name: '洛伦兹因子', expression: '1/sqrt(1-x^2)', description: '洛伦兹因子 γ', category: '物理函数', tags: ['洛伦兹', '相对论'] },
  { name: '库仑势', expression: '1/(abs(x)+0.01)', description: '库仑电势', category: '物理函数', tags: ['库仑', '电势'] },
  { name: '莫尔斯势', expression: '(1-exp(-x))^2', description: '莫尔斯势能', category: '物理函数', tags: ['莫尔斯', '分子'] },
  { name: '克勒尼希-彭尼', expression: 'cos(x)^2', description: '克勒尼希-彭尼模型', category: '物理函数', tags: ['能带', '固体'] },
  
  // 机器学习
  { name: 'Sigmoid', expression: '1/(1+exp(-x))', description: 'Sigmoid激活函数', category: '机器学习', tags: ['激活', '逻辑'] },
  { name: 'Tanh', expression: 'tanh(x)', description: '双曲正切激活', category: '机器学习', tags: ['激活'] },
  { name: 'ReLU', expression: 'max(0,x)', description: 'ReLU激活函数', category: '机器学习', tags: ['激活', '神经网络'] },
  { name: 'Leaky ReLU', expression: 'max(0.1*x,x)', description: 'Leaky ReLU激活', category: '机器学习', tags: ['激活', '神经网络'] },
  { name: 'ELU', expression: 'x>=0?x:exp(x)-1', description: 'ELU激活函数', category: '机器学习', tags: ['激活', '神经网络'] },
  { name: 'Swish', expression: 'x/(1+exp(-x))', description: 'Swish激活函数', category: '机器学习', tags: ['激活', '搜索'] },
  { name: 'GELU (近似)', expression: '0.5*x*(1+tanh(sqrt(2/pi)*(x+0.044715*x^3)))', description: 'GELU激活近似', category: '机器学习', tags: ['激活', 'Transformer'] },
  { name: 'Mish', expression: 'x*tanh(log(1+exp(x)))', description: 'Mish激活函数', category: '机器学习', tags: ['激活'] },
  { name: 'Softplus', expression: 'log(1+exp(x))', description: 'Softplus激活', category: '机器学习', tags: ['激活', '平滑'] },
  { name: 'Softsign', expression: 'x/(1+abs(x))', description: 'Softsign激活', category: '机器学习', tags: ['激活'] },
  { name: '高斯RBF', expression: 'exp(-x^2)', description: '高斯径向基函数', category: '机器学习', tags: ['RBF', '核函数'] },
  { name: '多二次RBF', expression: 'sqrt(1+x^2)', description: '多二次径向基', category: '机器学习', tags: ['RBF', '核函数'] },
];

export const COORDINATE_PRESETS = [
  { name: '默认', xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
  { name: '大范围', xMin: -50, xMax: 50, yMin: -50, yMax: 50 },
  { name: '小范围', xMin: -5, xMax: 5, yMin: -5, yMax: 5 },
  { name: '第一象限', xMin: -1, xMax: 10, yMin: -1, yMax: 10 },
  { name: '三角函数', xMin: -2 * Math.PI, xMax: 2 * Math.PI, yMin: -2, yMax: 2 },
  { name: '极坐标', xMin: -15, xMax: 15, yMin: -15, yMax: 15 },
  { name: '统计分布', xMin: -4, xMax: 4, yMin: -0.5, yMax: 1.5 },
];
