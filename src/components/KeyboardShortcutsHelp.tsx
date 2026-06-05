import React, { useEffect, useRef } from 'react';
import { SHORTCUTS } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  onClose: () => void;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    firstElement?.focus();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-surface-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl p-5 max-w-sm w-full mx-4 animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 id="shortcuts-title" className="text-base font-bold text-surface-900">键盘快捷键</h2>
            <p className="text-[11px] text-surface-400 mt-0.5">提高操作效率</p>
          </div>
          <button
            onClick={onClose}
            className="text-surface-300 hover:text-surface-500 transition-colors duration-150 p-1 hover:bg-surface-50 rounded-lg"
            aria-label="关闭"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-1.5">
          {SHORTCUTS.map((shortcut, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-2.5 px-3 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors duration-150"
            >
              <span className="text-[13px] text-surface-600">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2 py-0.5 text-[11px] font-mono font-medium bg-white text-surface-600 border border-surface-200 rounded-md shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full btn-primary text-[13px] py-2.5"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(KeyboardShortcutsHelp);
