import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type AccentColor = 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'pink';

interface ThemeStore {
  theme: Theme;
  accentColor: AccentColor;
  isDarkMode: boolean;
  
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleTheme: () => void;
  updateSystemPreference: () => void;
}

const getSystemDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      accentColor: 'blue',
      isDarkMode: getSystemDarkMode(),
      
      setTheme: (theme: Theme) => {
        const isDark = theme === 'dark' || (theme === 'system' && getSystemDarkMode());
        set({ theme, isDarkMode: isDark });
        document.documentElement.classList.toggle('dark', isDark);
      },
      
      setAccentColor: (color: AccentColor) => {
        set({ accentColor: color });
        document.documentElement.setAttribute('data-accent', color);
      },
      
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },
      
      updateSystemPreference: () => {
        const { theme } = get();
        if (theme === 'system') {
          const isDark = getSystemDarkMode();
          set({ isDarkMode: isDark });
          document.documentElement.classList.toggle('dark', isDark);
        }
      },
    }),
    {
      name: 'funcviz-theme',
      partialize: (state) => ({
        theme: state.theme,
        accentColor: state.accentColor,
      }),
    }
  )
);
