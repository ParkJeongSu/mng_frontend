<template>
  <v-card flat class="d-flex flex-column h-100">
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-account-group"></v-icon> &nbsp; 사용자 목록

      <v-spacer></v-spacer>

      <v-btn density="compact" icon="mdi-magnify" title="조회"></v-btn>
      <v-btn density="compact" icon="mdi-plus" title="추가" class="ml-2"></v-btn>
      <v-btn density="compact" icon="mdi-pencil" title="수정" class="ml-2"></v-btn>
      <v-btn density="compact" icon="mdi-delete" title="삭제" class="ml-2"></v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="items"
      item-value="name"
      class="elevation-1 flex-grow-1"
      density="compact"
      fixed-header
      height="100%"
      @click:row="handleRowClick"
    ></v-data-table>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { usePanelStore } from '@/stores/panel' // panel 스토어 import

const panelStore = usePanelStore()

// v-data-table에 표시할 페이지 당 아이템 개수
const itemsPerPage = ref(10)

// v-data-table의 헤더(컬럼) 정의
const headers = ref([
  { title: '이름', align: 'start', key: 'name', fixed: true },
  { title: '이메일', align: 'start', key: 'email', fixed: true },
  { title: '직책', align: 'start', key: 'role' },
  { title: '상태', align: 'center', key: 'status' },
])

// v-data-table에 표시할 데이터 (실제로는 API로 받아와야 함)
const items = ref([
  { name: '홍길동', email: 'gildong@example.com', role: '관리자', status: '활성' },
  { name: '이순신', email: 'sunsin@example.com', role: '사용자', status: '활성' },
  { name: '유관순', email: 'gwansun@example.com', role: '사용자', status: '비활성' },
  { name: '세종대왕', email: 'sejong@example.com', role: '관리자', status: '활성' },
])

/**
 * 테이블의 행(row)을 클릭했을 때 실행되는 함수
 * @param {object} event - 클릭 이벤트 객체
 * @param {object} value - 클릭된 행의 데이터 객체 ({ item })
 */
function handleRowClick(event, value) {
  // 1. 클릭한 행의 데이터를 panel 스토어에 저장
  panelStore.setSelectedItem(value.item)
  // 2. 패널을 연다
  panelStore.openPanel()
}
</script>

<style scoped></style>
