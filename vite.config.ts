import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
       '/api': {
         target: 'http://127.0.0.1:5000',
         changeOrigin: true,
         secure: false,
         rewrite: (path) => path.replace(/^\/api/, '/api'),
       },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './src/main.ts',
        app: './src/App.jsx'
      }
    }
  }
});
