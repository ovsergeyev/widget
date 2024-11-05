export interface IFitnessPromocode {
  id?: number
  widget_id: number
  title: string
  promocode: string
  start_date: string | null
  end_date: string | null
  start_time: string | null
  end_time: string | null
  auto_apply: boolean
}