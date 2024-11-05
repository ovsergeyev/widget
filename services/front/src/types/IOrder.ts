export default interface IOrder {
  uid: string;
  title: string;
  tariffId: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  price: number;
}
