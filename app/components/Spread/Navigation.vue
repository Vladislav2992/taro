<script setup lang="ts">
interface ISpreadNavigationProps {
    selectedCount: number
    totalCards: number
}

defineProps<ISpreadNavigationProps>()
defineEmits(['reset'])
</script>

<template>
<div class="flex items-center gap-3">
      <button class="py-2 px-4 border rounded-2xl" @click="$emit('reset')">Сбросить</button>
      <NuxtLink to="/" class="py-2 px-4 border rounded-2xl">
        Назад
      </NuxtLink>
      <span v-if="totalCards" class="text-sm opacity-70">{{ selectedCount }}/{{ totalCards }}</span>
    </div>    
</template>