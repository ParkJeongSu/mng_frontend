<template>
  <v-container fluid class="page-container">
    <ServerSideDataTable
      :search-schema="productSearchSchema"
      :headers="productHeaders"
      api-endpoint="/api/products"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :form-schema="productFormSchema"
    >
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

const productSearchSchema = ref([
  { key: 'productCode', label: '제품 코드', component: 'v-text-field' },
  { key: 'productName', label: '제품명', component: 'v-text-field' },
  {
    key: 'status',
    label: '상태',
    component: 'v-select',
    items: ['판매중', '품절', '단종'],
  },
])

const productFormSchema = ref([
  { key: 'productCode', labelKey: '제품 코드', component: 'v-text-field' },
  { key: 'productName', labelKey: '제품명', component: 'v-text-field' },
  {
    key: 'status',
    labelKey: '상태',
    component: 'v-select',
    items: ['판매중', '품절', '단종'],
  },
  {
    key: 'price',
    labelKey: '가격',
    component: 'v-text-field',
    type: 'number',
  },
])

const productHeaders = ref([
  { title: '제품 코드', key: 'productCode' },
  { title: '제품명', key: 'productName' },
  { title: '상태', key: 'status' },
  { title: '가격', key: 'price' },
])
</script>
<style scoped></style>
