<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :item-value="itemKey"
    :show-select="showCheckbox"
    :model-value="selectedCheckboxItems"
    @update:model-value="$emit('update:selected', $event)"
    class="flex-grow-1"
    density="compact"
    fixed-header
    return-object
  >
    <template v-slot:item="{ item, internalItem, isSelected }">
      <tr
        :class="{ 'selected-row': selectedRowItem && selectedRowItem[itemKey] === item[itemKey] }"
        @click="$emit('row-click', item)"
      >
        <td v-if="showCheckbox">
          <v-checkbox-btn
            :model-value="isSelected(internalItem)"
            @click.stop="$emit('toggle-select', internalItem)"
          ></v-checkbox-btn>
        </td>
        <td v-for="header in headers" :key="header.key" :class="`text-${header.align || 'start'}`">
          {{ item[header.key] }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup>
defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  itemKey: { type: String, required: true },
  showCheckbox: { type: Boolean, default: false },
  selectedRowItem: { type: Object, default: null }, // 부모로부터 어떤 행이 선택되었는지 받음
  selectedCheckboxItems: { type: Array, default: () => [] }, // 부모로부터 어떤 체크박스가 선택되었는지 받음
})

defineEmits(['row-click', 'update:selected', 'toggle-select'])
</script>

<style scoped>
:deep(tbody tr) {
  cursor: pointer;
}
.selected-row {
  background-color: #e3f2fd;
  font-weight: bold;
}
</style>
