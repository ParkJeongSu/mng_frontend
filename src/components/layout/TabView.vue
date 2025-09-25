<template>
  <div class="tab-view-layout">
    <div class="tab-view-container">
      <v-tabs
        v-model="tabsStore.activeTabPath"
        @update:model-value="onTabChange"
        density="compact"
        show-arrows
        class="tab-bar"
      >
        <v-tab
          v-for="tab in tabsStore.openTabs"
          :key="tab.path"
          :value="tab.path"
          @contextmenu.prevent="onRightClick(tab, $event)"
        >
          {{ tab.title }}
          <v-icon
            v-if="tab.path !== '/'"
            size="small"
            class="ml-2 close-icon"
            @click.stop="closeTab(tab)"
          >
            mdi-close
          </v-icon>
        </v-tab>
      </v-tabs>

      <div class="tab-content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>

    <div class="side-panel-container">
      <div class="panel-toggle-button" @click="panelStore.togglePanel">
        <v-icon>
          {{ panelStore.isPanelOpen ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
        </v-icon>
      </div>

      <div v-if="panelStore.isPanelOpen" class="side-panel">
        <v-card class="fill-height" flat>
          <v-card-title>상세 정보</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div v-if="panelStore.selectedItem">
              <v-text-field
                v-for="(value, key) in panelStore.selectedItem"
                :key="key"
                :label="String(key)"
                :model-value="value"
                density="compact"
                variant="outlined"
                readonly
                class="mb-2"
              ></v-text-field>
            </div>
            <div v-else>
              <p>표에서 항목을 선택하세요.</p>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <v-menu
      v-model="contextMenu.show"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      absolute
      offset-y
    >
      <v-list density="compact">
        <v-list-item @click="closeAllTabs">
          <v-list-item-title>모든 탭 닫기</v-list-item-title>
        </v-list-item>
        <v-list-item @click="closeOtherTabs">
          <v-list-item-title>다른 탭 닫기</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTabsStore } from '@/stores/tabs'
import { usePanelStore } from '@/stores/panel' // panel 스토어 import
import router from '@/router'

const tabsStore = useTabsStore()
const panelStore = usePanelStore() // panel 스토어 인스턴스 생성

const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  targetTab: null,
})

function onTabChange(newPath) {
  router.push(newPath)
}

function closeTab(tab) {
  tabsStore.removeTab(tab)
}

function onRightClick(tab, event) {
  contextMenu.value.show = true
  contextMenu.value.x = event.clientX
  contextMenu.value.y = event.clientY
  contextMenu.value.targetTab = tab
  tabsStore.activeTabPath = tab.path
  router.push(tab.path)
}

function closeAllTabs() {
  tabsStore.closeAllTabs()
  contextMenu.value.show = false
}

function closeOtherTabs() {
  tabsStore.closeOtherTabs()
  contextMenu.value.show = false
}
</script>

<style scoped>
/* 3. 새로운 Flexbox 레이아웃과 패널 스타일을 추가/수정합니다. */
.tab-view-layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.tab-view-container {
  /* flex-grow: 1을 통해 남는 공간을 모두 차지하도록 설정 */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f0f2f5;
  transition: width 0.3s ease; /* 너비 변경 시 부드러운 애니메이션 효과 */
}

.tab-bar {
  box-shadow: none;
  border-bottom: 1px solid #dcdfe6;
}

.tab-content {
  flex-grow: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #ffffff;
  border-left: 1px solid #dcdfe6;
}

/* --- 상세 정보 패널 관련 스타일 --- */
.side-panel-container {
  display: flex;
  align-items: center; /* 토글 버튼을 세로 중앙에 위치시키기 위함 */
  position: relative; /* 토글 버튼의 위치 기준점 */
}

.panel-toggle-button {
  /* 버튼을 패널 왼쪽에 세로로 길게 배치 */
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-100%, -50%);
  z-index: 10;
  background-color: #1976d2; /* primary color */
  color: white;
  cursor: pointer;
  padding: 12px 2px;
  border-radius: 4px 0 0 4px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.side-panel {
  width: 400px;
  height: 100%;
  border-left: 1px solid #dcdfe6;
  background-color: #fafafa;
  /* 패널이 나타나고 사라질 때 부드러운 효과를 줌 */
  transition: all 0.3s ease;
}

/* --- 기존 스타일은 유지 --- */
:deep(.v-tab) {
  text-transform: none !important;
  border-right: 1px solid #dcdfe6;
  background-color: #f0f2f5;
  color: #606266;
  font-weight: 500;
}

:deep(.v-tab--selected) {
  background-color: #ffffff;
  color: var(--v-theme-primary);
  font-weight: 700;
  border-bottom-color: transparent;
}

.close-icon {
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;
}
.close-icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
