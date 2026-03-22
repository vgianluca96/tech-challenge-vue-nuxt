<template>
   <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb; padding: 3rem 1rem;">
     <div class="max-w-md w-full space-y-8">
      <div>
        <h1 class="text-center text-3xl font-extrabold text-gray-900">
          Sign in
        </h1>
      </div>
      
      <VeeForm 
        @submit="handleSubmit" 
        :validation-schema="validationSchema"
        class="mt-8 space-y-6"
      >
        <div class="space-y-4">
          <!-- Email Field -->
          <div>
            <label for="email" class="sr-only">Email address</label>
            <VeeField
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              :class="[
                'appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                emailError ? 'border-red-300' : 'border-gray-300'
              ]"
              placeholder="Email address"
              v-model="formData.email"
              @input="clearEmailError"
            />
            <VeeErrorMessage name="email" class="text-red-500 text-sm mt-1" />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="sr-only">Password</label>
            <VeeField
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              :class="[
                'appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                passwordError ? 'border-red-300' : 'border-gray-300'
              ]"
              placeholder="Password"
              v-model="formData.password"
              @input="clearPasswordError"
            />
            <VeeErrorMessage name="password" class="text-red-500 text-sm mt-1" />
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="loginError" class="text-red-500 text-sm text-center">
          {{ loginError }}
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <NuxtLink
            to="/register"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            not yet registered? register now
          </NuxtLink>
        </div>
      </VeeForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup'

definePageMeta({
  ssr:false,
  middleware: 'redirect'
})

const { login, isLoading } = useAuth()

const formData = reactive({
  email: '',
  password: ''
})

const loginError = ref('')
const emailError = ref(false)
const passwordError = ref(false)

const validationSchema = yup.object({
  email: yup
    .string()
    .required('insert the email')
    .email('insert a valid email'),
  password: yup
    .string()
    .required('insert the password')
})

const clearEmailError = () => {
  emailError.value = false
}

const clearPasswordError = () => {
  passwordError.value = false
}

const handleSubmit = async (values: any, { setFieldError }: any) => {
  loginError.value = ''
  emailError.value = false
  passwordError.value = false

  // Validate email
  if (!values.email) {
    setFieldError('email', 'insert the email')
    emailError.value = true
    return
  }
  
  if (!isValidEmail(values.email)) {
    setFieldError('email', 'insert a valid email')
    emailError.value = true
    return
  }

  // Validate password
  if (!values.password) {
    setFieldError('password', 'insert the password')
    passwordError.value = true
    return
  }

  const result = await login({
    email: values.email,
    password: values.password
  })

  if (result.success) {
    await navigateTo('/me')
  } else {
    loginError.value = result.error || 'credentials are not valid'
  }
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
</script>