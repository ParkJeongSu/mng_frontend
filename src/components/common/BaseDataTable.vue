<template>
  <v-card flat class="d-flex flex-column flex-grow-1 h-100">
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="$accountGroup" /> &nbsp; 사용자 목록
      <v-spacer></v-spacer>
      <v-btn density="compact" icon="$magnify" title="조회"> </v-btn>
      <v-btn
        density="compact"
        icon="$plus"
        :title="$t('dataTable.add')"
        class="ml-2"
        @click="handleAddClick"
      ></v-btn>
      <v-btn
        :disabled="!selectedItemLocal"
        density="compact"
        icon="$pencil"
        :title="$t('dataTable.edit')"
        class="ml-2"
        @click="handleEditClick"
      ></v-btn>
      <v-btn
        :disabled="selectedItems.length === 0"
        density="compact"
        icon="$delete"
        :title="$t('dataTable.delete')"
        class="ml-2"
        @click="handleDeleteClick"
      ></v-btn>
    </v-card-title>

    <v-divider></v-divider>
    <v-card-text class="d-flex flex-column flex-grow-1 pa-0 table-wrapper">
      <v-data-table
        :headers="headers"
        :items="items"
        :show-select="showCheckbox"
        v-model="selectedItems"
        class="flex-grow-1"
        density="compact"
        return-object
        fixed-header
        fixed-layout
        :item-value="itemKey"
        height="100%"
        @click:row="handleRowClick"
        :hover="isHover"
      >
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { usePanelStore } from '@/stores/panel'

const panelStore = usePanelStore()
const selectedItemLocal = ref(null)
// v-data-table의 v-model과 연결될 내부 상태
const selectedItems = ref([])

const props = defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  itemKey: { type: String, required: true },
  showCheckbox: { type: Boolean, default: false },
  isHover: { type: Boolean, default: false }, // 부모로부터 어떤 행이 선택되었는지 받음
  userFormSchema: { type: Array, required: true }, // 부모로부터 폼 스키마 받음
})

function handleRowClick(event, { item }) {
  selectedItemLocal.value = item
  panelStore.openReadOnlyPanel(props.userFormSchema, item) // 스키마 전달
}

function handleDeleteClick() {
  console.log('삭제할 항목들:', selectedItems.value)
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
.table-wrapper {
  /* ✨ 가로로 내용이 넘칠 때만 스크롤바 표시 */
  overflow-x: auto;
  overflow-y: auto;
  /* 세로 레이아웃 관련 (선택 사항) */
  flex: 1;
  display: flex;
  flex-direction: column;
}
:deep(.v-data-table) {
  height: 100%;
  display: flex;
  /* wrapper가 남은 높이를 먹도록 */
  flex-direction: column;
}
/*
  prop으로 해결되지 않을 경우를 대비한 CSS 보험입니다.
  :deep()을 이용해 자식인 v-data-table 내부의 table 태그에
  '쪼그라들지 말라'는 규칙을 한 번 더 강제로 적용합니다.
*/
:deep(.v-data-table__wrapper table) {
  table-layout: fixed;
}

/*
  헤더의 텍스트가 길 경우 줄바꿈되면서 컬럼 너비에 영향을 주는 것을
  방지하기 위한 추가 설정입니다.
*/
:deep(th) {
  white-space: nowrap;

  /*
  border-left-style: solid;
  border-color: black;
  border-width: 1px;
  */
}

:deep(td) {
  white-space: nowrap;
}
</style>
