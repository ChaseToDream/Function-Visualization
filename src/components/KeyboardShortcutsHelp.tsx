import React from 'react';
import { SHORTCUTS } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  onClose: () => void;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-large p-6 max-w-md w-full mx-4 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-surface-900">键盘快捷键</h2>
            <p className="text-sm text-surface-500 mt-0.5">提高操作效率</p>
          </div>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600 transition-colors duration-200 p-1 hover:bg-surface-100 rounded-lg"
            aria-label="关闭"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-2">
          {SHORTCUTS.map((shortcut, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-3 px-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors"
            >
              <span className="text-sm text-surface-700">{shortcut.description}</span>
              <div className="flex gap-1.5">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2.5 py-1 text-xs font-mono font-medium bg-white text-surface-700 border border-surface-200 rounded-lg shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full btn-primary text-sm"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(KeyboardShortcutsHelp);
