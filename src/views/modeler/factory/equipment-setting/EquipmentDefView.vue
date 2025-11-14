<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/equipment-def"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="menu.EquipmentDef"
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
    key: 'equipmentDefName',
    labelKey: 'model.equipment.equipmentDefName',
    component: 'v-text-field',
  },
]

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = [
  {
    key: 'equipmentDefName',
    labelKey: 'model.equipment.equipmentDefName',
    component: 'v-text-field',
  },
  { key: 'description', labelKey: 'model.common.description', component: 'v-text-field' },
  {
    key: 'equipmentType',
    labelKey: 'model.equipment.equipmentType',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/equipment-type',
  },
  {
    key: 'equipmentGroupName',
    labelKey: 'model.equipment.equipmentGroupName',
    component: 'v-autocomplete',
    'item-title': 'equipmentGroupName', // v-select의 item-title에 매핑할 키
    'item-value': 'equipmentGroupName', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/equipment-group',
  },
  {
    key: 'detailEquipmentType',
    labelKey: 'model.equipment.detailEquipmentType',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/equipment-detail-type',
  },
  {
    key: 'containerType',
    labelKey: 'model.carrier.containerType',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/container-type',
  },
]

const headers = [
  { title: 'model.common.id', key: 'id' },
  { title: 'model.equipment.equipmentDefName', key: 'equipmentDefName' },
  { title: 'model.common.description', key: 'description' },
  { title: 'model.equipment.equipmentType', key: 'equipmentType' },
  { title: 'model.equipment.equipmentGroupId', key: 'equipmentGroupId' },
  { title: 'model.equipment.equipmentGroupName', key: 'equipmentGroupName' },
  { title: 'model.equipment.detailEquipmentType', key: 'detailEquipmentType' },
  { title: 'model.equipment.stateModel', key: 'stateModel' },
  { title: 'model.equipment.vendorId', key: 'vendorId' },
  { title: 'model.equipment.modelId', key: 'modelId' },
  { title: 'model.equipment.processCapacity', key: 'processCapacity' },
  { title: 'model.equipment.loadingCapacity', key: 'loadingCapacity' },
  { title: 'model.common.checkOutState', key: 'checkOutState' },
  { title: 'model.common.checkOutTime', key: 'checkOutTime', type: 'datetime' },
  { title: 'model.common.checkOutUser', key: 'checkOutUser' },
  { title: 'model.common.dataState', key: 'dataState' },
  { title: 'model.event.eventName', key: 'eventName' },
  { title: 'model.event.eventTime', key: 'eventTime', type: 'datetime' },
  { title: 'model.event.eventUser', key: 'eventUser' },
  { title: 'model.event.eventComment', key: 'eventComment' },
  { title: 'model.carrier.containerType', key: 'containerType' },
]
</script>
<style scoped></style>
