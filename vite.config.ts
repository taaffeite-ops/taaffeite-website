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
        // Split heavy vendor libs into a separate chunk so the main bundle
        // is smaller and hydrates faster, reducing LCP render delay
        manualChunks(id) {
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/react-router/')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
