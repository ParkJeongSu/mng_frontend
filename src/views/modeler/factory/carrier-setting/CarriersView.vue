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
  { key: 'authorityName', labelKey: 'model.authority.authorityName', component: 'v-text-field' },
]

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = [
  { key: 'authorityName', labelKey: 'model.authority.authorityName', component: 'v-text-field' },
  { key: 'description', labelKey: 'model.common.description', component: 'v-text-field' },
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
  { title: 'model.event.timeKey', key: 'timeKey' },
  { title: 'model.event.eventTime', key: 'eventTime', type: 'datetime' },
  { title: 'model.event.eventUser', key: 'eventUser' },
  { title: 'model.event.eventComment', key: 'eventComment' },
  { title: 'model.carrier.containerType', key: 'containerType' },
]
</script>
<style scoped></style>
