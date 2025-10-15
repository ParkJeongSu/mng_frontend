<template>
  <v-card class="datatable-card d-flex flex-column" flat color="surface">
    <!-- 제목과 검색 바는 높이가 고정되어야 하므로, 공간이 줄어들 때 수축하지 않도록 합니다. -->
    <v-card-title class="datatable-title text-h6">서버 사이드 데이터 테이블</v-card-title>
    <v-card class="search-panel" color="surface" flat>
      <v-row class="search-row" dense>
        <v-col v-for="item in props.searchSchema" :key="item.key" cols="12" md="2">
          <component
            :is="componentMap[item.component]"
            v-model="searchParams[item.key]"
            :label="item.label"
            :items="item.items"
            density="compact"
            variant="outlined"
            hide-details
          ></component>
        </v-col>
        <v-col class="search-actions d-flex justify-end align-center">
          <slot name="search-bar.append"></slot>
          <v-btn @click="search">{{ $t('dataTable.search') }}</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- 툴바 역시 높이가 고정됩니다. -->
    <v-toolbar class="results-toolbar" density="comfortable" flat color="surface">
      <v-toolbar-title class="text-subtitle-1">조회 결과</v-toolbar-title>
      <v-spacer></v-spacer>
      <slot name="actions.prepend"></slot>
      <v-btn v-if="props.actions.includes('add')" class="ml-2" @click="handleAddClick">{{
        $t('dataTable.add')
      }}</v-btn>
      <v-btn v-if="props.actions.includes('edit')" class="ml-2" @click="handleEditClick">{{
        $t('dataTable.edit')
      }}</v-btn>
      <v-btn
        v-if="props.actions.includes('delete')"
        class="ml-2"
        @click="openDeleteConfirmDialog"
        >{{ $t('dataTable.delete') }}</v-btn
      >
      <v-btn v-if="props.actions.includes('excelExport')" class="ml-2">Excel Export</v-btn>
      <v-btn v-if="props.actions.includes('excelImport')" class="ml-2">Excel Import</v-btn>
    </v-toolbar>

    <!--
      핵심 변경사항입니다.
      이 div 래퍼(wrapper)가 남은 공간을 모두 차지하도록(flex-grow-1) 하고,
      v-data-table-server가 이 래퍼 안에서 높이를 100%로 채우게 만듭니다.
      이 구조가 flexbox에서 높이 계산을 가장 안정적으로 만듭니다.
    -->
    <div class="table-wrapper flex-grow-1">
      <v-data-table-server
        v-model="selectedItems"
        density="compact"
        v-model:items-per-page="options.itemsPerPage"
        :headers="translatedHeaders"
        :items-length="totalItems"
        :items="serverItems"
        :loading="loading"
        class="server-table pro-table"
        fixed-header
        return-object
        height="100%"
        :show-select="showCheckbox"
        :hover="isHover"
        @update:options="loadItems"
        @click:row="handleRowClick"
      >
        <template
          v-for="header in props.headers"
          :key="header.key"
          v-slot:[`item.${header.key}`]="slotProps"
        >
          <slot :name="`item.${header.key}`" v-bind="slotProps">
            <span class="cell-ellipsis" :title="String(slotProps.value ?? '')">
              {{ slotProps.value }}
            </span>
          </slot>
        </template>
      </v-data-table-server>
    </div>
  </v-card>

  <ConfirmDialog
    v-model:show="showDeleteConfirm"
    :title="$t('title.deleteConfirm')"
    :message="$t('messages.deleteConfirm')"
    @confirm="handleDeleteClick"
  />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { componentMap } from '@/constants/componentMap' // componentMap import
import { usePanelStore } from '@/stores/panel'
import { fetchListData, deleteItems } from '@/api/common' // 공통 API 함수 import
import ConfirmDialog from '@/components/common/ConfirmDialog.vue' // ConfirmDialog import
import { useI18n } from 'vue-i18n' // 1. useI18n을 import 합니다.
const { t } = useI18n() // 2. useI18n을 호출해서 't' 함수를 가져옵니다.

const showDeleteConfirm = ref(false) // 다이얼로그 표시 상태

const panelStore = usePanelStore()
const selectedItemLocal = ref(null)
// v-data-table의 v-model과 연결될 내부 상태
const selectedItems = ref([])

const props = defineProps({
  searchSchema: { type: Array, required: true },
  headers: { type: Array, required: true },
  apiEndpoint: { type: String, required: true },
  showCheckbox: { type: Boolean, default: false },
  isHover: { type: Boolean, default: false }, // 부모로부터 어떤 행이 선택되었는지 받음
  userFormSchema: { type: Array, required: true }, // 부모로부터 폼 스키마 받음
  actions: {
    type: Array,
    default: function () {
      return []
    },
  },
})
// ✨ [추가] computed 속성을 만듭니다.
// props.headers가 변경되거나, 언어가 변경(t 함수가 변경)될 때마다
// 이 코드가 자동으로 다시 실행되어 새로운 번역된 헤더 배열을 만듭니다.
const translatedHeaders = computed(() => {
  return props.headers.map((header) => ({
    ...header, // key, align 등 나머지 속성은 그대로 복사
    title: t(header.title, header.title), // title 속성만 번역
  }))
})

const searchParams = reactive({})
// searchSchema를 기반으로 searchParams 초기화
props.searchSchema.forEach(function (item) {
  searchParams[item.key] = null
})

const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
})

function openDeleteConfirmDialog() {
  // 1. 선택된 항목이 있는지 확인
  if (selectedItems.value.length === 0) {
    alert('삭제할 항목을 선택해주세요.')
    return
  }
  // 2. 다이얼로그 표시
  showDeleteConfirm.value = true
}

// 데이터 로드 함수
async function loadItems(newOptions) {
  // v-data-table-server의 options가 변경될 때마다 이 함수가 호출됩니다.
  // newOptions 파라미터에 최신 페이지, 정렬 정보가 담겨있습니다.
  if (newOptions) {
    options.value = newOptions
  }

  loading.value = true

  // 1. API로 보낼 쿼리 파라미터를 준비합니다.
  const query = {
    ...searchParams, // 검색 조건
    page: options.value.page, // 현재 페이지
    limit: options.value.itemsPerPage, // 페이지 당 항목 수
    // 정렬 조건 처리 (배열의 첫 번째 항목 사용)
    sortBy: options.value.sortBy.length ? options.value.sortBy[0].key : null,
    sortOrder: options.value.sortBy.length ? options.value.sortBy[0].order : null,
  }

  try {
    // 2. 공통 API 함수를 호출하고 결과를 받습니다.
    const responseData = await fetchListData(props.apiEndpoint, query)

    // 3. 컴포넌트의 상태를 업데이트합니다.
    serverItems.value = responseData.items
    totalItems.value = responseData.total
  } catch (error) {
    // fetchListData 내부에서 에러를 처리하지만,
    // 컴포넌트 레벨에서 추가적인 에러 처리가 필요하다면 여기에 작성합니다.
    console.error('An error occurred in the component while loading data:', error)
    serverItems.value = []
    totalItems.value = 0
  } finally {
    // 4. API 호출 성공/실패와 관계없이 로딩 상태를 해제합니다.
    loading.value = false
  }
}

// 조회 버튼 클릭 시 1페이지로 리셋 후 조회
function search() {
  options.value.page = 1
  // page만 바꾸고 loadItems를 직접 호출하면 정렬 등의 다른 옵션이 누락될 수 있습니다.
  // v-data-table-server는 options가 변경되면 자동으로 @update:options 이벤트를 발생시키므로
  // loadItems()를 직접 호출할 필요가 없습니다. 하지만 명시적으로 호출하는 것이 더 직관적일 수 있습니다.
  loadItems()
}

function handleRowClick(event, { item }) {
  selectedItemLocal.value = item
  panelStore.openReadOnlyPanel(props.userFormSchema, item) // 스키마 전달
}

async function handleDeleteClick() {
  console.log('삭제할 항목들:', selectedItems.value)

  try {
    // 3. 선택된 항목들에서 ID만 추출하여 배열 생성
    const idsToDelete = selectedItems.value.map((item) => item.id)
    // 4. 공통 API 함수를 호출하여 삭제 요청
    await deleteItems(props.apiEndpoint, idsToDelete)

    // 5. 성공 처리
    alert('성공적으로 삭제되었습니다.')
    selectedItems.value = [] // 선택 상태 초기화
    loadItems() // 데이터 테이블 새로고침
  } catch (error) {
    // 6. 실패 처리
    alert('삭제 처리 중 오류가 발생했습니다.')
    console.error('An error occurred while deleting items:', error)
  } finally {
    showDeleteConfirm.value = false // 다이얼로그 닫기
  }
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
.datatable-wrapper {
  height: 100%;
  width: 100%;
  /* 🔑 내부 스크롤을 위해 필요 */
  min-height: 0;
}
.table-wrapper {
  position: relative;
  /* 이 래퍼(wrapper)가 flex-grow-1로 늘어난 공간을 차지하고
    내용이 넘치는 것을 숨겨서, 자식인 v-data-table-server가
    height: 100%를 정확히 계산하도록 돕습니다.
  */
  overflow: auto;
  /* 남은 공간 모두 차지 */
  flex: 1 1 0;
  /* 🔑 자식이 0까지 줄어들 수 있어야 overflow 영역 생성 */
  min-height: 0;
}
/* Vuetify v-data-table이 100% 높이를 제대로 채우도록 강제 */
.table-wrapper :deep(.v-data-table) {
  height: 100%;
  display: flex;
  /* wrapper가 남은 높이를 먹도록 */
  flex-direction: column;
}

/* (선택) 푸터 고정 시 */
.table-wrapper :deep(.v-data-table__bottom) {
  /* flex-shrink: 0; */
}

/* ServerSideDataTable 업그레이드 */
/* 루트 카드: 가로/세로 풀 채움 + 평평한 베이스 */
.datatable-card {
  width: 100%;
  height: 100%;
  min-height: 0; /* 내부 스크롤 허용 */
  border: none;
  box-shadow: none;
  background: rgb(var(--v-theme-surface));
}

/* 타이틀: 높이/여백 절제 */
.datatable-title {
  min-height: 44px;
  padding-block: 6px;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

/* 검색 패널: 얕은 경계선 + 조밀한 그리드 */
.search-panel {
  margin: 4px 0 8px 0;
  padding: 10px 12px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  background: rgb(var(--v-theme-surface));
  border-radius: 8px;
}
.search-row {
  row-gap: 8px;
}
.search-actions .v-btn + .v-btn {
  margin-left: 8px;
}

/* 툴바: 하단 경계선으로 영역 구분 */
.results-toolbar {
  min-height: 42px;
  padding-inline: 8px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
.results-toolbar .v-toolbar-title {
  color: rgba(var(--v-theme-on-surface), 0.82);
}

/* 테이블 래퍼: 스크롤 컨테이너 */
.table-wrapper {
  position: relative;
  overflow: auto;
  flex: 1 1 0;
  min-height: 0;
  background: rgb(var(--v-theme-surface));
}

/* v-data-table-server 베이스 (BaseDataTable과 톤 통일) */
:deep(.server-table) {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
  border: none;
  box-shadow: none;
}

/* 헤더: sticky + 분리선 */
:deep(.server-table .v-data-table__thead) {
  position: sticky;
  top: 0;
  z-index: 2;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}
:deep(.server-table th) {
  white-space: nowrap;
  font-weight: 700;
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.78);
  height: 38px;
  padding: 0 12px;
}

/* 바디 셀: 라인 최소화 + 가독성 */
:deep(.server-table td) {
  white-space: nowrap;
  font-size: 0.92rem;
  color: rgba(var(--v-theme-on-surface), 0.87);
  height: 38px;
  padding: 0 12px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

/* Zebra (은은하게) */
:deep(.server-table .v-data-table__tbody tr:nth-child(even)) {
  background-color: rgba(var(--v-theme-on-surface), 0.02);
}

/* Hover: primary 아주 약하게 */
:deep(.server-table .v-data-table__tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.06);
}

/* Selected: primary 조금 더 진하게 + 좌측 인디케이터 */
:deep(.server-table .v-data-table__tbody tr.v-data-table__selected) {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  position: relative;
}
:deep(.server-table .v-data-table__tbody tr.v-data-table__selected::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: rgb(var(--v-theme-primary));
}

/* Focus(키보드 탐색) */
:deep(.server-table .v-data-table__tbody tr:focus-visible) {
  outline: 2px solid rgba(var(--v-theme-primary), 0.8);
  outline-offset: -2px;
}

/* 긴 문자열 처리 */
.cell-ellipsis {
  display: inline-block;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

/* 실제 스크롤은 wrapper가 담당 */
:deep(.v-data-table__wrapper) {
  overflow: auto;
}
:deep(.v-data-table__wrapper table) {
  table-layout: fixed;
  width: 100%;
}

/* 체크박스/액션 컬럼 폭 조정 */
:deep(th.v-data-table__td--checkbox),
:deep(td.v-data-table__td--checkbox) {
  width: 44px;
  padding: 0 8px;
}

/* 빈/로딩 상태 톤 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

/* sticky footer(페이지네이션) */
:deep(.server-table .v-data-table__bottom) {
  position: sticky;
  bottom: 0;
  z-index: 1;
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

/* 스크롤바 정리 (선택) */
.table-wrapper::-webkit-scrollbar {
  height: 10px;
  width: 10px;
}
.table-wrapper::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-surface), 0.2);
  border-radius: 8px;
}
.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-on-surface), 0.3);
}

/* 다크 모드 미세 조정 */
:deep(.v-theme--dark .server-table .v-data-table__tbody tr:nth-child(even)) {
  background-color: rgba(255, 255, 255, 0.02);
}
:deep(.v-theme--dark .server-table td) {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}
</style>
