<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/equipments"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="menu.Equipments"
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
  { key: 'equipmentName', labelKey: 'model.equipment.equipmentName', component: 'v-text-field' },
]

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = [
  { key: 'equipmentName', labelKey: 'model.equipment.equipmentName', component: 'v-text-field' },
  {
    key: 'equipmentDefName',
    labelKey: 'model.equipment.equipmentDefName',
    component: 'v-autocomplete',
    'item-title': 'equipmentDefName', // v-select의 item-title에 매핑할 키
    'item-value': 'equipmentDefName', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/equipment-def',
  },
  {
    key: 'parentEquipmentName',
    labelKey: 'model.equipment.parentEquipmentName',
    component: 'v-autocomplete',
    'item-title': 'equipmentName', // v-select의 item-title에 매핑할 키
    'item-value': 'equipmentName', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/equipments',
  },
  {
    key: 'equipmentLevel',
    labelKey: 'model.equipment.equipmentLevel',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/equipment-level',
  },
  {
    key: 'equipmentState',
    labelKey: 'model.equipment.equipmentState',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/equipment-state',
  },
  {
    key: 'communicationState',
    labelKey: 'model.equipment.communicationState',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/communication-state',
  },
  {
    key: 'operationMode',
    labelKey: 'model.equipment.operationMode',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/equipment-operation-mode',
  },
  {
    key: 'messageServiceAddress',
    labelKey: 'model.equipment.messageServiceAddress',
    component: 'v-text-field',
  },
]

const headers = [
  { title: 'model.common.id', key: 'id' },
  { title: 'model.equipment.equipmentName', key: 'equipmentName' },
  { title: 'model.equipment.equipmentDefId', key: 'equipmentDefId' },
  { title: 'model.equipment.equipmentDefName', key: 'equipmentDefName' },
  { title: 'model.equipment.parentEquipmentId', key: 'parentEquipmentId' },
  { title: 'model.equipment.parentEquipmentName', key: 'parentEquipmentName' },
  { title: 'model.equipment.equipmentLevel', key: 'equipmentLevel' },
  { title: 'model.equipment.equipmentState', key: 'equipmentState' },
  { title: 'model.equipment.communicationState', key: 'communicationState' },
  { title: 'model.equipment.processCount', key: 'processCount' },
  { title: 'model.equipment.recipeName', key: 'recipeName' },
  { title: 'model.equipment.defaultStockerId', key: 'defaultStockerId' },
  { title: 'model.equipment.defaultZoneId', key: 'defaultZoneId' },
  { title: 'model.carrier.holdState', key: 'holdState' },
  { title: 'model.carrier.reasonCode', key: 'reasonCode' },
  { title: 'model.equipment.resourceState', key: 'resourceState' },
  { title: 'model.equipment.operationMode', key: 'operationMode' },
  { title: 'model.equipment.messageServiceAddress', key: 'messageServiceAddress' },
  { title: 'model.event.eventName', key: 'eventName' },
  { title: 'model.event.eventTime', key: 'eventTime', type: 'datetime' },
  { title: 'model.event.eventUser', key: 'eventUser' },
  { title: 'model.event.eventComment', key: 'eventComment' },
]
</script>
<style scoped></style>
