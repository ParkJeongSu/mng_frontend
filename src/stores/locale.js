import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import i18n from '@/plugins/i18n' // i18n 인스턴스 직접 가져오기

export const useLocaleStore = defineStore('locale', () => {
  // 1. State: localStorage에 저장된 언어가 있으면 가져오고, 없으면 'ko'를 기본값으로 사용
  const locale = ref(localStorage.getItem('locale') || 'ko')

  // 2. Action: 언어를 변경하는 함수
  function setLocale(newLocale) {
    locale.value = newLocale
  }

  // 3. Side Effect: locale 상태가 변경될 때마다 localStorage와 i18n 인스턴스를 업데이트
  watch(locale, (newLocale) => {
    localStorage.setItem('locale', newLocale) // localStorage에 저장
    i18n.global.locale.value = newLocale // i18n 라이브러리의 현재 언어 변경
    console.log(`언어가 ${newLocale}(으)로 변경되었습니다.`)
  })

  // 최초 로드 시 i18n 인스턴스의 언어를 스토어의 현재 언어로 설정
  i18n.global.locale.value = locale.value

  return { locale, setLocale }
})
