import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  onAddFunction?: () => void;
  onClearAll?: () => void;
  onToggleFullscreen?: () => void;
  onExportPNG?: () => void;
  onExportSVG?: () => void;
  onUndo?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      if (isCtrlOrCmd && event.key === 'Enter') {
        event.preventDefault();
        shortcuts.onAddFunction?.();
      }

      if (isCtrlOrCmd && event.key === 'Delete') {
        event.preventDefault();
        shortcuts.onClearAll?.();
      }

      if (event.key === 'F11') {
        event.preventDefault();
        shortcuts.onToggleFullscreen?.();
      }

      if (isCtrlOrCmd && event.key === 'p') {
        event.preventDefault();
        shortcuts.onExportPNG?.();
      }

      if (isCtrlOrCmd && event.key === 's') {
        event.preventDefault();
        shortcuts.onExportSVG?.();
      }

      if (isCtrlOrCmd && event.key === 'z') {
        event.preventDefault();
        shortcuts.onUndo?.();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export const SHORTCUTS = [
  { keys: ['Ctrl', 'Enter'], description: '添加函数' },
  { keys: ['Ctrl', 'Delete'], description: '清空所有函数' },
  { keys: ['F11'], description: '切换全屏' },
  { keys: ['Ctrl', 'P'], description: '导出 PNG' },
  { keys: ['Ctrl', 'S'], description: '导出 SVG' },
  { keys: ['Ctrl', 'Z'], description: '撤销' },
];