<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/lots"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="title.authList"
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
  { title: 'columns.lotName', key: 'lotName' },
  { title: 'columns.productionType', key: 'productionType' },
  { title: 'columns.lotState', key: 'lotState' },
  { title: 'columns.processState', key: 'processState' },
  { title: 'columns.productDefId', key: 'productDefId' },
  { title: 'columns.processSpecId', key: 'processSpecId' },
  { title: 'columns.processSpecVersion', key: 'processSpecVersion' },
  { title: 'columns.processFlowId', key: 'processFlowId' },
  { title: 'columns.processOperationId', key: 'processOperationId' },
  { title: 'columns.workOrderId', key: 'workOrderId' },
  { title: 'columns.equipmentName', key: 'equipmentName' },
  { title: 'columns.portName', key: 'portName' },
  { title: 'columns.recipeName', key: 'recipeName' },
  { title: 'columns.carrierId', key: 'carrierId' },
  { title: 'columns.priority', key: 'priority' },
  { title: 'columns.lotGrade', key: 'lotGrade' },
  { title: 'columns.productionDetailType', key: 'productionDetailType' },
  { title: 'columns.planStartDate', key: 'planStartDate' },
  { title: 'columns.planDueDate', key: 'planDueDate' },
  { title: 'columns.createTime', key: 'createTime' },
  { title: 'columns.releaseTime', key: 'releaseTime' },
  { title: 'columns.shipTime', key: 'shipTime' },
  { title: 'columns.trackInTime', key: 'trackInTime' },
  { title: 'columns.trackOutTime', key: 'trackOutTime' },
  { title: 'columns.operationMoveTime', key: 'operationMoveTime' },
  { title: 'columns.quantity', key: 'quantity' },
  { title: 'columns.oldQuantity', key: 'oldQuantity' },
  { title: 'columns.holdState', key: 'holdState' },
  { title: 'columns.reworkState', key: 'reworkState' },
  { title: 'columns.reworkCount', key: 'reworkCount' },
  { title: 'columns.originalProcessSpecId', key: 'originalProcessSpecId' },
  { title: 'columns.originalProcessSpecVersion', key: 'originalProcessSpecVersion' },
  { title: 'columns.returnProcessFlowId', key: 'returnProcessFlowId' },
  { title: 'columns.returnProcessOperationId', key: 'returnProcessOperationId' },
  { title: 'columns.reasonCode', key: 'reasonCode' },
  { title: 'columns.ownerCode', key: 'ownerCode' },
  { title: 'columns.eventName', key: 'eventName' },
  { title: 'columns.timeKey', key: 'timeKey' },
  { title: 'columns.eventTime', key: 'eventTime' },
  { title: 'columns.eventUser', key: 'eventUser' },
  { title: 'columns.eventComment', key: 'eventComment' },
])
</script>
<style scoped></style>
