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
import { ref } from 'vue'
import { statusColorMap } from '@/constants/columnColorMaps' // 상태 색상 맵 임포트
import { aliases } from '@/plugins/vuetify-mdi-icons'

const ready = ref(true)

// 1. aliases 객체에서 key 목록만 배열로 추출합니다.
const aliasKeys = Object.keys(aliases)

// 2. map 함수를 사용해 각 key 앞에 '$'를 붙여 새 배열을 만듭니다.
const iconList = aliasKeys.map(function (key) {
  return '$' + key
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
const searchSchema = [
  {
    key: 'systemDefId',
    labelKey: 'model.systemDef.systemDefName',
    component: 'v-select',
    'item-title': 'systemDefName', // v-select의 item-title에 매핑할 키
    'item-value': 'id', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/system-def',
  },
  { key: 'menuName', labelKey: 'model.menu.menuName', component: 'v-text-field' },
  { key: 'viewURL', labelKey: 'model.menu.viewURL', component: 'v-text-field' },
]

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = [
  {
    key: 'systemDefId',
    labelKey: 'model.systemDef.systemDefId',
    component: 'v-select',
    'item-title': 'systemDefName', // v-select의 item-title에 매핑할 키
    'item-value': 'id', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/system-def',
  },
  { key: 'menuName', labelKey: 'model.menu.menuName', component: 'v-text-field' },
  {
    key: 'parentMenuId',
    labelKey: 'model.menu.parentmenuName',
    component: 'v-select',
    'item-title': 'menuName', // v-select의 item-title에 매핑할 키
    'item-value': 'id', // v-select의 item-value에 매핑할 키
    dependsOn: ['systemDefId'],
    apiEndpoint: '/api/menus',
  },
  { key: 'menuSEQ', labelKey: 'model.menu.menuSEQ', component: 'v-text-field' }, // 숫자만 입력 가능하게 가능한가?
  { key: 'description', labelKey: 'model.common.description', component: 'v-text-field' },
  { key: 'iconName', labelKey: 'model.menu.iconName', component: 'v-select', items: iconList },
  { key: 'viewURL', labelKey: 'model.menu.viewURL', component: 'v-text-field' },
  { key: 'menuType', labelKey: 'model.menu.menuType', component: 'v-text-field' },
]

const headers = [
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
  { title: 'model.common.checkOutTime', key: 'checkOutTime', type: 'datetime' },
  { title: 'model.common.checkOutUser', key: 'checkOutUser' },
  { title: 'model.common.dataState', key: 'dataState' },
  { title: 'model.event.eventName', key: 'eventName' },

  { title: 'model.event.eventTime', key: 'eventTime', type: 'datetime' },
  { title: 'model.event.eventUser', key: 'eventUser' },
  { title: 'model.event.eventComment', key: 'eventComment' },
]
</script>
<style scoped></style>
