import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Biarkan IDX mengakses server
    port: 5173, // Atur sesuai kebutuhan
  }
});
