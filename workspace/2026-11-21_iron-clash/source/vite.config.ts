import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  build: { target: 'es2020', chunkSizeWarningLimit: 8000, assetsInlineLimit: 100000000 },
});
