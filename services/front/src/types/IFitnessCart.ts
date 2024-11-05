export interface IFitnessCartElement {
  purchase_id: string
  count: number
}

export interface IFitnessCart {
  promocode: string | null
  cart_array: IFitnessCartElement[]
}
