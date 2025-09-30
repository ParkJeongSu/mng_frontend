/**
 * 두 날짜 사이의 간격이 최대 일수를 초과하는지 확인합니다.
 * @param {Date | string} startDate 시작일
 * @param {Date | string} endDate 종료일
 * @param {number} maxDays 최대 허용 일수 (기본값: 7)
 * @throws {Error} 날짜 간격이 최대 일수를 초과하면 에러를 발생시킵니다.
 */
export function validateDateRange(startDate, endDate, maxDays = 7) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  // 유효하지 않은 날짜 객체인지 확인
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('유효하지 않은 날짜 형식입니다.')
  }

  // 시간은 무시하고 날짜만 비교하기 위해 UTC 자정으로 설정
  start.setUTCHours(0, 0, 0, 0)
  end.setUTCHours(0, 0, 0, 0)

  if (start > end) {
    throw new Error('시작일은 종료일보다 이전이어야 합니다.')
  }

  // 두 날짜 간의 차이를 밀리초(ms)로 계산
  const diffTime = Math.abs(end - start)
  // 밀리초를 일(day)로 변환
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // 실제 간격은 diffDays + 1 (예: 9/1 ~ 9/1은 1일)
  const duration = diffDays + 1

  if (duration > maxDays) {
    throw new Error(`조회 기간은 최대 ${maxDays}일을 넘을 수 없습니다.`)
  }

  // 유효성 검사를 통과하면 아무것도 반환하지 않음
}
