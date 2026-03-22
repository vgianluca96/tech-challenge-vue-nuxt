<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Welcome Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          welcome {{ user?.email }}
        </h1>
        
        <!-- Logout Button -->
        <button
          @click="handleLogout"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>

      <!-- Users List Section -->
      <div class="bg-white shadow-sm rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            List of the users
          </h3>
          
          <!-- Loading State -->
          <div v-if="loadingUsers" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-gray-600">Loading users...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="usersError" class="text-center py-4">
            <p class="text-red-600">{{ usersError }}</p>
            <button
              @click="fetchUsersList"
              class="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Retry
            </button>
          </div>

          <!-- Users Table -->
          <div v-else-if="users.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lastname
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="userItem in users" :key="userItem._id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ userItem.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ userItem.name || 'N.A.' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ userItem.lastname || 'N.A.' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- No Users State -->
          <div v-else class="text-center py-8">
            <p class="text-gray-500">No users found</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

interface User {
  _id: string
  email: string
  name: string
  lastname?: string
  createdAt: string
  updatedAt: string
  __v: number
}

const { user, logout, getUsers, validateToken, isAuthenticated } = useAuth()

const users = ref<User[]>([])
const loadingUsers = ref(false)
const usersError = ref('')

const fetchUsersList = async () => {
  try {
    loadingUsers.value = true
    usersError.value = ''
    
    // First validate token
    const isValid = await validateToken()
    if (!isValid) {
      throw new Error('Token is invalid')
    }
    
    const usersList = await getUsers()
    users.value = usersList
  } catch (error: any) {
    console.error('Error fetching users:', error)
    usersError.value = 'Failed to fetch users. Please try again.'
    
    // If authentication error, redirect to signin
    if (error.message === 'Token is invalid' || error.response?.status === 401) {
      await navigateTo('/signin')
    }
  } finally {
    loadingUsers.value = false
  }
}

const handleLogout = () => {
  logout()
  navigateTo('/signin')
}

// Check authentication and fetch users when component mounts
onMounted(async () => {
  if (process.client) {
    // Validate token first
    const isValid = await validateToken()
    if (!isValid) {
      await navigateTo('/signin')
      return
    }
    
    // If token is valid, fetch users
    await fetchUsersList()
  }
})

// Watch for authentication status changes
watch(isAuthenticated, (newValue) => {
  if (!newValue && process.client) {
    navigateTo('/signin')
  }
})
</script>