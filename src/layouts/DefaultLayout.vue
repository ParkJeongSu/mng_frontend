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

        <TabView />
      </div>
    </v-main>
    <v-footer app class="d-flex justify-center" style="height: 40px">
      <div class="text-caption">© 2025 MNG. All rights reserved.</div>
    </v-footer>
  </v-app>
</template>

<script setup>
import TheHeader from '@/components/layout/TheHeader.vue'
import TheSubHeader from '@/components/layout/TheSubHeader.vue'
import TheSidebar from '@/components/layout/TheSidebar.vue'
import { useMenuStore } from '@/stores/menu' // 스토어 import
import TabView from '@/components/layout/TabView.vue' // TabView import
const menuStore = useMenuStore()
</script>

<style scoped>
.main-container {
  display: flex;
  /* v-main의 기본 높이를 100%로 채워 사이드바와 콘텐츠가 전체 화면을 사용하도록 합니다. */
  height: 100%;
}
.content {
  flex-grow: 1;
  padding: 20px;
}
</style>
