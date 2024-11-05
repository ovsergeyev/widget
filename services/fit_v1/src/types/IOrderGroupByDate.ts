import IOrderGroupByTariff from "./IOrderGroupByTariff";

export default interface IOrderGroupByDate {
  dayNumber: string
  weekDay: string
  monthNumber: string
  dateString: string
  ordersByTariff: IOrderGroupByTariff[]
  // appointmentId: string
  datetime: string
}