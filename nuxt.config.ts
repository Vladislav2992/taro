import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    deepseekApiKey: process.env.DEEPSEEK_API_KEY,
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@pinia/nuxt', '@nuxt/image'],
  css: ['~/assets/css/main.css', '~/assets/css/global.sass'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})