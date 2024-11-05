/* eslint-disable max-len */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';
import FitnesService from '@/services/FitnesService';
import ITariff from '@/types/ITariff';
import { IFitnessTariff } from '@/types/IFitnessTariff';
import { useConfigStore } from './config';

dayjs.extend(objectSupport);
dayjs.extend(utc);

export const useTariffsStore = defineStore('tariffs', () => {
  const allTariffs = ref<ITariff[]>([]);
  const availableTariffs = ref<ITariff[]>([]);
  const availableTariffsTest = ref<ITariff[]>([]);
  const lastDateTime = ref<string>('');

  const getTariff = async (data: any) => {
    const weekDays: number[] = [];
    let startTime = '';
    let endTime = '';
    let countAdults = 0;
    let countChildren = 0;
    // let times: string[];
    // let isFamilyTariff: boolean;
    const configStore = useConfigStore();

    if(!configStore.isConfigReceived){
      await new Promise((resolve, reject) => {
        const intervalId = setInterval(async()=>{
          console.log('###############################');
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

    const adminTariff: IFitnessTariff | undefined = configStore.config.tariffs.find((el) => el.uid === data.id);

    if(adminTariff) {
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
    }

    const tariff: ITariff = {
      id: data.id,
      title: data.title.replace('(онлайн)', ''),
      type: data.type,
      price: +data.price,
      discountPrice: +data.price_with_discount,
      availableTime: data.available_time,
      description: data.description,
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

  const setAvailableTariffs = async (datetime: string) => {
    console.log('alltariffs', allTariffs.value)
    console.log('lengts', allTariffs.value.length)
    if (!allTariffs.value.length) {
      console.log('test');
      await fetchAllTariffs();
    }

    console.log('step1', allTariffs.value.length)

    lastDateTime.value = datetime;

    const configStore = useConfigStore();
    // Uids заведенных в админке тарифов
    const tariffs_uids = new Set();
    configStore.config.tariffs.forEach(tariff => {
      tariffs_uids.add(tariff.uid);
    });
    console.log('uids', tariffs_uids)
    // Только заведенные в админке тарифы
    availableTariffsTest.value = allTariffs.value;
    availableTariffs.value = allTariffs.value.filter((tariff) => tariffs_uids.has(tariff.id));
    // console.log('available', availableTariffs.value);

    console.log('step2', availableTariffs.value.length)

    const day = dayjs(datetime);
    const weekDayNumber = day.day();

    // console.log('avaTV', allTariffs.value, tariffs_uids);
    // console.log('all', allTariffs.value);

    // Фильтрация по дням недели
    availableTariffs.value = availableTariffs.value.filter((tariff) => {
      let result = false;
      if(tariff.weekDays.some((el) => el === weekDayNumber)) result = true;
      return result;
    });

    console.log('step3', availableTariffs.value.length)


    const time = datetime.split('T')[1];

    // Фильтрация по времени
    availableTariffs.value = availableTariffs.value.filter((tariff) => {
      let result = false;
      if (time >= tariff.startTime && time < tariff.endTime) result = true;
      return result;
    });

    console.log('step end', availableTariffs.value.length)

  };

  const clearAvailableTariffs = () => {
    // availableTariffs.value = [];
    console.log('!!!!!!!!!!')
  };

  return {
    allTariffs,
    availableTariffs,
    lastDateTime,
    availableTariffsTest,
    fetchAllTariffs,
    setAvailableTariffs,
    clearAvailableTariffs,
  };
});
