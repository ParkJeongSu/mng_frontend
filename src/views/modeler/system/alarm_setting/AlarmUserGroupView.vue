<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/alarm_user_group"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="menuNames.alarmUserGroup"
    >
      <template v-slot:item.status="slotProps">
        <v-chip
          v-if="statusColorMap[slotProps.value]"
          :color="statusColorMap[slotProps.value]"
          small
          :title="`상태: ${slotProps.value}`"
        >
          {{ slotProps.value }}
        </v-chip>

        <span v-else>
          {{ slotProps.value }}
        </span>
      </template>
    </ServerSideDataTableTemplate>
  </v-container>
</template>

<script setup>
import ServerSideDataTableTemplate from '@/components/common/ServerSideDataTableTemplate.vue' // 만든 컴포넌트 임포트
import { ref, onMounted, onActivated, watch, computed } from 'vue'
import { statusColorMap } from '@/constants/columnColorMaps' // 상태 색상 맵 임포트
import { useTabsStore } from '@/stores/tabs'
import { useRoute } from 'vue-router'

const tabsStore = useTabsStore()
const route = useRoute()

const ready = ref(true)

// 데이터를 로드하는 함수를 별도로 분리합니다.
async function loadInitData() {}

onMounted(function () {
  loadInitData()
})

// onActivated: keep-alive로 캐싱된 컴포넌트가 다시 활성화될 때 호출됩니다.
onActivated(function () {
  loadInitData()
})

// 3. openTabs 배열을 감시하는 watch 로직을 추가합니다.
watch(
  // 감시할 대상을 함수로 지정합니다.
  function () {
    return tabsStore.openTabs
  },
  // 변경이 감지되면 실행될 콜백 함수입니다.
  function (newTabs) {
    // some 함수를 사용해 현재 라우트의 경로가 새 탭 목록에 여전히 존재하는지 확인합니다.
    const isTabStillOpen = newTabs.some(function (tab) {
      return tab.path === route.path
    })

    // 만약 탭 목록에 더 이상 존재하지 않는다면, 이 컴포넌트의 탭이 닫힌 것입니다.
    if (!isTabStillOpen) {
      console.log('탭이 닫혔음을 감지하여 데이터를 초기화합니다. (watch)')
    }
  },
  // 배열 내부의 객체까지 감지하기 위해 deep 옵션을 추가합니다.
  { deep: true },
)

// 검색 및 폼 스키마 정의
const searchSchema = computed(function () {
  return [{ key: 'authorityName', labelKey: 'columns.authorityName', component: 'v-text-field' }]
})

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = computed(function () {
  return [
    { key: 'authorityName', labelKey: 'columns.authorityName', component: 'v-text-field' },
    { key: 'description', labelKey: 'columns.description', component: 'v-text-field' },
  ]
})

const headers = ref([
  { title: 'columns.id', key: 'id' },
  { title: 'columns.userGroupName', key: 'userGroupName' },
  { title: 'columns.eventName', key: 'eventName' },
  { title: 'columns.timeKey', key: 'timeKey' },
  { title: 'columns.eventTime', key: 'eventTime' },
  { title: 'columns.eventUser', key: 'eventUser' },
  { title: 'columns.eventComment', key: 'eventComment' },
])
</script>
<style scoped></style>
