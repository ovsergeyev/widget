import { computed, inject } from 'vue';
import { defineStore } from 'pinia';
import { useBookingStore } from './booking';
import { useTariffsStore } from './tariffs';
import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';
import { v4 as uuidv4 } from 'uuid';
import IGroupingResult from '../types/IGroupingResult';
import IOrder from '../types/IOrder';
import IOrderGroupByDate from '../types/IOrderGroupByDate';
import IOrderGroupByTariff from '../types/IOrderGroupByTariff';
import ITariff from '../types/ITariff';

export const useGroupOrdersStore = defineStore('groupOrders', () => {
  const bookingStore = useBookingStore();
  const tariffStore = useTariffsStore();
  const tariffs = tariffStore.allTariffs;

  const ordersByTariff = computed((): IOrderGroupByTariff[] => {
    const result: IOrderGroupByTariff[] = [];
    const tariffGroupIds: Set<string> = new Set();

    bookingStore.orders.forEach((order: IOrder) => {
      const tariff: ITariff | undefined = tariffs.find((tariff: ITariff) => tariff.id === order.tariffId);

      if(tariff) {
        if(!tariffGroupIds.has(order.tariffGroupId)){
          const date = order.datetime.split('T')[0];
          const time = order.datetime.split('T')[1];
          const orderGroupByTariff: IOrderGroupByTariff = {
            tariff: tariff,
            tariffGroupId: order.tariffGroupId,
            orders: [
              order
            ],
            price: 0,
            appointmentId: order.appointmentId,
            date: date,
            time: time,
            getCountAdults: function():number {
              return this.orders.filter((order: IOrder) => order.isAdult).length;
            },
            getCountChildren: function():number {
              return this.orders.filter((order: IOrder) => !order.isAdult).length;
            }
          }
          result.push(orderGroupByTariff);
        } else {
          const orderGroupByTariff = result.find((el: IOrderGroupByTariff) => el.tariffGroupId === order.tariffGroupId);
          if(orderGroupByTariff){
            // let price = 0;
            // if(tariff && tariff.type !== 'group' && order.isAdult){
            //   price = orderGroupByTariff.price;
            //   price += tariff.price;
            // };
            // orderGroupByTariff.price = price;
            orderGroupByTariff.orders.push(order);
          };
        }
        tariffGroupIds.add(order.tariffGroupId)
      }

    });

    //Пересчет цены
    result.forEach((orderByTariff: IOrderGroupByTariff) => {
      //Цена за групповой тариф одна, как и количество посетителей
      if(orderByTariff.tariff.type === "group"){
        orderByTariff.price = orderByTariff.tariff.price;
      }

      //Цена на другие тарифы считается по взрослым
      //На текущий момент другие тарифы - base, fixed
      if(orderByTariff.tariff.type !== "group"){
        const adultOrders = orderByTariff.orders.filter((el: IOrder) => el.isAdult === true);
        const price = orderByTariff.tariff.price * adultOrders.length;
        orderByTariff.price = price;
      }
    });

    return result;
  });

  const ordersByDate = computed((): IOrderGroupByDate[] => {
    const result: IOrderGroupByDate[] = [];

    // const appointmentIds: Set<string> = new Set();
    const dates: Set<string> = new Set();

    ordersByTariff.value.forEach((orderGroupByTariff: IOrderGroupByTariff) => {
      if(!dates.has(orderGroupByTariff.date)){
        const datetime = orderGroupByTariff.date + 'T' + orderGroupByTariff.time;
        const day = dayjs.utc(datetime);
        const dayNumber = day.format('D');
        const monthNumber = (day.month() + 1)
          .toString()
          .padStart(2, '0');
        const weekDayNumber = day.day();
        const weekDay = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][
          weekDayNumber
        ];
        const dateString = day.locale('ru').format('DD MMMM YYYY');
        const orderByDate: IOrderGroupByDate = {
          dayNumber: dayNumber,
          monthNumber: monthNumber,
          dateString: dateString,
          ordersByTariff: [orderGroupByTariff],
          weekDay: weekDay,
          datetime: datetime
        }
        result.push(orderByDate);
      } else {
        const orderByDate = result.find((el:IOrderGroupByDate) => {
          return el.datetime.split('T')[0] === orderGroupByTariff.date;
        });
        if(orderByDate){
          orderByDate.ordersByTariff.push(orderGroupByTariff);
        }
      }
      dates.add(orderGroupByTariff.date);
    });

    return result;
  });

  const checkAndGroup = async (orderByTariff: IOrderGroupByTariff) => {
    const result: IGroupingResult = {
      isGrouping: false,
      groupTariff: null,
      adultOrders: [],
      childrenOrders: [],
    }
    //Получаем доступные групповые тарифы
    const tariffStore = useTariffsStore();

    const dateTime = orderByTariff.date + 'T' + orderByTariff.time;
    const tariffs: ITariff[] = await tariffStore.getFilteredTariffs(dateTime);
    const availableTariffs: ITariff[] = tariffs.filter((tariff: ITariff) => tariff.type === "group");

    //Получаем не сгруппированные заказы на это же время
    const orders: IOrder[] = bookingStore.orders.filter((order: IOrder) => {
      let result = true;
      const tariff: ITariff | undefined = tariffStore.allTariffs.find((el: ITariff) => el.id === order.tariffId);
      if(order.appointmentId !== orderByTariff.appointmentId) result = false;
      if(tariff && tariff.type !== 'base') result = false;
      return result;
    })

    const adults = orders.filter((el: IOrder) => el.isAdult).length;
    const children = orders.filter((el: IOrder) => !el.isAdult).length;

    //Находим, если есть, подходящий групповой тариф
    const groupTariff: ITariff | undefined = availableTariffs.find((el: ITariff) => {
      let result = true;
      if (el.countAdults > adults) result = false;
      if (el.countChildren > children) result = false;
      return result;
    });

    //Если групповой тариф найден группируем
    //Детей максимально перемещаем в групповой тариф
    if(groupTariff){
      //создаем массивы со взрослыми и детскими заказами
      const adultOrders: IOrder[] = [];
      const childrenOrders: IOrder[] = [];
      //формируем объект ответа
      result.isGrouping = true;
      result.groupTariff = groupTariff;
      result.adultOrders = adultOrders;
      result.childrenOrders = childrenOrders;

      const countBeingAddedAdults = groupTariff.countAdults;
      // const minBeingAddedChildren = groupTariff.countChildren;
      const maxCountBeingAddedChildren = groupTariff.countAdults * 2;
      const countBeingAddedChildren =
        children > maxCountBeingAddedChildren
        ?
        maxCountBeingAddedChildren
        :
        children;

      let countAddedAdults = 0;
      let countAddedChildren = 0;
      orders.forEach((el: IOrder) => {
        if(el.isAdult && countAddedAdults < countBeingAddedAdults){
          countAddedAdults += 1;
          adultOrders.push(el);
        }
        if(!el.isAdult && countAddedChildren < countBeingAddedChildren){
          countAddedChildren += 1;
          childrenOrders.push(el);
        }
      })

      //Изменяем на групповой тариф
      const uuid = uuidv4();
      adultOrders.forEach((adultOrder: IOrder) => {
        adultOrder.tariffGroupId = uuid;
        adultOrder.tariffId = groupTariff.id;
      });
      childrenOrders.forEach((childrenOrder: IOrder) => {
        childrenOrder.tariffGroupId = uuid;
        childrenOrder.tariffId = groupTariff.id;
      });

      // let detail = `Применен групповой тариф - "${ groupTariff.title.trim() }".`
      // if(countAddedChildren === 1){
      //   detail += ' Детское посещение включено в стоимость тарифа.';
      // }
      // if(countAddedChildren > 1){
      //   detail += ' Одно детское посещение включено в стоимость тарифа.';
      // }

      // toast.add(
      //   {
      //     severity: 'success',
      //     summary: 'Применение тарифа',
      //     detail: detail
      //   }
      // );
    }

    return result;
  }

  return {
    checkAndGroup,
    ordersByTariff,
    ordersByDate
  }

});