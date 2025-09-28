import type { ICard } from "~~/shared/types"

export const generateDeepSeekInterpretation = async (
  cards: ICard[],
  layout: string,
  question: string
): Promise<string> => {
  const prompt = createTaroPrompt(cards, layout, question)

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY}`,
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Tarot App'
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat-v3.1:free',
      messages: [
        {
          role: 'system',
          content: `Ты опытный таролог. Давай глубокие, но понятные интерпретации раскладов таро.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('API Error:', response.status, errorText)
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

const createTaroPrompt = (cards: ICard[], layout: string, question: string): string => {
  return `
РАСКЛАД: ${layout}
${question ? `ВОПРОС: ${question}` : 'ОБЩИЙ РАСКЛАД'}

КАРТЫ:
${cards.map((card, index) => 
  `${index + 1}. ${card.name} (${card.isReversed ? 'перевернутая' : 'прямая'}): ${
    card.isReversed ? card.reversed : card.upright
  }`
).join('\n')}

Проанализируй этот расклад таро. Учитывай:
1. Значение каждой карты в своей позиции
2. Взаимосвязи между картами  
3. Общую энергетику расклада
4. Практические рекомендации
5. Возможные предостережения

Дай развернутую интерпретацию на русском языке.
`
}