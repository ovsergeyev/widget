export interface IFitnesScheduleSegmentCreate {
  title: string
  widget_id: number
  start_time: string
  end_time: string
}

export interface IFitnesScheduleSegment {
  id: number
  title: string
  start_time: string
  end_time: string
}