// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    BIApiBase: "http://localhost:5000/",
  },
  modules: [
    'nuxt-primevue',
    'nuxt-icon',
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
