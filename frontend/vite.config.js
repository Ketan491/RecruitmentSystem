import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },

  build: {
    // Split chunks by route for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk — rarely changes so browser can cache it long-term
          vendor:    ['react', 'react-dom', 'react-router-dom'],
          animation: ['framer-motion', 'gsap', '@gsap/react', 'lenis'],
          charts:    ['recharts'],
        },
      },
    },
    // Warn on chunks > 500 KB
    chunkSizeWarningLimit: 500,
  },
})
