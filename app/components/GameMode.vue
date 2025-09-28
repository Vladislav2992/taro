<script setup lang="ts">
import { useModeStore } from '@/stores/gameMode'
import { storeToRefs } from 'pinia'
import { onBeforeMount } from 'vue'
import type { LayoutMode } from '~~/types'

const modesStore = useModeStore()
const { isLoading, currentMode, modesList } = storeToRefs(modesStore)
const { fetchGameMode, updateGameMode } = modesStore

const setNewGameMode = async (newValue: LayoutMode): Promise<void> => {
  await updateGameMode(newValue)
}

onBeforeMount(async () => {
  await fetchGameMode()
})
</script>

<template>
  <template v-if="isLoading"> Load mods </template>

  <template v-else>
    <select
      id=""
      v-model="currentMode"
      name=""
      class="mt-10 border p-3"
      @change="setNewGameMode(currentMode)"
    >
      <option
        v-for="option in modesList"
        :key="option.value"
        :selected="option.value === currentMode"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <div class="description text-center">
      <div v-if="currentMode === 'auto'" class="mt-4 text-sm text-gray-600">
        Режим "Довериться судьбе" - карты будут выбираться случайным образом
      </div>

      <div v-else class="mt-4 text-sm text-gray-600">
        Режим "Самостоятельный выбор" - вы сами выбираете карты
      </div>
    </div>
  </template>
</template>

<style lang="sass" scoped></style>
