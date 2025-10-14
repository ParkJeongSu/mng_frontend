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
import { useI18n } from 'vue-i18n' // 1. useI18n을 import 합니다.
const { t } = useI18n() // 2. useI18n을 호출해서 't' 함수를 가져옵니다.

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
  { title: t('id', 'id'), key: 'id' },
  { title: t('userId', 'userId'), key: 'userId' },
  { title: t('authorityId', 'authorityId'), key: 'authorityId' },
  { title: t('userName', 'userName'), key: 'userName' },
  { title: t('password', 'password'), key: 'password' },
  { title: t('email', 'email'), key: 'email' },
  { title: t('phone1', 'phone1'), key: 'phone1' },
  { title: t('phone2', 'phone2'), key: 'phone2' },
  { title: t('checkOutState', 'checkOutState'), key: 'checkOutState' },
  { title: t('checkOutTime', 'checkOutTime'), key: 'checkOutTime' },
  { title: t('checkOutUser', 'checkOutUser'), key: 'checkOutUser' },
  { title: t('dataState', 'dataState'), key: 'dataState' },
  { title: t('eventName', 'eventName'), key: 'eventName' },
  { title: t('timeKey', 'timeKey'), key: 'timeKey' },
  { title: t('eventTime', 'eventTime'), key: 'eventTime' },
  { title: t('eventUser', 'eventUser'), key: 'eventUser' },
  { title: t('eventComment', 'eventComment'), key: 'eventComment' },
])
</script>
<style scoped></style>
