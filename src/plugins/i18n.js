import { createI18n } from 'vue-i18n'
import ko from '@/locales/ko.json'
import en from '@/locales/en.json'

const i18n = createI18n({
  legacy: false, // Composition API를 사용하려면 false로 설정
  locale: 'ko', // 기본 언어
  fallbackLocale: 'en', // locale 설정에 문제가 있을 경우 보여질 언어
  messages: {
    ko,
    en,
  },
})

export default i18n
