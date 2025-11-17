<script setup lang="ts">
import type { ICard } from '#imports'

const { isLoading, interpretation, generateInterpretation } = useInterpretation()

const { setSelectedCard, setCurrentSpread  } = useCurrentSpreadStore()
const { selectedCardsList, currentSpread } = storeToRefs(useCurrentSpreadStore())

const { showCardDescription, closeCardDescription } = useCardDatailsModalStore()
const { cardDetails, selectedCardPosition } = storeToRefs(useCardDatailsModalStore())

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

onMounted(async () => {
    const spread = localStorage?.getItem('spread')
    const cards = localStorage?.getItem('cards')
    const paymentId = localStorage?.getItem('paymentId')

    if (spread && typeof spread === 'string') setCurrentSpread(JSON.parse(spread))
    if (cards && typeof cards === 'string') {
        JSON.parse(cards).forEach((card: ICard) => setSelectedCard(card))
    }

    if (paymentId) {
        const res = await useFetch(`/api/check-payment?id=${paymentId}`)
        
        if (res?.data?.value?.paid) getInterpretation()
    }
})
</script>

<template>
    <SpreadPlaygroundArea 
        :selected-cards="selectedCardsList"
        :spread="currentSpread"
        @card-click="showCardDescription"
    />

    <div v-if="!interpretation" class="mt-5">Формируем ответ, это займет немного времени</div>
    <TextPreloader v-if="isLoading" />
    <SpreadInterpretation v-if="interpretation" :content="interpretation"/>

    <Transition name="modal">
      <CardModal
        v-if="cardDetails"
        :card="cardDetails"
        :position-value="selectedCardPositionValue"
        @close="closeCardDescription"
      />
    </Transition>
</template>