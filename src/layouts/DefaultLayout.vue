<template>
  <v-app>
    <TheHeader>
      <template v-slot:extension>
        <TheSubHeader />
      </template>
    </TheHeader>

    <v-main>
      <div class="main-container">
        <TheSidebar v-model="menuStore.isSidebarOpen" />
        <div class="content-wrapper">
          <v-app-bar color="surface" flat>
            <v-app-bar-nav-icon @click="menuStore.toggleSidebar" />
          </v-app-bar>
          <TabView />
        </div>
        <div class="side-panel-container">
          <div class="panel-toggle-button" @click="panelStore.togglePanel">
            <v-icon>
              {{ panelToggleIcon }}
            </v-icon>
          </div>
          <div v-if="panelStore.isPanelOpen" class="side-panel">
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
                <v-btn @click="panelStore.closePanel">취소</v-btn>
                <v-btn>저장</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>
      </div>
    </v-main>

    <v-footer app class="pa-0 footer">
      <div class="footer-container">
        <AlarmBar />
        <div class="footer-content">© 2025 MNG. All rights reserved.</div>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import TheHeader from '@/components/layout/TheHeader.vue'
import TheSubHeader from '@/components/layout/TheSubHeader.vue'
import TheSidebar from '@/components/layout/TheSidebar.vue'
import { useMenuStore } from '@/stores/menu' // 스토어 import
import TabView from '@/components/layout/TabView.vue' // TabView import
import AlarmBar from '@/components/layout/AlarmBar.vue'
import { usePanelStore } from '@/stores/panel' // panel 스토어 import
import { computed, onMounted } from 'vue'
import { componentMap } from '@/constants/componentMap' // componentMap import

const menuStore = useMenuStore()
const panelStore = usePanelStore() // panel 스토어 인스턴스 생성
const panelToggleIcon = computed(function () {
  return panelStore.isPanelOpen ? '$next' : '$prev'
})
onMounted(() => {
  menuStore.fetchAllAuthorityMenus()
})
</script>

<style scoped>
.footer {
  height: auto;
}
.main-container {
  display: flex;
  /* v-main의 기본 높이를 100%로 채워 사이드바와 콘텐츠가 전체 화면을 사용하도록 합니다. */
  height: 100%;
  width: 100%;
  overflow: hidden; /* 전체 레이아웃이 화면을 벗어나지 않도록 설정 */
}
/* --- 콘텐츠 영역 스타일 (핵심 수정 1) --- */
.content-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  /* ✨ 핵심: 패널이 열릴 때 이 영역이 줄어들 수 있도록 허용합니다. */
  min-width: 0;
}

/* 2. v-footer 내부 레이아웃을 위한 스타일 추가 */
.footer-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  font-size: 0.75rem; /* text-caption과 유사한 폰트 크기 */
}

/* --- 상세 정보 패널 관련 스타일 --- */
.side-panel-container {
  display: flex;
  align-items: center; /* 토글 버튼을 세로 중앙에 위치시키기 위함 */
  /* 토글 버튼의 위치 기준점 */
  /* position: relative; */
  flex-shrink: 0;
}

.panel-toggle-button {
  height: 48px;
  width: 24px;
  border-radius: 4px 0 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  border-right: none;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.side-panel {
  width: 400px; /* 고정 너비 */
  height: 100%;
  /* border-left: 1px solid #dcdfe6; */
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}
</style>
