// src/stores/panel.js
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePanelStore = defineStore('panel', () => {
  // State: 패널이 열려있는지 여부
  const isPanelOpen = ref(false)

  // 1. 선택된 아이템 데이터를 저장할 상태 추가
  const selectedItem = ref(null)
  const apiUrl = ref('')
  const onSaveAction = ref(null) // ✅ 저장 콜백을 저장할 상태 추가
  const onSuccessAction = ref(null) // ✅ 성공 콜백을 저장할 상태 추가

  // --- 새로 추가되는 상태들 ---
  // 1. 폼을 그리기 위한 '설계도(Schema)'
  const formSchema = ref([])
  // 2. 폼에 바인딩 될 실제 데이터 객체
  const formData = ref({})
  // 3. 현재 폼의 모드 ('create' 또는 'edit')
  const formMode = ref(null) // 'create', 'edit'

  function closePanel() {
    isPanelOpen.value = false
    selectedItem.value = null
    formSchema.value = [] // 폼 관련 상태 모두 초기화
    formData.value = {}
    formMode.value = null
  }

  /**
   * (수정) Row 클릭 시 읽기용 패널을 여는 함수
   * @param {object} item - 행 데이터
   */
  function openReadOnlyPanel(schema, item) {
    selectedItem.value = item
    formMode.value = null
    isPanelOpen.value = true
    formSchema.value = schema
    formData.value = { ...item } // 원본 수정을 방지하기 위해 복사해서 사용
  }

  function togglePanel() {
    isPanelOpen.value = !isPanelOpen.value
  }

  /**
   * (신규) '생성' 또는 '수정'을 위한 폼 패널을 여는 함수
   * @param {Array} schema - View에서 정의한 폼 설계도
   * @param {object} initialData - 초기 데이터 (생성 시에는 빈 객체, 수정 시에는 원본 데이터)
   * @param {string} mode - 'create' 또는 'edit'
   */
  function openFormPanel(schema, initialData, mode, url, onSave, onSuccess) {
    selectedItem.value = null // 읽기용 데이터는 비워둠
    formSchema.value = schema
    formData.value = { ...initialData } // 원본 수정을 방지하기 위해 복사해서 사용
    formMode.value = mode
    isPanelOpen.value = true
    apiUrl.value = url // API URL 저장
    onSaveAction.value = onSave
    onSuccessAction.value = onSuccess // 성공 콜백 저장
  }

  /**
   * 서버로 폼 데이터를 저장하는 함수 (예: API 호출)
   */
  async function saveForm() {
    console.log('폼 데이터:', formData.value)
    console.log('폼 데이터 모드:', formMode.value)
    if (typeof onSaveAction.value !== 'function') return

    try {
      await onSaveAction.value(apiUrl.value, formData.value) // API 호출 실행

      // ✅ API 호출 성공 후, 저장해뒀던 onSuccessAction 실행!
      if (typeof onSuccessAction.value === 'function') {
        onSuccessAction.value() // 이 코드가 부모의 reloadData()를 실행시킴
      }

      closePanel()
    } catch (error) {
      console.error('저장 실패:', error)
      // 실패 시에는 onSuccessAction을 실행하지 않음
    }
  }

  // ✅ [추가] formData의 특정 필드를 업데이트하는 액션
  function updateFormDataField(key, value) {
    if (formData.value) {
      formData.value[key] = value
      console.log(`[Store] formData.${key} updated to:`, value)
    }
  }
  // ✅ [추가] formData의 특정 필드를 업데이트하는 액션
  function updateSelectedItemField(key, value) {
    if (selectedItem.value) {
      selectedItem.value[key] = value
      console.log(`[Store] selectedItem.${key} updated to:`, value)
    }
  }

  return {
    isPanelOpen,
    selectedItem,
    formSchema,
    formData,
    formMode,
    apiUrl,
    onSaveAction,
    onSuccessAction,
    closePanel,
    openReadOnlyPanel,
    openFormPanel,
    togglePanel,
    saveForm,
    updateFormDataField,
    updateSelectedItemField,
  }
})
