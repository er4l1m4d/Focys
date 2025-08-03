import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import inject from '@rollup/plugin-inject';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      events: 'events',
      buffer: 'buffer',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['@irys/sdk', 'zustand', '@tanstack/react-query'],
        },
      },
      plugins: [
        inject({
          Buffer: ['buffer', 'Buffer'],
          process: 'process',
        }),
      ],
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    include: ['@irys/sdk', 'react', 'react-dom', 'react-router-dom', 'buffer'],
  },
});
