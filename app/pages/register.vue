<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h1 class="text-center text-3xl font-extrabold text-gray-900">
          Register
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
              autocomplete="new-password"
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

          <!-- Confirm Password Field -->
          <div>
            <label for="confirmPassword" class="sr-only">Confirm Password</label>
            <VeeField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              :class="[
                'appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                confirmPasswordError ? 'border-red-300' : 'border-gray-300'
              ]"
              placeholder="Confirm Password"
              v-model="formData.confirmPassword"
              @input="clearConfirmPasswordError"
            />
            <VeeErrorMessage name="confirmPassword" class="text-red-500 text-sm mt-1" />
          </div>

          <!-- Name Field -->
          <div>
            <label for="name" class="sr-only">Name</label>
            <VeeField
              id="name"
              name="name"
              type="text"
              autocomplete="given-name"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Name (optional)"
              v-model="formData.name"
            />
          </div>

          <!-- Last Name Field -->
          <div>
            <label for="lastname" class="sr-only">Last Name</label>
            <VeeField
              id="lastname"
              name="lastname"
              type="text"
              autocomplete="family-name"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Last Name (optional)"
              v-model="formData.lastname"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="isLoading">Registering...</span>
            <span v-else>Register</span>
          </button>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="text-center">
          <NuxtLink
            to="/signin"
            class="font-medium text-green-600 hover:text-green-500"
          >
            {{ successMessage }}
          </NuxtLink>
        </div>

        <!-- Error Message -->
        <div v-if="registerError" class="text-red-500 text-sm text-center">
          {{ registerError }}
        </div>
      </VeeForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup'

const { register, isLoading } = useAuth()

const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  lastname: ''
})

const registerError = ref('')
const successMessage = ref('')
const emailError = ref(false)
const passwordError = ref(false)
const confirmPasswordError = ref(false)

const validationSchema = yup.object({
  email: yup
    .string()
    .required('insert the email')
    .email('insert a valid email'),
  password: yup
    .string()
    .required('insert the password')
    .min(8, 'password must be at least 8 characters long, have at least 1 uppercase letter, 1 number and 1 special character')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'password must be at least 8 characters long, have at least 1 uppercase letter, 1 number and 1 special character'
    ),
  confirmPassword: yup
    .string()
    .required('confirm the password')
    .oneOf([yup.ref('password')], 'the inserted string is not equal to the chosen password'),
  name: yup.string().optional(),
  lastname: yup.string().optional()
})

const clearEmailError = () => {
  emailError.value = false
}

const clearPasswordError = () => {
  passwordError.value = false
}

const clearConfirmPasswordError = () => {
  confirmPasswordError.value = false
}

const handleSubmit = async (values: any, { setFieldError }: any) => {
  registerError.value = ''
  successMessage.value = ''
  emailError.value = false
  passwordError.value = false
  confirmPasswordError.value = false

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

  if (!isValidPassword(values.password)) {
    setFieldError('password', 'password must be at least 8 characters long, have at least 1 uppercase letter, 1 number and 1 special character')
    passwordError.value = true
    return
  }

  // Validate confirm password
  if (!values.confirmPassword) {
    setFieldError('confirmPassword', 'confirm the password')
    confirmPasswordError.value = true
    return
  }

  if (values.password !== values.confirmPassword) {
    setFieldError('confirmPassword', 'the inserted string is not equal to the chosen password')
    confirmPasswordError.value = true
    return
  }

  const result = await register({
    email: values.email,
    password: values.password,
    name: values.name || '',
    lastname: values.lastname || ''
  })

  if (result.success) {
    successMessage.value = 'user correctly registered. now you can signin'
    // Clear form
    Object.keys(formData).forEach(key => {
      formData[key as keyof typeof formData] = ''
    })
  } else {
    registerError.value = result.error || 'something went wrong. please retry'
  }
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[@$!%*?&]/.test(password)
  )
}
</script>