<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/menus"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="menuNames.menu"
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
import { fetchListData } from '@/api/dataTable' // 공통 API 함수 import
import { useTabsStore } from '@/stores/tabs'
import { useRoute } from 'vue-router'
import { aliases } from '@/plugins/vuetify-mdi-icons'

const tabsStore = useTabsStore()
const route = useRoute()

const ready = ref(false)

const systemDefList = ref([])

const menuList = ref([])

// 1. aliases 객체에서 key 목록만 배열로 추출합니다.
const aliasKeys = Object.keys(aliases)

// 2. map 함수를 사용해 각 key 앞에 '$'를 붙여 새 배열을 만듭니다.
const iconList = aliasKeys.map(function (key) {
  return '$' + key
})

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

    // 각각의 API 응답 데이터를 가공하여 필요한 형태로 변환합니다.
    const systemDefListMapData = apiSystemDefList.items.map(function (item) {
      return { id: item.id, systemDefName: item.systemDefName }
    })

    const menuListMapData = apiMenuList.items.map(function (item) {
      return { id: item.id, menuName: item.menuName }
    })

    systemDefList.value = systemDefListMapData
    menuList.value = menuListMapData
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
  return [
    {
      key: 'systemId',
      labelKey: 'columns.systemDefName',
      component: 'v-select',
      // ⬇⬇ Vuetify v-select 관례에 맞게 전달할 프로퍼티 이름을 명확히
      items: systemDefList.value, // [{ authorityName, authorityId }]
      'item-title': 'systemDefName', // v-select의 item-title에 매핑할 키
      'item-value': 'id', // v-select의 item-value에 매핑할 키
    },
    {
      key: 'menuId',
      labelKey: 'columns.menuName',
      component: 'v-select',
      // ⬇⬇ Vuetify v-select 관례에 맞게 전달할 프로퍼티 이름을 명확히
      items: menuList.value, // [{ authorityName, authorityId }]
      'item-title': 'menuName', // v-select의 item-title에 매핑할 키
      'item-value': 'id', // v-select의 item-value에 매핑할 키
    },
  ]
})

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = computed(function () {
  return [
    {
      key: 'systemDefId',
      labelKey: 'columns.systemDefId',
      component: 'v-select',
      // ⬇⬇ Vuetify v-select 관례에 맞게 전달할 프로퍼티 이름을 명확히
      items: systemDefList.value, // [{ authorityName, authorityId }]
      'item-title': 'systemDefName', // v-select의 item-title에 매핑할 키
      'item-value': 'id', // v-select의 item-value에 매핑할 키
    },
    { key: 'menuName', labelKey: 'columns.menuName', component: 'v-text-field' },
    {
      key: 'parentMenuId',
      labelKey: 'columns.parentmenuName',
      component: 'v-select',
      // ⬇⬇ Vuetify v-select 관례에 맞게 전달할 프로퍼티 이름을 명확히
      items: menuList.value, // [{ authorityName, authorityId }]
      'item-title': 'menuName', // v-select의 item-title에 매핑할 키
      'item-value': 'id', // v-select의 item-value에 매핑할 키
    },
    { key: 'menuSEQ', labelKey: 'columns.menuSEQ', component: 'v-text-field' }, // 숫자만 입력 가능하게 가능한가?
    { key: 'description', labelKey: 'columns.description', component: 'v-text-field' },
    { key: 'iconName', labelKey: 'columns.iconName', component: 'v-select', items: iconList },
    { key: 'viewURL', labelKey: 'columns.viewURL', component: 'v-text-field' },
    { key: 'menuType', labelKey: 'columns.menuType', component: 'v-text-field' },
  ]
})

const headers = ref([
  { title: 'columns.id', key: 'id' },
  { title: 'columns.systemDefId', key: 'systemDefId' },
  { title: 'columns.systemDefName', key: 'systemDefName' },
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
