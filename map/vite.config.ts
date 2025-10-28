import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.VITE_APP_BASE_PATH || '/map/';

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
});
