<template>
  <v-container fluid class="page-container">
    <ServerSideDataTable
      :search-schema="productSearchSchema"
      :headers="productHeaders"
      api-endpoint="/api/products"
      :actions="['add', 'edit', 'delete', 'excelExport', 'excelImport']"
      isHover
      showCheckbox
      :user-form-schema="productFormSchema"
    >
      <template v-slot:item.status="{ item }">
        <v-chip :color="item.status === '판매중' ? 'green' : 'red'" small>
          {{ item.status }}
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

const productHeaders = ref([
  { title: '제품 코드', key: 'productCode' },
  { title: '제품명', key: 'productName' },
  { title: '상태', key: 'status' },
  { title: '가격', key: 'price' },
])
</script>
<style scoped>
/* 이 스타일 블록이 핵심입니다.
  페이지 컨테이너가 화면 전체 높이를 차지하고, 내부 컨텐츠(ServerSideDataTable)가
  그 공간을 꽉 채우도록 만듭니다.
*/
/* v-container 안의 ServerSideDataTable 컴포넌트가 남은 공간을 모두 차지하도록 함 */
.page-container > :deep(.v-card) {
  /* flex-grow: 1; */
}
/* ServerSideDataTable 카드가 남은 공간을 모두 차지하고 0까지 줄어들 수 있도록 */
.page-container > :deep(.datatable-wrapper) {
  /* flex: 1 1 0; */
  /* 🔑 */
  /* min-height: 0;  */
}
</style>
