<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-center text-emerald-700 mb-6">Create Account</h2>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700">Full Name</label>
          <input v-model="name" type="text" placeholder="John Doe"
            class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" placeholder="you@example.com"
            class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required />
        </div>
        <div v-if="email && !emailAvailable" class="text-red-500 text-xs mt-1">
          Email already exists. Please use a different one.
        </div>
        <div v-if="checkingEmail" class="text-xs text-gray-500 mt-1">
          Checking email availability...
        </div>


        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required />
            <button type="button" class="absolute top-2 right-3 text-gray-500" @click="showPassword = !showPassword">
              <span v-if="showPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
          <div v-if="password && !isPasswordValid" class="text-red-500 text-xs mt-1">
            Password harus mengandung huruf besar, huruf kecil, angka, dan simbol.
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <div class="relative">
            <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="••••••••"
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required />
            <button type="button" class="absolute top-2 right-3 text-gray-500"
              @click="showConfirmPassword = !showConfirmPassword">
              <span v-if="showConfirmPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
          <div v-if="confirmPassword && !isPasswordsMatch" class="text-red-500 text-xs mt-1">
            Passwords do not match.
          </div>
        </div>

        <div v-if="formError" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>

        <button type="submit" class="w-full py-2 rounded-lg font-semibold transition duration-200" :class="{
          'bg-emerald-600 text-white hover:bg-emerald-700': isFormValid && !isLoading,
          'bg-gray-400 text-gray-700 cursor-not-allowed': !isFormValid || isLoading
        }" :disabled="!isFormValid || isLoading">
          <span v-if="isLoading" class="animate-spin mr-2">🔄</span>
          Register
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Already have an account?
        <a href="/" class="text-emerald-600 hover:underline">Login</a>
      </p>
    </div>

    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-10">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold text-gray-700">Please wait...</h3>
        <div class="mt-4 text-center">
          <span class="animate-spin mr-2">🔄</span> Processing your registration...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordMismatch = ref(false)
const formError = ref(false)
const isLoading = ref(false)

const router = useRouter()

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const isPasswordValid = computed(() => passwordRegex.test(password.value))

const isPasswordsMatch = computed(() => password.value === confirmPassword.value)

const isFormValid = computed(() => {
  return (
    name.value !== '' &&
    email.value !== '' &&
    password.value !== '' &&
    confirmPassword.value !== '' &&
    isPasswordValid.value &&
    isPasswordsMatch.value &&
    emailAvailable.value
  )
})

const errorMessage = ref('')

const handleRegister = async () => {
  if (!isPasswordsMatch.value) {
    passwordMismatch.value = true
    formError.value = true
    errorMessage.value = 'Passwords do not match.'
    return
  }

  passwordMismatch.value = false
  formError.value = false
  errorMessage.value = ''
  isLoading.value = true

  try {
    const response = await fetch('http://localhost:3000/v.01/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'pnm',
        'Authorization': 'Basic cG5tOnBubTEyMw=='
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
      })
    })

    const result = await response.json()

    if (!response.ok || result.error) {
      errorMessage.value = result.message || 'Registration failed.'
      formError.value = true
      return
    }

    console.log('Registration successful:', result)
    router.push('/')
  } catch (error) {
    console.error('Error during registration:', error)
    errorMessage.value = 'Network or server error.'
    formError.value = true
  } finally {
    isLoading.value = false
  }
}

const emailAvailable = ref(true)
const checkingEmail = ref(false)


watch(email, async (newEmail) => {
  if (!newEmail.includes('@') || newEmail.length < 5) {
    emailAvailable.value = true
    return
  }

  checkingEmail.value = true
  try {
    const res = await fetch('http://localhost:3000/v.01/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'pnm',
        'Authorization': 'Basic cG5tOnBubTEyMw=='
      },
      body: JSON.stringify({ email: newEmail, password: 'Dummy123@' }) // password is required by API
    })

    const result = await res.json()

    if (result?.error && result?.message.includes('already exists')) {
      emailAvailable.value = false
    } else {
      emailAvailable.value = true
    }

  } catch (err) {
    console.error('Email check failed:', err)
    emailAvailable.value = true
  } finally {
    checkingEmail.value = false
  }
})



</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>