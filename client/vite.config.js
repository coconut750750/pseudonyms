import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const backend = 'http://localhost:5000';

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 3000,
    proxy: {
      '/register/': backend,
      '/game/': backend,
      '/socket.io': { target: backend, ws: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
