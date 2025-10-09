// src/stores/auth.js
import { ref,computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'; // 1. jwt-decode 임포트
import router from '@/router' // 라우터를 import 합니다.

export const useAuthStore = defineStore('auth', () => {
  // State: 사용자가 로그인했는지 여부를 저장
  const token = ref(localStorage.getItem('accessToken') || null);
  const email = ref(null);

  // 앱 로드 시 토큰이 있다면 이메일을 바로 설정해줍니다.
  if (token.value) {
    const decoded = jwtDecode(token.value);
    email.value = decoded.sub; // 'sub' 클레임에 이메일이 저장되어 있습니다.
  }
  const isAuthenticated = computed(() => !!token.value);
  // 2. action: 토큰을 설정할 때 Pinia 와 localStorage 에 동시에 저장
  function setToken(newToken) {
    if (newToken) {
      // 토큰 저장
      token.value = newToken;
      localStorage.setItem('accessToken', newToken);

      // 토큰에서 이메일 정보 추출하여 저장
      const decoded = jwtDecode(newToken);
      email.value = decoded.sub;
    } else {
      // 토큰 제거 (로그아웃)
      token.value = null;
      email.value = null;
      localStorage.removeItem('accessToken');
    }
  }

  function logout() {
    token.value = null
    email.value = null
    localStorage.removeItem('accessToken')
    // 로그아웃하면 로그인 페이지로 보냅니다.
    router.push('/login')
  }

  return { token,email,isAuthenticated, logout,setToken }
})
