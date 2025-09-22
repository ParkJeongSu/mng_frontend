<template>
  <v-navigation-drawer permanent>
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in menuStore.currentSidebarItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :value="item.title"
        :to="item.to"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()
</script>

<style scoped>
/* 사이드바 스타일 */
</style>
