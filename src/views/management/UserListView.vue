<template>
  <v-card flat class="d-flex flex-column h-100">
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-account-group"></v-icon> &nbsp; 사용자 목록
      <v-spacer></v-spacer>
      <v-btn density="compact" icon="mdi-magnify" title="조회"></v-btn>
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

    <BaseDataTable
      :headers="headers"
      :items="items"
      item-key="email"
      show-checkbox
      :selected-row-item="selectedItemLocal"
      :selected-checkbox-items="checkedItems"
      @row-click="handleBaseTableRowClick"
      @update:selected="updateCheckedItems"
      @toggle-select="toggleSelectItem"
    />
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
  { title: '이름', align: 'start', key: 'name', fixed: true, width: '200px' },
  { title: '이메일', align: 'start', key: 'email' },
  { title: '직책', align: 'start', key: 'role' },
  { title: '상태', align: 'center', key: 'status' },
])

const items = ref([
  { name: '홍길동', email: 'gildong@example.com', role: '관리자', status: '활성' },
  { name: '이순신', email: 'sunsin@example.com', role: '사용자', status: '활성' },
  { name: '유관순', email: 'gwansun@example.com', role: '사용자', status: '비활성' },
  { name: '세종대왕', email: 'sejong@example.com', role: '관리자', status: '활성' },
])

function updateCheckedItems(selected) {
  checkedItems.value = selected
}

// BaseDataTable의 v-slot에서 toggleSelect를 직접 호출하기 어려우므로 이벤트를 받아 처리
function toggleSelectItem(internalItem) {
  const index = checkedItems.value.findIndex((item) => item.email === internalItem.raw.email)
  if (index > -1) {
    checkedItems.value.splice(index, 1)
  } else {
    checkedItems.value.push(internalItem.raw)
  }
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
<style scoped></style>
