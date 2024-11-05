import { IPayment1C } from "./IPayment1C"
import ISeat from "./ISeat"

export default interface IPaymentInfo {
  amount: number
  club_id: string
  created_at: string
  description: string
  integration_code: string
  payments1C: IPayment1C[]
  seats: ISeat[]
  status: string
  uid: string
  user_token: string
  widget_id: string
}