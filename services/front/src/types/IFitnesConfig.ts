import { IFitnesScheduleSegment } from "./IFitnesScheduleSegment";
import { IFitnessTariff } from "./IFitnessTariff";
export interface IFitnesConfig {
  title: string
  schedule_segments: Array<IFitnesScheduleSegment>
  tariffs: Array<IFitnessTariff>
}
