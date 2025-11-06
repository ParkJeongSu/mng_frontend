<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/alarm"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="menu.Alarm"
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
    key: 'alarmDefId',
    labelKey: 'model.alarm.alarmDefName',
    component: 'v-select',
    'item-title': 'alarmDefName', // v-select의 item-title에 매핑할 키
    'item-value': 'id', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/alarm-def',
  },
  { key: 'equipmentName', labelKey: 'model.alarm.equipmentName', component: 'v-text-field' },
  {
    key: 'alarmState',
    labelKey: 'model.alarm.alarmState',
    component: 'v-select',
    'item-title': 'code', // v-select의 item-title에 매핑할 키
    'item-value': 'code', // v-select의 item-value에 매핑할 키
    apiEndpoint: '/api/meta-data/alarm-state',
  },
]

const formSchema = [
  { key: 'authorityName', labelKey: 'model.authority.authorityName', component: 'v-text-field' },
  { key: 'description', labelKey: 'model.common.description', component: 'v-text-field' },
]

const headers = [
  { title: 'model.common.id', key: 'id' },
  { title: 'model.alarm.alarmDefId', key: 'alarmDefId' },
  { title: 'model.equipment.equipmentName', key: 'equipmentName' },
  { title: 'model.alarm.alarmState', key: 'alarmState' },
  { title: 'model.carrier.createTime', key: 'createTime', type: 'datetime' },
  { title: 'model.alarm.clearTime', key: 'clearTime', type: 'datetime' },
  { title: 'model.event.eventName', key: 'eventName' },

  { title: 'model.event.eventTime', key: 'eventTime', type: 'datetime' },
  { title: 'model.event.eventUser', key: 'eventUser' },
  { title: 'model.event.eventComment', key: 'eventComment' },
]
</script>
<style scoped></style>
