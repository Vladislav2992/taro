<script setup lang="ts">
import type { ICard, ICardLayout } from '~~/shared/types'

interface IPlaygroundProps {
    spread: ICardLayout | null
    selectedCards: ICard[]
}

defineProps<IPlaygroundProps>()
const emit = defineEmits(['card-click'])

const cardsDetails = (card: ICard, index: number) => {
    emit('card-click', card, index)
}
</script>

<template>
    <div      
      class="relative w-full max-w-4xl h-[45vh] border border-dashed rounded-xl"
    >
      <CardItem
        v-if="spread"
        v-for="(card, i) in selectedCards"
        :key="card.id"
        :card="card"      
        :class="[
          'absolute transition-all duration-500 translate-[-50%] thumb opened shadow',
          { reversed: card.isReversed },
        ]"
        :style="{
          left: (spread.positions?.[i]?.x ?? 50) + '%',
          top: (spread.positions?.[i]?.y ?? 50) + '%',
          rotate: (spread.positions?.[i]?.rotation ?? 0) + 'deg',
        }"
        @click="cardsDetails(card, i)"
      />

      <div
        v-if="spread"
        v-for="n in spread.cardsCount"
        :key="'slot-' + n"
        class="absolute pointer-events-none opacity-30 border border-dashed rounded-md card thumb"
        :style="{
          left: (spread.positions?.[n - 1]?.x ?? 50) + '%',
          top: (spread.positions?.[n - 1]?.y ?? 50) + '%',
          transform: `translate(-50%, -50%) rotate(${
            spread.positions?.[n - 1]?.rotation ?? 0
          }deg)`,
        }"
      />
    </div>
</template>

<style lang="sass" scoped>
.thumb
    width: clamp(50px, 15vw, 80px)
.shadow 
  box-shadow: -4px 4px 4px rgba(0,0,0, .1)
</style>