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
            <div class="d-flex align-center">
              <template v-for="(pathItem, index) in menuStore.activeMenuPath" :key="pathItem.id">
                <v-icon v-if="index > 0" size="small" class="mx-1">$next</v-icon>

                <v-chip size="small" variant="text" class="breadcrumb-chip">
                  {{ $t(pathItem.name, pathItem.name) }}
                </v-chip>
              </template>
            </div>
            <v-spacer></v-spacer>
            <div class="app-bar-right">
              <MenuQuickFinder></MenuQuickFinder>
            </div>
          </v-app-bar>
          <TabView />
        </div>
        <v-card class="side-panel-container" flat>
          <div class="panel-toggle-button" @click="panelStore.togglePanel">
            <v-icon>
              {{ panelToggleIcon }}
            </v-icon>
          </div>
          <SidePanel :is-open="panelStore.isPanelOpen" />
        </v-card>
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
import SidePanel from '@/components/layout/SidePanel.vue' // SidePanel import
import MenuQuickFinder from '@/components/layout/MenuQuickFinder.vue'
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
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.app-bar-left,
.app-bar-right {
  display: flex;
  align-items: center;
  /* 오른쪽 영역의 실제 너비를 확인하고 (예: 개발자 도구)
    그 값(혹은 그보다 약간 큰 값)을 min-width로 설정합니다.
    여기서는 200px로 가정합니다.
  */
  /* min-width: 300px; */
}

.app-bar-left {
  justify-content: flex-start;
}

.app-bar-right {
  justify-content: flex-end;
  /* ← 수축 금지 + 원하는 너비 확보 */
  flex: 0 0 auto;
  width: clamp(280px, 32vw, 520px); /* 최소~가변~최대 */
}
/* MenuQuickFinder 내부 v-text-field를 꽉 채우기 */
:deep(.app-bar-right .v-field) {
  width: 100%;
}

/* [추가] Breadcrumb 칩 스타일 (선택 사항) */
.breadcrumb-chip {
  /* 텍스트 variant는 기본 패딩이 크므로 조절 */
  padding: 0 8px;
  /* 칩에 마우스 올렸을 때 배경색이 생기지 않도록 */
  background-color: transparent !important;
}
/* 클릭 가능한 칩처럼 보이지 않도록 호버 효과 제거 */
.breadcrumb-chip:hover::before {
  opacity: 0 !important;
}

/* v-main은 DefaultLayout.vue의 자식 컴포넌트가 아니므로
  :deep()을 사용하거나 scoped를 제거해야 할 수 있습니다.
  하지만 Vuetify 3에서는 v-main이 일반 태그처럼 작동하므로
  :deep()이 더 안전할 수 있습니다.
*/

/* ✅ 가장 가능성이 높은 해결책입니다.
  v-main 태그의 padding이 변하는 속도를 0.6초로 설정합니다.
*/
:deep(main.v-main) {
  /* Vuetify의 기본 transition을 덮어씁니다. */
  transition-property: padding !important;
  transition-duration: 0.6s !important;
  /* 원하는 ease 함수가 있다면 추가 */
  /* transition-timing-function: ease-in-out !important; */
}

/* 만약 위 코드가 작동하지 않는다면,
  TheSidebar.vue 내부의 v-navigation-drawer를 직접 타겟팅합니다.
*/
:deep(.v-navigation-drawer) {
  transition-property: transform, width !important;
  transition-duration: 0.6s !important;
}

/*
  v-main 태그를 :deep()으로 선택하여
  그 내부에 있는 모든 Vuetify 레이아웃 컴포넌트들이
  참조하는 transition 속도 변수를 0.6초로 덮어씁니다.
*/
:deep(main.v-main) {
  --v-layout-transition-duration: 0.6s;
}

/*
  만약 위의 변수 설정으로도 v-app-bar가 여전히 빠르다면,
  (다른 트랜지션이 겹쳤을 수 있으므로)
  아래 코드로 v-app-bar의 속도를 직접 강제합니다.
*/
.content-wrapper > .v-app-bar {
  transition-duration: 0.6s !important;
  /* 모든 속성 변경(width, left, right 등)에 대해 0.6초 적용 */
  transition-property: all !important;
}
</style>
