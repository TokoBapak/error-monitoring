// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    build: {
        transpile: ['trpc-nuxt']
    },
    modules: [
        '@unocss/nuxt',
    ],
    unocss: {
        // presets
        uno: true, 
        icons: true, 
    },
})
