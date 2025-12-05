import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
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
        fs: {
            allow: [resolve(__dirname, '..')]
        }
    }
});
