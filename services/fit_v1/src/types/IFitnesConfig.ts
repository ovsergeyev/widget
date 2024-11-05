import { IFitnesScheduleSegment } from "./IFitnesScheduleSegment";
import { IFitnessTariff } from "./IFitnessTariff";
import { IFitnessPromocode } from "./IFitnessPromocode";
export interface IFitnesConfig {
  title: string
  description: string
  message_after_payment: string
  schedule_segments: Array<IFitnesScheduleSegment>
  tariffs: Array<IFitnessTariff>
  promocodes: Array<IFitnessPromocode>
  metrica_code: string
}
