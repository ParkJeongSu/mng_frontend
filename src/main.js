import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 방금 만든 Vuetify 설정 파일을 import 합니다.
import vuetify from './plugins/vuetify'

import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify) // Vuetify를 앱에 등록합니다.
app.mount('#app')
