<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { shuffleCards } from '~/composables/shuffleCards'
import type { ICard, IFanCard } from '~~/shared/types'

const route = useRoute()
const spreadId = route.params.id

const { fetchLayouts } = useCardsLayout()
const { cards } = storeToRefs(useCardsStore())
const { setSelectedCard, setCurrentSpread, resetSelectedCards  } = useCurrentSpreadStore()
const { selectedCardsList: selectedCards, currentSpread } = storeToRefs(useCurrentSpreadStore())

const { showCardDescription, closeCardDescription } = useCardDatailsModalStore()
const { cardDetails, selectedCardPosition } = storeToRefs(useCardDatailsModalStore())

const cardsFan = ref<IFanCard[]>([])

const selectedCardPositionValue = computed((): string => {
  if (typeof selectedCardPosition.value !== 'number' || !currentSpread.value) return ''

  return currentSpread.value?.positions?.[selectedCardPosition.value]?.label ?? ''  
})

const isComplete = computed((): boolean => {
  if (!currentSpread.value) return false
  return selectedCards.value.length >= currentSpread.value.cardsCount
})

const addToPlayground = async (card: ICard) => {
  if (selectedCards.value.some((c) => c.id === card.id) || !currentSpread.value)
    return

  const index = cardsFan.value.findIndex((c) => c.id === card.id)
  if (index === -1 || !cardsFan.value[index]) return

  setSelectedCard(card)
  cardsFan.value[index].isAdded = true

  if (isComplete.value) cardsFan.value = []
}

onMounted(async () => {
  localStorage.clear()
  resetSelectedCards()

  const data = await fetchLayouts(`id=${spreadId}`)
  setCurrentSpread(data[0])
  cardsFan.value = shuffleCards([...cards.value]).slice(0, 15)
})

const paySpread = async () => {
  localStorage.setItem('spread', JSON.stringify(currentSpread.value))
  localStorage.setItem('cards', JSON.stringify(selectedCards.value))
  
  const res = await $fetch('/api/create-payment', {
    method: 'POST',
    body: {
      amount: '99.00',
      description: currentSpread.value?.description,
    }
  })

  localStorage.setItem('paymentId', res.id)
  window.location.href = res.confirmation.confirmation_url  
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 h-full w-full relative">
    <NuxtLink to="/" class="absolute rotate-180 left-0 opacity-50 hover:opacity-100 transition-opacity">
      <IconArrow />
    </NuxtLink>

    <h1 v-if="currentSpread" class="title text-2xl font-bold">
      {{ currentSpread.name }}
    </h1>

    <SpreadPlaygroundArea v-if="currentSpread" :selected-cards="selectedCards" :spread="currentSpread"
      @card-click="showCardDescription" />

    <span v-if="currentSpread?.cardsCount" class="text-sm opacity-70">{{ selectedCards.length }}/{{ currentSpread?.cardsCount || 0 }}</span>

    <div v-if="isComplete" class="flex flex-col gap-4">
      <div class="text-center">
        Вы&nbsp;можете ознакомиться со&nbsp;значением карты, нажав на&nbsp;неё
        или получить развернутое трактование<br>
        за 99 ₽, но прежде ознакомьтесь с  <br>
        <NuxtLink to="/" class="underline hover:no-underline">пользовательским соглашением</NuxtLink> 
      </div>
      <button @click="paySpread" class="py-2 px-4 border rounded-2xl">
        Узнать подробнее
      </button>
    </div>

    <div v-else class="text-center">
      Выберите карты из веера и они займут свои позиции в раскладе<br>
      Коснитесь открытой карты, чтобы узнать её значение.
    </div>

    <SpreadFan v-if="cardsFan.length" :cards="cardsFan" @add-to-playground="addToPlayground" />

    <Transition name="modal">
      <CardModal v-if="cardDetails" :card="cardDetails" :position-value="selectedCardPositionValue"
        @close="closeCardDescription" />
    </Transition>
  </div>
</template>
