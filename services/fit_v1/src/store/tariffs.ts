/* eslint-disable max-len */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';
import FitnesService from '../services/FitnesService';
import ITariff from '../types/ITariff';
import { IFitnessTariff } from '../types/IFitnessTariff';
import { useConfigStore } from './config';

dayjs.extend(objectSupport);
dayjs.extend(utc);

export const useTariffsStore = defineStore('tariffs', () => {
  const allTariffs = ref<ITariff[]>([]);
  const availableTariffs = ref<ITariff[]>([]);
  const lastDateTime = ref<string>('');
  const currentTariff = ref<ITariff>();

  const getTariff = async (data: any) => {
    const weekDays: number[] = [];
    let startDate = '';
    let endDate = '';
    let isNew = false;
    let startTime = '';
    let endTime = '';
    let type = '';
    let countAdults = 0;
    let countChildren = 0;
    let adminTitle = '';
    let adminDescription = '';
    // let times: string[];
    // let isFamilyTariff: boolean;
    const configStore = useConfigStore();

    if(!configStore.isConfigReceived){
      await new Promise((resolve, reject) => {
        const intervalId = setInterval(async()=>{
          if(configStore.isConfigReceived) {
            resolve(true)
          }
        }, 100);

        setTimeout(() => {
          clearInterval(intervalId);
          reject(new Error('Timeout: конфиг не получен'))
        }, 100000);
      });
    }

    const adminTariff: IFitnessTariff | undefined = configStore.config.tariffs.find((el: any) => el.uid === data.id);

    if(adminTariff) {
      if(adminTariff.start_date) startDate = adminTariff.start_date;
      if(adminTariff.end_date) endDate = adminTariff.end_date;
      if(adminTariff.is_new) isNew = adminTariff.is_new;
      if(adminTariff.type) type = adminTariff.type;
      if(adminTariff.is_monday) weekDays.push(1);
      if(adminTariff.is_tuesday) weekDays.push(2);
      if(adminTariff.is_wednesday) weekDays.push(3);
      if(adminTariff.is_thursday) weekDays.push(4);
      if(adminTariff.is_friday) weekDays.push(5);
      if(adminTariff.is_saturday) weekDays.push(6);
      if(adminTariff.is_sunday) weekDays.push(7);
      if(adminTariff.is_holiday) weekDays.push(0);
      if(adminTariff.start_time) startTime = adminTariff.start_time;
      if(adminTariff.end_time) endTime = adminTariff.end_time;
      if(adminTariff.count_adults) countAdults = adminTariff.count_adults;
      if(adminTariff.count_children) countChildren = adminTariff.count_children;
      if(adminTariff.description) adminDescription = adminTariff.description;
      if(adminTariff.title) adminTitle = adminTariff.title;
    }

    const tariff: ITariff = {
      id: data.id,
      title: data.title,
      adminTitle: adminTitle,
      description: data.description,
      adminDescription: adminDescription,
      startDate: startDate,
      endDate: endDate,
      isNew: isNew,
      type: type,
      price: +data.price,
      discountPrice: +data.price_with_discount,
      availableTime: data.available_time,
      weekDays,
      startTime,
      endTime,
      countAdults,
      countChildren,
    };
    return tariff;
  };

  const fetchAllTariffs = async () => {
    if (allTariffs.value.length) return;
    const configStore = useConfigStore();
    const res = await FitnesService.priceList(configStore.integration_code);
    const { data } = res.data;
    data.forEach(async (el: any) => {
      const tariff: ITariff = await getTariff(el);
      allTariffs.value.push(tariff);
    });
  };

  const getFilteredTariffs = async(datetime: string) => {
    if (!allTariffs.value.length) {
      await fetchAllTariffs();
    }

    const configStore = useConfigStore();
    // Uids заведенных в админке тарифов
    const tariffs_uids = new Set();
    configStore.config.tariffs.forEach((tariff: any) => {
      tariffs_uids.add(tariff.uid);
    });

    // Только заведенные в админке тарифы
    let availableTariffs: ITariff[] = allTariffs.value.filter((tariff: ITariff) => tariffs_uids.has(tariff.id));

    // Тарифы с признаком new не отображаем
    availableTariffs = availableTariffs.filter((tariff: ITariff) => !tariff.isNew)

    // Фильтруем тарифы дата применения которых еще не наступила
    availableTariffs = availableTariffs.filter((tariff: ITariff) => {
      let result = true;
      const date1 = new Date(datetime)
      const date2 = new Date(tariff.startDate)

      // console.log('date1', date1)
      // console.log('date2', date2)

      if(date2 && date1.getTime() < date2.getTime()) result = false;

      return result
    });

    // Фильтруем тарифы дата применения которых уже прошла
    availableTariffs = availableTariffs.filter((tariff: ITariff) => {
      let result = true;
      const date1 = new Date(datetime)
      const date2 = new Date(tariff.endDate)

      // console.log('date1', date1)
      // console.log('date2', date2)

      if(date2 && date1.getTime() >= date2.getTime()) result = false;

      return result
    });

    const day = dayjs(datetime);
    //TODO const
    let weekDayNumber: Number = day.day();
    if(weekDayNumber===0){
      weekDayNumber = 7
    }


    const date = datetime.split('T')[0];

    //TODO добавить алгоритм праздничных дней
    if(date == '2024-11-04'){
      weekDayNumber = 0
    }
    if(date == '2024-11-02'){
      weekDayNumber = 5
    }


    // Фильтрация по дням недели
    availableTariffs = availableTariffs.filter((tariff) => {
      let result = false;
      if(tariff.weekDays.some((el) => el === weekDayNumber)) result = true;
      return result;
    });

    const time = datetime.split('T')[1];

    // Фильтрация по времени
    availableTariffs = availableTariffs.filter((tariff) => {
      let result = false;
      if (time >= tariff.startTime && time < tariff.endTime) result = true;
      return result;
    });

    return availableTariffs;
  }

  const setAvailableTariffs = async (datetime: string) => {
    if (!allTariffs.value.length) {
      await fetchAllTariffs();
    }

    lastDateTime.value = datetime;
    availableTariffs.value = await getFilteredTariffs(datetime);

  };

  return {
    allTariffs,
    availableTariffs,
    currentTariff,
    lastDateTime,
    fetchAllTariffs,
    getFilteredTariffs,
    setAvailableTariffs,
  };
});
