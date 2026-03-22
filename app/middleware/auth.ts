export default defineNuxtRouteMiddleware((to, from) => {
    const { isAuthenticated, validateToken } = useAuth()

    // Only run on client side
    if (process.client) {
        const token = localStorage.getItem('access_token')

        if (!token) {
            if (to.path === '/me') {
                throw createError({ statusCode: 404, statusMessage: 'Page not found' })
            }
            return navigateTo('/signin')
        }

        // Validate token asynchronously
        validateToken().then((isValid) => {
            if (!isValid) {
                if (to.path === '/me') {
                    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
                }
                return navigateTo('/signin')
            }
        })
    }
})