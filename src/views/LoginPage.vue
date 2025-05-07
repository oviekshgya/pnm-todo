<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 relative">
      <div
        v-if="isLoading"
        class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10"
      >
        <div class="text-center">
          <svg class="animate-spin h-6 w-6 mx-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p class="mt-2 text-indigo-600 font-semibold">Logging in...</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-center text-indigo-700 mb-6">Welcome Back</h2>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              class="absolute top-2 right-3 text-gray-500"
              @click="showPassword = !showPassword"
            >
              <span v-if="showPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
        </div>

        <div v-if="loginError" class="text-red-500 text-sm text-center">
          Email or password is incorrect.
        </div>

        <button
          type="submit"
          :disabled="!email || !password || isLoading"
          :class="[
            'w-full py-2 rounded-lg font-semibold transition duration-200',
            (!email || !password || isLoading)
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          ]"
        >
          Login
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Don't have an account?
        <router-link to="/register" class="text-indigo-600 hover:underline">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loginError = ref(false)
const isLoading = ref(false)

const handleLogin = () => {
  if (email.value === 'admin@example.com' && password.value === '123456') {
    loginError.value = false
    isLoading.value = true

    setTimeout(() => {
      isLoading.value = false
      router.push('/home')
    }, 1500)
  } else {
    loginError.value = true
  }
}
</script>
