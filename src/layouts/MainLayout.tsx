import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  const navItems = [
    { path: '/', label: '可视化', icon: '📊' },
    { path: '/gallery', label: '函数库', icon: '📚' },
    { path: '/settings', label: '设置', icon: '⚙️' },
    { path: '/about', label: '关于', icon: 'ℹ️' },
  ];

  return (
    <div className="min-h-screen bg-surface-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 text-surface-600 hover:text-surface-800 hover:bg-surface-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-surface-800 leading-none">
                    Func<span className="text-primary-600">Viz</span>
                  </h1>
                  <p className="text-[10px] text-surface-500">函数可视化工具</p>
                </div>
              </Link>
            </div>
            
            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-surface-600 hover:bg-surface-100 hover:text-surface-800'
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Right side */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-green-100 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] font-medium text-green-700">就绪</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={toggleSidebar} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="p-4 border-b border-surface-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-surface-800">
                    Func<span className="text-primary-600">Viz</span>
                  </h1>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={toggleSidebar}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-surface-600 hover:bg-surface-100 hover:text-surface-800'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-surface-200 bg-white mt-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-1 text-xs text-surface-500">
            <p>© 2026 FuncViz</p>
            <div className="flex items-center gap-3">
              <span>React + TypeScript + Zustand</span>
              <span className="text-surface-300">•</span>
              <span>v2.1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
