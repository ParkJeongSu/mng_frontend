<template>
  <div class="side-panel">
    <v-card class="fill-height" flat>
      <v-card-title>
        <span v-if="panelStore.formMode === 'create'">사용자 생성</span>
        <span v-else-if="panelStore.formMode === 'edit'">사용자 수정</span>
        <span v-else>상세 정보</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <div v-if="panelStore.formMode">
          <component
            v-for="field in translatedFormSchema"
            :key="field.key"
            :is="componentMap[field.component]"
            :label="field.label"
            :items="field.items"
            :item-title="field['item-title']"
            :item-value="field['item-value']"
            :model-value="panelStore.formData[field.key]"
            @update:model-value="updateItemData(field.key, $event)"
            density="compact"
            variant="outlined"
            class="mb-2"
          ></component>
        </div>
        <div v-else-if="panelStore.selectedItem">
          <component
            v-for="field in translatedFormSchema"
            :key="field.key"
            :is="componentMap[field.component]"
            :label="field.label"
            :items="field.items"
            :item-title="field['item-title']"
            :item-value="field['item-value']"
            :model-value="panelStore.selectedItem[field.key]"
            @update:model-value="updateSelectedItemData(field.key, $event)"
            density="compact"
            variant="outlined"
            class="mb-2"
          ></component>
        </div>
      </v-card-text>

      <v-card-actions v-if="panelStore.formMode">
        <v-spacer></v-spacer>
        <v-btn @click="onCancel">취소</v-btn>
        <v-btn @click="onSave">저장</v-btn>
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
    console.log('변경된 필드:', changedKeys)
    for (const changedKey of changedKeys) {
      // 현재 변경된 필드(예: systemId)에 의존하는 다른 필드들을 찾습니다.
      const dependentFields = localFormSchema.value.filter(function (field) {
        return field.dependsOn === changedKey
      })

      for (const fieldToUpdate of dependentFields) {
        console.log(`'${fieldToUpdate.key}' 필드는 '${changedKey}'의 변경을 감지했습니다.`)

        // 부모 필드의 새 값을 가져옵니다.
        const parentValue = newFormData[changedKey]

        // 부모 값이 있을 때만 API를 호출합니다.
        if (parentValue && fieldToUpdate.apiEndpoint) {
          // {value} placeholder를 실제 값으로 교체합니다.
          const endpoint = fieldToUpdate.apiEndpoint.replace('{value}', parentValue)

          console.log(`API 호출: ${endpoint}`)

          // API를 호출하여 새 데이터를 가져옵니다.
          const response = await fetchListData(endpoint, {})

          // 해당 필드의 items를 업데이트합니다.
          fieldToUpdate.items = response.items

          // 부모 값이 변경되었으므로, 자식 필드의 값은 초기화합니다.
          panelStore.formData[fieldToUpdate.key] = null
        } else {
          // 부모 값이 없으면 자식 필드의 옵션도 비웁니다.
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
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}
</style>
