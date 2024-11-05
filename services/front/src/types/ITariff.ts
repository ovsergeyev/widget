export default interface ITariff {
  id: string
  title: string
  type: string
  price: number
  discountPrice: number
  availableTime: string
  description: string
  weekDays: number[]
  startTime: string
  endTime: string
  countAdults: number
  countChildren: number
}
