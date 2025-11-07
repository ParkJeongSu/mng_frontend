<template>
  <v-card class="datatable-card d-flex flex-column" flat color="surface">
    <v-card-title class="datatable-title text-h5">
      &nbsp; <v-icon :icon="$route.meta.icon || '$databaseOutline'" size="24" /> &nbsp;
      {{ $t(dataTabletitleKey, dataTabletitleKey) }}
    </v-card-title>

    <v-card class="search-panel" color="surface" flat elevation="0">
      <v-row class="search-row" dense no-gutters>
        <v-col v-for="item in translatedsearchSchema" :key="item.key" cols="12" md="auto">
          <component
            :is="componentMap[item.component]"
            v-model="searchParams[item.key]"
            :placeholder="item.label"
            clearable
            :items="item.items"
            :item-title="item['item-title']"
            :item-value="item['item-value']"
            density="compact"
            variant="solo"
            flat
            hide-details
            :type="item.type"
            class="search-input"
          ></component>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="search-actions d-flex justify-end align-center" cols="12" md="auto">
          <slot name="search-bar.append"></slot>
          <v-btn @click="search" color="primary" variant="elevated" prepend-icon="$magnify">
            {{ $t('common.search') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-toolbar class="results-toolbar" density="comfortable" flat color="surface">
      <v-spacer></v-spacer>
      <slot name="actions.prepend"></slot>

      <v-tooltip
        v-for="action in toolbarActions"
        :key="action.key"
        location="bottom"
        :text="action.tooltip"
      >
        <template v-slot:activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            class="ml-2"
            :icon="action.icon"
            density="comfortable"
            @click="action.onClick"
            :loading="action.loading"
            :disabled="action.disabled"
          ></v-btn>
        </template>
      </v-tooltip>
    </v-toolbar>

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
              {{ getFormattedValue(header, slotProps.value) }}
            </span>
          </slot>
        </template>

        <template v-slot:footer.prepend>
          <div class="d-flex align-center pa-2 footer-left-actions">
            <v-btn
              v-for="button in props.footerActions"
              :key="button.label"
              :color="button.color || 'primary'"
              variant="outlined"
              size="small"
              class="ml-2 no-uppercase"
              @click="handleFooterClick(button.action)"
            >
              {{ button.label }}
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </div>

    <input
      type="file"
      ref="fileInput"
      @change="handleFileSelect"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      style="display: none"
    />

    <v-dialog v-model="showImportError" max-width="600">
      <v-card>
        <v-card-title class="text-h5">
          {{ $t('title.importError') }}
        </v-card-title>
        <v-card-text>
          <p>{{ $t('messages.importError') }}</p>
          <v-list density="compact" class="mt-4">
            <v-list-item v-for="(error, index) in importErrorMessages" :key="index" class="pa-0">
              <v-list-item-title>
                <v-icon color="error" size="small" class="mr-1">$alertCircle</v-icon>
                {{ error }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showImportError = false">
            {{ $t('dataTable.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ConfirmDialog
      v-model:show="showDeleteConfirm"
      :title="$t('title.deleteConfirm')"
      :message="$t('messages.deleteConfirm')"
      @confirm="handleDeleteClick"
    />
  </v-card>
</template>

<script setup>
// ✨ [리팩토링] 1. Imports (모든 임포트)
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePanelStore } from '@/stores/panel'
import { useMetaDataStore } from '@/stores/metaData'
import { componentMap } from '@/constants/componentMap'
import {
  fetchListData,
  deleteItems,
  updateItemData,
  createItemData,
  uploadExcelFile,
} from '@/api/dataTable'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
// [추가] 날짜 포맷터 유틸리티를 import 합니다.
import { formatDateTime, formatDate } from '@/utils/formatters'

// ✨ [리팩토링] 2. Props & Emits
const props = defineProps({
  dataTabletitleKey: { type: String, required: true },
  searchSchema: { type: Array, required: true },
  headers: { type: Array, required: true },
  apiEndpoint: { type: String, required: true },
  formSchema: { type: Array, required: true },
  showCheckbox: { type: Boolean, default: false },
  isHover: { type: Boolean, default: false },
  isOpenPanel: { type: Boolean, default: true },
  actions: {
    type: Array,
    default: function () {
      return []
    },
  },
  filterParams: {
    type: Object,
    default: function () {
      return {}
    },
  },
  footerActions: {
    type: Array,
    default: function () {
      return []
    },
  },
})

const emit = defineEmits(['row-selected'])

// ✨ [리팩토링] 3. Dependencies (외부 주입)
const { t, locale } = useI18n()
const panelStore = usePanelStore()
const metaDataStore = useMetaDataStore()

// ✨ [리팩토링] 4. Core State (모든 ref, reactive)
// -------------------
// 기본 상태
const selectedItemLocal = ref(null)
const selectedItems = ref([]) // v-data-table v-model
const showDeleteConfirm = ref(false)

// 검색 패널 (동적 v-select 아이템 포함)
const searchParams = reactive({})
const dynamicSelectItems = reactive({})

// 데이터 테이블 상태
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
})

// 엑셀 Import/Export 상태
const fileInput = ref(null)
const isUploading = ref(false)
const showImportError = ref(false)
const importErrorMessages = ref([])

// -------------------
// searchParams 초기화 (Props 기반)
props.searchSchema.forEach(function (item) {
  searchParams[item.key] = null
})

// ✨ [리팩토링] 5. Computed (계산된 속성)
// -------------------
/**
 * props.headers를 번역합니다.
 */
const translatedHeaders = computed(function () {
  return props.headers.map(function (header) {
    return Object.assign({}, header, {
      title: t(header.title, header.title),
    })
  })
})

/**
 * props.searchSchema를 번역하고, 동적 'items' 목록을 바인딩합니다.
 */
const translatedsearchSchema = computed(function () {
  const _ = locale.value // 언어 변경 감지

  return props.searchSchema.map(function (schema) {
    // 1. Label 번역
    const key = schema.labelKey != null ? schema.labelKey : schema.label != null ? schema.label : ''
    let translated = key ? t(key) : ''
    if (!translated || translated === key) {
      translated = schema.label != null ? schema.label : key
    }

    // 2. 동적 Items 바인딩
    const finalItems =
      schema.component === 'v-select' ? dynamicSelectItems[schema.key] : schema.items

    // 3. 병합
    return Object.assign({}, schema, {
      label: translated,
      items: finalItems,
    })
  })
})

/**
 * 'searchSchema'에서 의존성을 가진 필드(v-select) 목록을 미리 계산합니다.
 */
const dependentFields = computed(function () {
  return props.searchSchema.filter(function (item) {
    return (
      item.component === 'v-select' &&
      item.dependsOn &&
      item.dependsOn.length > 0 &&
      item.apiEndpoint
    )
  })
})

/**
 * ✨ [리팩토링] 툴바 액션 버튼 목록을 동적으로 생성합니다.
 * (템플릿 v-for에서 사용)
 */
const toolbarActions = computed(function () {
  // 클릭 핸들러 함수 매핑
  const actionHandlers = {
    add: handleAddClick,
    edit: handleEditClick,
    delete: openDeleteConfirmDialog,
    excelExport: handleExcelExport,
    excelImport: handleExcelImportClick,
  }

  // 버튼 기본 정의
  const actionDefinitions = [
    { key: 'add', icon: '$plus', tooltipKey: 'dataTable.add' },
    { key: 'edit', icon: '$pencil', tooltipKey: 'dataTable.edit' },
    { key: 'delete', icon: '$delete', tooltipKey: 'dataTable.delete' },
    { key: 'excelExport', icon: '$fileExport', tooltipKey: 'dataTable.export' },
    { key: 'excelImport', icon: '$fileImport', tooltipKey: 'dataTable.import' },
  ]

  return actionDefinitions
    .filter(function (action) {
      // 1. props.actions에 포함된 것만 필터링
      return props.actions.includes(action.key)
    })
    .map(function (action) {
      // 2. 번역된 텍스트와 핸들러, 로딩 상태 등을 추가
      return {
        ...action,
        tooltip: t(action.tooltipKey),
        onClick: actionHandlers[action.key],
        // 'excelImport' 버튼을 위한 특수 로딩/비활성 상태
        loading: action.key === 'excelImport' ? isUploading.value : false,
        disabled: action.key === 'excelImport' ? isUploading.value : false,
      }
    })
})

// ✨ [리팩토링] 6. Watch (반응형 감시)
// -------------------
/**
 * props.searchSchema가 변경될 때 dynamicSelectItems를 초기화합니다.
 */
watch(
  function () {
    return props.searchSchema
  },
  function (newSchema) {
    if (!newSchema) return
    newSchema.forEach(async function (item) {
      if (item.component === 'v-select') {
        if (dynamicSelectItems[item.key] === undefined) {
          // --- ✨ [신규] 'apiEndpoint'가 있고, 의존성이 없는 경우 (정적 Select)
          if (item.apiEndpoint && !item.dependsOn) {
            // 1. 임시로 빈 배열 설정 (중복 호출 방지)
            dynamicSelectItems[item.key] = []
            // 2. 스토어에서 아이템 가져오기
            const items = await metaDataStore.getItems(
              item.apiEndpoint,
              item['item-value'],
              item['item-title'],
              true, // 검색 패널이므로 '선택안함' 옵션 추가
            )
            // 3. 실제 데이터로 업데이트
            dynamicSelectItems[item.key] = items

            // --- [기존] 의존성이 있는 경우 (연쇄 Select)
          } else if (item.dependsOn) {
            dynamicSelectItems[item.key] = item.items || [] // 예: menuId는 빈 배열로 시작

            // --- [기존] 부모가 'items'를 직접 준 경우 (드문 케이스)
          } else {
            dynamicSelectItems[item.key] = item.items || []
          }
        }
      }
    })
  },
  { immediate: true, deep: true },
)

/**
 * searchParams (검색 조건)가 변경되면, 연쇄 v-select 목록을 업데이트합니다.
 */
watch(
  function () {
    return { ...searchParams }
  },
  function (newParams, oldParams) {
    dependentFields.value.forEach(function (field) {
      let dependencyChanged = false
      if (field.dependsOn) {
        field.dependsOn.forEach(function (depKey) {
          if (oldParams && newParams[depKey] !== oldParams[depKey]) {
            dependencyChanged = true
          }
        })
      }

      if (dependencyChanged) {
        // 1. 의존하는 값이 바뀌었으므로, 현재 필드(자식) 값 초기화
        searchParams[field.key] = null
        // 2. 자식 필드의 items 목록 새로고침
        fetchDependentItems(field)
      }
    })
  },
)

/**
 * props.filterParams (외부 필터)가 변경되면, 데이터를 새로고침합니다.
 */
watch(
  function () {
    return props.filterParams
  },
  function (newFilters, oldFilters) {
    options.value.page = 1
    loadItems()
  },
  { deep: true },
)

/**
 * header에 정의된 type에 따라 값을 포맷팅합니다.
 * @param {object} header - props.headers의 개별 헤더 객체
 * @param {*} value - 셀의 원본 값 (예: '...T...')
 */
function getFormattedValue(header, value) {
  // 1. 값이 없으면 빈 문자열 반환 (null이나 undefined가 'null'로 표시되는 것 방지)
  if (value === null || value === undefined) {
    return ''
  }

  // 2. header.type에 따라 분기
  if (header.type === 'datetime') {
    return formatDateTime(value) // 예: 2025-10-21 12:50:24
  }
  if (header.type === 'date') {
    return formatDate(value) // 예: 2025-10-21
  }

  // (향후 확장)
  // if (header.type === 'currency') {
  //   return value.toLocaleString('ko-KR') + '원'
  // }

  // 3. 일치하는 type이 없으면 원본 값 반환
  return value
}

// ✨ [리팩토링] 7. Methods (주요 로직 및 핸들러)
// -------------------
/**
 * [CORE] 서버에서 데이터를 로드합니다.
 * v-data-table-server의 @update:options 이벤트 및 'search' 버튼 클릭 시 호출됩니다.
 */
async function loadItems(newOptions) {
  if (newOptions) {
    options.value = newOptions
  }
  loading.value = true

  // API 쿼리 파라미터 구성
  const query = {
    ...searchParams,
    ...props.filterParams,
    page: options.value.page,
    limit: options.value.itemsPerPage,
    sortBy: options.value.sortBy.length ? options.value.sortBy[0].key : null,
    sortOrder: options.value.sortBy.length ? options.value.sortBy[0].order : null,
  }

  try {
    const responseData = await fetchListData(props.apiEndpoint, query)
    serverItems.value = responseData.items
    totalItems.value = responseData.total
  } catch (error) {
    console.error('An error occurred in the component while loading data:', error)
    serverItems.value = []
    totalItems.value = 0
  } finally {
    loading.value = false
  }
}

/**
 * [CORE] 연쇄 v-select를 위해 의존성 필드의 아이템 목록을 API로 가져옵니다.
 */
async function fetchDependentItems(fieldSchema) {
  // 1. 모든 의존성 값이 채워져 있는지 확인하고 쿼리 객체 생성
  let allDependenciesMet = true
  const query = {}

  if (fieldSchema.dependsOn) {
    fieldSchema.dependsOn.forEach(function (depKey) {
      const value = searchParams[depKey]
      if (value === null || value === undefined || value === '') {
        allDependenciesMet = false
      }
      query[depKey] = value
    })
  } else {
    return
  }

  // 2. 모든 의존 값이 충족되었다면 API 호출
  if (allDependenciesMet) {
    try {
      const response = await fetchListData(fieldSchema.apiEndpoint, query)

      // 3. v-select에 맞게 데이터 매핑
      let itemValue = fieldSchema['item-value']
      let itemTitle = fieldSchema['item-title']
      const responseMapData = response.items.map(function (item) {
        return { [itemValue]: item[itemValue], [itemTitle]: item[itemTitle] }
      })

      // 4. '선택 안함' (빈 값) 옵션 추가
      responseMapData.unshift({ [itemValue]: '', [itemTitle]: '' })

      dynamicSelectItems[fieldSchema.key] = responseMapData
    } catch (error) {
      console.error(
        'An error occurred while fetching dependent items for ' + fieldSchema.key,
        error,
      )
      dynamicSelectItems[fieldSchema.key] = []
    }
  } else {
    // 3. 의존 값이 하나라도 비어있다면 목록을 비웁니다.
    dynamicSelectItems[fieldSchema.key] = []
  }
}

/**
 * '조회' 버튼 핸들러
 */
function search() {
  options.value.page = 1
  loadItems()
}

/**
 * 테이블 행 클릭 핸들러
 */
function handleRowClick(event, { item }) {
  selectedItemLocal.value = item
  panelStore.openReadOnlyPanel(props.dataTabletitleKey, props.formSchema, item, props.isOpenPanel)
  emit('row-selected', item)
}

// --- CRUD 액션 핸들러 ---
function handleAddClick() {
  const newItem = {} // 새 아이템 (필요시 기본값 설정)
  panelStore.openFormPanel(
    props.dataTabletitleKey,
    props.formSchema,
    newItem,
    'create',
    props.apiEndpoint,
    createItemData,
    loadItems, // 성공 시 콜백
  )
}

function handleEditClick() {
  if (!selectedItemLocal.value) {
    // (참고) 보통 행 클릭(handleRowClick)이 선행되어야 함
    // 만약 체크박스 선택 기준으로 하려면 selectedItems[0]을 사용
    if (selectedItems.value.length > 0) {
      selectedItemLocal.value = selectedItems.value[0]
    } else {
      alert(t('messages.selectItemFirst', '항목을 먼저 선택해주세요.'))
      return
    }
  }

  panelStore.openFormPanel(
    props.dataTabletitleKey,
    props.formSchema,
    selectedItemLocal.value, // 선택된 아이템
    'edit',
    props.apiEndpoint,
    updateItemData,
    loadItems, // 성공 시 콜백
  )
}

function openDeleteConfirmDialog() {
  if (selectedItems.value.length === 0) {
    alert(t('messages.selectItemsToDelete', '삭제할 항목을 선택해주세요.'))
    return
  }
  showDeleteConfirm.value = true
}

async function handleDeleteClick() {
  try {
    const idsToDelete = selectedItems.value.map(function (item) {
      return item.id
    })
    await deleteItems(props.apiEndpoint, idsToDelete)

    alert(t('messages.deleteSuccess', '성공적으로 삭제되었습니다.'))
    selectedItems.value = [] // 선택 상태 초기화
    selectedItemLocal.value = null // 상세 패널용 선택도 초기화
    loadItems()
  } catch (error) {
    alert(t('messages.deleteFailed', '삭제 처리 중 오류가 발생했습니다.'))
    console.error('An error occurred while deleting items:', error)
  } finally {
    showDeleteConfirm.value = false
  }
}

// --- 엑셀 Import/Export 핸들러 ---
function handleExcelImportClick() {
  if (fileInput.value) {
    fileInput.value.value = null
  }
  fileInput.value.click()
}

async function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return

  // 프론트엔드 1차 검증
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (file.type !== ALLOWED_TYPE) {
    alert(t('messages.excelOnlyError', 'xlsx 파일 형식만 업로드할 수 있습니다.'))
    return
  }
  if (file.size > MAX_FILE_SIZE) {
    alert(t('messages.fileSizeError', '파일 크기는 10MB를 초과할 수 없습니다.'))
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  isUploading.value = true
  importErrorMessages.value = []

  try {
    const importApiEndpoint = props.apiEndpoint + '/import'
    await uploadExcelFile(importApiEndpoint, formData)

    alert(t('messages.importSuccess', '성공적으로 가져왔습니다.'))
    loadItems()
  } catch (error) {
    console.error('An error occurred while importing excel:', error)
    if (error.response && error.response.data && error.response.data.errors) {
      importErrorMessages.value = error.response.data.errors
      showImportError.value = true
    } else {
      alert(t('messages.importFailed', '파일 업로드 중 오류가 발생했습니다.'))
    }
  } finally {
    isUploading.value = false
  }
}

function handleExcelExport() {
  const exportApiEndpoint = props.apiEndpoint + '/export'

  // 현재 모든 검색 조건을 쿼리 스트링으로 변환
  const queryParams = new URLSearchParams()

  // 1. 검색 패널 파라미터
  for (const key in searchParams) {
    const value = searchParams[key]
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value)
    }
  }

  // 2. 외부 필터 파라미터
  for (const key in props.filterParams) {
    const value = props.filterParams[key]
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value)
    }
  }

  const queryString = queryParams.toString()
  const downloadUrl = `${exportApiEndpoint}?${queryString}`

  console.log('엑셀 다운로드 URL:', downloadUrl)
  window.location.href = downloadUrl // 다운로드 트리거
}

// --- 푸터 핸들러 ---
function handleFooterClick(actionFunction) {
  // 부모로부터 받은 함수에 'selectedItems'를 인자로 전달하며 실행
  actionFunction(selectedItems.value)
}
</script>

<style scoped>
/* ✨ [리팩토링] 스타일은 변경 사항 없음 (기존과 동일) */
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

/* ServerSideDataTable 업그레이드 */
/* 루트 카드: 가로/세로 풀 채움 + 평평한 베이스 */
.datatable-card {
  width: 100%;
  height: 100%;
  min-height: 0; /* 내부 스크롤 허용 */
  border: none;
  box-shadow: none;
  background: rgb(var(--v-theme-surface));
  /* [추가]
    이것이 메인 컨텐츠 영역 전체의 안쪽 여백입니다.
    24px 정도의 넉넉한 여백이 세련된 느낌을 줍니다.
  */
  padding: 24px;
}

/* 타이틀: 높이/여백 절제 */
.datatable-title {
  min-height: 44px;
  padding-block: 6px;
  color: rgba(var(--v-theme-on-surface), 0.9);

  /* [추가] 제목을 더 중요하게 보이도록 */
  font-weight: 600; /* 500(기본)보다 살짝 더 굵게 */
  margin-bottom: 8px; /* 제목과 검색 패널 사이의 간격 확보 */
}

/* 검색 패널: 얕은 경계선 + 조밀한 그리드 */
.search-panel {
  /* [변경]
    margin: [top] [right] [bottom] [left];
    아래쪽 여백(bottom)을 8px에서 16px로 늘려
    검색 영역과 결과 툴바(Add, Edit 버튼 등) 사이의
    공간을 더 확보합니다.
  */
  margin: 4px 0 16px 0;
  /* [기존] margin: 4px 0 8px 0; */
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
  background: rgb(var(--v-theme-surface), 0.04);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}
:deep(.server-table th) {
  white-space: nowrap;
  font-weight: 700;
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.78);
  height: 38px;
  /* [변경] 좌우 패딩을 12px -> 16px로 늘려 여유 공간 확보 */
  padding: 0 16px;
}

/* 바디 셀: 라인 최소화 + 가독성 */
:deep(.server-table td) {
  white-space: nowrap;
  font-size: 0.92rem;
  color: rgba(var(--v-theme-on-surface), 0.87);
  height: 38px;
  /* [변경] 좌우 패딩을 12px -> 16px로 늘려 여유 공간 확보 */
  padding: 0 16px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

/* Zebra (은은하게) */
:deep(.server-table .v-data-table__tbody tr:nth-child(even)) {
  background-color: rgba(var(--v-theme-on-surface), 0.03);
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
  background-color: rgba(255, 255, 255, 0.03);
}
:deep(.v-theme--dark .server-table td) {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.no-uppercase {
  text-transform: none !important;
}

/* [추가]
  'md="auto"' 컬럼이 참조할 수 있는 기본 너비를 지정합니다.
  이렇게 하면 입력창들이 일정한 크기를 가지면서 자연스럽게 배치됩니다.
*/
.search-input {
  width: 200px; /* 180px ~ 220px 사이에서 조절해 보세요. */
}

/* [추가] 모바일 화면(md 미만) 대응
  cols="12"가 적용될 때를 대비합니다.
*/
@media (max-width: 959px) {
  .search-input {
    width: 100%; /* 모바일에선 꽉 채움 */
  }

  /* 모바일에선 버튼 영역도 꽉 채우고 버튼을 우측 정렬 */
  .search-actions {
    width: 100%;
    padding-top: 8px; /* 입력창과 간격 */
    justify-content: flex-end; /* d-flex가 있으므로 justify-end 사용 */
  }
}

/* ✨ [핵심] 푸터 왼쪽 정렬 강제
  .v-data-table-footer (flex 컨테이너) 내부의
  .footer-left-actions 요소에 오른쪽 마진을 'auto'로 주어
  페이지네이션을 오른쪽 끝으로 밀어냅니다.
*/
:deep(.v-data-table-footer .footer-left-actions) {
  margin-right: auto;
}
</style>
