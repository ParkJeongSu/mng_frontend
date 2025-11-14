<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/carrier-def"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="menu.CarrierDef"
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
]

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = [
  { key: 'carrierDefName', labelKey: 'model.carrier.carrierDefName', component: 'v-text-field' },
  { key: 'description', labelKey: 'model.common.description', component: 'v-text-field' },
  {
    key: 'carrierType',
    labelKey: 'model.carrier.carrierType',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/carrier-type',
  },
  {
    key: 'carrierDetailType',
    labelKey: 'model.carrier.carrierDetailType',
    component: 'v-select',
    dependsOn: ['carrierType'],
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/carrier-type',
    PathVariable: true,
  },
]

const headers = [
  { title: 'model.common.id', key: 'id' },
  { title: 'model.carrier.carrierDefName', key: 'carrierDefName' },
  { title: 'model.common.description', key: 'description' },
  { title: 'model.carrier.carrierType', key: 'carrierType' },
  { title: 'model.carrier.carrierDetailType', key: 'carrierDetailType' },
  { title: 'model.carrier.defaultCapacity', key: 'defaultCapacity' },
  { title: 'model.carrier.useCountLimit', key: 'useCountLimit' },
  { title: 'model.carrier.useDurationLimit', key: 'useDurationLimit' },
  { title: 'model.carrier.countLimitPerClean', key: 'countLimitPerClean' },
  { title: 'model.carrier.durationLimitPerClean', key: 'durationLimitPerClean' },
  { title: 'model.carrier.cleanCountLimit', key: 'cleanCountLimit' },
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
