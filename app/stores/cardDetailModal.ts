export const useCardDatailsModalStore = defineStore(
  'cardDatailsModal',
  () => {
    const cardDetails = ref<ICard | null>(null)
    const selectedCardPosition = ref<number | null>(null)

    const showCardDescription = (card: ICard, index: number) => {
      cardDetails.value = card
      selectedCardPosition.value = index
    }

    const closeCardDescription = () => {
      cardDetails.value = null
      selectedCardPosition.value = null
    }

    return {
      cardDetails,
      selectedCardPosition,
      showCardDescription,
      closeCardDescription,
    }
  }
)
