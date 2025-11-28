import { defineEventHandler, readBody } from 'h3'
import { YooCheckout, ICreatePayment } from '@a2seven/yoo-checkout'

// import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { amount, description } = body

  const checkout = new YooCheckout({
    shopId: process.env.SHOP_ID!,
    secretKey: process.env.SHOP_SECRET_KEY!,
  })

  const idempotenceKey = crypto.randomUUID()

  const createPayload: ICreatePayment = {
    amount: {
      value: '2',
      currency: 'RUB',
    },
    payment_method_data: {
      type: 'bank_card',
    },
    description,
    confirmation: {
      type: 'redirect',
      return_url: 'https://taro-bice.vercel.app/result',
    },
  }

  try {
    const payment = await checkout.createPayment(createPayload, idempotenceKey)
    return payment
  } catch (error) {
    console.error(error)
  }
})
