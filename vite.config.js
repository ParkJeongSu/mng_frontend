import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 1. vuetify 플러그인을 import 합니다.
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // 2. plugins 배열에 vuetify()를 추가합니다.
    vuetify(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // '/api' 로 시작하는 요청은 전부 target 으로 프록시해준다.
      '/api': {
        target: 'http://localhost:8081', // Spring 백엔드 서버 주소
        changeOrigin: true, // cross origin 허용
      },
    },
  },
})
