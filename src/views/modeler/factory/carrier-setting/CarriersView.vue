<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/carriers"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="menu.Carriers"
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
  { key: 'carrierDefName', labelKey: 'model.carrier.carrierDefName', component: 'v-text-field' },
  { key: 'carrierName', labelKey: 'model.carrier.carrierName', component: 'v-text-field' },
]

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = [
  { key: 'carrierName', labelKey: 'model.carrier.carrierName', component: 'v-text-field' },
  {
    key: 'carrierDefName',
    labelKey: 'model.carrier.carrierDefName',
    component: 'v-autocomplete',
    'item-title': 'carrierDefName', // v-autocomplete item-title에 매핑할 키
    'item-value': 'carrierDefName', // v-autocomplete item-value에 매핑할 키
    apiEndpoint: '/api/carrier-def',
  },
  { key: 'capacity', labelKey: 'model.carrier.capacity', component: 'v-text-field' },
  {
    key: 'cleanState',
    labelKey: 'model.carrier.cleanState',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/carrier-clean-state',
  },
  {
    key: 'holdState',
    labelKey: 'model.carrier.holdState',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/hold-state',
  },
]

const headers = [
  { title: 'model.common.id', key: 'id' },
  { title: 'model.carrier.carrierName', key: 'carrierName' },
  { title: 'model.carrier.carrierDefId', key: 'carrierDefId' },
  { title: 'model.carrier.carrierDefName', key: 'carrierDefName' },
  { title: 'model.carrier.carrierState', key: 'carrierState' },
  { title: 'model.equipment.equipmentName', key: 'equipmentName' },
  { title: 'model.port.portName', key: 'portName' },
  { title: 'model.carrier.zoneName', key: 'zoneName' },
  { title: 'model.carrier.shelfName', key: 'shelfName' },
  { title: 'model.carrier.capacity', key: 'capacity' },
  { title: 'model.carrier.cleanState', key: 'cleanState' },
  { title: 'model.carrier.transportState', key: 'transportState' },
  { title: 'model.carrier.reservedObjectId', key: 'reservedObjectId' },
  { title: 'model.carrier.holdState', key: 'holdState' },
  { title: 'model.carrier.reasonCode', key: 'reasonCode' },
  { title: 'model.carrier.useState', key: 'useState' },
  { title: 'model.carrier.useCount', key: 'useCount' },
  { title: 'model.carrier.useCountPerClean', key: 'useCountPerClean' },
  { title: 'model.carrier.cleanCount', key: 'cleanCount' },
  { title: 'model.carrier.lotQuantity', key: 'lotQuantity' },
  { title: 'model.carrier.capaState', key: 'capaState' },
  { title: 'model.carrier.lastCleanTime', key: 'lastCleanTime' },
  { title: 'model.carrier.createTime', key: 'createTime', type: 'datetime' },
  { title: 'model.event.eventName', key: 'eventName' },
  { title: 'model.event.eventTime', key: 'eventTime', type: 'datetime' },
  { title: 'model.event.eventUser', key: 'eventUser' },
  { title: 'model.event.eventComment', key: 'eventComment' },
  { title: 'model.carrier.containerType', key: 'containerType' },
]
</script>
<style scoped></style>
