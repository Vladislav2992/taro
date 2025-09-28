import type { ICard } from "~~/shared/types";

export function shuffleCards(array: ICard[]): ICard[] {
  if (!array.length) return array

  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i]!, shuffled[j]!] = [shuffled[j]!, shuffled[i]!]
  }

  return reverseCards(shuffled)
}

function reverseCards(cards: ICard[]): ICard[] {
  return cards.map(item => ({
    ...item,
    isReversed: Math.random() > .5
  }))
}