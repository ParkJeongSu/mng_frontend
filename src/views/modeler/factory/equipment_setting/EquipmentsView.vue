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
      data-tabletitle-key="menuNames.equipments"
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
import { useTabsStore } from '@/stores/tabs'
import { useRoute } from 'vue-router'

const tabsStore = useTabsStore()
const route = useRoute()

const ready = ref(true)

// 데이터를 로드하는 함수를 별도로 분리합니다.
async function loadInitData() {}

// onActivated: keep-alive로 캐싱된 컴포넌트가 다시 활성화될 때 호출됩니다.
onActivated(function () {
  loadInitData()
})

// 검색 및 폼 스키마 정의
const searchSchema = computed(function () {
  return [{ key: 'authorityName', labelKey: 'columns.authorityName', component: 'v-text-field' }]
})

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = computed(function () {
  return [
    { key: 'authorityName', labelKey: 'columns.authorityName', component: 'v-text-field' },
    { key: 'description', labelKey: 'columns.description', component: 'v-text-field' },
  ]
})

const headers = ref([
  { title: 'columns.id', key: 'id' },
  { title: 'columns.equipmentName', key: 'equipmentName' },
  { title: 'columns.equipmentDefId', key: 'equipmentDefId' },
  { title: 'columns.equipmentDefName', key: 'equipmentDefName' },
  { title: 'columns.parentEquipmentId', key: 'parentEquipmentId' },
  { title: 'columns.parentEquipmentName', key: 'parentEquipmentName' },
  { title: 'columns.equipmentLevel', key: 'equipmentLevel' },
  { title: 'columns.equipmentState', key: 'equipmentState' },
  { title: 'columns.communicationState', key: 'communicationState' },
  { title: 'columns.processCount', key: 'processCount' },
  { title: 'columns.recipeName', key: 'recipeName' },
  { title: 'columns.defaultStockerId', key: 'defaultStockerId' },
  { title: 'columns.defaultZoneId', key: 'defaultZoneId' },
  { title: 'columns.holdState', key: 'holdState' },
  { title: 'columns.reasonCode', key: 'reasonCode' },
  { title: 'columns.resourceState', key: 'resourceState' },
  { title: 'columns.operationMode', key: 'operationMode' },
  { title: 'columns.messageServiceAddress', key: 'messageServiceAddress' },
  { title: 'columns.eventName', key: 'eventName' },
  { title: 'columns.timeKey', key: 'timeKey' },
  { title: 'columns.eventTime', key: 'eventTime' },
  { title: 'columns.eventUser', key: 'eventUser' },
  { title: 'columns.eventComment', key: 'eventComment' },
])
</script>
<style scoped></style>
