import axios from 'axios'
import { useAuthStore } from '@/stores/auth' // 토큰 관리를 위해 auth 스토어 사용

// 1. Axios 인스턴스 생성
const apiClient = axios.create({
  // .env 파일에 정의된 API 서버 주소를 사용합니다.
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
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
  function (error) {
    // 401 Unauthorized 에러가 발생하면 (토큰 만료 등)
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      // 스토어의 로그아웃 액션을 호출하고 로그인 페이지로 보냅니다.
      authStore.logout()
    }
    // 다른 에러들은 여기서 공통으로 처리할 수 있습니다.
    // 예: alert(error.response.data.message || '에러가 발생했습니다.');
    return Promise.reject(error)
  },
)

// 생성한 apiClient 인스턴스를 export 합니다.
export default apiClient
