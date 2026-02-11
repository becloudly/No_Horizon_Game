import { defineConfig } from 'electron-vite';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts')
        }
      },
      outDir: 'dist/main'
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts')
        }
      },
      outDir: 'dist/preload'
    }
  },
  renderer: {
    root: 'src/renderer',
    publicDir: '../assets',
    plugins: [
      tailwindcss()
    ],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html')
        }
      },
      outDir: 'dist/renderer'
    }
  }
});
