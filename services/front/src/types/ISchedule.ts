import IOffer from './IOffer';

export default interface ISchedule {
  dayNumber: string;
  monthNumber: string;
  weekDay: string;
  offers: IOffer[];
}
