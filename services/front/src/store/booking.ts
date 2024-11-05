import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { v4 as uuidv4 } from 'uuid';
import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';
import ITariff from '@/types/ITariff';
import IOrder from '@/types/IOrder';
import IOrdersGroup from '@/types/IOrderGroup';
import { IUkassaPayment } from '@/types/IUkassaPayment';
import { IFitnessCart } from '@/types/IFitnessCart';
import FitnesService from '@/services/FitnesService';
import { useConfigStore } from './config';
import { useAuthStore } from './auth';

dayjs.extend(objectSupport);
dayjs.extend(utc);

export const useBookingStore = defineStore('booking', () => {
  const orderGroups = ref<IOrdersGroup[]>([]);
  const completeOrderGroups = ref<IOrdersGroup[]>([]);
  const total_discount = ref(0);
  const promocode = ref<string | null>(null);
  const updateOrdersGroup = (orders: IOrder[]) => {
    const dates: Set<string> = new Set();
    orders.forEach((el) => dates.add(el.date));
    const result: IOrdersGroup[] = [];
    dates.forEach((ordersDate) => {
      const ordersByDate = orders.filter(
        (el) => el.date === ordersDate,
      );
      const day = dayjs.utc(ordersDate);
      const dayNumber = day.format('D');
      const monthNumber = (day.month() + 1)
        .toString()
        .padStart(2, '0');
      const weekDayNumber = day.day();
      // console.log('weekdaynumber', weekDayNumber, day);
      const weekDay = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][
        weekDayNumber
      ];
      const dateString = day.locale('ru').format('DD MMMM YYYY');
      const ordersGroup: IOrdersGroup = {
        dayNumber,
        monthNumber,
        weekDay,
        dateString,
        orders: ordersByDate,
      };
      result.push(ordersGroup);
    });
    orderGroups.value = result;
  };

  const addOrder = (tariff: ITariff, datetime: string) => {
    const date = datetime.split('T')[0];
    const time = datetime.split('T')[1];
    const adults = tariff.countAdults;
    const children = tariff.countChildren;
    const order: IOrder = {
      uid: uuidv4(),
      title: tariff.title,
      tariffId: tariff.id,
      date,
      time,
      adults,
      children,
      price: tariff.price,
    };
    let localOrders: IOrder[] = [];
    orderGroups.value.forEach((orderByDate) => {
      localOrders = [...orderByDate.orders];
    });
    localOrders.push(order);
    updateOrdersGroup(localOrders);
  };

  const addChildren = (uid: string) => {
    let result = false;
    let localOrders: IOrder[] = [];
    const orders: IOrder[] = [];
    orderGroups.value.forEach((orderByDate) => {
      localOrders = [...orderByDate.orders];
    });
    localOrders.forEach((order: IOrder) => {
      if (order.uid !== uid) {
        orders.push(order);
      } else {
        const newOrder = { ...order };
        if (
          newOrder.children < 2 ||
          (newOrder.adults > 1 && newOrder.children < 4)
        ) {
          newOrder.children += 1;
          result = true;
        } else {
          result = false;
        }
        orders.push(newOrder);
      }
    });
    updateOrdersGroup(orders);
    return result;
  };
  const delChildren = (uid: string) => {
    let result = false;
    let localOrders: IOrder[] = [];
    const orders: IOrder[] = [];
    orderGroups.value.forEach((orderByDate) => {
      localOrders = [...localOrders, ...orderByDate.orders];
    });
    localOrders.forEach((order: IOrder) => {
      if (order.uid !== uid) {
        orders.push(order);
      } else {
        const newOrder = { ...order };
        if (newOrder.children > 0) {
          newOrder.children -= 1;
          result = true;
        } else {
          result = false;
        }
        orders.push(newOrder);
      }
    });
    updateOrdersGroup(orders);
    return result;
  };
  const delTariff = (uid: string) => {
    promocode.value = null
    total_discount.value = 0
    let localOrders: IOrder[] = [];
    const orders: IOrder[] = [];
    orderGroups.value.forEach((orderByDate) => {
      localOrders = [...localOrders, ...orderByDate.orders];
    });
    localOrders.forEach((order: IOrder) => {
      if (order.uid !== uid) {
        orders.push(order);
      }
    });
    updateOrdersGroup(orders);
  };

  const updateCost = async () => {
    const payload: IFitnessCart = {
      promocode: promocode.value,
      cart_array: []
    }
    let localOrders: IOrder[] = [];
    orderGroups.value.forEach((orderByDate) => {
      localOrders = [...orderByDate.orders];
    });
    localOrders.forEach((order) => {
      const cartElement = {
        purchase_id: order.tariffId,
        count: 1
      }
      payload.cart_array.push(cartElement);
    });
    const configStore = useConfigStore();
    const res = await FitnesService.cartCost(
      configStore.integration_code,
      payload
    );

    const { data } = res.data;

    console.log('data update cost', data.total_amount);
    total_discount.value = data.total_discount;

    const authStore = useAuthStore();
    const description = `
      ${authStore.user.last_name}
      ${authStore.user.name}
      ${authStore.user.second_name}
      (${authStore.user.phone})
    `

    const paymentPayload: IUkassaPayment = {
      amount: data.total_amount,
      description,
      cart: payload.cart_array,
      user_token: authStore.userToken,
      return_url: "https://weeek.ru",
      promocode: promocode.value
    }
    return paymentPayload
  };

  const payment = async () => {
    // const payload: IUkassaPayment = {
    //   amount: 1200,
    //   description: "Test",
    //   return_url: "https://weeek.ru"
    // };
    const configStore = useConfigStore();
    const payload: IUkassaPayment = await updateCost();
    promocode.value = null
    total_discount.value = 0
    const res = await FitnesService.paymentUkassa(
      configStore.integration_code,
      payload
    );
    const url = res.data.url;
    const uid = res.data.uid;
    window.open(url, "_blank")?.focus();
    console.log('res', res);


    const payment_info = await new Promise((resolve, reject) => {
      const intervalId = setInterval(async()=>{
        const response_payment_info = await FitnesService.getPaymentInfo(uid);
        const info = response_payment_info.data;
        // console.log('info', info);
        if(info.status === "succeeded") {
          clearInterval(intervalId);
          completeOrderGroups.value = [... orderGroups.value];
          orderGroups.value = [];
          resolve(info)
        }
      }, 1000);

      setTimeout(() => {
        clearInterval(intervalId);
        reject(new Error('Timeout: payment has not been made'))
      }, 600000);
    });

    return payment_info;
  }

  return {
    orderGroups,
    completeOrderGroups,
    promocode,
    total_discount,
    addOrder,
    addChildren,
    delChildren,
    delTariff,
    updateCost,
    payment,
  };
});
