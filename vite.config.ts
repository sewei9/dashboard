import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: './',
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  build: {
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
  },
  plugins: [react(), tsconfigPaths()],
  define: {
    'process.env': {
      AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
      AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
      AZURE_REDIRECT_URI: process.env.AZURE_REDIRECT_URI,
    },
  },
});