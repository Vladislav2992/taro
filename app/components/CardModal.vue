<script setup lang="ts">
import type { ICard } from '~~/shared/types'

interface ICardModalProps {
  card: ICard | null
  positionValue: string
}

defineProps<ICardModalProps>()

const emit = defineEmits(['close'])
const handleBackdropClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).classList.contains('overlay')) {
    emit('close')
  }
}
</script>

<template>
  <div
    v-if="card"
    class="modal-backdrop fixed inset-0 flex items-center justify-center z-50"
    @click="handleBackdropClick"
  >
    <div class="overlay"></div>
    <div
      class="modal-window bg-[#c07d7e96] rounded-lg p-6 max-w-md w-full mx-4 max-h-90vh overflow-y-auto transition-[scale] z-[1]"
    >
      <div class="flex flex-col justify-between items-start mb-4">
        <button class="text-2xl ml-auto" @click="$emit('close')">
          &times;
        </button>

        <div class="flex items-center justify-center max-w-1/2 mx-auto mb-4">
          <img
            :src="card.imageUrl"
            :alt="card.name"
            :class="['rounded-[10px]', { 'rotate-180': card.isReversed }]"
          />
        </div>
        <div class="">Позиция карты: {{ positionValue }}</div>
        <h2 class="text-xl font-bold">
          {{ card.name }} <i v-if="card.isReversed" class="">перевернутая</i>
        </h2>

        {{ !card.isReversed ? card.upright : card.reversed }}
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.overlay
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: #433a40f0
.modal-enter-active,
.modal-leave-active
  transition: opacity .2s

.modal-enter-from,
.modal-leave-to
  opacity: 0
</style>
