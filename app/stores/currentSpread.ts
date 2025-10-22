export const useCurrentSpreadStore = defineStore('currentSpread', () => {
  const selectedCardsList = ref<ICard[]>([])
  const currentSpread = ref<ICardLayout | null>(null)
  const setSelectedCard = (card: ICard) => selectedCardsList.value.push(card)
  const resetSelectedCards = () => (selectedCardsList.value = [])
  const setCurrentSpread = (layout: ICardLayout) =>
    (currentSpread.value = layout)

  return {
    selectedCardsList,
    setSelectedCard,
    resetSelectedCards,
    currentSpread,
    setCurrentSpread,
  }
})
