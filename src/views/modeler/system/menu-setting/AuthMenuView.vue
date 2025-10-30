<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/auth-menu"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="title.authList"
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
import { ref, onMounted, computed, onActivated, watch } from 'vue'
import { statusColorMap } from '@/constants/columnColorMaps' // 상태 색상 맵 임포트
import { fetchListData } from '@/api/dataTable' // 공통 API 함수 import
import { useTabsStore } from '@/stores/tabs'
import { useRoute } from 'vue-router'

const tabsStore = useTabsStore()
const route = useRoute()

const ready = ref(false)

const authorityList = ref([])

const systemDefList = ref([])

const menuList = ref([])

// 데이터를 로드하는 함수를 별도로 분리합니다.
async function loadInitData() {
  // menuList의 길이가 0보다 크다는 것은 데이터가 이미 있다는 의미로 가정합니다.
  if (menuList.value.length > 0) {
    console.log('데이터가 이미 존재하므로 API를 호출하지 않습니다.')
    return
  }

  console.log('데이터를 조회합니다...')
  try {
    ready.value = false
    const [apiAuthorityList, apiSystemDefList, apiMenuList] = await Promise.all([
      fetchListData('/api/auth', {}),
      fetchListData('/api/system-def', {}),
      fetchListData('/api/menus', {}),
    ])
    // 각각의 API 응답 데이터를 가공하여 필요한 형태로 변환합니다.
    const authorityListMapData = apiAuthorityList.items.map(function (item) {
      return { id: item.id, authorityName: item.authorityName }
    })

    const systemDefListMapData = apiSystemDefList.items.map(function (item) {
      return { id: item.id, systemDefName: item.systemDefName }
    })

    const menuListMapData = apiMenuList.items.map(function (item) {
      return { id: item.id, menuName: item.menuName }
    })

    systemDefList.value = systemDefListMapData
    menuList.value = menuListMapData

    authorityList.value = authorityListMapData
    systemDefList.value = systemDefListMapData
    menuList.value = menuListMapData
  } catch (error) {
    console.error('데이터를 로드하는 중 에러가 발생했습니다:', error)
  } finally {
    ready.value = true
  }
}

// onActivated: keep-alive로 캐싱된 컴포넌트가 다시 활성화될 때 호출됩니다.
onActivated(function () {
  loadInitData()
})

// 검색 및 폼 스키마 정의
const searchSchema = computed(function () {
  return [
    {
      key: 'authorityId',
      labelKey: 'columns.authorityName',
      component: 'v-select',
      // ⬇⬇ Vuetify v-select 관례에 맞게 전달할 프로퍼티 이름을 명확히
      items: authorityList.value, // [{ authorityName, authorityId }]
      'item-title': 'authorityName', // v-select의 item-title에 매핑할 키
      'item-value': 'id', // v-select의 item-value에 매핑할 키
    },
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

const formSchema = computed(function () {
  return [
    {
      key: 'authorityId',
      labelKey: 'columns.authorityId',
      component: 'v-select',
      // ⬇⬇ Vuetify v-select 관례에 맞게 전달할 프로퍼티 이름을 명확히
      items: authorityList.value, // [{ authorityName, authorityId }]
      'item-title': 'authorityName', // v-select의 item-title에 매핑할 키
      'item-value': 'id', // v-select의 item-value에 매핑할 키
    },
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
      // 2. 이 필드가 'systemId' 필드의 값에 의존한다고 명시합니다.
      dependsOn: ['systemId'],
      // 3. 의존하는 필드의 값이 변경될 때 호출할 API 엔드포인트를 정의합니다.
      //    {value} 부분은 나중에 실제 systemId 값으로 교체될 placeholder 입니다.
      apiEndpoint: '/api/menus?systemDefId={systemId}',
    },
  ]
})

const headers = ref([
  //{title:'columns.id', key : 'id'},
  { title: 'columns.authorityId', key: 'authorityId' },
  { title: 'columns.authorityName', key: 'authorityName' },
  { title: 'columns.systemDefId', key: 'systemDefId' },
  { title: 'columns.systemDefName', key: 'systemDefName' },
  { title: 'columns.parentMenuId', key: 'menuId' },
  { title: 'columns.parentmenuName', key: 'menuName' },
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
