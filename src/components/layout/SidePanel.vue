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
            v-model="panelStore.formData[field.key]"
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
import { computed } from 'vue'
import { usePanelStore } from '@/stores/panel'
import { componentMap } from '@/constants/componentMap'

import { useI18n } from 'vue-i18n' // 1. useI18n을 import 합니다.
const { t, locale } = useI18n() // 2. useI18n을 호출해서 't' 함수를 가져옵니다.

const panelStore = usePanelStore()

// formSchema를 스토어에서 직접 읽어 번역된 label을 만든다.
// - 화살표 함수 사용 안 함
// - locale.value를 touch해서 언어 변경 시 재계산
const translatedFormSchema = computed(function () {
  // 언어 변경에 반응시키기 위한 접근
  const _ = locale.value
  _
  return panelStore.formSchema.map(function (schema) {
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
