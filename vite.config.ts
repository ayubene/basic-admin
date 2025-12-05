import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5174,
    proxy: {
      '/system': {
        target: 'http://10.1.23.80:8082/shiye-retail',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})
