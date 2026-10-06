interface TelegramUser {
  id: string
}

interface TelegramWebApp {
  initData?: string
  colorScheme?: 'light' | 'dark'
  themeParams?: Record<string, string>
  BackButton?: {
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  ready?: () => void
  expand?: () => void
}

export const useTelegram = () => {
  const isTelegram = useState('telegram-is-telegram', () => false)
  const initData = useState('telegram-init-data', () => '')
  const user = useState<TelegramUser | null>('telegram-user', () => null)
  const balance = useState<number | null>('telegram-free-readings-balance', () => null)
  const authError = useState<string | null>('telegram-auth-error', () => null)

  const startParam = computed(() => {
    const signedParam = initData.value
      ? new URLSearchParams(initData.value).get('start_param')
      : null
    if (signedParam) return signedParam
    if (!import.meta.client) return null
    return new URLSearchParams(window.location.search).get('tgWebAppStartParam')
  })

  return { isTelegram, initData, user, balance, authError, startParam }
}

export type { TelegramWebApp }
