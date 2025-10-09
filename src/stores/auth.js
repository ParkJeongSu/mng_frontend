// src/stores/auth.js
import { ref,computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'; // 1. jwt-decode 임포트
import router from '@/router' // 라우터를 import 합니다.

export const useAuthStore = defineStore('auth', () => {
  // State: 사용자가 로그인했는지 여부를 저장
  const accessToken = ref(localStorage.getItem('accessToken') || null);
  const refreshToken = ref(localStorage.getItem('refreshToken') || null);
  const email = ref(null);

  // 앱 로드 시 토큰이 있다면 이메일을 바로 설정해줍니다.
  if (accessToken.value) {
    const decoded = jwtDecode(accessToken.value);
    email.value = decoded.sub; // 'sub' 클레임에 이메일이 저장되어 있습니다.
  }
  const isAuthenticated = computed(() => !!accessToken.value);
  // 2. action: 토큰을 설정할 때 Pinia 와 localStorage 에 동시에 저장
  function setTokens(newAccessToken,newRefreshToken) {
    if (newAccessToken && newRefreshToken) {
      // 토큰 저장
      accessToken.value = newAccessToken;
      refreshToken.value = newRefreshToken;
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      // 토큰에서 이메일 정보 추출하여 저장
      const decoded = jwtDecode(newAccessToken);
      email.value = decoded.sub;
    } else {
      // 토큰 제거 (로그아웃)
      accessToken.value = null;
      refreshToken.value = null;
      email.value = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // 로그인 시 호출할 액션
  function login(tokenDto) {
    setTokens(tokenDto.accessToken, tokenDto.refreshToken);
  }

  function logout() {
    setTokens(null, null);
  }

  return { accessToken,refreshToken,email,isAuthenticated, login,logout,setTokens }
})
