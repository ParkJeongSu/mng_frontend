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
      data-tabletitle-key="menu.AuthMenu"
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

const ready = ref(true)

// 검색 및 폼 스키마 정의
const searchSchema = [
  {
    key: 'authorityId',
    labelKey: 'model.authority.authorityName',
    component: 'v-select',
    'item-title': 'authorityName', // v-select의 item-title에 매핑할 키
    'item-value': 'id', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/auth',
  },
  {
    key: 'systemDefId',
    labelKey: 'model.systemDef.systemDefName',
    component: 'v-select',
    'item-title': 'systemDefName', // v-select의 item-title에 매핑할 키
    'item-value': 'id', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/system-def',
  },
  {
    key: 'menuId',
    labelKey: 'model.menu.menuName',
    component: 'v-select',
    'item-title': 'menuName', // v-select의 item-title에 매핑할 키
    'item-value': 'id', // v-select의 item-value에 매핑할 키
    dependsOn: ['systemDefId'], // 2. 'systemDefId' 키에 의존한다고 명시합니다.
    // 3. 다시 조회할 API 주소를 명시합니다.
    // (백엔드는 /api/menus/find-by-system?systemDefId=... 형식으로 호출받게 됩니다)
    apiEndpoint: '/api/menus',
  },
]

const formSchema = [
  {
    key: 'authorityId',
    labelKey: 'model.authority.authorityId',
    component: 'v-select',
    apiEndpoint: '/api/auth',
    'item-title': 'authorityName', // v-select의 item-title에 매핑할 키
    'item-value': 'id', // v-select의 item-value에 매핑할 키
  },
  {
    key: 'systemDefId',
    labelKey: 'model.systemDef.systemDefName',
    component: 'v-select',
    apiEndpoint: '/api/system-def',
    'item-title': 'systemDefName', // v-select의 item-title에 매핑할 키
    'item-value': 'id', // v-select의 item-value에 매핑할 키
  },
  {
    key: 'menuId',
    labelKey: 'model.menu.menuName',
    component: 'v-select',
    'item-title': 'menuName', // v-select의 item-title에 매핑할 키
    'item-value': 'id', // v-select의 item-value에 매핑할 키
    // 2. 이 필드가 'systemId' 필드의 값에 의존한다고 명시합니다.
    dependsOn: ['systemDefId'],
    // 3. 의존하는 필드의 값이 변경될 때 호출할 API 엔드포인트를 정의합니다.
    //    {value} 부분은 나중에 실제 systemId 값으로 교체될 placeholder 입니다.
    apiEndpoint: '/api/menus',
  },
]

const headers = [
  { title: 'model.common.id', key: 'id' },
  { title: 'model.authority.authorityId', key: 'authorityId' },
  { title: 'model.authority.authorityName', key: 'authorityName' },
  { title: 'model.systemDef.systemDefId', key: 'systemDefId' },
  { title: 'model.systemDef.systemDefName', key: 'systemDefName' },
  { title: 'model.menu.menuId', key: 'menuId' },
  { title: 'model.menu.menuName', key: 'menuName' },
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
