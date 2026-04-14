const CACHE_NAME = 'function-visualization-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/index-DnX5kRmw.css',
  '/assets/index-CZO0N16O.js',
  '/assets/vendor-v4ha15EW.js',
  '/assets/plot-Dq2E8QPJ.js',
  '/assets/math-X4nR47y7.js',
  '/vite.svg',
  '/manifest.json'
];

// 安装service worker，缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS);
      })
  );
});

// 激活service worker，清理旧缓存
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截网络请求，优先使用缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});