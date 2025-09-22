<template>
  <v-app-bar color="primary" density="compact">
    <v-btn
      v-for="(system, id) in menuStore.allMenus"
      :key="id"
      :active="menuStore.selectedSystemId === id"
      @click="menuStore.selectSystem(id)"
    >
      {{ system.name }}
    </v-btn>

    <template v-slot:extension>
      <slot name="extension"></slot>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useMenuStore } from '@/stores/menu' // 1. 스토어 import

const menuStore = useMenuStore() // 2. 스토어 인스턴스 생성
</script>

<style scoped>
/* 스타일도 변경할 필요 없습니다. */
</style>
