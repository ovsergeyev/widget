import IOrder from "./IOrder"
import ITariff from "./ITariff"

export default interface IOrderGroupByTariff {
  tariff: ITariff,
  tariffGroupId: string,
  price: number
  orders: IOrder[]
  appointmentId: string
  date: string
  time: string
  getCountChildren: () => number;
  getCountAdults: () => number;
}