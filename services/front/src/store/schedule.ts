import { defineStore } from 'pinia';
import { ref } from 'vue';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';
import IOffer from '@/types/IOffer';
import ISchedule from '@/types/ISchedule';
import { useClassesStore } from './classes';

dayjs.extend(objectSupport);
dayjs.extend(utc);

export const useScheduleStore = defineStore('schedule', () => {
  const classesStore = useClassesStore();
  const schedule = ref<ISchedule>({
    dayNumber: '',
    monthNumber: '',
    weekDay: '',
    offers: []
  });

  const setSchedule = (dayIso: string) => {
    const day = dayjs.utc(dayIso);
    const dayOffersIntermediate: IOffer[] = classesStore.offers.filter(
      (el: IOffer) => el.startDate === dayIso,
    );
    const dayOffers: IOffer[] = [];
    dayOffersIntermediate.forEach((el: IOffer) => {
      const offer = { ...el, isActive: true };
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

  return {
    schedule,
    setSchedule,
  };
});
