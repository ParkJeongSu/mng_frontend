<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card width="400">
      <v-card-title class="text-center text-h5 py-4">로그인</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="username"
          label="아이디"
          variant="outlined"
          density="compact"
          class="mb-2"
          @keyup.enter="handleLogin"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="비밀번호"
          type="password"
          variant="outlined"
          density="compact"
          @keyup.enter="handleLogin"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-btn @click="handleLogin" color="primary" block size="large">로그인</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const handleLogin = () => {
  authStore.login(username.value, password.value)
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
