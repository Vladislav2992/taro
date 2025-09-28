<script setup lang="ts">
import { useCardsLayout } from '@/stores/cardsLayouts'
import { storeToRefs } from 'pinia'
import { ref, onBeforeMount } from 'vue'
import type { ICardLayout } from '~/shared/types'

const { layouts, isLoading } = storeToRefs(useCardsLayout())
const { fetchLayouts } = useCardsLayout()
const currentGame = ref<ICardLayout | null>(null)
const focusedGame = ref<string | null>(null)

const choiseGame = (game: ICardLayout) => {
  currentGame.value = game
  focusedGame.value = game.id
}

onBeforeMount(async () => {
  await fetchLayouts()
})
</script>

<template>
  <div class="">
    <div class="flex items-center justify-center gap-2 mb-8">
      <NuxtImg src="/cards/fool.avif" class="preview-card"/>
      <NuxtImg src="/cards/empress.avif" class="preview-card"/>
      <NuxtImg src="/cards/hierophant.avif" class="preview-card"/>
    </div>

    <h1 class="title uppercase font-bold text-3xl text-center mb-6">Раскрой тайны своего пути <br>Спроси у карт</h1>

    <div class="flex flex-wrap gap-3">
      <span v-if="isLoading" class="text-center">Loading...</span>
      <div
        v-for="layout in layouts"
        v-else
        :key="layout.id"
        :class="['layout', { focused : layout.id === focusedGame }]"
        @click="choiseGame(layout)"
      >
        {{ layout.name }}
      </div>
    </div>

    <div v-if="currentGame" class="description mt-20">
      <div class="mb-5">
        {{ currentGame.description }}
      </div>
      <NuxtLink 
        :to="`games/${currentGame.id}`"
        class="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
        >
        Далее <IconArrow />
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '~/assets/css/vars' as *
.layout
  padding: 5px 10px
  border: 1px solid $primary
  border-radius: 20px
  width: fit-content
  cursor: pointer
  transition: color .2s, border-color .2s
  &:hover
    border-color: $accent
    color: $accent
  &.focused
    border-color: $accent
    color: $accent
.preview-card
  position: relative
  width: 90px
  height: 140px
  position: relative
  border-radius: 5px
  &:nth-child(1)
    z-index: 3
    transform: rotate(-30deg) translate(36px, 36px)
    // animation: first-card 3s infinite
  &:nth-child(2)
    z-index: 2
  &:nth-child(3)
    z-index: 1
    transform: rotate(30deg) translate(-34px, 37px)
    // animation: second-card 3s infinite
@keyframes first-card
  0% 
    transform: rotate(-30deg) translate(36px, 36px)
  50% 
    transform: none
  75%
    transform: translate(100%, 0)
  100%
    transform: rotate(-30deg) translate(36px, 36px)
@keyframes second-card
  0% 
    transform: rotate(30deg) translate(-34px, 37px)
  50% 
    transform: none
  75%
    transform: translate(-100%, 0)
  100%
    transform: rotate(30deg) translate(-34px, 37px)
</style>
