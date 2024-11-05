/* eslint-disable linebreak-style */
export default interface IOffer {
  appointmentId: string,
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  duration: number;
  roomName: string;
  availableSlots: number;
  isActive?: boolean;
}
