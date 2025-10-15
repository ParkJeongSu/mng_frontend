import apiClient from './index.js'

/**
 * 서버로부터 목록 데이터를 조회하는 공통 API 함수
 * @param {string} endpoint - API 엔드포인트 (e.g., '/api/users')
 * @param {object} params - 조회 파라미터 (검색 조건, 페이지, 정렬 정보 등)
 * @returns {Promise<{items: Array<any>, total: number}>} - 목록 데이터와 전체 개수
 */
export async function fetchListData(endpoint, params) {
  // 1. 백엔드(Spring Pageable) 형식에 맞게 파라미터를 가공합니다.
  const apiParams = new URLSearchParams()

  // 페이지네이션 처리 (v-data-table-server는 1-based, Spring Pageable은 0-based)
  if (params.page) {
    apiParams.append('page', params.page - 1)
  }
  if (params.limit) {
    apiParams.append('size', params.limit)
  }

  // 정렬 처리 (v-data-table-server의 sortBy 배열을 Spring Pageable 형식으로 변환)
  if (params.sortBy && params.sortOrder) {
    apiParams.append('sort', `${params.sortBy},${params.sortOrder}`)
  }

  // 2. 나머지 검색 파라미터를 추가합니다.
  // 값이 있는 (null, undefined, ''가 아닌) 파라미터만 추가합니다.
  for (const key in params) {
    if (
      Object.prototype.hasOwnProperty.call(params, key) &&
      !['page', 'limit', 'sortBy', 'sortOrder'].includes(key)
    ) {
      const value = params[key]
      if (value !== null && value !== undefined && value !== '') {
        apiParams.append(key, value)
      }
    }
  }

  try {
    // 3. Axios를 사용하여 GET 요청을 보냅니다.
    const response = await apiClient.get(endpoint, { params: apiParams })

    // 4. Spring Page 객체 응답을 컴포넌트가 사용하기 쉬운 형태로 변환하여 반환합니다.
    // 백엔드 응답: { content: [...], totalElements: 100 }
    // 컴포넌트 필요: { items: [...], total: 100 }
    return {
      items: response.data.content || [],
      total: response.data.totalElements || 0,
    }
  } catch (error) {
    console.error(`[API Error] Failed to fetch list data from ${endpoint}:`, error)
    // 에러 발생 시 컴포넌트가 안전하게 처리할 수 있도록 빈 데이터를 반환합니다.
    return {
      items: [],
      total: 0,
    }
  }
}

/**
 * 서버에 여러 항목의 삭제를 요청하는 공통 API 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Array<number|string>} idList - 삭제할 ID의 배열
 * @returns {Promise<void>}
 */
export async function deleteItems(endpoint, idList) {
  if (!idList || idList.length === 0) {
    console.warn('No items selected for deletion.')
    return
  }

  try {
    // axios.delete 요청 시 body를 보내려면 data 속성을 사용해야 합니다.
    await apiClient.delete(endpoint, {
      data: { ids: idList }, // Spring의 UserDeleteRequest DTO 형식에 맞게 전송
    })
  } catch (error) {
    console.error(`[API Error] Failed to delete items from ${endpoint}:`, error)
    // 에러를 다시 던져서 컴포넌트에서 후속 처리를 할 수 있게 합니다.
    throw error
  }
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
  return apiClient.get('/api/members/test')
}
