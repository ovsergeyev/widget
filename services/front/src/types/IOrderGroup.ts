import IOrder from './IOrder';

export default interface IOrdersGroup {
  dayNumber: string;
  weekDay: string;
  monthNumber: string;
  dateString: string;
  orders: IOrder[];
}
