// src/stores/panel.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useSnackbarStore } from '@/stores/snackbar' // 👈 [1. 추가] 스낵바 스토어 import

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

  // ✅ [추가] 1. 패널 제목 키를 저장할 상태
  const panelTitleKey = ref('')

  function closePanel() {
    isPanelOpen.value = false
    selectedItem.value = null
    formSchema.value = [] // 폼 관련 상태 모두 초기화
    formData.value = {}
    formMode.value = null
  }

  /**
   * (수정) Row 클릭 시 읽기용 패널을 여는 함수
   * @param {string} titleKey - [추가됨] '메뉴', '사용자' 등의 제목 키
   * @param {object} schema - 행 데이터
   * @param {object} item - 행 데이터
   */
  // ✅ [수정] 3. openReadOnlyPanel에 titleKey 파라미터 추가
  function openReadOnlyPanel(titleKey, schema, item, openFormPanel = true) {
    selectedItem.value = item
    formMode.value = null
    isPanelOpen.value = openFormPanel
    formSchema.value = schema
    formData.value = { ...item } // 원본 수정을 방지하기 위해 복사해서 사용
    panelTitleKey.value = titleKey // ✅ [추가] 4. 제목 키 저장
  }

  function togglePanel() {
    isPanelOpen.value = !isPanelOpen.value
  }

  /**
   * (신규) '생성' 또는 '수정'을 위한 폼 패널을 여는 함수
   * @param {string} titleKey - [추가됨] '메뉴', '사용자' 등의 제목 키
   * @param {Array} schema - View에서 정의한 폼 설계도
   * @param {object} initialData - 초기 데이터
   * @param {string} mode - 'create' 또는 'edit'
   * @param {string} url - API 엔드포인트
   * @param {Function} onSave - 저장 콜백
   * @param {Function} onSuccess - 성공 콜백
   */
  // ✅ [수정] 5. openFormPanel에 titleKey 파라미터 추가
  function openFormPanel(titleKey, schema, initialData, mode, url, onSave, onSuccess) {
    selectedItem.value = null // 읽기용 데이터는 비워둠
    formSchema.value = schema
    formData.value = { ...initialData } // 원본 수정을 방지하기 위해 복사해서 사용
    formMode.value = mode
    isPanelOpen.value = true
    apiUrl.value = url // API URL 저장
    onSaveAction.value = onSave
    onSuccessAction.value = onSuccess // 성공 콜백 저장
    panelTitleKey.value = titleKey // ✅ [추가] 6. 제목 키 저장
  }

  /**
   * 서버로 폼 데이터를 저장하는 함수 (예: API 호출)
   */
  async function saveForm() {
    const snackbarStore = useSnackbarStore() // 👈 [2. 추가] 스토어 인스턴스 생성
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
      // ✅ [3. 추가] 성공 스낵바 호출
      snackbarStore.showSnackbar('성공적으로 저장되었습니다.', 'success')
    } catch (error) {
      console.error('저장 실패:', error)
      // 실패 시에는 onSuccessAction을 실행하지 않음
      // ✅ [4. 추가] 실패 스낵바 호출
      // (백엔드에서 error.response.data.message에 오류 메시지를 보낸다고 가정)
      const errorMsg = error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'
      snackbarStore.showSnackbar('저장 실패: ' + errorMsg, 'error')
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
    panelTitleKey, // ✅ [추가] 7. 외부에서 사용할 수 있도록 반환
    closePanel,
    openReadOnlyPanel,
    openFormPanel,
    togglePanel,
    saveForm,
    updateFormDataField,
    updateSelectedItemField,
  }
})
