import type { TelegramWebApp } from '~/composables/useTelegram'

export default defineNuxtPlugin((nuxtApp) => {
  const telegram = useTelegram()
  const webApp = (window as Window & { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp
  if (!webApp) return

  telegram.initData.value = webApp.initData ?? ''
  const queryParams = new URLSearchParams(window.location.search)
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const isTelegramLaunch = Boolean(telegram.initData.value)
    || queryParams.has('tgWebAppVersion')
    || hashParams.has('tgWebAppVersion')
  if (!isTelegramLaunch) return

  telegram.isTelegram.value = true
  webApp.ready?.()
  webApp.expand?.()
  document.documentElement.style.colorScheme = webApp.colorScheme ?? 'dark'
  for (const [key, value] of Object.entries(webApp.themeParams ?? {})) {
    if (/^[a-z_]+$/.test(key) && typeof value === 'string') {
      document.documentElement.style.setProperty(`--tg-${key.replaceAll('_', '-')}`, value)
    }
  }

  if (telegram.initData.value) {
    void $fetch<{ user: { id: string }; freeReadingsBalance: number }>('/api/auth/telegram', {
      method: 'POST',
      body: { initData: telegram.initData.value },
    }).then((response) => {
      telegram.user.value = response.user
      telegram.balance.value = response.freeReadingsBalance
      telegram.authError.value = null
    }).catch(() => {
      telegram.authError.value = 'Не удалось подтвердить Telegram. Закройте и снова откройте приложение.'
    })
  } else {
    telegram.authError.value = 'Telegram не передал данные для входа. Откройте приложение из чата с ботом.'
  }

  const backButton = webApp.BackButton
  if (!backButton) return

  const router = nuxtApp.$router
  const updateBackButton = (path: string) => {
    if (path === '/') {
      backButton.hide()
      return
    }
    backButton.show()
  }
  const onBack = () => {
    const path = router.currentRoute.value.path
    if (path === '/result' && import.meta.client) {
      try {
        const savedSpread = localStorage.getItem('spread')
        const id = savedSpread ? JSON.parse(savedSpread)?.id : null
        if (id) {
          localStorage.setItem('telegramResumeSpread', '1')
          void router.push(`/spreads/${encodeURIComponent(id)}`)
          return
        }
      } catch {
        // Fall through to the spread list when stored state cannot be read.
      }
    }
    void router.push('/')
  }

  backButton.onClick(onBack)
  updateBackButton(router.currentRoute.value.path)
  router.afterEach((to) => updateBackButton(to.path))
})
