<template>
  <v-app>
    <TheHeader>
      <template v-slot:extension>
        <TheSubHeader />
      </template>
    </TheHeader>

    <v-main class="main-background">
      <div class="main-container">
        <TheSidebar v-model="menuStore.isSidebarOpen" />
        <div class="content-wrapper">
          <div class="toolbar-area">
            <v-app-bar-nav-icon @click="menuStore.toggleSidebar"></v-app-bar-nav-icon>
          </div>

          <TabView />
        </div>
      </div>
    </v-main>

    <v-footer app class="pa-0 footer" >
      <div class="footer-container">
        <AlarmBar />
        <div class="footer-content">
          © 2025 MNG. All rights reserved.
        </div>
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
const menuStore = useMenuStore()
</script>

<style scoped>
/* 2. v-main의 배경색을 지정하는 스타일을 추가합니다. */
.main-background {
  background-color: #f5f5f5;
}

.footer{
  height: auto;
}
.main-container {
  display: flex;
  /* v-main의 기본 높이를 100%로 채워 사이드바와 콘텐츠가 전체 화면을 사용하도록 합니다. */
  height: 100%;
}
.content {
  flex-grow: 1;
  padding: 20px;
}

/* 2. v-footer 내부 레이아웃을 위한 스타일 추가 */
.footer-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  font-size: 0.75rem; /* text-caption과 유사한 폰트 크기 */
}
</style>
