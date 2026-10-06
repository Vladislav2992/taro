import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg', href: '/icon.svg' }],
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }],
      script: [{ src: 'https://telegram.org/js/telegram-web-app.js?63' }]
    }
  },
  ssr: true,
  runtimeConfig: {
    deepseekApiKey: process.env.DEEPSEEK_API_KEY,
    telegramBotToken: '',
    databaseUrl: '',
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@pinia/nuxt', '@nuxt/image'],
  css: ['~/assets/css/main.css', '~/assets/css/global.sass'],
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "@/assets/css/vars.sass" as *\n'
        }
      }
    },
    plugins: [
      tailwindcss(),      
    ],
  },
})
