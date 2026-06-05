import React from 'react';

const AboutPage: React.FC = () => {
  const techStack = [
    { name: 'React', description: '用户界面库', version: '18.x' },
    { name: 'TypeScript', description: '类型安全', version: '5.x' },
    { name: 'Vite', description: '构建工具', version: '5.x' },
    { name: 'Tailwind CSS', description: '样式框架', version: '3.x' },
    { name: 'Zustand', description: '状态管理', version: '5.x' },
    { name: 'React Router', description: '路由管理', version: '7.x' },
    { name: 'mathjs', description: '数学计算', version: '12.x' },
    { name: 'function-plot', description: '函数绘图', version: '1.x' },
  ];

  const features = [
    '实时函数图像绘制',
    '多函数同时显示',
    '坐标轴范围自定义',
    '函数预设快速选择',
    '图像导出（PNG/SVG）',
    '数据导入/导出（JSON/CSV）',
    '键盘快捷键支持',
    '撤销/重做操作',
    '响应式设计',
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">
            Func<span className="text-primary-600">Viz</span>
          </h1>
          <p className="text-surface-500">数学函数可视化工具</p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="badge">v2.0.0</span>
            <span className="badge-success">稳定版</span>
          </div>
        </div>

        <div className="prose prose-surface max-w-none">
          <p className="text-surface-600 leading-relaxed">
            FuncViz 是一个现代化的数学函数可视化工具，帮助用户直观地理解和探索数学函数。
            支持实时绘制函数图像、多函数对比、坐标轴自定义等功能，让数学学习变得更加生动有趣。
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-surface-900 mb-4">功能特性</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 p-3 bg-surface-50 rounded-lg"
            >
              <svg className="w-5 h-5 text-success-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-surface-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-surface-900 mb-4">技术栈</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
            >
              <div>
                <div className="font-medium text-surface-900">{tech.name}</div>
                <div className="text-xs text-surface-500">{tech.description}</div>
              </div>
              <span className="text-xs font-mono text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                {tech.version}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-surface-900 mb-4">开源许可</h2>
        <p className="text-sm text-surface-600">
          本项目基于 MIT 许可证开源。您可以自由使用、修改和分发本软件。
        </p>
        <div className="mt-4 p-4 bg-surface-50 rounded-lg">
          <pre className="text-xs text-surface-600 font-mono overflow-x-auto">
{`MIT License

Copyright (c) 2026 FuncViz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
