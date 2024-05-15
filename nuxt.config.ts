// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    BIApiBase: process.env.BI_API_BASE ? process.env.BI_API_BASE : "http://localhost:5000",
    BIDatabaseAddr: process.env.BI_DATABASE_ADDR ? process.env.BI_DATABASE_ADDR : "localhost",
    saltRounds: 11,
    tokenSecret: "VVVVT09PR0hIIENVTk5ZWS4uLi4hISEgOnNvYjo=",
  },
  modules: [
    'nuxt-primevue',
    'nuxt-icon',
    '@pinia/nuxt',
    '@sidebase/nuxt-auth',
    'nuxt3-leaflet',
  ],
  primevue: {
    /* option */
  },
  auth: {
    globalAppMiddleware: true,
    provider: {
      type: 'local',
      sessionDataType: {
        user_id: 'number',
        username: 'string',
        nama_lengkap: 'string',
        jabatan: 'string',
        role: 'admin | non_admin',
      },
      token: {
        maxAgeInSeconds: 60 * 60 * 6,
      },
    }
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
