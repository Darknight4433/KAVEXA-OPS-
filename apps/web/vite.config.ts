import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@kavexa/shared-types': path.resolve(__dirname, '../../packages/shared-types/src/index.ts'),
      '@kavexa/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts'),
      '@kavexa/intelligence': path.resolve(__dirname, '../../packages/intelligence/src/index.ts'),
      '@kavexa/firebase': path.resolve(__dirname, '../../packages/firebase/src/index.ts'),
      'firebase/app': path.resolve(__dirname, 'node_modules/firebase/app'),
      'firebase/auth': path.resolve(__dirname, 'node_modules/firebase/auth'),
      'firebase/firestore': path.resolve(__dirname, 'node_modules/firebase/firestore'),
      'firebase/analytics': path.resolve(__dirname, 'node_modules/firebase/analytics'),
      'firebase': path.resolve(__dirname, 'node_modules/firebase')
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
