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
            :readonly="isFieldReadOnly(field)"
            density="compact"
            variant="solo"
            flat
            :class="['mb-2', { 'readonly-field': isFieldReadOnly(field) }]"
            :loading="loadingKey === field.key"
            @update:search="onAutocompleteSearch($event, field)"
            no-filter
          >
            <template
              v-if="field.component === 'v-autocomplete' && !field.isLastPage"
              v-slot:append-item
            >
              <div v-intersect="onAutocompleteLoadMore" class="pa-2 text-center">
                <v-progress-circular
                  v-if="field.loadingMore"
                  indeterminate
                  color="primary"
                  size="20"
                ></v-progress-circular>
              </div>
            </template>
          </component>
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
const localFormSchema = ref([])
const loadingKey = ref(null)
const searchTimeouts = ref({})
const intersectingField = ref(null)
const isSelecting = ref(false) // 💡 [플래그 추가]

// ✨ [리팩토링] 5. Computed

// 💡 [해결책] isReadOnly computed 속성 추가
const isReadOnly = computed(function () {
  // formMode가 null (falsy)이면 true (읽기 전용)
  // formMode가 'create' 또는 'edit' (truthy)이면 false
  return !panelStore.formMode
})

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

    // 'schema'의 원본 속성(items, page 등)과 'label'을 합친 '복사본'이 반환됩니다.
    return Object.assign({}, schema, { label: translated })
  })
})

const activeDataItem = computed(function () {
  return panelStore.formMode ? panelStore.formData : panelStore.selectedItem
})

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

      const newLocalSchema = JSON.parse(JSON.stringify(newSchema))

      const fetchTasks = newLocalSchema.map(async function (item) {
        if (item.component === 'v-select' && item.apiEndpoint && !item.dependsOn) {
          item.items = await metaDataStore.getItems(
            item.apiEndpoint,
            item['item-value'],
            item['item-title'],
            false,
          )
        }
        // (2) ✨ [수정] v-autocomplete 로직
        else if (item.component === 'v-autocomplete' && item.apiEndpoint) {
          // A. 상태 객체 초기화
          item.items = []
          item.page = 1 // 👈 [수정] 0-based -> 1-based
          item.totalPages = 1
          item.isLastPage = false
          item.loadingMore = false
          item.currentSearch = ''

          // B. 수정 모드일 때, 현재 ID에 해당하는 항목 이름을 표시
          const selectedValue = panelStore.formData[item.key]
          if (selectedValue !== null && selectedValue !== undefined && selectedValue !== '') {
            try {
              const query = { [item['item-value']]: selectedValue }
              const response = await fetchListData(item.apiEndpoint, query)
              const items = response.items || response.content || response

              if (items.length > 0) {
                const itemValue = item['item-value']
                const itemTitle = item['item-title']
                item.items = items.map(function (i) {
                  return { [itemValue]: i[itemValue], [itemTitle]: i[itemTitle] }
                })
                item.isLastPage = true
              }
            } catch (e) {
              console.error('Failed to fetch initial v-autocomplete item', e)
              item.items = []
            }
          }
        }
        return item
      })

      const populatedSchema = await Promise.all(fetchTasks)
      localFormSchema.value = populatedSchema
    } else {
      localFormSchema.value = []
    }
  },
  { deep: true, immediate: true },
)

/**
 * 'formData'가 변경될 때마다 연쇄 v-select 처리를 위해
 */
watch(
  function () {
    return { ...panelStore.formData }
  },
  function (newFormData, oldFormData) {
    if (oldFormData) {
      handleFormDataChange(newFormData, oldFormData)
    }
  },
)

// ✨ [리팩토링] 7. Methods

// 💡 [추가] 7-X. 필드별 Readonly 상태를 계산하는 함수
/**
 * 현재 필드가 읽기 전용 상태여야 하는지 판단합니다.
 * @param {object} field - v-for 루프의 현재 schema 필드
 * @returns {boolean} - 읽기 전용 여부
 */
function isFieldReadOnly(field) {
  // 1. (전역) '읽기 모드'일 경우 (formMode: null)
  //    모든 필드는 무조건 true
  if (isReadOnly.value) {
    return true
  }

  // 2. (필드) '수정 모드'일 경우 (formMode: 'edit')
  if (panelStore.formMode === 'edit') {
    // 2-1. field.editAvailable가 false로 명시된 경우
    if (field.editAvailable === false) {
      // 👈 'editAvailble' 오타일 경우 여기를 수정하세요
      return true
    }
  }

  // 3. '생성 모드' (formMode: 'create') 이거나
  //    '수정 모드'에서 editAvailable가 true 또는 undefined인 경우
  return false
}

/**
 * Autocomplete API 호출을 담당하는 공통 함수
 */
async function fetchAutocompleteItems(field, search) {
  // 'field'는 computed 복사본이므로, 'localFormSchema' (원본)에서 'originalField'를 찾습니다.
  const originalField = localFormSchema.value.find(function (f) {
    return f.key === field.key
  })
  if (!originalField) {
    console.error('localFormSchema에서 원본 field를 찾을 수 없습니다!', field.key)
    return
  }

  if (originalField.loadingMore) return

  const PAGE_SIZE = 20

  originalField.loadingMore = true
  if (originalField.page === 1) {
    // 👈 [수정] 1-based
    loadingKey.value = originalField.key
  }

  try {
    const itemValue = originalField['item-value']
    const itemTitle = originalField['item-title']

    const query = {
      [itemTitle]: search.trim(),
      size: PAGE_SIZE,
      page: originalField.page, // 👈 [수정] 1-based
    }

    const response = await fetchListData(originalField.apiEndpoint, query)
    const items = response.items || response.content || []

    const mappedItems = items.map(function (item) {
      return { [itemValue]: item[itemValue], [itemTitle]: item[itemTitle] }
    })

    if (originalField.page === 1) {
      // 👈 [수정] 1-based
      originalField.items = mappedItems
    } else {
      // 🚨 [추가] 중복 제거 로직 (SidePanel에도 동일하게 적용)
      const existingIds = new Set(
        originalField.items.map(function (item) {
          return item[itemValue]
        }),
      )
      const newItemsOnly = mappedItems.filter(function (item) {
        return !existingIds.has(item[itemValue])
      })
      originalField.items = [...originalField.items, ...newItemsOnly]
    }

    if (response.last !== undefined) {
      originalField.isLastPage = response.last
    } else {
      originalField.isLastPage = items.length < PAGE_SIZE
    }
  } catch (error) {
    console.error(`Error fetching autocomplete data for ${originalField.key}`, error)
    originalField.items = []
    originalField.isLastPage = true
  } finally {
    originalField.loadingMore = false
    loadingKey.value = null
  }
}

/**
 * v-autocomplete 검색 핸들러 (디바운싱 적용)
 */
function onAutocompleteSearch(search, field) {
  // 💡 [수정 1] 선택 플래그가 true이면 검색 로직을 즉시 중단
  if (isSelecting.value) {
    console.log('(방어) 현재 항목 선택 중이므로, @update:search 이벤트를 무시합니다.')
    return
  }

  // 'field'는 computed 복사본
  if (field.component !== 'v-autocomplete') return

  const originalField = localFormSchema.value.find(function (f) {
    return f.key === field.key
  })
  if (!originalField) return

  intersectingField.value = originalField
  originalField.currentSearch = search || ''

  if (searchTimeouts.value[originalField.key]) {
    clearTimeout(searchTimeouts.value[originalField.key])
  }

  if (!search || search.trim().length < 1) {
    return
  }

  searchTimeouts.value[originalField.key] = setTimeout(async function () {
    originalField.page = 1 // 👈 [수정] 0-based -> 1-based
    originalField.isLastPage = false
    originalField.items = []

    await fetchAutocompleteItems(originalField, originalField.currentSearch)
  }, 300)
}

/**
 * v-intersect 스크롤 감지 핸들러
 */
function onAutocompleteLoadMore(isIntersecting, entries, observer) {
  const field = intersectingField.value

  // 🚨 [수정] ServerSide와 동일한 4가지 조건으로 강화
  if (
    isIntersecting &&
    field &&
    !field.loadingMore &&
    !field.isLastPage &&
    loadingKey.value === null &&
    field.items.length > 0 // [중요] Page 1 로드 완료 조건
  ) {
    console.log(`(패널) 스크롤 감지: ${field.key} (Page: ${field.page + 1})`)

    field.page++
    fetchAutocompleteItems(field, field.currentSearch)
  }
}

/**
 * 폼 데이터 변경 감지 시 실행되는 메인 핸들러
 */
async function handleFormDataChange(newFormData, oldFormData) {
  const changedKeys = Object.keys(newFormData).filter(function (key) {
    return newFormData[key] !== oldFormData[key]
  })

  if (changedKeys.length === 0) return
  console.log('변경된 필드:', changedKeys)

  for (const changedKey of changedKeys) {
    const dependentFields = localFormSchema.value.filter(function (field) {
      if (!field.dependsOn) return false
      // 2. [핵심] 자기 자신은 종속 필드가 아님
      if (field.key === changedKey) {
        return false
      }
      if (Array.isArray(field.dependsOn)) {
        return field.dependsOn.includes(changedKey)
      }
      if (typeof field.dependsOn === 'string') {
        return field.dependsOn === changedKey
      }
      return false
    })

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
  let dependencies = []
  if (Array.isArray(fieldToUpdate.dependsOn)) {
    dependencies = fieldToUpdate.dependsOn
  } else if (typeof fieldToUpdate.dependsOn === 'string') {
    dependencies = [fieldToUpdate.dependsOn]
  }

  let allDependenciesMet = true
  const query = {}

  for (const depKey of dependencies) {
    const value = newFormData[depKey]
    if (value === null || value === undefined || value === '') {
      allDependenciesMet = false
      break
    }
    query[depKey] = value
  }

  if (allDependenciesMet && fieldToUpdate.apiEndpoint) {
    try {
      let response
      if (fieldToUpdate.PathVariable) {
        let PathVariableURL
        for (const property in query) {
          PathVariableURL = fieldToUpdate.apiEndpoint + '/' + query[property]
        }
        console.log(`API 호출 (동적 쿼리): ${PathVariableURL}`)
        response = await fetchListData(PathVariableURL, {})
      } else {
        console.log(`API 호출 (동적 쿼리): ${fieldToUpdate.apiEndpoint}`, query)
        response = await fetchListData(fieldToUpdate.apiEndpoint, query)
      }

      const items = response.items || response.content || response

      const itemValue = fieldToUpdate['item-value']
      const itemTitle = fieldToUpdate['item-title']
      const responseMapData = items.map(function (item) {
        return { [itemValue]: item[itemValue], [itemTitle]: item[itemTitle] }
      })

      fieldToUpdate.items = responseMapData
    } catch (error) {
      console.error(
        'An error occurred while fetching dependent items for ' + fieldToUpdate.key,
        error,
      )
      fieldToUpdate.items = []
    }
  } else {
    console.log('부모 값 중 하나가 비어있으므로 자식 필드를 초기화합니다.')
    fieldToUpdate.items = []
  }

  panelStore.updateFormDataField(fieldToUpdate.key, null)
}

function updateItemData(key, value) {
  // 💡 [수정 2] 선택 시작 플래그 설정
  isSelecting.value = true
  console.log('(플래그) ' + key + ' 선택 시작. isSelecting = true')

  // 💡 [디버깅 코드 추가]
  console.log('--- [항목 선택] ---')
  console.log('선택한 필드 key:', key)
  console.log('현재 searchTimeouts 객체:', JSON.parse(JSON.stringify(searchTimeouts.value)))
  console.log('해당 key로 타이머를 찾았나?:', searchTimeouts.value[key])
  if (searchTimeouts.value[key]) {
    console.log('타이머(ID: ' + searchTimeouts.value[key] + ')를 취소합니다.')
    clearTimeout(searchTimeouts.value[key])
    searchTimeouts.value[key] = null // 타이머 ID 정리
  } else {
    console.log('취소할 타이머가 없습니다.') // 👈 아마 이 로그가 뜰 것 같습니다.
  }
  panelStore.updateFormDataField(key, value)
  // 💡 [수정 3] '선택' 이벤트 처리가 모두 끝난 후 플래그를 해제
  // @update:search 이벤트가 처리될 시간을 주기 위해
  // 이벤트 루프의 맨 뒤로 작업을 보냅니다.
  setTimeout(function () {
    isSelecting.value = false
    console.log('(플래그) 선택 로직 완료. isSelecting = false')
  }, 0) // 0ms 타이머
}

function updateSelectedItemData(key, value) {
  // 💡 [버그 수정] - 동일한 로직 적용
  if (searchTimeouts.value[key]) {
    clearTimeout(searchTimeouts.value[key])
    searchTimeouts.value[key] = null
  }
  panelStore.updateSelectedItemField(key, value)
  setTimeout(function () {
    isSelecting.value = false
  }, 0)
}

function onCancel() {
  panelStore.closePanel()
}

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

/* 읽기 전용 필드(.readonly-field) 내부의
  실제 입력창 UI(.v-field) 스타일을 지정합니다.
*/
:deep(.readonly-field .v-field) {
  /* 'variant="solo"'가 적용된 Vuetify 컴포넌트의 배경색을
    덮어쓰기 위해 !important를 사용합니다.
  */
  background-color: #f0f0f0 !important; /* 연한 회색 배경 */
  color: #666666; /* 내부 텍스트 색상 */
}

/* v-select나 v-autocomplete의 드롭다운 화살표 클릭을 막고
  시각적으로 비활성화된 것처럼 보입니다.
*/
:deep(.readonly-field) {
  pointer-events: none;
}

/*
  화살표 아이콘을 연하게 처리합니다.
*/
:deep(.readonly-field .v-field__append-inner) {
  opacity: 0.5;
}
</style>
