import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { ICardLayout } from '~~/shared/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useCardsLayout = defineStore('cardsLayouts', () => {
  const layouts = ref<ICardLayout[]>([])
  const isLoading = ref<boolean>(false)
  const fetchLayouts = async (params='') => {
    try {
      isLoading.value = true
      const { data } = await axios(`${BASE_URL}/layout${params ? "?" + params : ''}`)
      return layouts.value = data || []
    }
    catch (error) {
      console.error(error)
      return []
    }
    finally {
      isLoading.value = false
    }
  }

  return { layouts, fetchLayouts, isLoading }
})