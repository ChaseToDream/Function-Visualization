# 数学函数可视化

一个现代化的数学函数可视化工具，支持实时函数图像绘制、多函数对比和交互式操作。

## 功能特性

### 核心功能

- **函数表达式输入** - 支持多种数学函数（sin、cos、tan、exp、log、sqrt 等）
- **实时图像绘制** - 输入即渲染，流畅的交互体验
- **多函数对比** - 同一坐标系中显示多个函数，自动分配颜色
- **坐标轴自定义** - 灵活调整 X/Y 轴范围
- **预设函数库** - 内置常用数学函数，一键添加
- **图像导出** - 支持导出 PNG 和 SVG 格式

### 交互功能

- **实时验证** - 输入时自动验证表达式，即时反馈错误
- **键盘快捷键** - 提高操作效率
- **撤销/重做** - 支持操作历史回溯
- **数据持久化** - 本地存储，刷新不丢失

### 用户体验

- **响应式设计** - 完美适配桌面和移动端
- **深色模式** - 护眼设计（即将推出）
- **无障碍支持** - ARIA 标签，键盘导航

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 18 |
| 类型系统 | TypeScript |
| 构建工具 | Vite |
| 样式方案 | Tailwind CSS |
| 数学计算 | mathjs |
| 函数绘图 | function-plot |
| 测试框架 | Vitest |

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/function-visualization.git

# 进入项目目录
cd function-visualization

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 打开浏览器访问 http://localhost:5173
```

### 构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 开发指南

### 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run test` | 运行测试（监听模式） |
| `npm run test:run` | 运行测试（单次） |
| `npm run test:coverage` | 生成测试覆盖率报告 |
| `npm run lint` | 代码检查 |
| `npm run format` | 代码格式化 |

### 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + Enter` | 添加函数 |
| `Ctrl + Delete` | 清空所有函数 |
| `Ctrl + Z` | 撤销操作 |
| `Ctrl + P` | 导出 PNG |
| `Ctrl + S` | 导出 SVG |
| `F11` | 切换全屏 |

## 项目结构

```
src/
├── components/              # React 组件
│   ├── Controls.tsx         # 坐标控制组件
│   ├── FunctionInput.tsx    # 函数输入组件
│   ├── FunctionList.tsx     # 函数列表组件
│   ├── Graph.tsx            # 函数图像组件
│   └── KeyboardShortcutsHelp.tsx  # 快捷键帮助
├── config/                  # 配置文件
│   └── index.ts             # 颜色、符号、预设配置
├── hooks/                   # 自定义 Hooks
│   ├── useCoordinateRange.ts # 坐标范围管理
│   ├── useFunctions.ts      # 函数列表管理
│   ├── useHistory.ts        # 历史记录（撤销/重做）
│   ├── useKeyboardShortcuts.ts # 快捷键处理
│   ├── useLocalStorage.ts   # 本地存储抽象
│   └── useValidation.ts     # 输入验证
├── types/                   # TypeScript 类型
│   └── index.ts             # 接口定义
├── utils/                   # 工具函数
│   ├── debounce.ts          # 防抖/节流
│   └── math.ts              # 数学计算
├── test/                    # 测试配置
│   └── setup.ts             # 测试环境
├── App.tsx                  # 主应用
├── main.tsx                 # 入口文件
└── index.css                # 全局样式
```

## 架构设计

### 状态管理

采用自定义 Hooks 模式，实现关注点分离：

```
App.tsx
  ├── useFunctions()      # 函数列表状态
  ├── useCoordinateRange() # 坐标范围状态
  └── useKeyboardShortcuts() # 快捷键处理
```

### 性能优化

- **表达式缓存** - 编译后的表达式缓存复用
- **组件 memo** - React.memo 防止无效重渲染
- **防抖处理** - 窗口 resize 等事件防抖
- **useMemo/useCallback** - 计算密集型操作优化

### 数据流

```
用户输入 → 验证 → 添加到列表 → 更新图像
                ↓
            本地存储（持久化）
```

## 测试

项目包含 32 个测试用例，覆盖核心功能：

```bash
# 运行测试
npm run test

# 生成覆盖率报告
npm run test:coverage
```

### 测试覆盖

- 配置模块
- 工具函数（数学计算、防抖）
- 组件渲染和交互
- 自定义 Hooks

## 部署

### Cloudflare Pages

1. 推送代码到 GitHub
2. 在 Cloudflare Pages 创建项目
3. 连接 GitHub 仓库
4. 配置构建：
   - 构建命令：`npm run build`
   - 输出目录：`dist`
5. 部署完成

### Vercel

```bash
npm i -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

## 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 开发规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 编写单元测试
- 提交前运行 `npm run lint` 和 `npm run test`

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 致谢

- [mathjs](https://mathjs.org/) - 强大的数学计算库
- [function-plot](https://mauriciopoppe.github.io/function-plot/) - 函数绘图库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
