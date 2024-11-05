import { defineStore } from 'pinia';
import { ref } from 'vue';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';
import { IAppointment } from '../types/IAppointment';
import IOffer from '../types/IOffer';
import ISchedule from '../types/ISchedule';
import ITakePlace from '../types/ITakePlace';
import { useConfigStore } from './config';
import FitnesService from '../services/FitnesService';

dayjs.extend(objectSupport);
dayjs.extend(utc);

export const useScheduleStore = defineStore('schedule', () => {
  const offers = ref<IOffer[]>([]);
  const loading = ref(false);
  const appointments = ref<IAppointment[]>([]);
  const schedule = ref<ISchedule>({
    dayNumber: '',
    monthNumber: '',
    weekDay: '',
    offers: []
  });
  const takePlaces = ref<ITakePlace[]>([]);

  const getOffers = async (isoDate: string) => {
    loading.value = true;
    // offers.value = [];
    const result: IOffer[] = [];
    const payload = {
      start_date: isoDate + 'T00:00',
      end_date: isoDate + 'T23:59',
    };
    const configStore = useConfigStore();
    const res = await FitnesService.classes(
      configStore.integration_code,
      payload
    );
    const { data } = res.data;

    data.forEach((el: any) => {
      let countTakePlaces = 0;
      const takePlace: ITakePlace | undefined = takePlaces.value.find((tp: ITakePlace) => tp.appointmentId === el.appointment_id);
      if(takePlace) countTakePlaces = takePlace.count;

      const offer: IOffer = {
        appointmentId: el.appointment_id,
        startDate: el.start_date.split(' ')[0],
        startTime: el.start_date.split(' ')[1],
        endDate: el.end_date.split(' ')[0],
        endTime: el.end_date.split(' ')[1],
        duration: el.duration,
        roomName: el.room.title,
        availableSlots: el.available_slots - countTakePlaces,
      };
      result.push(offer);

      const allOffers = offers.value.filter((el: IOffer) => el.appointmentId !== offer.appointmentId);
      allOffers.push(offer);
      offers.value = allOffers;

      let appointment: IAppointment | undefined = appointments.value.find((el: IAppointment) => el.id === offer.appointmentId);
      if(!appointment) {
        appointment = {
          id: offer.appointmentId,
          datetime: el.start_date.replace(' ', 'T')
        }
        appointments.value.push(appointment);
      };
    });
    loading.value = false;
    return result;
  };

  const setSchedule = async (dayIso: string) => {
    const day = dayjs.utc(dayIso);
    const offers: IOffer[] = await getOffers(dayIso);
    const dayOffersIntermediate: IOffer[] = offers.filter(
      (el: IOffer) => el.startDate === dayIso,
    );
    const dayOffers: IOffer[] = [];
    dayOffersIntermediate.forEach((el: IOffer) => {
      const offer: IOffer = el;
      offer.isActive = true;
      const currentDate = dayjs().utcOffset(3);
      const currentDayIso = currentDate.format('YYYY-MM-DD');
      const datetime = dayjs(`${el.startDate}T${el.startTime}`);
      if (
        el.startDate === currentDayIso &&
        dayjs().utcOffset(3).isAfter(datetime)
      ) {
        offer.isActive = false;
      }
      if (dayjs(el.startDate).isBefore(dayjs(currentDayIso))) {
        offer.isActive = false;
      }
      dayOffers.push(offer);
    });
    const monthNumber = (day.month() + 1).toString().padStart(2, '0');
    const weekDayNumber = day.day();
    const weekDay = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][
      weekDayNumber
    ];

    const localSchedule: ISchedule = {
      dayNumber: day.format('D'),
      monthNumber,
      weekDay,
      offers: dayOffers,
    };

    schedule.value = localSchedule;
  };

  const getUnlimitedAppointments = (appointmentId: string): IAppointment[] => {
    let appointmentsByUnlimited: IAppointment[] = [];
    const currentAppointment: IAppointment | undefined = appointments.value.find((el: IAppointment) => el.id === appointmentId);

    if(currentAppointment){
      const date1 = dayjs(currentAppointment.datetime);
      appointmentsByUnlimited = appointments.value.filter((el: IAppointment) => {
        let result = false;
        const date2 = dayjs(el.datetime);
        if((date2.isSame(date1) || date2.isAfter(date1)) && date2.isBefore(date1.add(5,'hour').add(1, 'minute'))){
          result = true;
        }
        return result;
      })
    };

    return appointmentsByUnlimited;
  }

  const takeSeat = (takePlace: ITakePlace) => {
    if(takePlace.isUnlimited){
      const appointmentsByUnlimited: IAppointment[] = getUnlimitedAppointments(takePlace.appointmentId);
      appointmentsByUnlimited.forEach((el: IAppointment) => {
        const unlimitedTakePlace: ITakePlace = {
          appointmentId: el.id,
          count: takePlace.count,
          isUnlimited: true
        }
        const currentTakeSeat = takePlaces.value.find((el: ITakePlace) => el.appointmentId === unlimitedTakePlace.appointmentId);
        if(currentTakeSeat){
          currentTakeSeat.count += unlimitedTakePlace.count;
        } else {
          takePlaces.value.push(unlimitedTakePlace);
        }

        //Занятие мест в расписании
        const offer = offers.value.find((el: IOffer) => el.appointmentId === unlimitedTakePlace.appointmentId);
        if(offer) offer.availableSlots -= unlimitedTakePlace.count;
      });
    } else {
      const currentTakeSeat = takePlaces.value.find((el: ITakePlace) => el.appointmentId === takePlace.appointmentId);
      if(currentTakeSeat){
        currentTakeSeat.count += takePlace.count;
      } else {
        takePlaces.value.push(takePlace);
      }

      //Занятие мест в расписании
      const offer = offers.value.find((el: IOffer) => el.appointmentId === takePlace.appointmentId);
      if(offer) offer.availableSlots -= takePlace.count;
    }
  }

  const freeUpSeat = (takePlace: ITakePlace) => {
    if(takePlace.isUnlimited){
      const appointmentsByUnlimited: IAppointment[] = getUnlimitedAppointments(takePlace.appointmentId);
      appointmentsByUnlimited.forEach((el: IAppointment) => {
        const unlimitedTakePlace: ITakePlace = {
          appointmentId: el.id,
          count: takePlace.count,
          isUnlimited: true
        }
        const currentTakeSeat = takePlaces.value.find((el: ITakePlace) => el.appointmentId === unlimitedTakePlace.appointmentId);
        if(currentTakeSeat){
          currentTakeSeat.count -= unlimitedTakePlace.count;
          //Освобождение мест в расписании
          const offer = offers.value.find((el: IOffer) => el.appointmentId === unlimitedTakePlace.appointmentId);
          if(offer) offer.availableSlots += unlimitedTakePlace.count;
        }
      });
    } else {
      const currentTakeSeat = takePlaces.value.find((el: ITakePlace) => el.appointmentId === takePlace.appointmentId);
      if(currentTakeSeat){
        currentTakeSeat.count -= takePlace.count;
        if(currentTakeSeat.count < 0) currentTakeSeat.count = 0;

        //Освобождение мест в расписании
        const offer = offers.value.find((el: IOffer) => el.appointmentId === takePlace.appointmentId);
        if(offer) offer.availableSlots += takePlace.count;

      }
    }
  }

  const clearSeat = () => {
    takePlaces.value = [];
  }

  return {
    appointments,
    offers,
    schedule,
    loading,
    takePlaces,
    setSchedule,
    takeSeat,
    freeUpSeat,
    clearSeat
  };
});
