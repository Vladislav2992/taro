import { validateTelegramInitData } from '../../utils/telegram-auth'
import { useDatabase } from '../../utils/database'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const botToken = config.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    throw createError({ statusCode: 503, statusMessage: 'Telegram authentication is not configured' })
  }

  const body = await readBody<{ initData?: unknown }>(event)
  if (typeof body?.initData !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'initData is required' })
  }

  const user = validateTelegramInitData(body.initData, botToken)
  const sql = useDatabase()
  await sql`
    INSERT INTO telegram_users (telegram_id, free_readings_balance)
    VALUES (${user.id}, 1)
    ON CONFLICT (telegram_id) DO NOTHING
  `
  const [record] = await sql<{ free_readings_balance: number }[]>`
    SELECT free_readings_balance
    FROM telegram_users
    WHERE telegram_id = ${user.id}
  `

  return {
    user,
    freeReadingsBalance: record.free_readings_balance,
  }
})
