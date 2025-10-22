<script setup lang="ts">
import type { IFanCard } from '~~/shared/types';

interface IFanCardsProps {
    cards: IFanCard[]
}

defineProps<IFanCardsProps>()
const emit = defineEmits(['addToPlayground'])

const addCard = (id: number) => {
    emit('addToPlayground', id)
}
</script>

<template>
    <div class="flex relative w-full max-w-4xl h-50">
      <CardItem
          v-for="card in cards" :key="card.id" :card="card" :class="[
          'shuffled',
          { added: card.isAdded },
        ]" @action="addCard" />
    </div>
</template>

<style lang="sass" scoped>
$cards: 15
$delay-step: 0.03s
$shuffle-count: 4
$fan-angle: 160deg

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