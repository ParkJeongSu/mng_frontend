<template>
  <v-app-bar density="compact" color="white" app>
    <v-img
      class="company-logo"
      src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
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
    <v-btn @click="localeStore.setLocale('ko')">한국어</v-btn>
    <v-btn @click="localeStore.setLocale('en')">English</v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <div v-bind="props" class="d-flex align-center cursor-pointer">
          <span class="user-id">test@test.com</span>
          <v-icon class="user-icon">mdi-account-circle</v-icon>
        </div>
      </template>

      <v-list density="compact">
        <v-list-item to="/profile" prepend-icon="mdi-account">
          <v-list-item-title>프로필</v-list-item-title>
        </v-list-item>
        <v-list-item @click="openLogoutDialog" prepend-icon="mdi-logout">
          <v-list-item-title>{{ $t('auth.logout') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <template v-slot:extension>
      <slot name="extension"></slot>
    </template>
  </v-app-bar>

  <ConfirmDialog
    v-model:show="showLogoutConfirm"
    :title="$t('auth.logout')"
    :message="$t('messages.logoutConfirm')"
    @confirm="handleLogout"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useMenuStore } from '@/stores/menu'
import { useAuthStore } from '@/stores/auth' // auth 스토어 import
import ConfirmDialog from '@/components/common/ConfirmDialog.vue' // ConfirmDialog import
import { useLocaleStore } from '@/stores/locale'

const localeStore = useLocaleStore()

const menuStore = useMenuStore()
const authStore = useAuthStore()

const showLogoutConfirm = ref(false) // 다이얼로그 표시 상태

// '로그아웃' 메뉴 클릭 시 다이얼로그를 엽니다.
function openLogoutDialog() {
  showLogoutConfirm.value = true
}

// 다이얼로그에서 '확인'을 눌렀을 때 실제 로그아웃을 처리합니다.
function handleLogout() {
  authStore.logout()
}
</script>

<style scoped>
/* 3. 메뉴를 클릭할 수 있도록 커서 모양을 추가합니다. */
.cursor-pointer {
  cursor: pointer;
}

.company-logo {
  margin-left: 12px;
  max-height: 32px;
  max-width: 32px;
}
.company-title {
  margin-left: 8px;
  flex: 0 1 auto;
  min-width: max-content;
}
.user-id {
  font-size: 14px;
  margin-right: 8px;
}
.user-icon {
  margin-right: 12px;
}
</style>
