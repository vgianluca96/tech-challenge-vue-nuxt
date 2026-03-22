export default defineNuxtRouteMiddleware(async (to, from) => {
    // Only run on client side and for root path or page refresh
    if (process.client && (to.path === '/' || !from.fullPath)) {
        const { validateToken } = useAuth()
        const token = localStorage.getItem('access_token')

        if (token) {
            const isValid = await validateToken()
            if (isValid) {
                return navigateTo('/me')
            } else {
                return navigateTo('/signin')
            }
        } else {
            return navigateTo('/signin')
        }
    }
})