<template>
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
    @click:row="handleRowClick"
    :hover="isHover"
  >
  </v-data-table>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  itemKey: { type: String, required: true },
  showCheckbox: { type: Boolean, default: false },
  selectedRowItem: { type: Object, default: null }, // 부모로부터 어떤 행이 선택되었는지 받음
  isHover: { type: Boolean, default: false }, // 부모로부터 어떤 행이 선택되었는지 받음
})

const emit = defineEmits(['row-click', 'update:selected'])

// v-data-table의 v-model과 연결될 내부 상태
const selectedItems = ref([])

// 행 클릭 이벤트는 그대로 부모에게 전달
function handleRowClick(event, { item }) {
  emit('row-click', item)
}

// 체크박스 선택이 변경되면 부모에게 알림
watch(selectedItems, (newValue) => {
  emit('update:selected', newValue)
})
</script>

<style scoped>
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
  border-left-style: solid;
  border-color: black;
  border-width: 1px;
}

:deep(td) {
  white-space: nowrap;
}
</style>
