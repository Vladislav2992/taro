<script setup lang="ts">
import type { ICard } from '#imports'

const { isLoading, interpretation, generateInterpretation } = useInterpretation()
const { setSelectedCard, setCurrentSpread, resetSelectedCards } = useCurrentSpreadStore()
const { selectedCardsList, currentSpread } = storeToRefs(useCurrentSpreadStore())
const { showCardDescription, closeCardDescription } = useCardDatailsModalStore()
const { cardDetails, selectedCardPosition } = storeToRefs(useCardDatailsModalStore())
const isPayed = ref<boolean>(false)
const resultError = ref<string | null>(null)
const telegram = useTelegram()

const selectedCardPositionValue = computed((): string => {
  if (typeof selectedCardPosition.value !== 'number' || !currentSpread.value) return ''
  return currentSpread.value?.positions?.[selectedCardPosition.value]?.label ?? ''
})

const getInterpretation = async () => {
  if (!selectedCardsList?.value || !currentSpread?.value) return
  await generateInterpretation(
    selectedCardsList.value,
    currentSpread.value.name,
    'Что означает этот расклад?'
  )
}

const hasMounted = ref(false)

const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  try {
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

onMounted(async () => {
  resetSelectedCards()
  const spread = localStorage?.getItem('spread')
  const cards = localStorage?.getItem('cards')
  const paymentId = localStorage?.getItem('paymentId')
  const cachedInterpretation = localStorage?.getItem('interpretation')
  const readingMode = localStorage?.getItem('readingMode')

  if (spread && typeof spread === 'string') {
    setCurrentSpread(JSON.parse(spread))
  }
  if (cards && typeof cards === 'string') {
    safeJsonParse<ICard[]>(cards, []).forEach((card: ICard) => setSelectedCard(card))
  }
  
  if (cachedInterpretation) {
    interpretation.value = cachedInterpretation
    isPayed.value = true
    hasMounted.value = true
    return
  }

  if (telegram.isTelegram.value && readingMode === 'telegram-free') {
    if (!telegram.initData.value) {
      resultError.value = 'Откройте приложение через Telegram, чтобы подтвердить пользователя.'
    } else {
      try {
        const result = await $fetch<{ interpretation: string; freeReadingsBalance: number }>('/api/telegram/free-reading', {
          method: 'POST',
          headers: { 'x-telegram-init-data': telegram.initData.value },
          body: {
            cards: selectedCardsList.value,
            layoutName: currentSpread.value?.name,
            question: 'Что означает этот расклад?',
          },
        })
        interpretation.value = result.interpretation
        telegram.balance.value = result.freeReadingsBalance
        isPayed.value = true
      } catch (error: unknown) {
        const statusCode = (error as { statusCode?: number; status?: number })?.statusCode
          ?? (error as { status?: number })?.status
        resultError.value = statusCode === 409
          ? 'Бесплатный расклад уже использован.'
          : statusCode === 401
            ? 'Сеанс Telegram устарел. Закройте Mini App и снова откройте его из чата с ботом.'
            : 'Не удалось сформировать расклад. Бесплатная попытка сохранена, попробуйте ещё раз.'
      }
    }
    hasMounted.value = true
    return
  }

  if (paymentId) {
    try {
      const res = await $fetch(`/api/check-payment?id=${paymentId}`)
      if (res?.paid) {
        isPayed.value = true
        await getInterpretation()
      }
    } catch {
      resultError.value = 'Не удалось проверить оплату. Проверьте интернет-соединение или детали платежа.'
    }
  }

  hasMounted.value = true
})

watch(
  interpretation,
  (val) => {
    if (typeof val === 'string' && val.trim()) {
      localStorage?.setItem('interpretation', val)
    }
  },
  { immediate: true }
)
</script>

<template>
  <SpreadPlaygroundArea
    :selected-cards="selectedCardsList"
    :spread="currentSpread"
    @card-click="showCardDescription"
  />
  <div v-if="!isPayed && (resultError || hasMounted)" class="mt-5 text-center">
    {{ resultError || (telegram.isTelegram.value ? 'Не удалось сформировать бесплатный расклад.' : 'Что-то пошло не так. Проверьте интернет-соединение или детали платежа.') }}
  </div>
  <div v-if="!interpretation && isPayed" class="mt-5 text-center">Формируем ответ, это займет немного времени</div>
  <TextPreloader v-if="isLoading" />
  <SpreadInterpretation v-if="interpretation" :content="interpretation" />

  <Transition name="modal">
    <CardModal
      v-if="cardDetails"
      :card="cardDetails"
      :position-value="selectedCardPositionValue"
      @close="closeCardDescription"
    />
  </Transition>
</template>
