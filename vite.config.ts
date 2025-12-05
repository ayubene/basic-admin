import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // 本地调试 srit-basic-components，直接指向源码
      'srit-basic-components': resolve(__dirname, '../basic-components/src')
    }
  },
  server: {
    port: 5174,
    // 允许从 sibling 目录加载源码
    fs: {
      allow: [resolve(__dirname, '..')]
    },
    proxy: {
      '/system': {
        target: 'http://10.1.23.80:8082/shiye-retail',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})
