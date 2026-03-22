export default defineNuxtPlugin(async () => {
    const { initAuth } = useAuth()

    // Initialize auth state on app start
    await initAuth()
})