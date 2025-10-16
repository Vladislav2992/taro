export interface ICard {
  id: number
  name: string
  suite: string
  upright: string
  reversed: string
  imageUrl: string
  isReversed?: boolean
}

export interface IFanCard extends ICard {
  isAdded?: boolean
}

export interface ICardPosition {
  index?: number,
  label?: string
  x?: number,
  y?: number,
  rotation?: string
}

export interface ICardLayout {
  id: string,
  name: string,
  description: string,
  type: string,
  cardsCount: number,
  positions?: ICardPosition[]
}

export type LayoutMode = 'auto' | 'himself'

export interface ILayoutOptions {
  label: string
  value: LayoutMode
}