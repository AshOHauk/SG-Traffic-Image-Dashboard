import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
// vite.config.js
export default defineConfig({
  base: '/SG-Traffic-Image-Dashboard/',
  plugins: [solid()],
});
