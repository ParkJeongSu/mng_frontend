<!-- src/views/LoginView.vue -->
<template>
  <div class="page">
    <div class="card">
      <h1 class="title">Sign in</h1>

      <form @submit.prevent="onSubmit">
        <label class="field">
          <span>Email</span>
          <input
            type="email"
            v-model.trim="email"
            placeholder="you@example.com"
            autocomplete="username"
            :class="{ invalid: emailError }"
          />
          <small v-if="emailError" class="error">{{ emailError }}</small>
        </label>

        <label class="field">
          <span>Password</span>
          <div class="password-wrap">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="••••••••"
              autocomplete="current-password"
              :class="{ invalid: passwordError }"
            />
            <button type="button" class="toggle" @click="showPassword = !showPassword">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <small v-if="passwordError" class="error">{{ passwordError }}</small>
        </label>

        <label class="remember">
          <input type="checkbox" v-model="remember" />
          <span>Remember me</span>
        </label>

        <button class="submit" :disabled="submitting">
          <span v-if="!submitting">Login</span>
          <span v-else>Signing in…</span>
        </button>

        <p v-if="formError" class="form-error">{{ formError }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '../services/auth.js'

const email = ref('')
const password = ref('')
const remember = ref(true)
const showPassword = ref(false)
const submitting = ref(false)
const formError = ref('')

const emailError = ref('')
const passwordError = ref('')

function validate() {
  emailError.value = ''
  passwordError.value = ''

  if (!email.value) emailError.value = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
    emailError.value = 'Invalid email format.'

  if (!password.value) passwordError.value = 'Password is required.'
  else if (password.value.length < 6) passwordError.value = 'At least 6 characters.'

  return !(emailError.value || passwordError.value)
}

async function onSubmit() {
  formError.value = ''
  if (!validate()) return
  submitting.value = true
  try {
    const { token, user } = await login(email.value, password.value)
    if (remember.value) {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      sessionStorage.setItem('auth_token', token)
      sessionStorage.setItem('auth_user', JSON.stringify(user))
    }
    // 로그인 성공 후 이동 (필요에 맞게 변경)
    window.location.href = '/'
  } catch (err) {
    formError.value = err?.message || 'Failed to sign in.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f6f7fb;
  padding: 24px;
}
.card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  padding: 28px;
}
.title {
  margin: 0 0 16px;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
}
.field {
  display: block;
  margin-bottom: 14px;
}
.field > span {
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
  color: #333;
}
input[type='email'],
input[type='password'],
input[type='text'] {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #d8d8de;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.15s ease;
  background: #fff;
}
input:focus {
  border-color: #7c7cff;
}
.invalid {
  border-color: #e45858 !important;
  background: #fff7f7;
}
.password-wrap {
  position: relative;
}
.toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 6px;
  color: #5a5a6f;
}
.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0 12px;
  font-size: 14px;
}
.submit {
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 10px;
  background: #6c6cff;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  margin-top: 6px;
}
.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  display: block;
  color: #e45858;
  font-size: 12px;
  margin-top: 6px;
}
.form-error {
  margin-top: 12px;
  color: #e45858;
  text-align: center;
  font-size: 14px;
}
</style>
