<template>
  <v-card flat class="d-flex flex-column flex-grow-1 h-100 data-table-card">
    <v-card-title class="d-flex align-center pe-2 table-toolbar">
      <v-icon icon="$accountGroup" /> &nbsp; 사용자 목록
      <v-spacer></v-spacer>
      <v-btn density="compact" icon="$magnify" title="조회" />
      <v-btn
        density="compact"
        icon="$plus"
        :title="$t('dataTable.add')"
        class="ml-2"
        @click="handleAddClick"
      />
      <v-btn
        :disabled="!selectedItemLocal"
        density="compact"
        icon="$pencil"
        :title="$t('dataTable.edit')"
        class="ml-2"
        @click="handleEditClick"
      />
      <v-btn
        :disabled="selectedItems.length === 0"
        density="compact"
        icon="$delete"
        :title="$t('dataTable.delete')"
        class="ml-2"
        @click="handleDeleteClick"
      />
    </v-card-title>

    <v-divider class="thin-divider" />

    <v-card-text class="d-flex flex-column flex-grow-1 pa-0 table-wrapper">
      <v-data-table
        :headers="headers"
        :items="items"
        :show-select="showCheckbox"
        v-model="selectedItems"
        class="flex-grow-1 pro-table"
        density="compact"
        return-object
        fixed-header
        fixed-layout
        :item-value="itemKey"
        height="100%"
        :hover="isHover"
        @click:row="handleRowClick"
      >
        <!-- 1) loading / no-data: 축약형 없이 -->
        <template v-slot:loading>
          <div class="empty-state">
            <v-progress-circular indeterminate size="24" class="mr-2" />
            <span>데이터를 불러오는 중…</span>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="empty-state">
            <v-icon icon="$databaseOff" class="mr-2" />
            <span>표시할 데이터가 없습니다</span>
          </div>
        </template>

        <!-- 2) 컬럼별 셀 슬롯을 동적으로 개방.
         v-slot:[...]에 들어온 slot props를 v-bind로 부모 슬롯에 "그대로" 전달 -->
        <template
          v-for="header in visibleHeaders"
          :key="header.key"
          v-slot:[`item.${header.key}`]="slotProps"
        >
          <!-- 부모가 제공한 슬롯이 있으면 사용, 없으면 폴백 표시 -->
          <slot :name="`item.${header.key}`" v-bind="slotProps">
            <span class="cell-ellipsis" :title="String(slotProps.value ?? '')">
              {{ slotProps.value }}
            </span>
          </slot>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePanelStore } from '@/stores/panel'

/** 안전 필터: 체크박스 등 내부/숨김 컬럼 제외 */
const visibleHeaders = computed(function () {
  return (props.headers || []).filter(function (h) {
    return (
      h &&
      h.key &&
      !String(h.key).startsWith('data-table') && // 예: data-table-select
      !h.hidden
    )
  })
})

const panelStore = usePanelStore()
const selectedItemLocal = ref(null)
const selectedItems = ref([])

const props = defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  itemKey: { type: String, required: true },
  showCheckbox: { type: Boolean, default: false },
  isHover: { type: Boolean, default: false },
  userFormSchema: { type: Array, required: true },
})

function handleRowClick(event, { item }) {
  selectedItemLocal.value = item
  panelStore.openReadOnlyPanel(props.userFormSchema, item)
}
function handleDeleteClick() {
  alert(`${selectedItems.value.length}개의 항목을 삭제합니다. (콘솔 확인)`)
}
function handleAddClick() {
  if (selectedItemLocal.value) {
    panelStore.openFormPanel(props.userFormSchema, selectedItemLocal.value, 'create')
  } else {
    const newItem = { name: '', email: '', role: '사용자', status: '활성' }
    panelStore.openFormPanel(props.userFormSchema, newItem, 'create')
  }
}
function handleEditClick() {
  if (selectedItemLocal.value) {
    panelStore.openFormPanel(props.userFormSchema, selectedItemLocal.value, 'edit')
  }
}
</script>

<style scoped>
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
.cell-ellipsis {
  display: inline-block;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 카드 상단 툴바: 높이/라인 최소화 */
.table-toolbar {
  min-height: 44px;
  padding-block: 6px;
}

/* 얇은 divider */
.thin-divider {
  opacity: 0.5;
}

/* 테이블 래퍼: 스크롤 최적화 */
.table-wrapper {
  overflow: hidden; /* 이 컨테이너 자체 스크롤은 숨기고 */
  flex: 1;
  display: flex;
  min-height: 0; /* 자식 스크롤 허용 */
}

/* v-data-table 베이스 튜닝 */
:deep(.pro-table) {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
  /* 모서리 라운드/테두리 제거로 평평하게 */
  border: none;
  box-shadow: none;
}

/* 헤더 영역 고정 + 배경/라인 일관화 */
:deep(.pro-table .v-data-table__thead) {
  position: sticky;
  top: 0;
  z-index: 2;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

/* 헤더 셀 타이포+간격 */
:deep(.pro-table th) {
  white-space: nowrap;
  font-weight: 700;
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.78);
  height: 38px;
  padding: 0 12px;
}

/* 바디 셀: 가독성 높이기 */
:deep(.pro-table td) {
  white-space: nowrap;
  font-size: 0.92rem;
  color: rgba(var(--v-theme-on-surface), 0.87);
  height: 38px;
  padding: 0 12px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

/* 행 zebra 옵션 (너무 강하지 않게) */
:deep(.pro-table .v-data-table__tbody tr:nth-child(even)) {
  background-color: rgba(var(--v-theme-on-surface), 0.02);
}

/* 호버 상태: 약한 primary 오버레이 */
:deep(.pro-table .v-data-table__tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.06);
}

/* 선택 상태: 더 진한 primary 오버레이 + 좌측 인디케이터 */
:deep(.pro-table .v-data-table__tbody tr.v-data-table__selected) {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  position: relative;
}
:deep(.pro-table .v-data-table__tbody tr.v-data-table__selected::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: rgb(var(--v-theme-primary));
}

/* 포커스(키보드 탐색) 링 */
:deep(.pro-table .v-data-table__tbody tr:focus-visible) {
  outline: 2px solid rgba(var(--v-theme-primary), 0.8);
  outline-offset: -2px;
}

/* 긴 문자열 처리: 말줄임표 + 전체 보기 */
.cell-ellipsis {
  display: inline-block;
  max-width: 320px; /* 필요에 따라 열마다 조정 */
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

/* 테이블 레이아웃 안정화 */
:deep(.v-data-table__wrapper) {
  overflow: auto; /* 실제 스크롤은 wrapper에 부여 */
}
:deep(.v-data-table__wrapper table) {
  table-layout: fixed;
  width: 100%;
}

/* 체크박스/액션 컬럼 폭 축소 */
:deep(th.v-data-table__td--checkbox),
:deep(td.v-data-table__td--checkbox) {
  width: 44px;
  padding: 0 8px;
}

/* 빈/로딩 상태 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

/* (선택) 첫 컬럼 고정: 헤더/바디 동시 sticky. width는 headers에서 고정 필수 */
:deep(.pro-table th.sticky-col),
:deep(.pro-table td.sticky-col) {
  position: sticky;
  left: 0;
  z-index: 1;
  background: inherit;
  /* Vuetify 경고 방지: 해당 컬럼은 headers에서 width 지정 */
  /* 예: { key:'name', title:'이름', width: '200px' } */
}

/* 다크 모드 미세 튜닝 */
:deep(.v-theme--dark .pro-table .v-data-table__tbody tr:nth-child(even)) {
  background-color: rgba(255, 255, 255, 0.02);
}
:deep(.v-theme--dark .pro-table td) {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}
</style>
