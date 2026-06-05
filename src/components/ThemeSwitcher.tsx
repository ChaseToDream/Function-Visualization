import React from 'react';
import { useThemeStore, AccentColor } from '../stores/themeStore';

const accentColors: { name: AccentColor; color: string; label: string }[] = [
  { name: 'blue', color: '#3b82f6', label: '蓝色' },
  { name: 'purple', color: '#8b5cf6', label: '紫色' },
  { name: 'green', color: '#22c55e', label: '绿色' },
  { name: 'red', color: '#ef4444', label: '红色' },
  { name: 'orange', color: '#f97316', label: '橙色' },
  { name: 'pink', color: '#ec4899', label: '粉色' },
];

const ThemeSwitcher: React.FC = () => {
  const { theme, accentColor, setTheme, setAccentColor, toggleTheme } = useThemeStore();

  return (
    <div className="space-y-4">
      {/* Theme Mode */}
      <div>
        <div className="text-xs font-medium text-surface-500 mb-2">主题模式</div>
        <div className="grid grid-cols-3 gap-2">
          {(['light', 'system', 'dark'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setTheme(mode)}
              className={`p-2 text-xs rounded-lg border transition-all ${
                theme === mode
                  ? 'bg-primary-50 border-primary-200 text-primary-700 font-medium'
                  : 'bg-surface-50 border-surface-100 text-surface-600 hover:bg-surface-100'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                {mode === 'light' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                )}
                {mode === 'system' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                {mode === 'dark' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
                <span>{mode === 'light' ? '浅色' : mode === 'dark' ? '深色' : '跟随系统'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Toggle */}
      <div>
        <button
          onClick={toggleTheme}
          className="btn-secondary w-full gap-2"
        >
          {theme === 'dark' ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
              切换到浅色模式
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              切换到深色模式
            </>
          )}
        </button>
      </div>

      {/* Accent Color */}
      <div>
        <div className="text-xs font-medium text-surface-500 mb-2">主题色</div>
        <div className="flex gap-2">
          {accentColors.map(({ name, color, label }) => (
            <button
              key={name}
              onClick={() => setAccentColor(name)}
              className={`w-8 h-8 rounded-full transition-all ${
                accentColor === name
                  ? 'ring-2 ring-offset-2 ring-offset-white scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ 
                backgroundColor: color,
                boxShadow: accentColor === name ? `0 0 0 2px white, 0 0 0 4px ${color}` : undefined
              }}
              title={label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
