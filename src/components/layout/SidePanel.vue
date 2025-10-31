<template>
  <div class="side-panel" :class="{ 'is-open': props.isOpen }">
    <v-card class="fill-height" flat>
      <v-card-title>
        <span v-if="panelStore.formMode === 'create'">
          {{ $t(panelStore.panelTitleKey) }} {{ $t('common.create') }}
        </span>
        <span v-else-if="panelStore.formMode === 'edit'">
          {{ $t(panelStore.panelTitleKey) }} {{ $t('common.edit') }}
        </span>
        <span v-else> {{ $t(panelStore.panelTitleKey) }} {{ $t('common.details') }} </span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <div v-if="activeDataItem">
          <component
            v-for="field in translatedFormSchema"
            :key="field.key"
            :is="componentMap[field.component]"
            :placeholder="field.label"
            :label="field.label"
            :items="field.items"
            clearable
            :item-title="field['item-title']"
            :item-value="field['item-value']"
            :model-value="activeDataItem[field.key]"
            @update:model-value="activeUpdateHandler(field.key, $event)"
            density="compact"
            variant="solo"
            flat
            class="mb-2"
          ></component>
        </div>
      </v-card-text>

      <v-card-actions v-if="panelStore.formMode">
        <v-spacer></v-spacer>
        <v-btn @click="onCancel">{{ $t('common.cancel') }}</v-btn>
        <v-btn @click="onSave">{{ $t('common.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
// ✨ [리팩토링] 1. Imports
import { computed, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePanelStore } from '@/stores/panel'
import { useMetaDataStore } from '@/stores/metaData'
import { componentMap } from '@/constants/componentMap'
import { fetchListData } from '@/api/dataTable' // 공통 API 함수 import

// ✨ [리팩토링] 2. Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

// ✨ [리팩토링] 3. Dependencies
const { t, locale } = useI18n()
const panelStore = usePanelStore()
const metaDataStore = useMetaDataStore()

// ✨ [리팩토링] 4. State
// 스토어의 스키마를 복사하여 'items' 목록 등을 로컬에서 수정/관리합니다.
const localFormSchema = ref([])

// ✨ [리팩토링] 5. Computed
/**
 * localFormSchema의 'labelKey'를 i18n으로 번역합니다.
 */
const translatedFormSchema = computed(function () {
  const _ = locale.value // 언어 변경 감지

  return localFormSchema.value.map(function (schema) {
    const key = schema.labelKey != null ? schema.labelKey : schema.label != null ? schema.label : ''
    let translated = key ? t(key) : ''
    if (!translated || translated === key) {
      translated = schema.label != null ? schema.label : key
    }

    return Object.assign({}, schema, { label: translated })
  })
})

/**
 * ✨ [리팩토링] 템플릿 중복 제거용:
 * 현재 모드(form/readonly)에 맞는 데이터 객체를 반환합니다.
 */
const activeDataItem = computed(function () {
  return panelStore.formMode ? panelStore.formData : panelStore.selectedItem
})

/**
 * ✨ [리팩토링] 템플릿 중복 제거용:
 * 현재 모드에 맞는 데이터 업데이트 함수를 반환합니다.
 */
const activeUpdateHandler = computed(function () {
  return panelStore.formMode ? updateItemData : updateSelectedItemData
})

// ✨ [리팩토링] 6. Watchers
/**
 * 스토어의 'formSchema'가 변경되면(패널이 열리면)
 * 'localFormSchema'로 깊은 복사(deep copy)를 수행합니다.
 */
watch(
  function () {
    return panelStore.formSchema
  },
  async function (newSchema) {
    if (newSchema && newSchema.length > 0) {
      console.log('패널이 열렸습니다. 로컬 폼 스키마를 스토어에서 복사합니다.')

      // 1. 먼저 스키마 구조를 깊은 복사합니다.
      const newLocalSchema = JSON.parse(JSON.stringify(newSchema))

      // 2. 복사된 스키마를 순회하며 API가 필요한 항목을 채웁니다.
      // (Promise.all을 사용해 모든 API 호출을 병렬로 처리)
      const fetchTasks = newLocalSchema.map(async function (item) {
        // ✨ [신규] 'apiEndpoint'가 있고, 의존성이 없는 경우
        // (참고: SidePanel은 'apiEndpoint' 키를 사용하도록 수정했었습니다)
        if (item.component === 'v-select' && item.apiEndpoint && !item.dependsOn) {
          item.items = await metaDataStore.getItems(
            item.apiEndpoint,
            item['item-value'],
            item['item-title'],
            false, // 폼 패널이므로 '선택안함' 옵션 *미포함*
          )
        }
        return item
      })

      // 3. 모든 데이터 로딩이 완료될 때까지 기다립니다.
      const populatedSchema = await Promise.all(fetchTasks)

      // 4. 데이터가 모두 채워진 스키마를 최종적으로 할당합니다.
      localFormSchema.value = populatedSchema
    } else {
      localFormSchema.value = []
    }
  },
  { deep: true, immediate: true },
)

/**
 * 'formData'가 변경될 때마다 연쇄 v-select 처리를 위해
 * 'handleFormDataChange' 함수를 호출합니다.
 */
watch(
  function () {
    return { ...panelStore.formData }
  },
  function (newFormData, oldFormData) {
    // oldFormData가 있어야만(초기 로드 제외) 변경 감지 로직 실행
    if (oldFormData) {
      handleFormDataChange(newFormData, oldFormData)
    }
  },
  // { deep: true } // 얕은 복사본을 반환하므로 deep: true 불필요
)

// ✨ [리팩토링] 7. Methods
/**
 * 폼 데이터 변경 감지 시 실행되는 메인 핸들러
 */
async function handleFormDataChange(newFormData, oldFormData) {
  // 변경된 필드 키 목록 찾기
  const changedKeys = Object.keys(newFormData).filter(function (key) {
    return newFormData[key] !== oldFormData[key]
  })

  if (changedKeys.length === 0) return
  console.log('변경된 필드:', changedKeys)

  for (const changedKey of changedKeys) {
    // 이 'changedKey'에 의존하는 'localFormSchema' 내의 필드들 찾기
    const dependentFields = localFormSchema.value.filter(function (field) {
      if (!field.dependsOn) return false
      // 배열 방식 (권장)
      if (Array.isArray(field.dependsOn)) {
        return field.dependsOn.includes(changedKey)
      }
      // (호환성) 문자열 방식
      if (typeof field.dependsOn === 'string') {
        return field.dependsOn === changedKey
      }
      return false
    })

    // 찾은 모든 의존 필드(자식 필드)의 목록을 업데이트
    for (const fieldToUpdate of dependentFields) {
      console.log(`'${fieldToUpdate.key}' 필드는 '${changedKey}'의 변경을 감지했습니다.`)
      await fetchDependentItems(fieldToUpdate, newFormData)
    }
  }
}

/**
 * 'fieldToUpdate'의 'items' 목록을 API로 가져오는 헬퍼 함수
 */
async function fetchDependentItems(fieldToUpdate, newFormData) {
  // 1. 의존성 목록(dependencies) 확보 (배열/문자열 호환)
  let dependencies = []
  if (Array.isArray(fieldToUpdate.dependsOn)) {
    dependencies = fieldToUpdate.dependsOn
  } else if (typeof fieldToUpdate.dependsOn === 'string') {
    dependencies = [fieldToUpdate.dependsOn]
  }

  // 2. 모든 의존성(부모) 값이 채워져 있는지 확인 및 쿼리 객체 생성
  let allDependenciesMet = true
  const query = {}

  for (const depKey of dependencies) {
    const value = newFormData[depKey]
    if (value === null || value === undefined || value === '') {
      allDependenciesMet = false
      break
    }
    query[depKey] = value // API 요청에 사용할 쿼리 파라미터
  }

  // 3. API 엔드포인트가 있고, 모든 의존성이 충족되었는지 확인
  if (allDependenciesMet && fieldToUpdate.apiEndpoint) {
    // [성공] API 호출
    try {
      console.log(`API 호출 (동적 쿼리): ${fieldToUpdate.apiEndpoint}`, query)
      const response = await fetchListData(fieldToUpdate.apiEndpoint, query)

      // 4. v-select에 맞게 데이터 매핑
      const itemValue = fieldToUpdate['item-value']
      const itemTitle = fieldToUpdate['item-title']
      const responseMapData = response.items.map(function (item) {
        return { [itemValue]: item[itemValue], [itemTitle]: item[itemTitle] }
      })

      // responseMapData.unshift({ [itemValue]: '', [itemTitle]: '' })
      // // 5. 로컬 스키마의 'items' 업데이트
      fieldToUpdate.items = responseMapData
    } catch (error) {
      console.error(
        'An error occurred while fetching dependent items for ' + fieldToUpdate.key,
        error,
      )
      fieldToUpdate.items = [] // 오류 시 비움
    }
  } else {
    // [실패] 부모 값이 비어있음 -> 자식 필드 초기화
    console.log('부모 값 중 하나가 비어있으므로 자식 필드를 초기화합니다.')
    fieldToUpdate.items = []
  }

  // 6. (중요) 부모 값이 변경되었으므로, 자식 필드의 '값'을 초기화
  panelStore.updateFormDataField(fieldToUpdate.key, null)
}

/**
 * 폼 모드에서 데이터 업데이트
 */
function updateItemData(key, value) {
  panelStore.updateFormDataField(key, value)
}

/**
 * 읽기 전용 모드에서 데이터 업데이트 (필요시 사용)
 */
function updateSelectedItemData(key, value) {
  panelStore.updateSelectedItemField(key, value)
}

/**
 * '취소' 버튼 핸들러
 */
function onCancel() {
  panelStore.closePanel()
}

/**
 * '저장' 버튼 핸들러
 */
function onSave() {
  panelStore.saveForm()
}
</script>

<style scoped>
/* ✨ [리팩토링] 스타일은 변경 사항 없음 (기존과 동일) */
.side-panel {
  width: 400px;
  height: 100%;
  transition: all 0.6s ease;
  display: flex;
  flex-direction: column;
}

/* ✅ [수정] 3. CSS를 수정합니다. */
.side-panel {
  /* "닫힘" 상태 (기본값) */
  width: 0;
  max-width: 0; /* width 대신 max-width를 사용하면 더 안정적입니다. */
  height: 100%;

  /* 애니메이션 속성 (기존과 동일) */
  transition: all 0.6s ease;

  display: flex;
  flex-direction: column;

  /* "닫힘" 상태에서 내용물이 삐져나오지 않도록 */
  overflow: hidden;
  white-space: nowrap; /* v-card-title 등이 줄바꿈되어 삐져나오는 것 방지 */
}

/* ✅ [추가] 4. "열림" 상태 CSS를 추가합니다. */
.side-panel.is-open {
  width: 400px;
  max-width: 400px;
}
</style>
