import { ref, computed } from 'vue'
import axios from 'axios'

interface User {
    _id: string
    email: string
    name: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface LoginResponse {
    access_token: string
    user: User
}

interface LoginCredentials {
    email: string
    password: string
}

interface RegisterCredentials {
    email: string
    password: string
    name: string
    lastname: string
}

const user = ref<User | null>(null)
const isAuthenticated = ref<boolean>(false)
const isLoading = ref<boolean>(false)

export const useAuth = () => {
    const config = useRuntimeConfig()

    const baseURL = config.public.backendUrl

    // Get token from localStorage
    const getToken = (): string | null => {
        if (process.client) {
            return localStorage.getItem('access_token')
        }
        return null
    }

    // Set token in localStorage
    const setToken = (token: string) => {
        if (process.client) {
            localStorage.setItem('access_token', token)
        }
    }

    // Remove token from localStorage
    const removeToken = () => {
        if (process.client) {
            localStorage.removeItem('access_token')
        }
    }

    // Create axios instance with auth header
    const createAuthAxios = () => {
        const token = getToken()
        return axios.create({
            baseURL,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
    }

    // Validate current token
    const validateToken = async (): Promise<boolean> => {
        const token = getToken()
        if (!token) return false

        try {
            isLoading.value = true
            const authAxios = createAuthAxios()
            const response = await authAxios.get('/auth/me')

            user.value = response.data
            isAuthenticated.value = true
            return true
        } catch (error) {
            removeToken()
            user.value = null
            isAuthenticated.value = false
            return false
        } finally {
            isLoading.value = false
        }
    }

    // Login function
    const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
        try {
            isLoading.value = true
            const response = await axios.post<LoginResponse>(`${baseURL}/auth/login`, credentials)

            const { access_token, user: userData } = response.data

            setToken(access_token)
            user.value = userData
            isAuthenticated.value = true

            return { success: true }
        } catch (error: any) {
            return {
                success: false,
                error: 'credentials are not valid'
            }
        } finally {
            isLoading.value = false
        }
    }

    // Register function
    const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
        try {
            isLoading.value = true
            await axios.post(`${baseURL}/auth/register`, credentials)
            return { success: true }
        } catch (error: any) {
            return {
                success: false,
                error: 'something went wrong. please retry'
            }
        } finally {
            isLoading.value = false
        }
    }

    // Get all users (for /me page)
    const getUsers = async (): Promise<User[]> => {
        try {
            const authAxios = createAuthAxios()
            const response = await authAxios.get('/auth/users')
            return response.data
        } catch (error) {
            throw new Error('Failed to fetch users')
        }
    }

    // Logout function
    const logout = () => {
        removeToken()
        user.value = null
        isAuthenticated.value = false
    }

    // Initialize auth state on client side
    const initAuth = async () => {
        if (process.client) {
            await validateToken()
        }
    }

    return {
        user: computed(() => user.value),
        isAuthenticated: computed(() => isAuthenticated.value),
        isLoading: computed(() => isLoading.value),
        login,
        register,
        logout,
        validateToken,
        getUsers,
        initAuth
    }
}