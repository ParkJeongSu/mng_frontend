<template>
  <div class="side-panel" :class="{ 'is-open': props.isOpen }">
    <v-card class="fill-height" flat>
      <v-card-title>
        <span v-if="panelStore.formMode === 'create'"
          >{{ $t(panelStore.panelTitleKey) }} {{ $t('common.create') }}</span
        >
        <span v-else-if="panelStore.formMode === 'edit'">
          {{ $t(panelStore.panelTitleKey) }} {{ $t('common.edit') }}
        </span>
        <span v-else>{{ $t(panelStore.panelTitleKey) }} {{ $t('title.details') }}</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <div v-if="panelStore.formMode">
          <component
            v-for="field in translatedFormSchema"
            :key="field.key"
            :is="componentMap[field.component]"
            :placeholder="field.label"
            :label="field.label"
            :items="field.items"
            :item-title="field['item-title']"
            :item-value="field['item-value']"
            :model-value="panelStore.formData[field.key]"
            @update:model-value="updateItemData(field.key, $event)"
            density="compact"
            variant="solo"
            flat
            class="mb-2"
          ></component>
        </div>
        <div v-else-if="panelStore.selectedItem">
          <component
            v-for="field in translatedFormSchema"
            :key="field.key"
            :is="componentMap[field.component]"
            :label="field.label"
            :placeholder="field.label"
            :items="field.items"
            :item-title="field['item-title']"
            :item-value="field['item-value']"
            :model-value="panelStore.selectedItem[field.key]"
            @update:model-value="updateSelectedItemData(field.key, $event)"
            density="compact"
            variant="solo"
            flat
            class="mb-2"
          ></component>
        </div>
        <!-- :label="field.label" -->
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
import { computed, watch, ref } from 'vue'
import { usePanelStore } from '@/stores/panel'
import { componentMap } from '@/constants/componentMap'
import { fetchListData } from '@/api/dataTable' // 공통 API 함수 import

import { useI18n } from 'vue-i18n' // 1. useI18n을 import 합니다.
const { t, locale } = useI18n() // 2. useI18n을 호출해서 't' 함수를 가져옵니다.

const panelStore = usePanelStore()

// ✅ [추가] 2. 부모(DefaultLayout)로부터 'isOpen' prop을 받습니다.
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

// 2. 스토어의 스키마를 복사하여 로컬에서 수정 가능한 상태로 만듭니다.
const localFormSchema = ref([])

// formSchema를 스토어에서 직접 읽어 번역된 label을 만든다.
// - 화살표 함수 사용 안 함
// - locale.value를 touch해서 언어 변경 시 재계산
const translatedFormSchema = computed(function () {
  // 언어 변경에 반응시키기 위한 접근
  const _ = locale.value
  _
  return localFormSchema.value.map(function (schema) {
    // 안전한 키/라벨 폴백
    const key = schema.labelKey != null ? schema.labelKey : schema.label != null ? schema.label : ''
    // 키가 없으면 그냥 원래 label을 쓰고, 키가 있으면 번역 시도
    let translated = key ? t(key) : ''
    if (!translated || translated === key) {
      // 번역 실패 시 원래 label이 있으면 사용
      translated = schema.label != null ? schema.label : key
    }

    // 나머지 필드는 그대로 유지, label만 치환
    return Object.assign({}, schema, { label: translated })
  })
})

function onCancel() {
  panelStore.closePanel()
}

/* 저장 로직이 스토어에 없다면 여기서 emit 하도록 바꿔도 됨 */
function onSave() {
  // 예: panelStore.saveForm() 이 있다면 호출
  panelStore.saveForm()
}

//v-model="panelStore.formData[field.key]" 대신 사용
function updateItemData(key, value) {
  panelStore.updateFormDataField(key, value)
}

function updateSelectedItemData(key, value) {
  panelStore.updateSelectedItemField(key, value)
}

// 3. 폼 데이터의 변경을 감시하는 watch를 추가합니다.
watch(
  function () {
    return { ...panelStore.formData }
  },
  async function (newFormData, oldFormData) {
    // 변경된 필드를 찾습니다.
    const changedKeys = Object.keys(newFormData).filter(function (key) {
      return newFormData[key] !== oldFormData[key]
    })

    if (changedKeys.length === 0) return

    console.log('변경된 필드:', changedKeys)
    for (const changedKey of changedKeys) {
      // 'changedKey'에 의존하는 필드들을 찾습니다.
      const dependentFields = localFormSchema.value.filter(function (field) {
        if (!field.dependsOn) {
          return false
        }
        // 1-A. 기존 문자열 방식 호환
        if (typeof field.dependsOn === 'string') {
          return field.dependsOn === changedKey
        }
        // 1-B. 새로운 배열 방식
        if (Array.isArray(field.dependsOn)) {
          return field.dependsOn.includes(changedKey)
        }
        return false
      })

      for (const fieldToUpdate of dependentFields) {
        console.log(`'${fieldToUpdate.key}' 필드는 '${changedKey}'의 변경을 감지했습니다.`)

        // 2-A. 의존성 목록을 항상 배열로 확보합니다.
        let dependencies = []
        if (typeof fieldToUpdate.dependsOn === 'string') {
          dependencies = [fieldToUpdate.dependsOn]
        } else if (Array.isArray(fieldToUpdate.dependsOn)) {
          dependencies = fieldToUpdate.dependsOn
        }

        // 2-B. 모든 의존성 필드(부모)가 값을 가지고 있는지 확인합니다.
        let allDependenciesMet = true
        for (const depKey of dependencies) {
          if (!newFormData[depKey]) {
            // 값이 (null, undefined, '', 0 등) 없으면
            allDependenciesMet = false
            break
          }
        }

        // 2-C. API 엔드포인트 처리
        if (allDependenciesMet && fieldToUpdate.apiEndpoint) {
          // [성공] 모든 부모 값이 채워져 있음 -> API 호출

          const query = {}
          dependencies.forEach(function (depKey) {
            query[depKey] = newFormData[depKey]
          })

          console.log(`API 호출 (동적 쿼리): ${fieldToUpdate.apiEndpoint}`, query)

          const response = await fetchListData(fieldToUpdate.apiEndpoint, query)

          let itemValue = fieldToUpdate['item-value']
          let itemTitle = fieldToUpdate['item-title']

          const responseMapData = response.items.map(function (item) {
            return { [itemValue]: item[itemValue], [itemTitle]: item[itemTitle] }
          })
          responseMapData.unshift({ [itemValue]: '', [itemTitle]: '' })

          fieldToUpdate.items = responseMapData

          // 부모 값이 변경되었으므로, 자식 필드의 값은 초기화합니다.
          panelStore.formData[fieldToUpdate.key] = null
        } else {
          // [실패] 부모 값 중 하나라도 비어있음 -> 자식 필드 초기화
          console.log('부모 값 중 하나가 비어있으므로 자식 필드를 초기화합니다.')
          fieldToUpdate.items = []
          panelStore.formData[fieldToUpdate.key] = null
        }
      }
    }
  },
  { deep: true }, // 객체 내부의 속성 변경까지 감지
)

// 4. 패널이 열릴 때 스토어의 스키마를 로컬 스키마로 복사하는 watch를 추가합니다.
watch(
  function () {
    return panelStore.formSchema
  },
  function (newSchema) {
    if (newSchema && newSchema.length > 0) {
      // JSON.parse(JSON.stringify(...)) 로 깊은 복사를 수행합니다.
      console.log('패널이 열렸습니다. 로컬 폼 스키마를 스토어에서 복사합니다.')
      localFormSchema.value = JSON.parse(JSON.stringify(panelStore.formSchema))
    } else {
      // 스키마가 비워지면(패널 닫힘), 로컬 스키마도 비웁니다.
      localFormSchema.value = []
    }
  },
  // 4. deep: true는 배열/객체 내부까지 감지하며,
  //    immediate: true는 컴포넌트 로드 시 즉시 실행을 보장합니다.
  { deep: true, immediate: true },
)
</script>

<style scoped>
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
