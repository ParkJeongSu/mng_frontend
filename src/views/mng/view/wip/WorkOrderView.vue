<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/work-order"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="menu.WorkOrder"
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
  { title: 'model.workorder.workOrderName', key: 'workOrderName' },
  { title: 'model.common.description', key: 'description' },
  { title: 'model.workorder.vendorName', key: 'vendorName' },
  { title: 'model.lot.productDefId', key: 'productDefId' },
  { title: 'model.workorder.processFlowId', key: 'processFlowId' },
  { title: 'model.lot.processOperationId', key: 'processOperationId' },
  { title: 'model.workorder.workOrderState', key: 'workOrderState' },
  { title: 'model.carrier.holdState', key: 'holdState' },
  { title: 'model.carrier.reasonCode', key: 'reasonCode' },
  { title: 'model.equipment.equipmentName', key: 'equipmentName' },
  { title: 'model.workorder.planQuantity', key: 'planQuantity' },
  { title: 'model.workorder.createdQuantity', key: 'createdQuantity' },
  { title: 'model.workorder.releasedQuantity', key: 'releasedQuantity' },
  { title: 'model.workorder.finishedQuantity', key: 'finishedQuantity' },
  { title: 'model.workorder.scrappedQuantity', key: 'scrappedQuantity' },
  { title: 'model.workorder.workOrderCount', key: 'workOrderCount' },
  { title: 'model.carrier.createTime', key: 'createTime' },
  { title: 'model.lot.releaseTime', key: 'releaseTime' },
  { title: 'model.workorder.completeTime', key: 'completeTime' },
  { title: 'model.workorder.createUser', key: 'createUser' },
  { title: 'model.workorder.releaseUser', key: 'releaseUser' },
  { title: 'model.workorder.completeUser', key: 'completeUser' },
  { title: 'model.workorder.dueDate', key: 'dueDate' },
  { title: 'model.event.eventName', key: 'eventName' },
  { title: 'model.event.timeKey', key: 'timeKey' },
  { title: 'model.event.eventTime', key: 'eventTime' },
  { title: 'model.event.eventUser', key: 'eventUser' },
  { title: 'model.event.eventComment', key: 'eventComment' },
]
</script>
<style scoped></style>
