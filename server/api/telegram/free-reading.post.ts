import type { ICard } from '~~/shared/types'
import { generateDeepSeekInterpretation } from '../../utils/deepseek'
import { useDatabase } from '../../utils/database'
import { requireTelegramUser } from '../../utils/telegram-auth'

export default defineEventHandler(async (event) => {
  const user = requireTelegramUser(event)
  const body = await readBody<{
    cards?: ICard[]
    layoutName?: string
    question?: string
  }>(event)

  if (!Array.isArray(body?.cards) || body.cards.length === 0 || typeof body.layoutName !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'A spread and selected cards are required' })
  }

  const sql = useDatabase()
  await sql`
    INSERT INTO telegram_users (telegram_id, free_readings_balance)
    VALUES (${user.id}, 1)
    ON CONFLICT (telegram_id) DO NOTHING
  `
  const [reservation] = await sql<{ free_readings_balance: number }[]>`
    UPDATE telegram_users
    SET free_readings_balance = free_readings_balance - 1
    WHERE telegram_id = ${user.id} AND free_readings_balance > 0
    RETURNING free_readings_balance
  `
  if (!reservation) {
    throw createError({ statusCode: 409, statusMessage: 'No free readings remain' })
  }

  let interpretation: string
  try {
    interpretation = await generateDeepSeekInterpretation(
      body.cards,
      body.layoutName,
      typeof body.question === 'string' ? body.question : 'Что означает этот расклад?'
    )
  } catch {
    try {
      const [refunded] = await sql<{ free_readings_balance: number }[]>`
        UPDATE telegram_users
        SET free_readings_balance = free_readings_balance + 1
        WHERE telegram_id = ${user.id}
        RETURNING free_readings_balance
      `
      if (!refunded) throw new Error('Telegram user row was not found during credit refund')
    } catch {
      console.error('Telegram free reading credit refund failed')
    }
    console.error('Telegram free reading failed')
    throw createError({ statusCode: 500, statusMessage: 'Failed to generate free reading' })
  }

  return { interpretation, freeReadingsBalance: reservation.free_readings_balance }
})
