import { defineEventHandler, getQuery } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (e) => {
  const { id } = getQuery(e)

  const res = await axios(`https://api.yookassa.ru/v3/payments/${id}`, {
    auth: {
      username: process.env.SHOP_ID!,
      password: process.env.SHOP_SECRET_KEY!,
    },
  })

  return res.data
})
