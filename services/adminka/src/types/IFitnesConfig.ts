import { IFitnesScheduleSegment } from "./IFitnesScheduleSegment"
import { IFitnessTariff } from "./IFitnessTariff"
import { IFitnessUkassa } from "./IFitnessUkassa"
import { IFitnessPromocode } from "./IFitnessPromocode"

export interface IFitnesConfig {
  id: number
  user_id: number
  title: string
  description: string
  metrica_code: string
  message_after_payment: string
  api_url: string
  api_key: string
  club_id: string
  service_id: string
  username: string
  password: string
  schedule_segments: Array<IFitnesScheduleSegment>
  tariffs: Array<IFitnessTariff>
  promocodes: Array<IFitnessPromocode>
  payment_gateways: Array<IFitnessUkassa>
  integration_code: string
}