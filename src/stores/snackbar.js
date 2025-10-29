import { defineStore } from 'pinia'
import { ref } from 'vue'

// (사용자님 선호도에 맞춰 람다식 없는 setup 구문 사용)
export const useSnackbarStore = defineStore('snackbar', function () {
  // 1. 상태 (State)
  const show = ref(false)
  const message = ref('')
  const color = ref('success') // 'success', 'error', 'info' 등
  const timeout = ref(3000) // 알람창이 떠 있는 시간 (3초)

  // 2. 액션 (Actions)
  /**
   * 스낵바를 표시하는 공통 함수
   * @param {string} msg - 표시할 메시지
   * @param {string} [clr='success'] - 스낵바 색상 ('success' 또는 'error')
   */
  function showSnackbar(msg, clr) {
    message.value = msg
    color.value = clr || 'success' // 기본값 success
    show.value = true
  }

  // 3. 반환
  return {
    show,
    message,
    color,
    timeout,
    showSnackbar,
  }
})
