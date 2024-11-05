import { IPayment1C } from "./IPayment1C"
import ISeat from "./ISeat"
export interface IUkassaPayment {
  amount: number
  user_token: string
  description: string
  payments1C: IPayment1C[]
  seats: ISeat[]
}
