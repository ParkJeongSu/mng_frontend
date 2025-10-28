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
      data-tabletitle-key="menuNames.carriers"
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
  { title: 'columns.carrierName', key: 'carrierName' },
  { title: 'columns.carrierDefId', key: 'carrierDefId' },
  { title: 'columns.carrierDefName', key: 'carrierDefName' },
  { title: 'columns.carrierState', key: 'carrierState' },
  { title: 'columns.equipmentName', key: 'equipmentName' },
  { title: 'columns.portName', key: 'portName' },
  { title: 'columns.zoneName', key: 'zoneName' },
  { title: 'columns.shelfName', key: 'shelfName' },
  { title: 'columns.capacity', key: 'capacity' },
  { title: 'columns.cleanState', key: 'cleanState' },
  { title: 'columns.transportState', key: 'transportState' },
  { title: 'columns.reservedObjectId', key: 'reservedObjectId' },
  { title: 'columns.holdState', key: 'holdState' },
  { title: 'columns.reasonCode', key: 'reasonCode' },
  { title: 'columns.useState', key: 'useState' },
  { title: 'columns.useCount', key: 'useCount' },
  { title: 'columns.useCountPerClean', key: 'useCountPerClean' },
  { title: 'columns.cleanCount', key: 'cleanCount' },
  { title: 'columns.lotQuantity', key: 'lotQuantity' },
  { title: 'columns.capaState', key: 'capaState' },
  { title: 'columns.lastCleanTime', key: 'lastCleanTime' },
  { title: 'columns.createTime', key: 'createTime' },
  { title: 'columns.eventName', key: 'eventName' },
  { title: 'columns.timeKey', key: 'timeKey' },
  { title: 'columns.eventTime', key: 'eventTime' },
  { title: 'columns.eventUser', key: 'eventUser' },
  { title: 'columns.eventComment', key: 'eventComment' },
  { title: 'columns.containerType', key: 'containerType' },
])
</script>
<style scoped></style>
