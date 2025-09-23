<template>
  <v-app-bar color="primary" density="compact">
    <v-img
      class="company-logo"
      src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
      max-height="32"
      max-width="32"
      contain
    ></v-img>
    <v-app-bar-title class="company-title">MNG</v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn
      v-for="(system, id) in menuStore.allMenus"
      :key="id"
      :active="menuStore.selectedSystemId === id"
      @click="menuStore.selectSystem(id)"
    >
      {{ system.name }}
    </v-btn>

    <v-spacer></v-spacer>

    <div class="d-flex align-center">
      <span class="user-id">test@test.com</span>
      <v-icon class="user-icon">mdi-account-circle</v-icon>
      <!--
      <v-btn icon @click="toggleTheme">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      -->
    </div>

    <template v-slot:extension>
      <slot name="extension"></slot>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useMenuStore } from '@/stores/menu'
// import { useTheme } from 'vuetify'

const menuStore = useMenuStore()
// const theme = useTheme()

// function toggleTheme() {
//   theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
// }
</script>

<style scoped>
.company-logo {
  margin-left: 12px;
}
.company-title {
  margin-left: 8px;
  /* flex-grow: 0;  */
  /* 제목이 너무 많은 공간을 차지하지 않도록 설정 */
  flex: 0 1 auto; /* grow=0, shrink=1, basis=auto */
  min-width: max-content; /* 내용만큼은 최소 확보 */
}
.user-id {
  font-size: 14px;
  margin-right: 8px;
}
.user-icon {
  margin-right: 12px;
}
</style>
