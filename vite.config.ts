/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        /**
         * The motion layer is app-level (cursor, page transition, footer), so
         * it can no longer live inside a lazy page chunk. Splitting the
         * long-lived dependencies out keeps them downloading in parallel and,
         * more importantly, keeps them in the browser cache across deploys —
         * only the app code has to be re-fetched when we ship a change.
         */
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
