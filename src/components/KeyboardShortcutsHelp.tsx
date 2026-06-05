import React from 'react';
import { SHORTCUTS } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  onClose: () => void;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-dark-900/90 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-dark-800 border border-dark-500 rounded-sm shadow-glow p-6 max-w-md w-full mx-4 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-display text-lg tracking-wider text-neon-blue">SHORTCUTS</h2>
            <p className="text-xs font-mono text-gray-500 mt-1">KEYBOARD COMMANDS</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-neon-pink transition-colors duration-200 text-xl"
            aria-label="关闭"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-2">
          {SHORTCUTS.map((shortcut, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-2.5 px-3 bg-dark-700/50 border border-dark-500/30 rounded-sm hover:border-neon-blue/20 transition-colors"
            >
              <span className="text-sm text-gray-300">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2 py-1 text-xs font-mono bg-dark-900 text-neon-blue border border-dark-500 rounded-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-dark-500/50">
          <button
            onClick={onClose}
            className="w-full btn-primary text-xs"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(KeyboardShortcutsHelp);
