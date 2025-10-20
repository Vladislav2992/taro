<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { shuffleCards } from '~/composables/shuffleCards'
import { useCardsStore } from '@/stores/cardsData'
import type { ICardLayout, ICard, IFanCard } from '~~/shared/types'

const route = useRoute()
const spreadId = route.params.id
const currentSpread = ref<ICardLayout | null>(null)
const { fetchLayouts } = useCardsLayout()
const { cards } = storeToRefs(useCardsStore())
const { isLoading, interpretation, generateInterpretation } = useInterpretation()
const cardsFan = ref<IFanCard[]>([])
const selectedCards = ref<ICard[]>([])
const cardDatails = ref<ICard | null>(null)
const selectedCardPosition = ref<number | null>(null)

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

  selectedCards.value.push(card)
  cardsFan.value[index].isAdded = true

  if (isComplete.value) cardsFan.value = []
}

const getInterpretation = async () => {
  if (!selectedCards?.value || !currentSpread?.value) return 
    await generateInterpretation(
      selectedCards.value,
      currentSpread.value.name,
      'Что означает этот расклад?'
    )
}

const handleReset: () => void = () => {
  selectedCards.value = []
  cardsFan.value = []
  setTimeout(() => {
    cardsFan.value = shuffleCards([...cards.value]).slice(0, 15)
  }, 300)
}

const showCardDescription = (card: ICard, index: number) => {
  cardDatails.value = card
  selectedCardPosition.value = index
}

const closeCardDescription = () => {
  cardDatails.value = null
  selectedCardPosition.value = null
}

onBeforeMount(async () => {
  const data = await fetchLayouts(`id=${spreadId}`)
  currentSpread.value = data[0]
  cardsFan.value = shuffleCards([...cards.value]).slice(0, 15)
})

const user = ref(null)

onMounted(() => {
  const tg = (window as any).Telegram?.WebApp
  if (tg?.initDataUnsafe?.user) {
    user.value = tg.initDataUnsafe.user
  }
})
</script>

<template>
  <div class="flex flex-col items-center gap-6 h-full w-full">
    <TextPreloader v-if="isLoading" />
    <h1 v-if="currentSpread" class="text-2xl font-bold">
      {{ currentSpread.name }}
    </h1>

    <SpreadPlaygroundArea
      v-if="currentSpread"
      :spread="currentSpread"
      :selected-cards="selectedCards"
      @card-click="showCardDescription"
    />

    <SpreadNavigation
      :selected-count="selectedCards.length"
      :total-cards="currentSpread?.cardsCount || 0"
      @reset="handleReset"
    />

    <SpreadFan
      v-if="cardsFan.length"
      :cards="cardsFan"
      :is-loading="isLoading"
      @add-to-playground="addToPlayground"
    />

    <div v-if="isComplete && !interpretation" class="">
      <button @click="getInterpretation" class="py-2 px-4 border rounded-2xl">
        Узнать подробнее
      </button>
    </div>

    <SpreadInterpretation v-if="interpretation" :content="interpretation"/>

    <Transition name="modal">
      <CardModal
        v-if="cardDatails"
        :card="cardDatails"
        :position-value="selectedCardPositionValue"
        @close="closeCardDescription"
      />
    </Transition>
  </div>
</template>

<style lang="sass" scoped>
.modal-enter-active,
.modal-leave-active
  transition: opacity .2s

.modal-enter-from,
.modal-leave-to
  opacity: 0
</style>
