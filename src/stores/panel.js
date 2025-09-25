// src/stores/panel.js
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePanelStore = defineStore('panel', () => {
  // State: 패널이 열려있는지 여부
  const isPanelOpen = ref(false)

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

  return {
    isPanelOpen,
    openPanel,
    closePanel,
    togglePanel,
  }
})
