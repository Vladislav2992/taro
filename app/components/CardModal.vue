<script setup lang="ts">
import type { ICard } from '~~/shared/types'

interface ICardModalProps {
  card: ICard | null
  positionValue: string
}

defineProps<ICardModalProps>()

const emit = defineEmits(['close'])
</script>

<template>
  <AppModal  v-if="card"
   @click="emit('close')"
  >
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
  </AppModal>

</template>
