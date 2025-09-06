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
// server: {
//     proxy: {
//       '/api': {
//         target: 'https://api.citybik.es/v2/networks/velobike-moscow',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//         secure: false,
//       },
//     },
//   },
});

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
