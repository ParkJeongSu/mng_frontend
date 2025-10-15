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
            v-for="field in panelStore.formSchema"
            :key="field.key"
            :is="componentMap[field.component]"
            :label="field.label"
            :items="field.items"
            v-model="panelStore.formData[field.key]"
            density="compact"
            variant="outlined"
            class="mb-2"
          ></component>
        </div>
        <div v-else-if="panelStore.selectedItem">
          <component
            v-for="field in panelStore.formSchema"
            :key="field.key"
            :is="componentMap[field.component]"
            :label="field.label"
            :items="field.items"
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
import { usePanelStore } from '@/stores/panel'
import { componentMap } from '@/constants/componentMap'

const panelStore = usePanelStore()

function onCancel() {
  panelStore.closePanel()
}

/* 저장 로직이 스토어에 없다면 여기서 emit 하도록 바꿔도 됨 */
function onSave() {
  // 예: panelStore.saveForm() 이 있다면 호출
  // panelStore.saveForm()
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
