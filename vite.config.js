import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep the REACT_APP_ prefix from the Create React App days, so REACT_APP_API_BASE still works.
  envPrefix: ['VITE_', 'REACT_APP_'],
  server: { port: 3000 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
