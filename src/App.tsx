import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Notification from './components/Notification';
import ErrorBoundary from './components/ErrorBoundary';

const VisualizationPage = lazy(() => import('./pages/VisualizationPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="text-sm text-surface-500">加载中...</span>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ErrorBoundary>
                    <VisualizationPage />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="gallery"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ErrorBoundary>
                    <GalleryPage />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ErrorBoundary>
                    <SettingsPage />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="about"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ErrorBoundary>
                    <AboutPage />
                  </ErrorBoundary>
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </ErrorBoundary>
      <Notification />
    </BrowserRouter>
  );
}

export default App;
