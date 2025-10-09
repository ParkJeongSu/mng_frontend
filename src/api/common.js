import apiClient from './index.js'

/**
 * 서버 사이드 데이터 테이블을 위한 범용 목록 조회 함수
 * @param {string} endpoint - 조회할 API 엔드포인트 (e.g., '/products')
 * @param {object} params - 쿼리 파라미터 (e.g., { page: 1, limit: 10, ... })
 * @returns {Promise} Axios 응답 Promise
 */
export function fetchListData(endpoint, params) {
  return apiClient.get(endpoint, { params })
}

// 필요하다면 범용 상세 조회, 삭제 등의 함수도 만들 수 있습니다.
export function fetchItemData(endpoint, id) {
  return apiClient.get(`${endpoint}/${id}`)
}

/**
 * 토큰 재발급 API 호출
 * @param {object} tokens
 * @param {string} tokens.accessToken - 만료된 액세스 토큰
 * @param {string} tokens.refreshToken - 리프레시 토큰
 * @returns {Promise} Axios 응답 Promise (새로운 TokenDto 객체 포함)
 */
export function test() {
  return apiClient.get('/api/members/test');
}
