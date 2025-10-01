// src/plugins/vuetify.js

// Styles
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // 아이콘 사용을 위해 추가
// 1. 방금 만든 파일에서 아이콘 설정(aliases, mdi)을 가져옵니다.
import { aliases, mdi } from './vuetify-mdi-icons'
// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  // ✅ 여기에 defaults 객체를 추가합니다.
  defaults: {
    // 1. 모든 v-text-field의 기본 props 설정
    VTextField: {
      variant: 'outlined', // 기본 모양을 outlined로
      density: 'compact', // 기본 밀도를 compact로
      color: 'primary',
      // ✅ camelCase로 변경
      hideDetails: 'auto',
    },
    // 2. 모든 v-select의 기본 props 설정
    VSelect: {
      variant: 'outlined',
      density: 'compact',
      color: 'primary',
      // ✅ camelCase로 변경
      hideDetails: 'auto',
    },
    // 3. 모든 v-btn의 기본 props 설정
    VBtn: {
      variant: 'flat', // 기본적으로 그림자 없는 버튼
      // height: 48, // 기본 버튼 높이
      // 기본 색상
      color: 'primary',
    },
    VAppBar: {
      color: 'surface', // 헤더는 항상 surface
      elevation: 1,
    },
    VToolbar: {
      color: 'surface',
      elevation: 1,
    },
    VTabs: {
      color: 'primary', // 인디케이터/활성 라벨
      bgColor: 'surface', // 탭 바 배경
      density: 'comfortable',
    },
    VTab: {
      // 비활성 라벨 톤 다운
      // Vuetify 3에선 class로 on-surface-variants 적용을 권장
      // 여기선 간단히 density만 통일
      density: 'comfortable',
    },
    VDivider: {
      // divider는 기본값 사용 (테마에 따라 자동 대비)
    },
    VDataTable: {
      density: 'compact',
      // hover/selected는 클래스와 CSS vars로 추가 미세조정 권장
    },
    VCard: {
      color: 'surface',
      elevation: 1,
    },
    VDialog: {
      // surface 배경 유지
    },
    VChip: {
      // 필터 칩 등은 tonal + primary 추천
      variant: 'tonal',
      color: 'primary',
      density: 'comfortable',
    },
  },
  // 이 부분을 추가해주세요!
  theme: {
    defaultTheme: 'light', // 기본 테마를 'light'로 설정
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          surface: '#FFFFFF',
          background: '#F5F5F5',
          error: '#FF5252',
          success: '#4CAF50',
          info: '#2196F3',
          warning: '#FB8C00',
        },
      },
      // 2. 새로운 dark 테마 추가
      dark: {
        dark: true, // dark 테마임을 명시! (글자색 등이 자동으로 반전됨)
        colors: {
          // 대비 확보를 위해 primary를 한 톤 더 진하게 권장
          primary: '#1565C0', // or '#1976D2'
          secondary: '#B0BEC5',
          accent: '#FF4081',
          surface: '#121212', // ★ 기존 '#FF4081'는 지양
          background: '#000000',
          error: '#CF6679',
          success: '#66BB6A',
          info: '#2196F3',
          warning: '#FB8C00',
        },
      },
    },
  },
  // 2. icons 설정을 추가합니다.
  // https://pictogrammers.com/library/mdi/
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
