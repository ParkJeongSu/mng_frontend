<template>
  <v-toolbar density="compact" app>
    <v-spacer></v-spacer>
    <div class="d-flex justify-center flex-grow-1">
      <v-btn
        v-for="(subMenu, id) in menuStore.currentSubMenus"
        :key="id"
        :active="menuStore.selectedSubMenuId === id"
        @click="menuStore.selectSubMenu(id)"
        class="no-uppercase"
      >
        {{ $t('menuNames.' + subMenu.name, subMenu.name) }}
        <!-- {{ subMenu.name }} -->
      </v-btn>
    </div>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script setup>
import { useMenuStore } from '@/stores/menu' // 1. 스토어 import

const menuStore = useMenuStore() // 2. 스토어 인스턴스 생성
</script>

<style scoped>
/* 서브헤더에만 적용될 스타일이 있다면 여기에 작성합니다. */

.no-uppercase {
  text-transform: none !important;
}
</style>
