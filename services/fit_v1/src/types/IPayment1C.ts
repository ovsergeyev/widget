export interface IPayment1C {
  purchase_id: string
  count: number
  amount: number
  discount: number
  appointment_id: string
  user_token: string
  promocode: string | null
}
