export interface IECommerceProduct {
  id: string
  name: string
  price: number
  category: string
  quantity?: number
  position?: number
}

export interface IECommerceActionField {
  id: string
}

export interface IECommercePurchase {
  actionField: IECommerceActionField,
  products: IECommerceProduct[]
}