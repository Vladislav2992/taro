<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { shuffleCards } from '~/composables/shuffleCards'
import { useCardsStore } from '@/stores/cardsData'
// import { useModeStore } from '@/stores/gameMode'
import type { ICardLayout, ICard } from '~~/types'

interface IFanCard extends ICard {
  isAdded?: boolean
}

const route = useRoute()
const gameId = route.params.id
const currentGame = ref<ICardLayout | null>(null)
const { fetchLayouts } = useCardsLayout()
const { cards } = storeToRefs(useCardsStore())
// const { currentMode: gameMode } = storeToRefs(useModeStore())
const { isLoading, interpretation, generateInterpretation } = useInterpretation()
const cardsFan = ref<IFanCard[]>([])
const selectedCards = ref<ICard[]>([])
const isComplete = computed(
  (): boolean => {
    if (!currentGame.value) return false    
    return selectedCards.value.length >= currentGame.value.cardsCount
  }
)
const cardDatails = ref<ICard | null >(null)

const addToPlayground = async (card: ICard) => {
  if (selectedCards.value.some((c) => c.id === card.id) || !currentGame.value) return

  const index = cardsFan.value.findIndex((c) => c.id === card.id)
  if (index === -1 || !cardsFan.value[index]) return

  selectedCards.value.push(card)
  cardsFan.value[index].isAdded = true

  if (isComplete.value) {
    await generateInterpretation(
      selectedCards.value,
      currentGame.value.name,
      'Что означает этот расклад?'
    )
    cardsFan.value = []
  }
}

const reset = () => {
  selectedCards.value = []
  cardsFan.value = []
  setTimeout(() => {
    cardsFan.value = shuffleCards([...cards.value]).slice(0, 15)
  }, 300)
  // if (gameMode.value === 'auto') autoComplate()
}

// const autoComplate = () => {
//   if (!cardsFan.value.length || !currentGame.value) return
//   const length = currentGame.value.cardsCount || 0
//   setTimeout(() => {
//     for (let i = 0; i < length; i++) {
//       const card = cardsFan.value[i]
//       if (card) selectedCards.value.push(card)
//     }
//   }, 4000)
// }

const showCardDescription = (card: ICard) => {
  cardDatails.value = {...card}
  console.log(cardDatails.value)
}

onBeforeMount(async () => {
  const data = await fetchLayouts(`id=${gameId}`)
  currentGame.value = data[0]
  cardsFan.value = shuffleCards([...cards.value]).slice(0, 15)
  // if (gameMode.value === 'auto') autoComplate()
})
</script>

<template>
  <div class="flex flex-col items-center gap-6 h-full w-full">
    <TextPreloader v-if="isLoading" />
    <h1 v-if="currentGame" class="text-3xl font-bold">{{ currentGame.name }}</h1>
    <div
      v-if="currentGame"
      class="relative w-full max-w-4xl aspect-[16/9] border border-dashed rounded-xl"
    >
      <CardItem
        v-for="(card, i) in selectedCards"
        :key="card.id"
        :card="card"        
        :class="[
          'absolute transition-all duration-500 translate-[-50%] thumb opened',
          { reversed: card.isReversed },
          { showed: cardDatails?.id === card.id}
        ]"
        :style="{
          left: (currentGame.positions?.[i]?.x ?? 50) + '%',
          top: (currentGame.positions?.[i]?.y ?? 50) + '%',
          rotate: (currentGame.positions?.[i]?.rotation ?? 0) + 'deg',
        }"
        @click="showCardDescription(card)"
      />

      <div
        v-for="n in currentGame.cardsCount"
        :key="'slot-' + n"
        class="absolute pointer-events-none opacity-30 border border-dashed rounded-md card thumb"
        :style="{
          left: (currentGame.positions?.[n - 1]?.x ?? 50) + '%',
          top: (currentGame.positions?.[n - 1]?.y ?? 50) + '%',
          transform: `translate(-50%, -50%) rotate(${
            currentGame.positions?.[n - 1]?.rotation ?? 0
          }deg)`,
        }"
      />
    </div>

    <div class="flex items-center gap-3">
      <button class="py-2 px-4 border rounded-2xl" @click="reset">reset</button>
      <NuxtLink
        to="/"
        class="py-2 px-4 border rounded-2xl"
      >
        back
      </NuxtLink>
      <span 
      v-if="currentGame"
      class="text-sm opacity-70"
        >{{ selectedCards.length }}/{{ currentGame.cardsCount }}</span
      >
    </div>

    <div v-if="cardsFan.length" class="flex relative w-full max-w-4xl h-50">
      <CardItem
        v-for="card in cardsFan"
        :key="card.id"
        :card="card"
        :class="[
          'shuffled',
          { 'opacity-50 pointer-events-none': isLoading },
          { 'pointer-events-none': gameMode === 'auto' },
          { added: card.isAdded },
        ]"
        @action="addToPlayground"
      />
    </div>

    <div v-if="interpretation" class="whitespace-break-spaces">
      {{ interpretation }}
    </div>

    <div v-if="currentGame" class="hidden" >
      <div v-for="(item, index) in selectedCards" :key="item.id" class="mb-5">
        <h2 v-if="currentGame.positions" class="font-bold text-center mb-3">
          {{ currentGame.positions[index]?.label }}
        </h2>

        <div class="">
          {{ item.name }}
          <i v-if="item.isReversed" class="text-red-300">перевернутая</i>
        </div>
        <div>{{ !item.isReversed ? item.upright : item.reversed }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
$cards: 15
$delay-step: 0.03s
$shuffle-count: 1
$fan-angle: 160deg
$thumb-width: 80px

.thumb
  width: $thumb-width
.card
  &.added
    opacity: 0
    pointer-events: none
  &.showed
    position: absolute
    top: 50%
    left: 50%
    transform: scale(2) translate(-50%, -50%)
.shuffled
  position: absolute
  left: 50%
  bottom: 15%
  transform-origin: bottom center
  animation-fill-mode: forwards
  will-change: transform
  &.added
    opacity: 0
    visibility: hidden
@for $i from 1 through $cards
  .shuffled:nth-child(#{$i})
    z-index: 1
    $delay: ($cards - $i + 1) * $delay-step
    $fan-delay: $delay + .8s * $shuffle-count + .8s
    $angle-step: calc($fan-angle / ($cards - 1))
    $rotate-angle: calc(-1 * $fan-angle / 2) + ($i - 1) * $angle-step
    --fan-rotate: #{$rotate-angle}

    @if $i == $cards
      animation: emergence .7s $delay forwards, shuffle .7s ($delay + 1s) $shuffle-count forwards, fan 0.8s $fan-delay forwards
    @else
      animation: emergence .7s $delay forwards, rotate .7s ($delay + 1s) $shuffle-count forwards, fan 0.8s $fan-delay forwards

@keyframes emergence
  0%
    transform: translateX(200%)
  100%
    transform: translateX(-50%)

@keyframes shuffle
  0%
    transform: translateX(-50%)
    z-index: 1
    transform-origin: bottom center
  50%
    transform: translateX(125%) rotate(8deg)
  100%
    transform: translateX(-50%)
    z-index: -1

@keyframes rotate
  50%
    transform: translateX(-50%) rotate(-4deg)

@keyframes fan
  0%
    transform: translateX(-50%) rotate(0deg)
    z-index: 1
  100%
    transform: translateX(-50%) rotate(var(--fan-rotate))
    z-index: 1
</style>
