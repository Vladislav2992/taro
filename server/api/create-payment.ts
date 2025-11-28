import { defineEventHandler, readBody } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { amount, description } = body

  const payment = await axios.post(
    'https://api.yookassa.ru/v3/payments',
    {
      amount: { value: amount, currency: 'RUB' },
      confirmation: {
        type: 'redirect',
        return_url: `https://taro-bice.vercel.app/result`
      },
      capture: true,
      description
    },
    {
      auth: {
        shopId: process.env.SHOP_ID!,
        secretKey: process.env.SHOP_SECRET_KEY!
      },
      headers: {
        'Idempotence-Key': crypto.randomUUID()
      }
    }
  )

  return payment.data
})
