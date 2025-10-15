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
      <!--
      <template v-slot:item.status="{ item }">
        <v-chip :color="item.status === '판매중' ? 'green' : 'red'" small>
          {{ item.status }}
        </v-chip>
      </template>
-->
      <template v-slot:item.status="slotProps">
        <v-chip
          :color="slotProps.value === '판매중' ? 'green' : 'red'"
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

const searchSchema = ref([
  { key: 'productCode', label: '제품 코드', component: 'v-text-field' },
  { key: 'productName', label: '제품명', component: 'v-text-field' },
  {
    key: 'status',
    label: '상태',
    component: 'v-select',
    items: ['판매중', '품절', '단종'],
  },
])

const formSchema = ref([
  { key: 'productCode', label: '제품 코드', component: 'v-text-field' },
  { key: 'productName', label: '제품명', component: 'v-text-field' },
  {
    key: 'status',
    label: '상태',
    component: 'v-select',
    items: ['판매중', '품절', '단종'],
  },
  {
    key: 'price',
    label: '가격',
    component: 'v-text-field',
    type: 'number',
  },
])

const headers = ref([
  { title: 'tableHeaders.id', key: 'id' },
  { title: 'tableHeaders.userId', key: 'userId' },
  { title: 'tableHeaders.authorityId', key: 'authorityId' },
  { title: 'tableHeaders.userName', key: 'userName' },
  { title: 'tableHeaders.password', key: 'password' },
  { title: 'tableHeaders.email', key: 'email' },
  { title: 'tableHeaders.phone1', key: 'phone1' },
  { title: 'tableHeaders.phone2', key: 'phone2' },
  { title: 'tableHeaders.checkOutState', key: 'checkOutState' },
  { title: 'tableHeaders.checkOutTime', key: 'checkOutTime' },
  { title: 'tableHeaders.checkOutUser', key: 'checkOutUser' },
  { title: 'tableHeaders.dataState', key: 'dataState' },
  { title: 'tableHeaders.eventName', key: 'eventName' },
  { title: 'tableHeaders.timeKey', key: 'timeKey' },
  { title: 'tableHeaders.eventTime', key: 'eventTime' },
  { title: 'tableHeaders.eventUser', key: 'eventUser' },
  { title: 'tableHeaders.eventComment', key: 'eventComment' },
])
</script>
<style scoped></style>
