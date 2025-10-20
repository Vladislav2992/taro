export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const tg = (window as any).Telegram?.WebApp
  if (!tg) return

  tg.ready() // уведомляем Telegram, что WebApp загружен
  tg.expand() // раскрываем окно на весь экран

  console.log('Telegram WebApp init:', tg.initDataUnsafe?.user)
})