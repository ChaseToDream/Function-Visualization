import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunctionStore } from '../stores/functionStore';
import { useUIStore } from '../stores/uiStore';
import { exportAsJSON, exportAsCSV, importFromJSON } from '../utils/export';
import { COORDINATE_PRESETS } from '../config';
import ThemeSwitcher from '../components/ThemeSwitcher';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    functions,
    coordinateRange,
    resetCoordinateRange,
    updateCoordinateRange,
    addFunction,
    clearAllFunctions,
  } = useFunctionStore();
  const { addNotification } = useUIStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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
      navigate('/');
    } catch (error) {
      addNotification({
        type: 'error',
        title: '导入失败',
        message: '文件格式无效',
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    clearAllFunctions();
    setShowClearConfirm(false);
    addNotification({
      type: 'info',
      title: '已清空',
      message: '所有函数已删除',
    });
  };

  const handleShareLink = () => {
    const params = new URLSearchParams();
    functions.forEach((f) => params.append('f', f.expression));
    params.set('xmin', coordinateRange.xMin.toString());
    params.set('xmax', coordinateRange.xMax.toString());
    params.set('ymin', coordinateRange.yMin.toString());
    params.set('ymax', coordinateRange.yMax.toString());
    
    const url = `${window.location.origin}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      addNotification({
        type: 'success',
        title: '链接已复制',
        message: '可以分享给其他人',
      });
    }).catch(() => {
      addNotification({
        type: 'error',
        title: '复制失败',
        message: '请手动复制链接',
      });
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Data Management */}
      <div className="card">
        <h1 className="text-2xl font-bold text-surface-900 mb-2">设置</h1>
        <p className="text-sm text-surface-500 mb-6">管理应用设置和数据</p>

        {/* Export Section */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-surface-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            数据导出
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onClick={handleExportJSON} className="btn-secondary gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              导出 JSON
            </button>
            <button onClick={handleExportCSV} className="btn-secondary gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              导出 CSV
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-surface-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            数据导入
          </h2>
          <div className="border-2 border-dashed border-surface-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file" className="cursor-pointer">
              <svg className="w-10 h-10 mx-auto mb-3 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-surface-600 mb-1">点击或拖拽文件到此处</p>
              <p className="text-xs text-surface-400">支持 JSON 格式</p>
            </label>
          </div>
        </div>

        {/* Share Section */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-surface-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            分享配置
          </h2>
          <button onClick={handleShareLink} className="btn-secondary gap-2 w-full">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            复制分享链接
          </button>
        </div>

        {/* Clear Data */}
        <div>
          <h2 className="text-base font-semibold text-surface-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            清除数据
          </h2>
          {showClearConfirm ? (
            <div className="p-4 bg-accent-50 border border-accent-200 rounded-xl">
              <p className="text-sm text-accent-700 mb-3">确定要清空所有函数吗？此操作不可撤销。</p>
              <div className="flex gap-2">
                <button onClick={handleClearAll} className="flex-1 btn-danger text-sm">
                  确认清空
                </button>
                <button onClick={() => setShowClearConfirm(false)} className="flex-1 btn-secondary text-sm">
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="btn-danger gap-2 w-full"
              disabled={functions.length === 0}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              清空所有函数 ({functions.length})
            </button>
          )}
        </div>
      </div>

      {/* Coordinate Presets */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          坐标预设
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COORDINATE_PRESETS.map((preset, index) => (
            <button
              key={index}
              onClick={() => updateCoordinateRange({
                xMin: preset.xMin,
                xMax: preset.xMax,
                yMin: preset.yMin,
                yMax: preset.yMax,
              })}
              className="p-3 text-left bg-surface-50 border border-surface-100 rounded-xl hover:bg-primary-50 hover:border-primary-200 transition-colors"
            >
              <div className="text-sm font-medium text-surface-800">{preset.name}</div>
              <div className="text-[10px] text-surface-400 mt-0.5">
                [{preset.xMin}, {preset.xMax}] × [{preset.yMin}, {preset.yMax}]
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={resetCoordinateRange}
          className="btn-secondary gap-2 w-full mt-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重置为默认
        </button>
      </div>

      {/* Theme Settings */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          外观设置
        </h2>
        <ThemeSwitcher />
      </div>

      {/* Keyboard Shortcuts */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          </svg>
          键盘快捷键
        </h2>
        <div className="space-y-1.5">
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
                    className="px-2 py-0.5 text-[11px] font-mono bg-white text-surface-600 border border-surface-200 rounded"
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
