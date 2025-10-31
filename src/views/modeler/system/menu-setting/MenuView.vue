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
      data-tabletitle-key="menu.Menu"
      :footer-actions="myLotActions"
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
      fetchListData('/api/system-def', {}),
      fetchListData('/api/menus', {}),
    ])

    // 각각의 API 응답 데이터를 가공하여 필요한 형태로 변환합니다.
    const systemDefListMapData = apiSystemDefList.items.map(function (item) {
      return { id: item.id, systemDefName: item.systemDefName }
    })
    systemDefListMapData.unshift({ id: '', systemDefName: '' })

    const menuListMapData = apiMenuList.items.map(function (item) {
      return { id: item.id, menuName: item.menuName }
    })
    menuListMapData.unshift({ id: '', menuName: '' })

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

// ✨ 부모에서 버튼과 기능을 정의
const myLotActions = ref([
  {
    label: 'Sample1',
    color: 'primary',
    action: handleTrackIn, // 버튼 클릭 시 실행할 함수
  },
  {
    label: 'Sample2',
    color: 'secondary',
    action: handleTrackOut,
  },
  {
    label: 'Sample3',
    color: 'info',
    action: handleAssign,
  },
])

// ✨ 실제 기능은 부모 컴포넌트가 가지고 있음
function handleTrackIn(items) {
  console.log('부모의 TrackIn 로직 실행!', items)

  if (items.length === 0) {
    alert('항목을 선택해주세요.') // 이 로직도 부모가 관리
    return
  }

  // 'items' (자식이 넘겨준 selectedItems)를 사용해 API 호출
  const ids = items.map(function (item) {
    return item.id
  })
  console.log('선택된 ID 목록:', ids)
}

function handleTrackOut(items) {
  console.log('부모의 TrackOut 로직 실행!', items)
  if (items.length === 0) {
    alert('항목을 선택해주세요.')
    return
  }
}

function handleAssign(items) {
  console.log('부모의 Assign 로직 실행!')
  if (items.length === 0) {
    alert('항목을 선택해주세요.')
    return
  }
}

// 검색 및 폼 스키마 정의
const searchSchema = computed(function () {
  return [
    {
      key: 'systemDefId',
      labelKey: 'model.systemDef.systemDefName',
      component: 'v-select',
      // ⬇⬇ Vuetify v-select 관례에 맞게 전달할 프로퍼티 이름을 명확히
      items: systemDefList.value, // [{ authorityName, authorityId }]
      'item-title': 'systemDefName', // v-select의 item-title에 매핑할 키
      'item-value': 'id', // v-select의 item-value에 매핑할 키
    },
    { key: 'menuName', labelKey: 'model.menu.menuName', component: 'v-text-field' },
    { key: 'viewURL', labelKey: 'model.menu.viewURL', component: 'v-text-field' },
    {
      key: 'id',
      labelKey: 'model.menu.menuName',
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
      labelKey: 'model.systemDef.systemDefId',
      component: 'v-select',
      // ⬇⬇ Vuetify v-select 관례에 맞게 전달할 프로퍼티 이름을 명확히
      items: systemDefList.value, // [{ authorityName, authorityId }]
      'item-title': 'systemDefName', // v-select의 item-title에 매핑할 키
      'item-value': 'id', // v-select의 item-value에 매핑할 키
    },
    { key: 'menuName', labelKey: 'model.menu.menuName', component: 'v-text-field' },
    {
      key: 'parentMenuId',
      labelKey: 'model.menu.parentmenuName',
      component: 'v-select',
      // ⬇⬇ Vuetify v-select 관례에 맞게 전달할 프로퍼티 이름을 명확히
      items: menuList.value, // [{ authorityName, authorityId }]
      'item-title': 'menuName', // v-select의 item-title에 매핑할 키
      'item-value': 'id', // v-select의 item-value에 매핑할 키
    },
    { key: 'menuSEQ', labelKey: 'model.menu.menuSEQ', component: 'v-text-field' }, // 숫자만 입력 가능하게 가능한가?
    { key: 'description', labelKey: 'model.common.description', component: 'v-text-field' },
    { key: 'iconName', labelKey: 'model.menu.iconName', component: 'v-select', items: iconList },
    { key: 'viewURL', labelKey: 'model.menu.viewURL', component: 'v-text-field' },
    { key: 'menuType', labelKey: 'model.menu.menuType', component: 'v-text-field' },
  ]
})

const headers = ref([
  { title: 'model.common.id', key: 'id' },
  { title: 'model.systemDef.systemDefId', key: 'systemDefId' },
  { title: 'model.systemDef.systemDefName', key: 'systemDefName' },
  { title: 'model.menu.menuName', key: 'menuName' },
  { title: 'model.menu.parentMenuId', key: 'parentMenuId' },
  { title: 'model.menu.viewURL', key: 'viewURL' },
  { title: 'model.menu.menuSEQ', key: 'menuSEQ' },
  { title: 'model.common.description', key: 'description' },
  { title: 'model.menu.iconName', key: 'iconName' },
  { title: 'model.menu.menuType', key: 'menuType' },
  { title: 'model.common.checkOutState', key: 'checkOutState' },
  { title: 'model.common.checkOutTime', key: 'checkOutTime' },
  { title: 'model.common.checkOutUser', key: 'checkOutUser' },
  { title: 'model.common.dataState', key: 'dataState' },
  { title: 'model.event.eventName', key: 'eventName' },
  { title: 'model.event.timeKey', key: 'timeKey' },
  { title: 'model.event.eventTime', key: 'eventTime' },
  { title: 'model.event.eventUser', key: 'eventUser' },
  { title: 'model.event.eventComment', key: 'eventComment' },
])
</script>
<style scoped></style>
