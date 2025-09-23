// src/plugins/vuetify.js

// Styles
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // 아이콘 사용을 위해 추가

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  // 이 부분을 추가해주세요!
  theme: {
    defaultTheme: 'light', // 기본 테마를 'light'로 설정
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2', // 파란색 계열
          secondary: '#424242',
        },
      },
    },
  },
})
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
