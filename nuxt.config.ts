import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg', href: '/icon.svg' }]
    }
  },
  ssr: true,
  runtimeConfig: {
    deepseekApiKey: process.env.DEEPSEEK_API_KEY,
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