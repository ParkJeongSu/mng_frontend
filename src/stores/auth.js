// src/stores/auth.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router' // 라우터를 import 합니다.

export const useAuthStore = defineStore('auth', () => {
  // State: 사용자가 로그인했는지 여부를 저장
  const isLoggedIn = ref(false)
  const loginError = ref(null)

  // Actions: 상태를 변경하는 함수
  function login(username, password) {
    // 실제로는 여기서 API를 호출해서 아이디/비밀번호를 확인해야 합니다.
    // 지금은 간단하게 아이디와 비밀번호가 입력되면 무조건 성공으로 처리합니다.
    if (username && password) {
      isLoggedIn.value = true
      // 로그인이 성공하면, 사용자를 메인 페이지('/')로 보냅니다.

      //const { token, user } = await login(email.value, password.value)
      // if (remember.value) {
      //   localStorage.setItem('auth_token', token)
      //   localStorage.setItem('auth_user', JSON.stringify(user))
      // } else {
      //   sessionStorage.setItem('auth_token', token)
      //   sessionStorage.setItem('auth_user', JSON.stringify(user))
      // }
      // 로그인 성공 후 이동 (필요에 맞게 변경)
      router.push('/')
    } else {
      loginError.value = '아이디와 비밀번호를 입력하세요.'
    }
  }

  function logout() {
    isLoggedIn.value = false
    loginError.value = null // 로그아웃 시 에러 초기화
    // 로그아웃하면 로그인 페이지로 보냅니다.
    router.push('/login')
  }

  return { isLoggedIn, loginError, login, logout }
})
