# 数学符号功能设计文档

## 1. 项目背景

当前项目是一个数学函数可视化工具，允许用户输入函数表达式并在坐标系中绘制函数图像。为了提升用户体验，需要添加数学符号选择功能，便于用户更方便地编辑数学公式。

## 2. 功能需求

### 2.1 数学符号支持
- **基础运算符**：加(+)、减(-)、乘(*)、除(/)、幂(^)、括号(()、[])、逗号(,)
- **三角函数**：sin、cos、tan、asin、acos、atan
- **指数对数**：exp、log、ln、sqrt
- **常量**：π、e
- **其他符号**：绝对值(|x|)、阶乘(!)、分号(;)

### 2.2 符号选择界面
- 使用下拉菜单形式呈现数学符号
- 按基础分类组织符号：运算符、三角函数、指数对数、常量、其他
- 点击符号后自动插入到输入框的光标位置

### 2.3 高级编辑功能
- 括号匹配提示
- 表达式格式化
- 输入验证和错误提示

## 3. 技术实现方案

### 3.1 组件修改
- 在现有的 `FunctionInput` 组件中添加数学符号选择功能
- 保持与现有代码风格和架构的一致性

### 3.2 实现细节

#### 3.2.1 数学符号数据结构
```typescript
interface MathSymbol {
  label: string;        // 显示名称
  value: string;        // 实际插入的符号
  category: string;     // 分类
}

const mathSymbols: MathSymbol[] = [
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
  
  // 指数对数
  { label: 'exp', value: 'exp()', category: '指数对数' },
  { label: 'log', value: 'log()', category: '指数对数' },
  { label: 'ln', value: 'ln()', category: '指数对数' },
  { label: 'sqrt', value: 'sqrt()', category: '指数对数' },
  
  // 常量
  { label: 'π', value: 'pi', category: '常量' },
  { label: 'e', value: 'e', category: '常量' },
  
  // 其他
  { label: '绝对值 |x|', value: 'abs()', category: '其他' },
  { label: '阶乘 !', value: '!', category: '其他' },
  { label: '分号 ;', value: ';', category: '其他' },
];
```

#### 3.2.2 组件实现
- 添加下拉菜单按钮和符号选择列表
- 实现符号点击插入功能，支持光标位置插入
- 添加括号匹配和表达式格式化功能
- 保持现有的函数验证逻辑

### 3.3 用户界面设计
- 在函数输入框旁边添加一个「数学符号」按钮
- 点击按钮展开下拉菜单，按分类显示符号
- 符号按分类分组，每个分类有标题
- 支持搜索符号功能

## 4. 实现步骤

1. **修改 FunctionInput 组件**：
   - 添加数学符号数据和分类
   - 实现下拉菜单 UI
   - 添加符号插入逻辑

2. **添加高级编辑功能**：
   - 实现括号匹配提示
   - 添加表达式格式化功能

3. **测试和优化**：
   - 测试各种符号的插入和验证
   - 优化用户交互体验
   - 确保与现有功能的兼容性

## 5. 预期效果

- 用户可以通过点击下拉菜单中的符号快速插入到函数表达式中
- 支持按分类浏览和选择数学符号
- 提供括号匹配和表达式格式化等高级编辑功能
- 保持与现有功能的无缝集成

## 6. 技术依赖

- 现有技术栈：React、TypeScript、Tailwind CSS、mathjs
- 无需添加新的依赖库

## 7. 实现风险

- 下拉菜单的定位和显示可能需要处理不同屏幕尺寸的适配
- 符号插入时的光标位置计算需要考虑各种输入场景
- 高级编辑功能可能需要额外的状态管理

## 8. 解决方案

- 使用 Tailwind CSS 的响应式设计确保下拉菜单在不同屏幕尺寸下正常显示
- 利用 React 的 useRef 钩子获取输入框的光标位置
- 采用模块化设计，将符号数据和插入逻辑分离，便于维护和扩展