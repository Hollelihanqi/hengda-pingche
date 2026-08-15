import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    UnoCSS(),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
