export interface IFitnessTariff {
  uid: string
  widget_id: number
  title: string
  description: string
  is_new: boolean
  start_date: string | null
  end_date: string | null
  type: string
  is_monday: boolean
  is_tuesday: boolean
  is_wednesday: boolean
  is_thursday: boolean
  is_friday: boolean
  is_saturday: boolean
  is_sunday: boolean
  is_holiday: boolean
  count_adults: number
  count_children: number
  start_time: string | null
  end_time: string | null
}