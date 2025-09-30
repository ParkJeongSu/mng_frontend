// src/plugins/vuetify.js

// Styles
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // 아이콘 사용을 위해 추가
// 1. 방금 만든 파일에서 아이콘 설정(aliases, mdi)을 가져옵니다.
import { aliases, mdi } from './vuetify-mdi-icons'
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
  // 2. icons 설정을 추가합니다.
  icons: {
    // 2. 기본 아이콘 세트를 'mdi'로 지정
    defaultSet: 'mdi',
    // 3. 별칭(aliases)을 등록
    aliases,
    // 4. mdi 세트를 등록
    sets: {
      mdi,
    },
  },
})
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
