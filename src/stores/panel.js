// src/stores/panel.js
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePanelStore = defineStore('panel', () => {
  // State: 패널이 열려있는지 여부
  const isPanelOpen = ref(false)

  // 1. 선택된 아이템 데이터를 저장할 상태 추가
  const selectedItem = ref(null)

  // Actions
  function openPanel() {
    isPanelOpen.value = true
  }

  function closePanel() {
    isPanelOpen.value = false
  }

  function togglePanel() {
    isPanelOpen.value = !isPanelOpen.value
  }

  // 2. 선택된 아이템을 설정하는 함수 추가
  function setSelectedItem(item) {
    selectedItem.value = item
  }

  return {
    isPanelOpen,
    selectedItem,
    openPanel,
    closePanel,
    togglePanel,
    setSelectedItem,
  }
})
