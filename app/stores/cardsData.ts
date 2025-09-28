import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { ICard } from '~~/shared/types'
import cardsList from './cards.json'
const BASE_URL = import.meta.env.VITE_API_BASE_URL 

export const useCardsStore = defineStore('cards', () => {
  const cards = ref<ICard[]>(cardsList)
  
  const fetchCards = async () => {
    try {
      const { data } = await axios(`${BASE_URL}/cards`)

      return cards.value = data || []
    }
    catch (error) {
      console.log(error)
      return []
    }
  }

  return { cards, fetchCards }
})