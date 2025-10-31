// stores/metaData.js
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { fetchListData } from '@/api/dataTable'

// 10분 (밀리초 단위)
const CACHE_TTL = 10 * 60 * 1000

export const useMetaDataStore = defineStore('metaData', function () {
  // API 응답을 캐시할 객체
  // (key = API 엔드포인트, value = 결과 배열)
  const cache = reactive({})

  /**
   * 메타데이터를 가져오고 캐시하는 범용 함수
   * @param {string} endpoint - API 엔드포인트 (예: '/api/auth')
   * @param {string} itemValueKey - 'item-value'로 사용할 키 (예: 'id')
   * @param {string} itemTitleKey - 'item-title'로 사용할 키 (예: 'authorityName')
   * @param {boolean} addEmptyOption - '선택안함' 옵션 추가 여부
   */
  async function getItems(endpoint, itemValueKey, itemTitleKey, addEmptyOption = false) {
    // 1. 고유한 캐시 키 생성
    const cacheKey = `${endpoint}-${itemValueKey}-${itemTitleKey}-${addEmptyOption}`
    const now = Date.now()

    // 1. 캐시가 있고, '유효 시간(expiry)'이 지나지 않았으면 캐시 반환
    if (cache[cacheKey] && cache[cacheKey].expiry > now) {
      console.log(`[MetaDataStore] Cache Hit: ${endpoint}`)
      return cache[cacheKey].data
    }

    // 2. 캐시가 없거나 만료되었으면 API 호출
    console.log(`[MetaDataStore] Cache Miss (Fetching): ${endpoint}`)
    try {
      // (참고: 메타데이터는 보통 페이징이 필요 없습니다)
      const response = await fetchListData(endpoint, {})

      // 4. v-select 형식으로 데이터 가공
      const mappedData = response.items.map(function (item) {
        return {
          [itemValueKey]: item[itemValueKey],
          [itemTitleKey]: item[itemTitleKey],
        }
      })

      // 5. '선택 안함' 옵션 추가
      // if (addEmptyOption) {
      //   const emptyOpt = { [itemValueKey]: '', [itemTitleKey]: '' }
      //   mappedData.unshift(emptyOpt)
      // }

      // 3. 캐시에 '데이터'와 '새 유효 시간' 저장
      cache[cacheKey] = {
        data: mappedData,
        expiry: now + CACHE_TTL, // 현재 시간 + 10분
      }
      return mappedData
    } catch (error) {
      console.error(`Failed to fetch meta data from ${endpoint}`, error)
      cache[cacheKey] = [] // 실패 시에도 캐시 (중복 호출 방지)
      return []
    }
  }

  return { getItems }
})
