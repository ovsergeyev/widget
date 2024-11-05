import IOrder from "./IOrder";
import ITariff from "./ITariff";

export default interface IGroupingResult {
  isGrouping: boolean,
  groupTariff: ITariff | null,
  adultOrders: IOrder[],
  childrenOrders: IOrder[],
}