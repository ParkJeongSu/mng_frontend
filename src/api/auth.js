import apiClient from './index.js';

/**
 * 로그인 API 호출
 * @param {object} credentials - 사용자 자격 증명
 * @param {string} credentials.email - 사용자 이메일
 * @param {string} credentials.password - 사용자 비밀번호
 * @returns {Promise} Axios 응답 Promise (TokenDto 객체 포함)
 */
export function login(credentials) {
  return apiClient.post('/api/members/login', credentials);
}

/**
 * 회원가입 API 호출
 * @param {object} memberInfo - 회원가입 정보
 * @param {string} memberInfo.email - 사용자 이메일
 * @param {string} memberInfo.password - 사용자 비밀번호
 * @returns {Promise} Axios 응답 Promise (생성된 회원 ID 포함)
 */
export function signup(memberInfo) {
  return apiClient.post('/api/members/join', memberInfo);
}
