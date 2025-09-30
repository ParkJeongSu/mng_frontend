<template>
  <v-app>
    <v-main>
      <v-container class="fill-height d-flex justify-center align-center login-page-container">
        <v-card class="login-card" flat>
          <v-icon icon="$home" size="48"></v-icon>
        </v-card>
        <v-card class="login-card" flat>
          <v-icon icon="$home" size="48"></v-icon>
          <v-card-text>
            <v-text-field
              v-model="username"
              label="ID"
              variant="outlined"
              density="compact"
              class="mb-2"
              prepend-inner-icon="$account"
              @keyup.enter="handleLogin"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              :type="passwordFieldType"
              variant="outlined"
              density="compact"
              @keyup.enter="handleLogin"
              prepend-inner-icon="$lock"
              :append-inner-icon="passwordFieldIcon"
              @click:append-inner="togglePasswordVisibility"
            ></v-text-field>
            <v-select
              v-model="language"
              :items="languageItems"
              item-title="title"
              item-value="value"
              label="Language"
              variant="outlined"
              density="compact"
              class="mb-2"
              prepend-inner-icon="$web"
            ></v-select>
            <v-alert v-if="loginError" type="error" density="compact" class="mb-4">
              {{ loginError }}
            </v-alert>
          </v-card-text>

          <v-card-actions class="px-4 pb-4">
            <v-btn
              @click="handleLogin"
              variant="elevated"
              class="login-btn"
              block
              size="large"
              :loading="submitting"
              :disabled="submitting"
              >Login</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
    <v-footer app class="d-flex justify-center footer">
      <div class="text-caption">© {{ new Date().getFullYear() }} MNG. All rights reserved.</div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const submitting = ref(false)
const showPassword = ref(false)

// 언어 선택 v-select를 위한 데이터 추가
const language = ref('ko') // 기본 선택값
const languageItems = ref([
  { title: '한국어', value: 'ko' },
  { title: 'English', value: 'en' },
])

// 1. 스토어의 loginError를 감시하는 computed 속성을 만듭니다.
const loginError = computed(function () {
  return authStore.loginError
})

const passwordFieldType = computed(function () {
  return showPassword.value ? 'text' : 'password'
})

const passwordFieldIcon = computed(function () {
  return showPassword.value ? '$eye' : '$eyeOff'
})

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

const handleLogin = function () {
  submitting.value = true
  authStore.login(username.value, password.value)
  submitting.value = false
}
</script>

<style scoped>
.login-btn {
  background: linear-gradient(
    42deg,
    rgba(131, 58, 180, 1) 38%,
    rgba(253, 29, 29, 1) 69%,
    rgba(255, 220, 43, 1) 100%
  );
  color: white;
  font-weight: 300;
  text-align: center;
  border-radius: 45px;
  font-size: 1.3rem;
  height: 48px;
}
.footer {
  height: 40px;
  background-color: #f0f2f5;
}

.fill-height {
  height: 100vh;
}

/* 2. login-card 클래스에 대한 스타일을 정의합니다. */
.login-card {
  width: 400px;
  background-color: #f0f2f5;
}

.login-page-container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background-color: #f0f2f5;
}
</style>
