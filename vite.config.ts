import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './',
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
});
