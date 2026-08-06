import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    // Split CSS per chunk so only the active route's CSS blocks render
    cssCodeSplit: true,
    // Remove the modulepreload polyfill (~1.6 kB) — not needed on modern browsers
    modulePreload: { polyfill: false },
    // Skip gzip size reporting to speed up CI builds (no runtime effect)
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // Granular vendor code splitting to keep JS chunks lean and avoid monolithic vendor execution
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-router-dom/') || id.includes('node_modules/react-router/')) {
            return 'router-vendor';
          }
          if (id.includes('node_modules/lenis/')) {
            return 'lenis-vendor';
          }
          if (id.includes('node_modules/@vercel/')) {
            return 'analytics-vendor';
          }
        }
      }
    }
  }
})
