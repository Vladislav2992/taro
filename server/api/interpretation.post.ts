import type { ICard } from "~~/shared/types"
import { generateDeepSeekInterpretation } from "~~/server/utils/deepseek"

export default defineEventHandler(async (event) => {
  
  const body = await readBody<{
    cards:ICard[],
    layoutName: string,
    question: string
  }>(event)

  try {
    const interpretation = await generateDeepSeekInterpretation(
      body.cards,
      body.layoutName,
      body.question
    )
   return interpretation
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate interpretation'
    })
  }
})