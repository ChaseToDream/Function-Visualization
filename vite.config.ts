import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
            if (id.includes('function-plot') || id.includes('d3')) {
              return 'plot';
            }
            if (id.includes('mathjs')) {
              return 'math';
            }
            if (id.includes('zustand')) {
              return 'state';
            }
            if (id.includes('katex')) {
              return 'katex';
            }
            if (id.includes('file-saver') || id.includes('papaparse')) {
              return 'export';
            }
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'es2015',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'zustand', 'function-plot', 'mathjs'],
  },
})
