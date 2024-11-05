export default interface ITariff {
  id: string
  title: string
  adminTitle: string
  description: string
  adminDescription: string
  startDate: string
  endDate: string
  isNew: boolean
  type: string
  price: number
  discountPrice: number
  availableTime: string
  weekDays: number[]
  startTime: string
  endTime: string
  countAdults: number
  countChildren: number
}
