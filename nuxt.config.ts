// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    BIApiBase: process.env.BI_API_BASE ? process.env.BI_API_BASE : "http://localhost:5000",
    BIDatabaseAddr: process.env.BI_DATABASE_ADDR ? process.env.BI_DATABASE_ADDR : "localhost",
  },
  modules: [
    'nuxt-primevue',
    'nuxt-icon',
    '@pinia/nuxt',
  ],
  primevue: {
    /* option */
  },
  css: [
    'primevue/resources/themes/aura-light-blue/theme.css',
    'primeicons/primeicons.css',
    '/removebodymargin.css'
  ],
  typescript: {
    typeCheck: true
  }
})
