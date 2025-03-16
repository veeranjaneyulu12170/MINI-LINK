import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Ensure external dependencies are properly handled
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'react-icons'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['axios'],
  },
  // Ensure proper resolution of dependencies
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}); 