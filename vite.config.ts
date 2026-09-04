import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: { port: 3100, host: '0.0.0.0' },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
    // react-three/fiber is a custom renderer: if anything resolves a second copy
    // of React, every one of its hooks throws "Invalid hook call". Pinning one
    // instance makes that failure mode impossible rather than intermittent.
    dedupe: ['react', 'react-dom', 'three'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep the 3D layer out of the critical bundle (brief 12.5).
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
