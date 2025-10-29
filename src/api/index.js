import axios from 'axios'
import { useAuthStore } from '@/stores/auth' // 토큰 관리를 위해 auth 스토어 사용
import { reissue } from '@/api/auth' // 재발급 API 함수 임포트
import { addCommonProperties } from '@/utils/apiHelper' // ✅ 1. 방금 만든 함수를 import

// 1. Axios 인스턴스 생성
const apiClient = axios.create({
  // .env 파일에 정의된 API 서버 주소를 사용합니다.
  //baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: '/',
  // 요청 타임아웃 설정 (예: 10초)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 2. 요청 인터셉터 (Request Interceptor)
//    - 모든 API 요청이 서버로 전송되기 전에 실행됩니다.
apiClient.interceptors.request.use(
  function (config) {
    const authStore = useAuthStore()
    // auth 스토어에 토큰이 있다면, 모든 요청 헤더에 'Authorization' 토큰을 추가합니다.
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }

    // ✅ 2. POST 또는 PATCH 요청일 경우, body에 공통 속성을 추가합니다.
    if (config.method === 'post' || config.method === 'patch') {
      // config.data가 요청 body에 해당합니다.
      // [수정] config.data가 FormData의 인스턴스가 *아닌* 경우에만
      // (즉, 일반적인 JSON 요청일 때만) 공통 속성을 추가합니다.
      if (!(config.data instanceof FormData)) {
        config.data = addCommonProperties(config.data || {})
      }
    }

    return config
  },
  function (error) {
    // 요청 오류가 있는 경우 여기서 처리합니다.
    return Promise.reject(error)
  },
)

// 3. 응답 인터셉터 (Response Interceptor)
//    - 서버로부터 응답을 받은 후 실행됩니다.
apiClient.interceptors.response.use(
  function (response) {
    // 성공적인 응답은 그대로 반환합니다.
    return response
  },
  async function (error) {
    const originalRequest = error.config // 원래의 요청 정보를 저장합니다.
    const authStore = useAuthStore()

    // 401 에러이고, 재시도한 요청이 아닐 경우에만 토큰 재발급을 시도합니다.
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true // 재시도 플래그를 true로 설정합니다.

      try {
        // 1. 저장된 토큰으로 재발급 API를 호출합니다.
        const response = await reissue({
          accessToken: authStore.accessToken,
          refreshToken: authStore.refreshToken,
        })

        // 2. 새로운 토큰들을 스토어와 localStorage에 저장합니다.
        const newAccessToken = response.data.accessToken
        const newRefreshToken = response.data.refreshToken
        authStore.setTokens(newAccessToken, newRefreshToken)

        // 3. 원래 요청의 Authorization 헤더를 새로운 토큰으로 교체합니다.
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

        // 4. 원래의 요청을 다시 보냅니다.
        return apiClient(originalRequest)
      } catch (reissueError) {
        // 재발급 실패 시 (Refresh Token 만료 등)
        console.error('Token reissue failed:', reissueError)
        authStore.logout() // 모든 토큰을 지우고 로그아웃 처리합니다.
        // 필요하다면 로그인 페이지로 리다이렉트합니다.
        window.location.href = '/login'
        return Promise.reject(reissueError)
      }
    }
    // 다른 에러들은 여기서 공통으로 처리할 수 있습니다.
    // 예: alert(error.response.data.message || '에러가 발생했습니다.');
    return Promise.reject(error)
  },
)

// 생성한 apiClient 인스턴스를 export 합니다.
export default apiClient
