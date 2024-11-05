import { IFitnessCartElement } from "./IFitnessCart"
export interface IUkassaPayment {
  amount: number
  user_token: string
  return_url: string
  description: string
  cart: IFitnessCartElement[]
  promocode: string | null
}
