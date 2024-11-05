import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';
import FitnesService from '@/services/FitnesService';
import Offer from '@/types/IOffer';
import { useConfigStore } from './config';

dayjs.extend(objectSupport);
dayjs.extend(utc);

export const useClassesStore = defineStore('classes', () => {
  const offers = ref<Offer[]>([]);
  const schedule = ref<Offer[]>([]);
  const getFirstAndLastDayOfMonth = (year: number, month: number) => {
    const firstDay = dayjs()
      .year(year)
      .month(month)
      .startOf('month')
      .format('YYYY-MM-DD');

    const lastDay = dayjs()
      .year(year)
      .month(month)
      .endOf('month')
      .format('YYYY-MM-DD');

    return {
      firstDay,
      lastDay,
    };
  };

  const getMonthClasses = async (year: number, month: number) => {
    offers.value = [];
    const { firstDay, lastDay } = getFirstAndLastDayOfMonth(
      year,
      month,
    );
    const payload = {
      start_date: firstDay,
      end_date: lastDay,
    };
    const configStore = useConfigStore();
    const res = await FitnesService.classes(
      configStore.integration_code,
      payload
    );
    const { data } = res.data;

    data.forEach((el: any) => {
      const offer = {
        startDate: el.start_date.split(' ')[0],
        startTime: el.start_date.split(' ')[1],
        endDate: el.end_date.split(' ')[0],
        endTime: el.end_date.split(' ')[1],
        duration: el.duration,
        roomName: el.room.title,
        availableSlots: el.available_slots,
      };
      offers.value.push(offer);
    });
  };

  return {
    offers,
    getMonthClasses
  };
});
