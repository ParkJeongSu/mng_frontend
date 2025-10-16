import { useAuthStore } from '@/stores/auth'

/**
 * API 요청 body에 공통 속성을 추가하는 함수
 * @param {object} body 원본 body 객체
 * @returns {object} 공통 속성이 추가된 새로운 body 객체
 */
export function addCommonProperties(body) {
  const authStore = useAuthStore()
  const now = new Date()

  // YYYYMMDDHHmmssSSS 형식의 timeKey 생성
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0')

  const timeKey = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`

  const commonProperties = {
    eventUser: authStore.userId || 'GUEST', // authStore에서 사용자 정보 가져오기
    eventComment: 'Data changed', // 필요에 따라 동적으로 설정 가능
    eventTime: now,
    timeKey: timeKey,
  }

  // 원본 body 객체와 공통 속성을 합쳐서 반환
  return {
    ...body,
    ...commonProperties,
  }
}
