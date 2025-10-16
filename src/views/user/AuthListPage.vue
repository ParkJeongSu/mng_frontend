<template>
  <v-container fluid class="page-container">
    <ServerSideDataTable
      v-if="ready"
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/auth"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="formSchema"
      data-tabletitle-key="title.authList"
    >
      <template v-slot:item.status="slotProps">
        <v-chip
          :color="slotProps.value === 'Active' ? 'green' : 'red'"
          small
          :title="`상태: ${slotProps.value}`"
        >
          {{ slotProps.value }}
        </v-chip>
      </template>
    </ServerSideDataTable>
  </v-container>
</template>

<script setup>
import ServerSideDataTable from '@/components/common/ServerSideDataTable.vue' // 만든 컴포넌트 임포트
import { ref, onMounted } from 'vue'

const ready = ref(true)

onMounted(async function () {})

// 검색 및 폼 스키마 정의
const searchSchema = ref([
  { key: 'authorityName', labelKey: 'columns.authorityName', component: 'v-text-field' },
])

//폼 스키마 정의 (추가/수정에 사용)
const formSchema = ref([
  { key: 'authorityName', labelKey: 'columns.authorityName', component: 'v-text-field' },
  { key: 'description', labelKey: 'columns.description', component: 'v-text-field' },
])

const headers = ref([
  // { title: 'columns.id', key: 'id' },
  { title: 'columns.authorityName', key: 'authorityName' },
  { title: 'columns.description', key: 'description' },
  { title: 'columns.checkOutState', key: 'checkOutState' },
  { title: 'columns.checkOutTime', key: 'checkOutTime' },
  { title: 'columns.checkOutUser', key: 'checkOutUser' },
  { title: 'columns.dataState', key: 'dataState' },
  { title: 'columns.eventName', key: 'eventName' },
  { title: 'columns.timeKey', key: 'timeKey' },
  { title: 'columns.eventTime', key: 'eventTime' },
  { title: 'columns.eventUser', key: 'eventUser' },
  { title: 'columns.eventComment', key: 'eventComment' },
])
</script>
<style scoped></style>
