<template>
  <v-container fluid class="page-container">
    <v-card class="mb-4">
      <v-card-text>
        <v-select
          v-model="selectedResource"
          :items="resourceList"
          :placeholder="$t('history.selectTitle')"
          density="compact"
          variant="solo"
          flat
          hide-details
        >
          <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props">
              <span>{{ $t('history.resources.' + item.value, item.value) }}</span>
            </v-list-item>
          </template>

          <template v-slot:selection="{ item }">
            <span>{{ $t('history.resources.' + item.value, item.value) }}</span>
          </template>
        </v-select>
      </v-card-text>
    </v-card>

    <ServerSideDataTableTemplate
      v-if="selectedResource"
      :key="selectedResource"
      :search-schema="dynamicSearchSchema"
      :headers="dynamicHeaders"
      :api-endpoint="dynamicApiEndpoint"
      :actions="['excelExport']"
      isHover
      :data-tabletitle-key="dynamicTitleKey"
    >
    </ServerSideDataTableTemplate>
  </v-container>
</template>

<script setup>
import ServerSideDataTableTemplate from '@/components/common/ServerSideDataTableTemplate.vue'
import { ref, computed, onActivated } from 'vue'
import { useRoute } from 'vue-router'
// import { fetchHistoryResourceList } from '@/api/historyMeta' // (가정) API 함수
import { historyConfig } from '@/config/history.config.js' // 1번에서 만든 설정 파일

// (가정) 현재 시스템이 "MES"라고 가정
// 실제로는 route.params나 app store 등에서 가져와야 함
const currentSystem = 'MODELER'

const resourceList = ref([]) // 백엔드에서 받은 리소스 목록 (예: ['alarm', 'lot'])
const selectedResource = ref(null) // 사용자가 선택한 리소스 (예: 'alarm')

// 1. (공통) 모든 히스토리 화면에 공통으로 들어갈 검색 필터
// (참고: Vuetify 3용 Date Picker 컴포넌트 이름으로 가정)
const commonSearchSchema = [
  {
    key: 'fromDate',
    labelKey: 'common.fromDate', // 다국어 키
    component: 'v-text-field', // (혹은 v-date-picker)
    type: 'date', // 'date' -> 'datetime-local'로 변경
    cols: 6, // (예시) 한 줄에 두 개 배치
  },
  {
    key: 'toDate',
    labelKey: 'common.toDate',
    component: 'v-text-field',
    type: 'date', // 'date' -> 'datetime-local'로 변경
    cols: 6,
  },
]

// (가정) /api/history-meta/resources API 호출 함수
// fetchListData 함수를 재사용해도 됨
async function fetchHistoryResourceList(system) {
  // return await fetchListData('/api/history-meta/resources', { system: system })

  // 임시 하드코딩 (테스트용)
  console.log(`${system} 시스템의 리소스 목록을 요청합니다.`)
  return ['alarm', 'alarm_def', 'alarm_action']
}

onActivated(async function () {
  // (가정) API를 호출하여 이 시스템(MES)이 볼 수 있는 리소스 목록을 가져옴
  try {
    const responseData = await fetchHistoryResourceList(currentSystem)
    resourceList.value = responseData // ['alarm', 'alarm_def','alarm_action']

    // 기본값으로 첫 번째 리소스를 선택 (선택 사항)
    if (responseData.length > 0 && !selectedResource.value) {
      selectedResource.value = responseData[0]
    }
  } catch (error) {
    console.error('History 리소스 목록 로드 실패:', error)
    resourceList.value = [] // 실패 시 비움
  }
})

// ----- [핵심] 동적 Props 계산 -----

// 1. 동적 API 엔드포인트
const dynamicApiEndpoint = computed(function () {
  if (!selectedResource.value) {
    return null
  }
  // 예: 'alarm' -> '/api/alarm/history'
  // (참고) 사용자 요청에 따라 /api/modeler/alarm/history 등으로 변경 필요
  return `/api/${selectedResource.value}/history`
})

// 2. 동적 검색 스키마 (공통 필터 + 리소스별 고유 필터)
const dynamicSearchSchema = computed(function () {
  if (!selectedResource.value) {
    return []
  }

  // history.config.js에서 'alarm'에 해당하는 고유 필터를 가져옴
  const specificSchema = historyConfig[selectedResource.value]?.searchSchema || []

  // [공통 필터] ...와 [고유 필터] ...를 합쳐서 반환
  return [...commonSearchSchema, ...specificSchema]
})

// 3. 동적 헤더
const dynamicHeaders = computed(function () {
  if (!selectedResource.value) {
    return []
  }
  // history.config.js 에서 'alarm'에 해당하는 headers를 반환
  return historyConfig[selectedResource.value]?.headers || []
})

// 4. 동적 제목 (다국어 키)
const dynamicTitleKey = computed(function () {
  if (!selectedResource.value) {
    return '...'
  }
  // 예: 'history.resources.alarm' (다국어 파일에 정의된 키)
  return 'history.resources.' + selectedResource.value
})
</script>
<style scoped></style>
