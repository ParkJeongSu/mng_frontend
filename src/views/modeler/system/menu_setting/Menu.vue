<template>
  <v-container fluid class="page-container">
    <ServerSideDataTable
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/menus"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="title.authList"
    >
      <template v-slot:item.status="slotProps">
        <v-chip
          :color="slotProps.value === 'Active' ? 'green' : 'red'"
          small
          :title="`상태: ${slotProps.value}`"
        >
          {{ slotProps.value }}
        </v-chip>
      </template>
    </ServerSideDataTable>
  </v-container>
</template>

<script setup>
import ServerSideDataTable from '@/components/common/ServerSideDataTable.vue' // 만든 컴포넌트 임포트
import { ref, onMounted, onActivated, watch, computed } from 'vue'
import { fetchListData } from '@/api/dataTable' // 공통 API 함수 import
import { useTabsStore } from '@/stores/tabs'
import { useRoute } from 'vue-router'

const tabsStore = useTabsStore()
const route = useRoute()

const ready = ref(false)

const systemDefList = ref([])

const menuList = ref([])

// 데이터를 로드하는 함수를 별도로 분리합니다.
async function loadInitData() {
  // menuList의 길이가 0보다 크다는 것은 데이터가 이미 있다는 의미로 가정합니다.
  if (systemDefList.value.length > 0) {
    console.log('데이터가 이미 존재하므로 API를 호출하지 않습니다.')
    return
  }

  console.log('데이터를 조회합니다...')
  try {
    ready.value = false
    const [apiSystemDefList, apiMenuList] = await Promise.all([
      fetchListData('/api/system_def', {}),
      fetchListData('/api/menus', {}),
    ])

    systemDefList.value = apiSystemDefList.items
    menuList.value = apiMenuList.items
  } catch (error) {
    console.error('데이터를 로드하는 중 에러가 발생했습니다:', error)
  } finally {
    ready.value = true
  }
}

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
  return [{ key: 'systemDefName', labelKey: 'columns.systemDefName', component: 'v-text-field' }]
})

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = computed(function () {
  return [{ key: 'systemDefName', labelKey: 'columns.systemDefName', component: 'v-text-field' }]
})

const headers = ref([
  //{ title : 'columns.id', key: 'id'},
  { title: 'columns.systemDefId', key: 'systemDefId' },
  { title: 'columns.menuName', key: 'menuName' },
  { title: 'columns.parentMenuId', key: 'parentMenuId' },
  { title: 'columns.viewURL', key: 'viewURL' },
  { title: 'columns.menuSEQ', key: 'menuSEQ' },
  { title: 'columns.description', key: 'description' },
  { title: 'columns.iconName', key: 'iconName' },
  { title: 'columns.menuType', key: 'menuType' },
  { title: 'columns.checkOutState', key: 'checkOutState' },
  { title: 'columns.checkOutTime', key: 'checkOutTime' },
  { title: 'columns.checkOutUser', key: 'checkOutUser' },
  { title: 'columns.dataState', key: 'dataState' },
  { title: 'columns.eventName', key: 'eventName' },
  { title: 'columns.timeKey', key: 'timeKey' },
  { title: 'columns.eventTime', key: 'eventTime' },
  { title: 'columns.eventUser', key: 'eventUser' },
  { title: 'columns.eventComment', key: 'eventComment' },
])
</script>
<style scoped></style>
