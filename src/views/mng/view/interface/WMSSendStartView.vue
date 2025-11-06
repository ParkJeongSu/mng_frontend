<template>
  <v-container fluid class="page-container">
    <ServerSideDataTableTemplate
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/auth"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="menu.WMSSendStart"
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
  // { title: 'model.common.id', key: 'id' },
  { title: 'model.authority.authorityName', key: 'authorityName' },
  { title: 'model.common.description', key: 'description' },
  { title: 'model.common.checkOutState', key: 'checkOutState' },
  { title: 'model.common.checkOutTime', key: 'checkOutTime', type: 'datetime' },
  { title: 'model.common.checkOutUser', key: 'checkOutUser' },
  { title: 'model.common.dataState', key: 'dataState' },
  { title: 'model.event.eventName', key: 'eventName' },
  { title: 'model.event.timeKey', key: 'timeKey' },
  { title: 'model.event.eventTime', key: 'eventTime', type: 'datetime' },
  { title: 'model.event.eventUser', key: 'eventUser' },
  { title: 'model.event.eventComment', key: 'eventComment' },
]
</script>
<style scoped></style>
