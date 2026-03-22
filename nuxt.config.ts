// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-03-22',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vee-validate/nuxt'
  ],

  runtimeConfig: {
    public: {
      backendUrl: process.env.BACKEND_URL || 'http://localhost:3000'
    }
  },

  ssr: false,

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config',
    exposeConfig: false,
    viewer: true,
  },

  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  }
})