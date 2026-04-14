# 部署指南：数学函数可视化网站到Cloudflare Pages

## 前提条件

- 一个Cloudflare账户
- 一个GitHub仓库，包含本项目代码

## 部署步骤

### 1. 登录Cloudflare控制台

访问 [Cloudflare控制台](https://dash.cloudflare.com/) 并登录您的账户。

### 2. 创建Pages项目

1. 在左侧导航栏中，点击 "Pages"。
2. 点击 "创建项目" 按钮。
3. 选择 "连接到Git" 选项。

### 3. 连接GitHub仓库

1. 选择GitHub作为代码源。
2. 授权Cloudflare访问您的GitHub账户。
3. 选择包含本项目代码的仓库。
4. 点击 "开始设置" 按钮。

### 4. 配置构建设置

在 "构建设置" 部分，配置以下参数：

- **构建命令**：`npm run build`
- **构建输出目录**：`dist`
- **根目录**：`/` (默认)

### 5. 部署项目

1. 点击 "保存并部署" 按钮。
2. Cloudflare Pages将开始构建和部署您的项目。
3. 部署完成后，您将获得一个唯一的Cloudflare Pages域名，例如 `function-visualization.pages.dev`。

## 部署后的操作

### 自定义域名（可选）

如果您想使用自定义域名访问您的网站：

1. 在Cloudflare Pages项目的 "自定义域" 标签页中，点击 "设置自定义域" 按钮。
2. 输入您的自定义域名，例如 `function-visualization.example.com`。
3. 按照Cloudflare的指示，更新您的DNS记录。

### 自动部署

Cloudflare Pages默认会在您向GitHub仓库推送代码时自动构建和部署项目。这意味着您可以通过简单地推送代码来更新您的网站。

## 故障排除

如果部署过程中遇到问题：

1. 检查构建日志，查看是否有错误信息。
2. 确保您的构建命令和输出目录配置正确。
3. 确保您的项目能够在本地成功构建 (`npm run build`)。
4. 查看Cloudflare Pages的 [官方文档](https://developers.cloudflare.com/pages/) 获取更多帮助。