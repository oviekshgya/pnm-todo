<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
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
            class="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>
  
        <p class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <a href="#" class="text-indigo-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const loginError = ref(false)
  
  const handleLogin = () => {
    // Simulasi login (ganti dengan real API)
    if (email.value === 'admin@example.com' && password.value === '123456') {
      alert('Login sukses!')
      loginError.value = false
    } else {
      loginError.value = true
    }
  }
  </script>
  