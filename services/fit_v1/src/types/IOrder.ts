export default interface IOrder {
  uid: string
  appointmentId: string
  tariffId: string
  tariffGroupId: string
  // tariffType: string
  datetime: string
  isAdult: boolean
}