# 数学函数可视化

一个使用 React + TypeScript + Vite 构建的数学函数可视化工具。

## 功能特性

- 支持数学函数表达式输入（如 sin(x)、x^2、exp(x) 等）
- 实时函数图像绘制
- 多函数同时显示，自动分配颜色
- 坐标轴范围自定义
- 函数预设快速选择
- 图像导出（PNG/SVG）
- 响应式设计，支持移动端
- 数据本地持久化

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- mathjs（数学计算）
- function-plot（函数绘图）

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm run test
```

### 运行测试并生成覆盖率报告

```bash
npm run test:coverage
```

### 代码格式化

```bash
npm run format
```

### 代码检查

```bash
npm run lint
```

## 项目结构

```
src/
├── components/          # React 组件
│   ├── Controls.tsx     # 坐标控制组件
│   ├── FunctionInput.tsx # 函数输入组件
│   ├── FunctionList.tsx # 函数列表组件
│   └── Graph.tsx        # 函数图像组件
├── config/              # 配置文件
│   └── index.ts         # 颜色、符号、预设等配置
├── types/               # TypeScript 类型定义
│   └── index.ts         # 接口定义
├── utils/               # 工具函数
│   └── math.ts          # 数学计算工具
├── test/                # 测试配置
│   └── setup.ts         # 测试环境设置
├── App.tsx              # 主应用组件
├── main.tsx             # 应用入口
└── index.css            # 全局样式
```

## 部署

### Cloudflare Pages

1. 将代码推送到 GitHub 仓库
2. 在 Cloudflare Pages 中创建新项目
3. 连接 GitHub 仓库
4. 配置构建设置：
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`
5. 部署项目

### 自定义域名

在 Cloudflare Pages 项目设置中添加自定义域名，并按照指示更新 DNS 记录。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT