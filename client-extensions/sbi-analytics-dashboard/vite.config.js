import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build/static',
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        assetFileNames: 'main.[ext]',
        inlineDynamicImports: true
      }
    }
  }
});