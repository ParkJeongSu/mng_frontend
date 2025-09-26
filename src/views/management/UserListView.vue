<template>
  <v-card flat class="d-flex flex-column h-100">
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-account-group" /> &nbsp; 사용자 목록
      <v-spacer></v-spacer>
      <v-btn density="compact" icon="mdi-magnify" title="조회"> </v-btn>
      <v-btn
        density="compact"
        icon="mdi-plus"
        title="추가"
        class="ml-2"
        @click="handleAddClick"
      ></v-btn>
      <v-btn
        :disabled="!selectedItemLocal"
        density="compact"
        icon="mdi-pencil"
        title="수정"
        class="ml-2"
        @click="handleEditClick"
      ></v-btn>
      <v-btn
        :disabled="checkedItems.length === 0"
        density="compact"
        icon="mdi-delete"
        title="삭제"
        class="ml-2"
        @click="handleDeleteClick"
      ></v-btn>
    </v-card-title>

    <v-divider></v-divider>
    <v-card-text class="d-flex flex-column flex-grow-1 pa-0">
      <div class="table-wrapper">
        <BaseDataTable
          :headers="headers"
          :items="items"
          item-key="name"
          :selected-row-item="selectedItemLocal"
          @row-click="handleBaseTableRowClick"
          @update:selected="updateCheckedItems"
          :is-hover="true"
          show-checkbox
        />
        <!-- show-checkbox  -->
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { usePanelStore } from '@/stores/panel'
import BaseDataTable from '@/components/common/BaseDataTable.vue'

const panelStore = usePanelStore()
const checkedItems = ref([])
const selectedItemLocal = ref(null)

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
])

function updateCheckedItems(selected) {
  checkedItems.value = selected
}

function handleDeleteClick() {
  console.log('삭제할 항목들:', checkedItems.value)
  alert(`${checkedItems.value.length}개의 항목을 삭제합니다. (콘솔 확인)`)
}

function handleBaseTableRowClick(item) {
  if (selectedItemLocal.value && selectedItemLocal.value.email === item.email) {
    selectedItemLocal.value = null
    panelStore.closePanel()
  } else {
    selectedItemLocal.value = item
    panelStore.openReadOnlyPanel(userFormSchema.value, item) // 스키마 전달
  }
}

function handleAddClick() {
  if (selectedItemLocal.value) {
    panelStore.openFormPanel(userFormSchema.value, selectedItemLocal.value, 'create')
  } else {
    const newItem = { name: '', email: '', role: '사용자', status: '활성' }
    panelStore.openFormPanel(userFormSchema.value, newItem, 'create')
  }
}

function handleEditClick() {
  if (selectedItemLocal.value) {
    panelStore.openFormPanel(userFormSchema.value, selectedItemLocal.value, 'edit')
  }
}
</script>
<style scoped>
.table-wrapper {
  /* ✨ 가로로 내용이 넘칠 때만 스크롤바 표시 */
  overflow-x: auto;

  /* 세로 레이아웃 관련 (선택 사항) */
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* BaseDataTable 컴포넌트가 래퍼를 꽉 채우도록 함 */
.table-wrapper > :deep(.v-data-table) {
  flex: 1;
}
</style>
