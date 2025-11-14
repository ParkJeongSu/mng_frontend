<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/port-def"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="menu.PortDef"
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
  { key: 'portDefName', labelKey: 'model.port.portDefName', component: 'v-text-field' },
]

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = [
  { key: 'portDefName', labelKey: 'model.port.portDefName', component: 'v-text-field' },
  { key: 'description', labelKey: 'model.common.description', component: 'v-text-field' },
  {
    key: 'portType',
    labelKey: 'model.port.portType',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/port-type',
  },
  {
    key: 'portUseType',
    labelKey: 'model.port.portUseType',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/port-use-type',
  },
]

const headers = [
  { title: 'model.common.id', key: 'id' },
  { title: 'model.port.portDefName', key: 'portDefName' },
  { title: 'model.common.description', key: 'description' },
  { title: 'model.port.portType', key: 'portType' },
  { title: 'model.port.portUseType', key: 'portUseType' },
  { title: 'model.port.useCarrierDefId', key: 'useCarrierDefId' },
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
