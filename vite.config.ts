import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:math";
          @import "@/globalStyles/variables";
          @import "@/globalStyles/mixins";
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});

