
import type { ICard } from "~~/shared/types"

export const useInterpretation = () => {
  const isLoading = ref(false)
  const interpretation = ref<string | null>(null)
  const error = ref<string | null>(null)

  const generateInterpretation = async (
    cards: ICard[],
    layoutName: string,
    question?: string
  ) => {
    isLoading.value = true
    interpretation.value = null 
    error.value = null

    try {
      const data = await $fetch('/api/interpretation', {
        method: 'POST',
        body: {
          cards,
          layoutName,
          question
        }
      })

      interpretation.value = data as string

    } catch (err) {
      console.error('Interpretation error:', err)
      error.value = 'Ошибка при генерации интерпретации'
    } finally {
      isLoading.value = false
    }
  }

  const resetInterpretation = () => {
    interpretation.value = null
    error.value = null
  }

  return {
    isLoading,
    interpretation,
    generateInterpretation,
    resetInterpretation
  }
}