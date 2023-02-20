import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import manifest from './manifest.json'
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: "public",
  build: {
    chunkSizeWarningLimit: 10240,
    rollupOptions: {
      input: {
        inject: 'src/content-script/ksLiveHelper/inject.ts',
      },
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "scripts/[name].js",
        entryFileNames: "scripts/[name].js"
      }
    },
  },
  plugins: [vue(), crx({ manifest }),],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  }
})