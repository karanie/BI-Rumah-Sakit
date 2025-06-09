// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'id-ID'
      }
    }
  },
  devtools: { enabled: true },
  runtimeConfig: {
    biApiBase: "http://localhost:5000",
    biDatabaseAddr: "localhost",
    biDatabasePort: 5432,
    biDatabaseName: "birumahsakit",
    biDatabaseUser: "birumahsakit",
    biDatabasePassword: "birumahsakit",
    saltRounds: 11,
    tokenSecret: "VVVVT09PR0hIIENVTk5ZWS4uLi4hISEgOnNvYjo=",
  },
  modules: [
    'nuxt-primevue',
    'nuxt-icon',
    '@pinia/nuxt',
    'nuxt3-leaflet',
    'nuxt-auth-utils'
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
  },
  nitro: {
    experimental: {
      websocket: true,
    },
  }
})
