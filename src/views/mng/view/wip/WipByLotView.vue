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
      data-tabletitle-key="menu.WipByLot"
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
  return [
    { key: 'authorityName', labelKey: 'model.authority.authorityName', component: 'v-text-field' },
  ]
})

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = computed(function () {
  return [
    { key: 'authorityName', labelKey: 'model.authority.authorityName', component: 'v-text-field' },
    { key: 'description', labelKey: 'model.common.description', component: 'v-text-field' },
  ]
})

const headers = ref([
  { title: 'model.common.id', key: 'id' },
  { title: 'model.lot.lotName', key: 'lotName' },
  { title: 'model.lot.productionType', key: 'productionType' },
  { title: 'model.lot.lotState', key: 'lotState' },
  { title: 'model.lot.processState', key: 'processState' },
  { title: 'model.lot.productDefId', key: 'productDefId' },
  { title: 'model.lot.processSpecId', key: 'processSpecId' },
  { title: 'model.lot.processSpecVersion', key: 'processSpecVersion' },
  { title: 'model.lot.processFlowId', key: 'processFlowId' },
  { title: 'model.lot.processOperationId', key: 'processOperationId' },
  { title: 'model.lot.workOrderId', key: 'workOrderId' },
  { title: 'model.equipment.equipmentName', key: 'equipmentName' },
  { title: 'model.port.portName', key: 'portName' },
  { title: 'model.equipment.recipeName', key: 'recipeName' },
  { title: 'model.lot.carrierId', key: 'carrierId' },
  { title: 'model.transportJob.priority', key: 'priority' },
  { title: 'model.lot.lotGrade', key: 'lotGrade' },
  { title: 'model.lot.productionDetailType', key: 'productionDetailType' },
  { title: 'model.lot.planStartDate', key: 'planStartDate' },
  { title: 'model.lot.planDueDate', key: 'planDueDate' },
  { title: 'model.carrier.createTime', key: 'createTime' },
  { title: 'model.lot.releaseTime', key: 'releaseTime' },
  { title: 'model.lot.shipTime', key: 'shipTime' },
  { title: 'model.lot.trackInTime', key: 'trackInTime' },
  { title: 'model.lot.trackOutTime', key: 'trackOutTime' },
  { title: 'model.lot.operationMoveTime', key: 'operationMoveTime' },
  { title: 'model.lot.quantity', key: 'quantity' },
  { title: 'model.lot.oldQuantity', key: 'oldQuantity' },
  { title: 'model.carrier.holdState', key: 'holdState' },
  { title: 'model.lot.reworkState', key: 'reworkState' },
  { title: 'model.lot.reworkCount', key: 'reworkCount' },
  { title: 'model.lot.originalProcessSpecId', key: 'originalProcessSpecId' },
  { title: 'model.lot.originalProcessSpecVersion', key: 'originalProcessSpecVersion' },
  { title: 'model.lot.returnProcessFlowId', key: 'returnProcessFlowId' },
  { title: 'model.lot.returnProcessOperationId', key: 'returnProcessOperationId' },
  { title: 'model.carrier.reasonCode', key: 'reasonCode' },
  { title: 'model.lot.ownerCode', key: 'ownerCode' },
  { title: 'model.event.eventName', key: 'eventName' },
  { title: 'model.event.timeKey', key: 'timeKey' },
  { title: 'model.event.eventTime', key: 'eventTime' },
  { title: 'model.event.eventUser', key: 'eventUser' },
  { title: 'model.event.eventComment', key: 'eventComment' },
])
</script>
<style scoped></style>
