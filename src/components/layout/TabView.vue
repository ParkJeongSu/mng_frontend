<template>
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
import router from '@/router'

const tabsStore = useTabsStore()

// 컨텍스트 메뉴(우클릭 메뉴)의 상태
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  targetTab: null,
})

// 탭을 클릭했을 때 해당 경로로 이동하는 함수
function onTabChange(newPath) {
  router.push(newPath)
}

// 탭의 'x' 버튼을 클릭했을 때
function closeTab(tab) {
  tabsStore.removeTab(tab)
}

// 탭에서 우클릭했을 때
function onRightClick(tab, event) {
  contextMenu.value.show = true
  contextMenu.value.x = event.clientX
  contextMenu.value.y = event.clientY
  contextMenu.value.targetTab = tab
  // 우클릭한 탭을 활성화
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
/* 3. 아래의 스타일 코드를 추가/수정합니다. */
.tab-view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f0f2f5; /* 전체 배경색을 약간 어둡게 변경 */
}

/* 탭 바 전체를 감싸는 영역 스타일 */
.tab-bar {
  /* Vuetify 기본 그림자 제거 */
  box-shadow: none;
  border-bottom: 1px solid #dcdfe6;
}

/* 탭 컨텐츠가 보여지는 영역 스타일 */
.tab-content {
  flex-grow: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #ffffff;
  border-left: 1px solid #dcdfe6;
}

/* Vuetify의 v-tab 기본 스타일을 덮어씁니다. */
:deep(.v-tab) {
  text-transform: none !important; /* 영문 대문자 변환 방지 */
  border-right: 1px solid #dcdfe6;
  background-color: #f0f2f5;
  color: #606266;
  font-weight: 500;
}

/* 활성화된 탭 스타일 */
:deep(.v-tab--selected) {
  background-color: #ffffff; /* 컨텐츠 영역과 같은 흰색으로 변경 */
  color: var(--v-theme-primary); /* Vuetify의 primary 색상 사용 */
  font-weight: 700;
  border-bottom-color: transparent; /* 아래쪽 경계선을 없애 컨텐츠와 이어진 느낌을 줌 */
}

/* 닫기 아이콘 스타일 */
.close-icon {
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;
}
.close-icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
