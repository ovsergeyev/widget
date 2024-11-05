/* eslint-disable max-len */
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import FitnesService from '@/services/FitnesService';
import ITariff from '@/types/ITariff';
import { useBookingStore } from './booking';

const bookingStore = useBookingStore();

const filteredTariffs = [
  '038a9e86-eaa9-11ee-8bbc-005056834a83', // Боди Тонус
  '1d108908-e868-11ee-8f91-005056834a83', // Красота
  'ebba125c-e867-11ee-8f91-005056834a83', // Оздоровление
  '5c22e816-e868-11ee-8f91-005056834a83', // Очищение
  '4c80f07e-e868-11ee-8f91-005056834a83', // Расслабление
  '2269c912-e6d5-11ee-82c3-005056834a83', // Сертификат 10 000
  'd3ec6cc6-e6d5-11ee-82c3-005056834a83', // Сертификат 15 000
  '0a6f9cc8-e6d6-11ee-82c3-005056834a83', // Сертификат 20 000
];

export const useCatalogStore = defineStore('catalog', () => {
  const tariffs = ref<ITariff[]>([]);
  // const getTariffs = async () => {
  //   if (tariffs.value.length) return;
  //   const res = await FitnesService.priceList();
  //   const { data } = res.data;
  //   console.log('data', data);
  //   data.forEach((el: any) => {
  //     const isInFilteredTariffs = filteredTariffs.find((id) => id === el.id);
  //     if (!isInFilteredTariffs) {
  //       const tariff: ITariff = {
  //         id: el.id,
  //         title: el.title,
  //         type: el.type,
  //         price: +el.price,
  //         discountPrice: +el.price_with_discount,
  //         availableTime: el.available_time,
  //         description: el.description,
  //       };
  //       tariffs.value.push(tariff);
  //     }
  //   });
  //   // const getAvailableTariffs = computed(() => {
  //   //   const availableTariffs: ITariff[] = [];
  //   //   const { isWeekend, selectedTime } = bookingStore;
  //   //   let availableTariffsIds: string[] = [];
  //   //   const weekendTariffsIds: string[] = [
  //   //     '12c08fb6-094c-11ef-924e-005056834a83', // Выходные 2ч 30мин (онлайн)
  //   //     'a85b86b4-0958-11ef-9613-005056834a83', // Выходные Безлимитно (онлайн)
  //   //     'b561231e-0958-11ef-9613-005056834a83', // Выходные Семейный
  //   //   ];
  //   //   const notWeekendTariffsIds: string[] = [
  //   //     'bff8c9a8-0949-11ef-924e-005056834a83', // Будние 2ч 30мин (онлайн)
  //   //     '168a6ca4-094a-11ef-924e-005056834a83', // Будние Безлимитно (онлайн)
  //   //     '9648201c-094a-11ef-924e-005056834a83', // Будние Семейный 2ч 30мин (онлайн)
  //   //     'aa46be34-094a-11ef-924e-005056834a83', // Будние Утренний 2ч 30мин (онлайн)
  //   //     'cf4858b4-0959-11ef-9613-005056834a83', // Будние Вечерний 2ч 30мин (онлайн)
  //   //   ];
  //   //   const morningTariffsIds: string[] = [
  //   //     'aa46be34-094a-11ef-924e-005056834a83', // Будние Утренний 2ч 30мин (онлайн)
  //   //   ];
  //   //   const enevingTariffsIds: string[] = [
  //   //     'cf4858b4-0959-11ef-9613-005056834a83', // Будние Вечерний 2ч 30мин (онлайн)
  //   //   ];
  //   //   if (isWeekend) {
  //   //     availableTariffsIds = weekendTariffsIds;
  //   //   }
  //   //   return availableTariffs;
  //   // });
  // };

  // return {
  //   tariffs,
  //   getTariffs,
  // };
});
