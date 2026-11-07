import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

// HTTPS is required for WebXR on phones. `npm run dev` serves the client with a
// self-signed certificate on your network and proxies /ws to the game server.
export default defineConfig(({ mode }) => ({
  plugins: process.env.NO_SSL ? [] : [basicSsl()],
  server: {
    host: true,
    port: 5173,
    proxy: { '/ws': { target: 'ws://localhost:8787', ws: true } },
  },
  build: { outDir: 'dist', target: 'es2022' },
  base: mode === 'pages' ? './' : '/',
}));
