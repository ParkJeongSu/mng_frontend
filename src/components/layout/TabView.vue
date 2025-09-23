<template>
  <div class="tab-view-container">
    <v-tabs
      v-model="tabsStore.activeTabPath"
      @update:model-value="onTabChange"
      density="compact"
      show-arrows
    >
      <v-tab
        v-for="tab in tabsStore.openTabs"
        :key="tab.path"
        :value="tab.path"
        @contextmenu.prevent="onRightClick(tab, $event)"
      >
        {{ tab.title }}
        <v-icon v-if="tab.path !== '/'" size="small" class="ml-2" @click.stop="closeTab(tab)">
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
.tab-view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.tab-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
