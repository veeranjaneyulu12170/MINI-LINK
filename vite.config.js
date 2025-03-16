import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure assets are properly handled
    assetsInlineLimit: 4096,
    // Copy the public directory to the output directory
    copyPublicDir: true,
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: [],
      output: {
        // Chunk configuration to improve build
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'react-icons']
        }
      },
      // Ensure sourcemaps are generated
      sourcemap: true,
      // Minimize output
      minify: 'terser',
      // Improve chunk loading
      chunkSizeWarningLimit: 1000
    },
    // Ensure proper resolution of dependencies
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        ui: ['framer-motion', 'lucide-react', 'react-icons'],
      },
    },
  },
  optimizeDeps: {
    include: ['axios', 'react', 'react-dom', 'react-router-dom']
  },
  // Ensure proper resolution of dependencies
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
}); 