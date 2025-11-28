<script setup lang="ts">
import { useCardsLayout } from '~/stores/cardsLayouts'
import { storeToRefs } from 'pinia'
import { ref, onBeforeMount } from 'vue'
import type { ICardLayout } from '~~/shared/types'

const isLoading = ref(false)
const { layouts, isLoading: pending } = storeToRefs(useCardsLayout())
const { fetchLayouts } = useCardsLayout()
const currentSpread = ref<ICardLayout | null>(null)
const focusedSpread = ref<string | null>(null)

const choiseSpread = (spread: ICardLayout) => {
  currentSpread.value = spread
  focusedSpread.value = spread.id
}

onBeforeMount(async () => {
  await fetchLayouts()
  isLoading.value = pending.value
})
</script>

<template>
  <div class="">
    <div class="flex items-center justify-center gap-2 mb-8">
      <img src="/cards/fool.avif" class="preview-card" >
      <img src="/cards/empress.avif" class="preview-card" >
      <img src="/cards/hierophant.avif" class="preview-card" >
    </div>

    <h1 class="title uppercase font-bold text-3xl text-center mb-6">Раскрой тайны своего пути <br>Спроси у карт</h1>

    <p class="text-center mb-5">
      Получите ответы на свои вопросы с помощью древнего искусства Таро. <br> 
      <strong>Выберите расклад ниже</strong>, чтобы начать путешествие к самопознанию.
    </p>
    <div class="flex flex-wrap justify-center gap-2 mb-5">
      <span v-if="isLoading" class="text-center">Loading...</span>
      <div
        v-for="layout in layouts"
        v-else
        :key="layout.id"
        :class="['layout', { focused : layout.id === focusedSpread }]"
        @click="choiseSpread(layout)"
      >
        {{ layout.name }}
      </div>
    </div>

    <div v-if="currentSpread" class="description">
      <div class="mb-5 text-center">
        {{ currentSpread.description }}
      </div>
      <NuxtLink 
        :to="`spreads/${currentSpread.id}`"
        class="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
        >
        Начать <IconArrow />
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
  font-size: 14px
  &:hover
    border-color: $accent
    color: $accent
  &.focused
    border-color: $accent
    color: $accent
.preview-card
  position: relative
  height: clamp(100px, 12vw, 120px)
  aspect-ratio: 1 / 1.6
  position: relative
  border-radius: 5px
  box-shadow: -4px 4px 4px rgba(0, 0, 0, .1)
  &:nth-child(1)
    z-index: 3
    transform: rotate(-30deg) translate(25px, 30px)
    // animation: first-card 3s infinite
  &:nth-child(2)
    z-index: 2
  &:nth-child(3)
    z-index: 1
    transform: rotate(30deg) translate(-25px, 30px)
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
