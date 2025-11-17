<script setup lang="ts">
import type { ICard } from '~~/shared/types'

defineProps<{
  card: ICard
}>()
const emit = defineEmits(['action'])
</script>

<template>
  <div :id="card.id.toString()" class="card" @click="emit('action', card)">
    <div class="card-inner">
      <div class="card-front">
        <img src="~/assets/img/back.avif" alt="рубашка карты" >
      </div>
      <div class="card-back">
        <img :src="card.imageUrl" :alt="card.name">
      </div>
    </div>
  </div>
</template>