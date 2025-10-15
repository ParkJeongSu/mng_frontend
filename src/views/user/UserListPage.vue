<template>
  <v-container fluid class="page-container">
    <ServerSideDataTable
      :search-schema="searchSchema"
      :headers="headers"
      api-endpoint="/api/users"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :user-form-schema="formSchema"
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
import { ref } from 'vue'

// 검색 및 폼 스키마 정의
const searchSchema = ref([
  { key: 'userId', labelKey: 'columns.userId', component: 'v-text-field' },
  { key: 'authorityId', labelKey: 'columns.authorityId', component: 'v-text-field' },
  { key: 'userName', labelKey: 'columns.userName', component: 'v-text-field' },
  { key: 'email', labelKey: 'columns.email', component: 'v-text-field' },
  { key: 'phone1', labelKey: 'columns.phone1', component: 'v-text-field' },
])

// 폼 스키마 정의 (추가/수정에 사용)
const formSchema = ref([
  { key: 'userId', labelKey: 'columns.userId', component: 'v-text-field' },
  { key: 'authorityId', labelKey: 'columns.authorityId', component: 'v-select', items: [] },
  { key: 'userName', labelKey: 'columns.userName', component: 'v-text-field' },
  { key: 'password', labelKey: 'columns.password', component: 'v-text-field' },
  { key: 'email', labelKey: 'columns.email', component: 'v-text-field' },
  { key: 'phone1', labelKey: 'columns.phone1', component: 'v-text-field' },
  { key: 'phone2', labelKey: 'columns.phone2', component: 'v-text-field' },
])

/**
 *   {
    key: 'userName',
    labelKey: 'userName',
    component: 'v-select',
    items: ['판매중', '품절', '단종'],
  },
 *
 */

const headers = ref([
  //{ title: 'columns.id', key: 'id' },
  { title: 'columns.userId', key: 'userId' },
  { title: 'columns.authorityId', key: 'authorityId' },
  { title: 'columns.userName', key: 'userName' },
  { title: 'columns.password', key: 'password' },
  { title: 'columns.email', key: 'email' },
  { title: 'columns.phone1', key: 'phone1' },
  { title: 'columns.phone2', key: 'phone2' },
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
