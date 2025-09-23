// src/main.js

// 1. Vuetify와 관련된 모든 것을 최상단으로 옮깁니다.
import 'vuetify/styles' // Vuetify의 기본 스타일
import vuetify from './plugins/vuetify' // Vuetify 설정

// 2. Vue와 App, Router 등 핵심 라이브러리를 import 합니다.
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 3. 우리만의 커스텀 CSS는 가장 마지막에 import 합니다.
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify) // Vuetify 플러그인을 Vue 앱에 등록합니다.

app.mount('#app')
