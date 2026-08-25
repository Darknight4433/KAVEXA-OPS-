import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function findNodeModulePath(pkgName: string): string {
  const possiblePaths = [
    path.resolve(__dirname, 'node_modules', pkgName),
    path.resolve(__dirname, '../../node_modules', pkgName),
    path.resolve(__dirname, '../../packages/firebase/node_modules', pkgName)
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return path.resolve(__dirname, 'node_modules', pkgName);
}

const firebasePath = findNodeModulePath('firebase');

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
      'firebase/app': path.join(firebasePath, 'app'),
      'firebase/auth': path.join(firebasePath, 'auth'),
      'firebase/firestore': path.join(firebasePath, 'firestore'),
      'firebase/analytics': path.join(firebasePath, 'analytics'),
      'firebase': firebasePath
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
