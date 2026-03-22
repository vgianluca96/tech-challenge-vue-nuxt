<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div>
        <h1 class="text-9xl font-bold text-gray-300">404</h1>
        <h2 class="text-3xl font-bold text-gray-900 mt-4">Page not found</h2>
        <p class="text-gray-600 mt-4">
          The page you are looking for doesn't exist.
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/signin"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Sign In
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const error = useError()
</script>