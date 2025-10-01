<template>
  <v-container fluid class="page-container">
    <BaseDataTable
      :headers="headers"
      :items="items"
      item-key="email"
      :show-checkbox="true"
      :is-hover="true"
      :user-form-schema="userFormSchema"
    >
      <template v-slot:item.status="slotProps">
        <!-- slotProps.value === slotProps.item[slotProps.column.key] -->
        <v-chip
          size="small"
          variant="tonal"
          :color="
            slotProps.value === '활성' ? 'success' : slotProps.value === '중지' ? 'error' : 'info'
          "
          :title="`상태: ${slotProps.value}`"
        >
          {{ slotProps.value }}
        </v-chip>
      </template>
    </BaseDataTable>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import BaseDataTable from '@/components/common/BaseDataTable.vue'

const userFormSchema = ref([
  { key: 'name', label: '이름', component: 'v-text-field' },
  { key: 'email', label: '이메일', component: 'v-text-field' },
  { key: 'role', label: '직책', component: 'v-select', items: ['관리자', '사용자'] },
  { key: 'status', label: '상태', component: 'v-select', items: ['활성', '비활성'] },
])

const headers = ref([
  // { key: 'data-table-select', width: 48, fixed: 'start' },
  // { title: '이름', align: 'start', key: 'name', width: 200, fixed: 'start' },
  // { title: '이메일', align: 'start', key: 'email', width: 200, fixed: 'start' },
  { key: 'data-table-select', width: 48 },
  { title: '이름', align: 'start', key: 'name', width: 200 },
  { title: '이메일', align: 'start', key: 'email', width: 200 },
  { title: '직책', align: 'start', key: 'role', width: 200 },
  { title: '상태', align: 'center', key: 'status', width: 200 },
  { title: '상태1', align: 'center', key: 'status1', width: 200 },
  { title: '상태2', align: 'center', key: 'status2' },
  { title: '상태3', align: 'center', key: 'status3' },
  { title: '상태4', align: 'center', key: 'status4' },
  { title: '상태5', align: 'center', key: 'status5' },
  { title: '상태6', align: 'center', key: 'status6' },
  { title: '상태7', align: 'center', key: 'status7' },
  { title: '상태8', align: 'center', key: 'status8' },
  { title: '상태9', align: 'center', key: 'status9' },
  { title: '상태10', align: 'center', key: 'status10' },
])

const items = ref([
  {
    name: '홍길동',
    email: 'gildong@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: '이순신',
    email: 'sunsin@example.com',
    role: '사용자',
    status: '활성',
  },
  {
    name: '유관순',
    email: 'gwansun@example.com',
    role: '사용자',
    status: '비활성',
  },
  {
    name: '세종대왕',
    email: 'sejong@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item1',
    email: 'item1@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item2',
    email: 'item2@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item3',
    email: 'item3@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item4',
    email: 'item4@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item5',
    email: 'item5@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item6',
    email: 'item6@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item7',
    email: 'item7@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item8',
    email: 'item8@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item9',
    email: 'item9@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item10',
    email: 'item10@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item11',
    email: 'item11@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item12',
    email: 'item12@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item13',
    email: 'item13@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item14',
    email: 'item14@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item15',
    email: 'item15@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item16',
    email: 'item16@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item17',
    email: 'item17@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item18',
    email: 'item18@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item19',
    email: 'item19@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item20',
    email: 'item20@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item21',
    email: 'item21@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item22',
    email: 'item22@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item23',
    email: 'item23@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item24',
    email: 'item24@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item25',
    email: 'item25@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item26',
    email: 'item26@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item27',
    email: 'item27@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item28',
    email: 'item28@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item29',
    email: 'item29@example.com',
    role: '관리자',
    status: '활성',
  },
  {
    name: 'item30',
    email: 'item30@example.com',
    role: '관리자',
    status: '활성',
  },
])
</script>
<style scoped></style>
