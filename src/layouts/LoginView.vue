<template>
  <v-app>
    <v-main>
      <v-container fluid class="d-flex justify-center align-center login-page-container">
        <v-card color="background" class="login-image-card" flat>
          <v-img :src="logoUrl" height="120" alt="taegutec"></v-img>
        </v-card>
        <v-card class="login-input-card" color="background" flat>
          <v-card flat class="d-flex justify-center pa-4 login-icon-card" color="background">
            <v-icon icon="$accountLock" color="purple" size="108"></v-icon>
          </v-card>
          <v-form @submit.prevent="handleLogin">
            <v-card-text>
              <v-text-field
                v-model="username"
                label="ID"
                variant="outlined"
                density="compact"
                class="mb-2 no-border-field"
                prepend-inner-icon="$account"
                @keyup.enter="handleLogin"
                :hide-details="false"
                autocomplete="username"
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
                class="no-border-field"
                autocomplete="current-password"
                @click:append-inner="togglePasswordVisibility"
                :hide-details="false"
              ></v-text-field>
              <v-select
                v-model="language"
                :items="languageItems"
                item-title="title"
                item-value="value"
                label="Language"
                variant="outlined"
                density="compact"
                class="mb-2 no-border-field"
                prepend-inner-icon="$web"
                :hide-details="false"
              ></v-select>
              <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4">
                {{ errorMessage }}
              </v-alert>
            </v-card-text>

            <v-card-actions class="px-4 pb-4">
              <v-btn
                variant="elevated"
                class="login-btn"
                type="submit"
                block
                size="large"
                :loading="submitting"
                :disabled="submitting"
                >Login</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card>
      </v-container>
    </v-main>
    <v-footer app class="d-flex justify-center footer" color="background">
      <div class="text-caption">© {{ new Date().getFullYear() }} MNG. All rights reserved.</div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import logoUrl from '@/assets/logo.png'
import { login } from '@/api/auth'
import { useRouter } from 'vue-router'
const router = useRouter()
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

const errorMessage = ref('')

const passwordFieldType = computed(function () {
  return showPassword.value ? 'text' : 'password'
})

const passwordFieldIcon = computed(function () {
  return showPassword.value ? '$eye' : '$eyeOff'
})

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

const handleLogin = async function () {
  try {
    submitting.value = true
    const response = await login({
      userId: username.value,
      password: password.value,
    })
    // 5. API 호출 성공 시, 응답으로 받은 토큰 정보를 추출합니다.
    //const accessToken = response.data.accessToken;
    //const refreshToken = response.data.refreshToken;
    //authStore.setTokens(accessToken,refreshToken);
    authStore.login(response.data)

    // 7. 로그인이 성공했으므로 메인 페이지나 대시보드로 이동합니다.

    await router.push('/')
  } catch (error) {
    // 8. API 호출 실패 시 (예: 아이디/비번 불일치), 에러 메시지를 표시합니다.
    console.error('로그인 실패:', error)
    errorMessage.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
  } finally {
    submitting.value = false
  }
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
}

.login-image-card {
  width: 500px;
  border: none !important;
  box-shadow: none !important;
}
.login-input-card {
  width: 400px;
  border: none !important;
  box-shadow: none !important;
}
.login-icon-card {
  border: none !important;
  box-shadow: none !important;
}

.login-page-container {
  min-height: 100vh;
}
</style>
