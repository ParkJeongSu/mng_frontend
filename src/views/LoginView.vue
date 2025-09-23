<template>
  <v-container class="fill-height d-flex justify-center align-center login-page-container">
    <v-card class="login-card">
      <v-card-title class="text-center text-h5 py-4">Sign in</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="username"
          label="ID"
          variant="outlined"
          density="compact"
          class="mb-2"
          @keyup.enter="handleLogin"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          :type="passwordFieldType"
          variant="outlined"
          density="compact"
          @keyup.enter="handleLogin"
          :append-inner-icon="passwordFieldIcon"
          @click:append-inner="togglePasswordVisibility"
        ></v-text-field>
        <v-alert v-if="loginError" type="error" density="compact" class="mb-4">
          {{ loginError }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-btn
          @click="handleLogin"
          variant="elevated"
          color="primary"
          block
          size="large"
          :loading="submitting"
          :disabled="submitting"
          >Login</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const submitting = ref(false)
const showPassword = ref(false)

// 1. 스토어의 loginError를 감시하는 computed 속성을 만듭니다.
const loginError = computed(function () {
  return authStore.loginError
})

const passwordFieldType = computed(function () {
  return showPassword.value ? 'text' : 'password'
})

const passwordFieldIcon = computed(function () {
  return showPassword.value ? 'mdi-eye' : 'mdi-eye-off'
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
.fill-height {
  height: 100vh;
}

/* 2. login-card 클래스에 대한 스타일을 정의합니다. */
.login-card {
  width: 400px;
}

.login-page-container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background-color: #f6f7fb;
}
</style>
