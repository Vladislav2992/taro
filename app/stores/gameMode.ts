import { ref } from "vue"
import { defineStore } from "pinia"
import axios from "axios"
import type { LayoutMode, ILayoutOptions } from "~~/shared/types"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useModeStore = defineStore('game-mode', () => {
  const currentMode = ref<LayoutMode>('auto')
  const modesList = ref<ILayoutOptions[]>([])
  const isLoading = ref<boolean>(false)
  
  const fetchGameMode = async (): Promise<void> => {
    try {
      isLoading.value = true
      const { data } = await axios(`${BASE_URL}/mode/1`)
      currentMode.value = data.current_mode
      modesList.value = data.modes
    }
    catch (error) {
      console.error(error)      
    }
    finally {
      isLoading.value = false
    }
  }

  const updateGameMode = async (newValue: LayoutMode): Promise<void> => {
    try {
      isLoading.value = false
      await axios.patch(`${BASE_URL}/mode/1`, {
         "current_mode": newValue
      })
      currentMode.value = newValue
      
    } catch (error) {
      console.error(error)
    }
    finally {
      isLoading.value = false
    }
  }
  return { currentMode, modesList, fetchGameMode, updateGameMode, isLoading }
})