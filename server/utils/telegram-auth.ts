import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const MAX_AUTH_AGE_SECONDS = 60 * 60
const MAX_FUTURE_SKEW_SECONDS = 60

export interface VerifiedTelegramUser {
  id: string
}

export function validateTelegramInitData(initData: string, botToken: string): VerifiedTelegramUser {
  if (!initData || initData.length > 16_384) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Telegram initData' })
  }

  const params = new URLSearchParams(initData)
  const entries = [...params.entries()]
  if (entries.length === 0 || params.getAll('hash').length !== 1) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Telegram initData' })
  }
  if (new Set(entries.map(([key]) => key)).size !== entries.length) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Telegram initData' })
  }

  const suppliedHash = params.get('hash') ?? ''
  if (!/^[a-f0-9]{64}$/i.test(suppliedHash)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Telegram signature' })
  }

  const dataCheckString = entries
    .filter(([key]) => key !== 'hash')
    .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
  const secretKey = createHmac('sha256', botToken).update('WebAppData').digest()
  const expectedHash = createHmac('sha256', secretKey).update(dataCheckString).digest()
  const receivedHash = Buffer.from(suppliedHash, 'hex')
  if (receivedHash.length !== expectedHash.length || !timingSafeEqual(receivedHash, expectedHash)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Telegram signature' })
  }

  const authDate = Number(params.get('auth_date'))
  const now = Math.floor(Date.now() / 1000)
  if (!Number.isInteger(authDate) || authDate > now + MAX_FUTURE_SKEW_SECONDS || now - authDate > MAX_AUTH_AGE_SECONDS) {
    throw createError({ statusCode: 401, statusMessage: 'Telegram authentication has expired' })
  }

  let telegramUser: { id?: number | string } | null = null
  try {
    telegramUser = JSON.parse(params.get('user') ?? 'null') as { id?: number | string } | null
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Telegram user data' })
  }

  const id = telegramUser?.id
  const normalizedId = String(id).replace(/^0+/, '')
  if (
    (typeof id !== 'number' && typeof id !== 'string')
    || (typeof id === 'number' && !Number.isSafeInteger(id))
    || !/^\d+$/.test(String(id))
    || !normalizedId
  ) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Telegram user data' })
  }

  return { id: normalizedId }
}

export function requireTelegramUser(event: H3Event): VerifiedTelegramUser {
  const config = useRuntimeConfig(event)
  const botToken = config.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    throw createError({ statusCode: 503, statusMessage: 'Telegram authentication is not configured' })
  }

  const initData = getHeader(event, 'x-telegram-init-data')
  if (!initData) {
    throw createError({ statusCode: 401, statusMessage: 'Telegram authentication required' })
  }

  return validateTelegramInitData(initData, botToken)
}
