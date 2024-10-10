import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import postcss from './postcss.config.cjs'
import { fileURLToPath, URL } from 'node:url'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  css: {
    postcss
  },
  resolve: {
    alias: [
      { find: "@", replacement: fileURLToPath(new URL('./src', import.meta.url)) }
    ]
  }
})
