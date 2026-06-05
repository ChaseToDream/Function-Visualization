import React, { useRef } from 'react';
import { useFunctionStore } from '../stores/functionStore';
import { useUIStore } from '../stores/uiStore';
import { exportAsJSON, exportAsCSV, importFromJSON } from '../utils/export';

const SettingsPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    functions,
    coordinateRange,
    resetCoordinateRange,
    addFunction,
    clearAllFunctions,
  } = useFunctionStore();
  const { addNotification } = useUIStore();

  const handleExportJSON = () => {
    if (functions.length === 0) {
      addNotification({
        type: 'warning',
        title: '导出失败',
        message: '没有可导出的函数',
      });
      return;
    }
    exportAsJSON(functions, coordinateRange);
    addNotification({
      type: 'success',
      title: '导出成功',
      message: '已导出为 JSON 文件',
    });
  };

  const handleExportCSV = () => {
    if (functions.length === 0) {
      addNotification({
        type: 'warning',
        title: '导出失败',
        message: '没有可导出的函数',
      });
      return;
    }
    exportAsCSV(functions);
    addNotification({
      type: 'success',
      title: '导出成功',
      message: '已导出为 CSV 文件',
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromJSON(file);
      clearAllFunctions();
      data.functions.forEach((func) => {
        addFunction(func.expression);
      });
      addNotification({
        type: 'success',
        title: '导入成功',
        message: `已导入 ${data.functions.length} 个函数`,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: '导入失败',
        message: '文件格式无效',
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-surface-900 mb-2">设置</h1>
        <p className="text-sm text-surface-500 mb-6">管理应用设置和数据</p>

        {/* Export Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-surface-800 mb-4">数据导出</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleExportJSON}
              className="btn-secondary gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              导出 JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="btn-secondary gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              导出 CSV
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-surface-800 mb-4">数据导入</h2>
          <div className="border-2 border-dashed border-surface-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="cursor-pointer"
            >
              <svg className="w-10 h-10 mx-auto mb-3 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-surface-600 mb-1">
                点击或拖拽文件到此处
              </p>
              <p className="text-xs text-surface-400">
                支持 JSON 格式
              </p>
            </label>
          </div>
        </div>

        {/* Coordinate Settings */}
        <div>
          <h2 className="text-lg font-semibold text-surface-800 mb-4">坐标设置</h2>
          <button
            onClick={resetCoordinateRange}
            className="btn-secondary gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重置坐标范围
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="card">
        <h2 className="text-lg font-semibold text-surface-800 mb-4">键盘快捷键</h2>
        <div className="space-y-2">
          {[
            { keys: ['Ctrl', 'Enter'], description: '添加函数' },
            { keys: ['Ctrl', 'Delete'], description: '清空所有函数' },
            { keys: ['Ctrl', 'Z'], description: '撤销操作' },
            { keys: ['Ctrl', 'P'], description: '导出 PNG' },
            { keys: ['Ctrl', 'S'], description: '导出 SVG' },
            { keys: ['F11'], description: '切换全屏' },
          ].map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-3 bg-surface-50 rounded-lg"
            >
              <span className="text-sm text-surface-600">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2 py-0.5 text-xs font-mono bg-white text-surface-600 border border-surface-200 rounded"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
