// src/utils/formatters.js
import dayjs from 'dayjs'

/**
 * ISO 문자열을 'YYYY-MM-DD HH:mm:ss' 형식으로 변환합니다.
 * @param {string} isoString (예: 2025-10-21T12:50:24.529)
 * @returns {string} (예: 2025-10-21 12:50:24)
 */
export function formatDateTime(isoString) {
  if (!isoString) return '-' // 값이 없을 경우
  return dayjs(isoString).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * ISO 문자열을 'YYYY-MM-DD' 형식으로 변환합니다.
 * @param {string} isoString
 * @returns {string}
 */
export function formatDate(isoString) {
  if (!isoString) return '-'
  return dayjs(isoString).format('YYYY-MM-DD')
}
