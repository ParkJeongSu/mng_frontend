<template>
  <v-app-bar density="compact" app>
    <v-img class="company-logo" :src="logoUrl" max-width="130"></v-img>

    <!-- <v-app-bar-title class="company-title">MNG</v-app-bar-title> -->

    <v-spacer></v-spacer>

    <v-btn
      v-for="(system, id) in menuStore.allMenus"
      :key="id"
      :active="menuStore.selectedSystemId === id"
      @click="menuStore.selectSystem(id)"
      class="no-uppercase"
    >
      {{ system.name }}
    </v-btn>

    <v-spacer></v-spacer>
    <v-btn
      @click="toggleTheme"
      icon
      class="theme-toggle-btn"
      aria-label="Toggle theme"
      :title="isDark ? 'Light mode' : 'Dark mode'"
    >
      <v-icon :icon="themeIcon" />
    </v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <div v-bind="props" class="d-flex align-center cursor-pointer">
          <v-btn icon="$translate"></v-btn>
        </div>
      </template>

      <v-list density="compact">
        <v-list-item>
          <v-btn color="surface" @click="localeStore.setLocale('ko')">한국어</v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn color="surface" @click="localeStore.setLocale('en')">English</v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <div v-bind="props" class="d-flex align-center cursor-pointer">
          <span class="user-id">{{ userId }} {{ $t('messages.welcome') }}</span>
          <v-icon class="user-icon">$accountCircle</v-icon>
        </div>
      </template>

      <v-list density="compact">
        <v-list-item to="/profile" prepend-icon="$account">
          <v-list-item-title>프로필</v-list-item-title>
        </v-list-item>
        <v-list-item @click="openLogoutDialog" prepend-icon="$logout">
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
import { ref, computed } from 'vue'
import { useMenuStore } from '@/stores/menu'
import { useAuthStore } from '@/stores/auth' // auth 스토어 import
import ConfirmDialog from '@/components/common/ConfirmDialog.vue' // ConfirmDialog import
import { useLocaleStore } from '@/stores/locale'
import logoUrl from '@/assets/logo.png'
import { useTheme } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
const router = useRouter()

const localeStore = useLocaleStore()
const menuStore = useMenuStore()
const authStore = useAuthStore()

// storeToRefs를 사용해 스토어의 상태를 반응형 ref로 가져옵니다.
// 이렇게 해야 구조 분해 할당을 해도 반응성이 유지됩니다.
const { isAuthenticated, userId } = storeToRefs(authStore)

// 1. useTheme 헬퍼 함수로 현재 테마 상태를 가져옵니다.
const theme = useTheme()
// 2. 현재 테마가 다크 모드인지 확인하는 computed 속성을 만듭니다.
const isDark = computed(() => theme.global.current.value.dark)

// 3. 현재 테마에 따라 표시할 아이콘을 결정합니다.
const themeIcon = computed(() => {
  // 아이콘 별칭은 vuetify.js에 등록된 값을 사용합니다.
  return isDark.value ? '$weatherNight' : '$weatherSunny'
})

// 4. 테마를 전환하는 함수입니다.
function toggleTheme() {
  if (isDark.value) {
    theme.change('light')
  } else {
    theme.change('dark')
  }
}

const showLogoutConfirm = ref(false) // 다이얼로그 표시 상태

// '로그아웃' 메뉴 클릭 시 다이얼로그를 엽니다.
function openLogoutDialog() {
  showLogoutConfirm.value = true
}

// 다이얼로그에서 '확인'을 눌렀을 때 실제 로그아웃을 처리합니다.
function handleLogout() {
  authStore.logout()
  router.push('/login') // 로그아웃 후 로그인 페이지로 이동
}
</script>

<style scoped>
.theme-toggle-btn {
  /* Vuetify의 내장 테마 변수를 사용하여 현재 테마에 맞는 색상을 적용합니다.
    --v-theme-on-surface-variant: 현재 테마의 surface 색상 위 텍스트/아이콘 색상 (variant)
  */
  color: rgb(var(--v-theme-on-surface-variant));
  border: 1px solid transparent; /* hover 시 크기 변경 방지 */
  transition: all 0.2s ease-in-out;
}

.theme-toggle-btn:hover {
  /* Vue 문서 스타일의 핵심인 hover 효과입니다.
    --v-theme-surface-variant: 현재 테마의 surface 색상 (variant)
  */
  background-color: rgb(var(--v-theme-surface-variant));
  border-color: rgb(var(--v-theme-on-surface-variant));
  transform: scale(1.1);
}

.theme-toggle-btn .v-icon {
  transition: transform 0.3s ease-in-out;
}

/* 테마가 바뀔 때 아이콘에 회전 효과 추가 */
.theme-toggle-btn:hover .v-icon {
  transform: rotate(360deg);
}

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

.no-uppercase {
  text-transform: none !important;
}
</style>
