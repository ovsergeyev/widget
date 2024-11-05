import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from './auth';
import { useCommonStore } from './common';
import { useConfigStore } from './config';
import { useECommerceStore } from './eCommerce';
import { useGroupOrdersStore } from './groupOrders';
import { useScheduleStore } from './schedule';
import { useTariffsStore } from './tariffs';
import { IECommerceProduct } from '../types/IECommerce';
import { IAppointment } from '../types/IAppointment';
import IOrder from '../types/IOrder';
import IOrderGroupByTariff from '../types/IOrderGroupByTariff';
import ITariff from '../types/ITariff';
import { IFitnessCart } from '../types/IFitnessCart';
import { IPayment1C } from '../types/IPayment1C';
import ISeat from '../types/ISeat';
import ITakePlace from '../types/ITakePlace';
import { IUkassaPayment } from '../types/IUkassaPayment';
import FitnesService from '../services/FitnesService';
import IPaymentInfo from '../types/IPaymentInfo';
import { IFitnessPromocode } from '../types/IFitnessPromocode';

interface IPrice {
  tariffGroupId: string,
  amount: number,
  discount: number
}

export const useBookingStore = defineStore('booking', () => {
  const priceArray = ref<IPrice[]>([]);
  const groupOrdersStore = useGroupOrdersStore();
  const tariffStore = useTariffsStore();
  const tariffs = tariffStore.allTariffs
  const orders = ref<IOrder[]>([]);
  const promocode = ref<string | null>(null);
  const showMessageAfterPayment = ref(false);
  const showAddGroupTariffWithChildrenPopup = ref(false);
  const showPaymentPopup = ref(false);

  const addOrder = (tariff: ITariff, datetime: string) => {
    // Добавляем тариф в массив тарифов если его там нет
    if(!tariffs.some((el: ITariff) => el.id === tariff.id)){
      tariffs.push(tariff)
    }
    const commonStore = useCommonStore();
    const scheduleStore = useScheduleStore();
    const adults = tariff.countAdults;
    const children = tariff.countChildren;

    let tariffGroupId = '';
    if(tariff.type === "base" || tariff.type === "fixed"){
      const existOrder: IOrder | undefined = orders.value.find((order: IOrder) => {
        return order.appointmentId === commonStore.currentAppointmentId && order.tariffId === tariff.id;
      });
      if(existOrder){
        tariffGroupId = existOrder.tariffGroupId;
      } else {
        tariffGroupId = uuidv4();
      }
    } else {
      tariffGroupId = uuidv4();
    }

    for(let count=0; count < adults; count++){
      const order: IOrder = {
        uid: uuidv4(),
        tariffGroupId: tariffGroupId,
        appointmentId: commonStore.currentAppointmentId,
        tariffId: tariff.id,
        // tariffType: tariff.type,
        datetime: datetime,
        isAdult: true,
      };
      orders.value.push(order);
      const takePlace: ITakePlace = {
        appointmentId: order.appointmentId,
        isUnlimited: tariff.type === "unlimited" ? true : false,
        count: 1
      };
      scheduleStore.takeSeat(takePlace);
    }

    for(let count=0; count < children; count++){
      const order: IOrder = {
        uid: uuidv4(),
        tariffGroupId: tariffGroupId,
        appointmentId: commonStore.currentAppointmentId,
        tariffId: tariff.id,
        datetime: datetime,
        isAdult: false,
      };
      orders.value.push(order);
      const takePlace: ITakePlace = {
        appointmentId: order.appointmentId,
        isUnlimited: tariff.type === "unlimited" ? true : false,
        count: 1
      };
      scheduleStore.takeSeat(takePlace);
    }
  };

  const delTariff = (orderGroupByTariff: IOrderGroupByTariff) => {
    const scheduleStore = useScheduleStore();
    const orderUids = orderGroupByTariff.orders.map((order: IOrder) => order.uid);

    let countOrders = orders.value.reduce((count: number, order: IOrder) => {
      if(orderUids.includes(order.uid)){
        return count + 1;
      }
      return count;
    }, 0);

    orders.value = orders.value.filter((order: IOrder) => !orderUids.some(uid => uid === order.uid));

    const eCommerce = useECommerceStore();
    const tariff = orderGroupByTariff.tariff;
    const products: IECommerceProduct[] = [];
    const product: IECommerceProduct = {
      id: tariff.id,
      category: 'Термальные источники',
      name: tariff.adminTitle,
      price: tariff.price,
      quantity: 1
    }
    products.push(product)
    eCommerce.delProducts(products);

    // Отправка цели Яндекс.Метрики.
    if(typeof (window as any).sendYandexGoal === 'function'){
      (window as any).sendYandexGoal('delTariffToCart', {
        tariff: tariff.adminTitle,
        price: tariff.price,
        day: orderGroupByTariff.date,
        time: orderGroupByTariff.time
      });
    }

    const takePlace: ITakePlace = {
      appointmentId: orderGroupByTariff.appointmentId,
      isUnlimited: orderGroupByTariff.tariff.type === "unlimited" ? true : false,
      count: countOrders
    };
    scheduleStore.freeUpSeat(takePlace);
  }

  const totalAmount = computed<number>(() => {
    let result = 0;
    groupOrdersStore.ordersByTariff.forEach((el: IOrderGroupByTariff) => {
      result += el.price;
    });

    return result;
  });

  const totalDiscount = computed<number>(() => {
    let result = 0;
    priceArray.value.forEach((el: IPrice) => {
      result += el.discount;
    });

    return result;
  });

  const updateTariffCost = async (payload: IFitnessCart, tariffGroupId: string) => {
    const configStore = useConfigStore();
    const res = await FitnesService.cartCost(
      configStore.integration_code,
      payload
    );
    const { data } = res.data;
    const price: IPrice = {
      tariffGroupId: tariffGroupId,
      amount: data.total_amount,
      discount: data.total_discount
    }
    priceArray.value.push(price);
  };

  const getPromocode = (orderGroupByTariff: IOrderGroupByTariff) => {
    let result = ''
    const configStore = useConfigStore();
    const current_promocode = configStore.config.promocodes.find((el: IFitnessPromocode) => el.promocode.toLowerCase() === promocode.value?.toLowerCase())
    // console.log('currentPromocode', current_promocode)
    //Если в настройках нет промокода, он применяется без ограничений
    if(!current_promocode && promocode.value){
      result = promocode.value;
    } else {
      let is_apply = true;
      if (current_promocode?.start_date && orderGroupByTariff.date < current_promocode.start_date) is_apply = false
      if (current_promocode?.end_date && orderGroupByTariff.date > current_promocode.end_date) is_apply = false
      if (current_promocode?.start_time && orderGroupByTariff.time < current_promocode.start_time) is_apply = false
      if (current_promocode?.end_time && orderGroupByTariff.time > current_promocode.end_time) is_apply = false
      if (is_apply && promocode.value) result = promocode.value
    }

    return result
  }

  const updateCartCost = async () => {
    priceArray.value = [];

    const ordersGroupByTariff: IOrderGroupByTariff[] = groupOrdersStore.ordersByTariff;

    for(const orderGroupByTariff of ordersGroupByTariff){
      const promocode = getPromocode(orderGroupByTariff)
      const payload: IFitnessCart = {
        promocode: promocode,
        cart_array: []
      }

      let count = 0;
      if(orderGroupByTariff.tariff.type === 'group'){
        count = 1;
      } else {
        count = orderGroupByTariff.getCountAdults();
      }

      const cartElement = {
        purchase_id: orderGroupByTariff.tariff.id,
        count: count
      }

      payload.cart_array.push(cartElement);

      await updateTariffCost(payload, orderGroupByTariff.tariffGroupId);
    }

    // console.log('data', data);
  };

  const payment = async () => {
    const authStore = useAuthStore();
    const configStore = useConfigStore();
    const scheduleStore = useScheduleStore();
    const payments1C: IPayment1C[] = [];
    const seats: ISeat[] = [];
    await updateCartCost();

    groupOrdersStore.ordersByTariff.forEach((orderByTariff: IOrderGroupByTariff) => {
      const price = priceArray.value.find((el: IPrice) => el.tariffGroupId === orderByTariff.tariffGroupId);
      const count = orderByTariff.tariff.type === "group" ? 1 : orderByTariff.getCountAdults();
      if(price){
        const payment1C: IPayment1C = {
          purchase_id: orderByTariff.tariff.id,
          count: count,
          amount: price.amount,
          discount: price.discount,
          appointment_id: orderByTariff.appointmentId,
          promocode: promocode.value,
          user_token: authStore.userToken
        }
        payments1C.push(payment1C);
      };
    });

    const description = `
      ${authStore.user.last_name}
      ${authStore.user.name}
      ${authStore.user.second_name}
      (${authStore.user.phone})
    `

    const totalAmount = priceArray.value.reduce((akk: number, cur: IPrice) => {
      return akk + cur.amount;
    }, 0)

    scheduleStore.takePlaces.forEach((el: ITakePlace) => {
      const seat: ISeat = {
        appointment_id: el.appointmentId,
        count: el.count
      }
      seats.push(seat);
    });

    const paymentPayload: IUkassaPayment = {
      amount: totalAmount,
      description,
      payments1C: payments1C,
      user_token: authStore.userToken,
      seats: seats
    }

    promocode.value = null;
    const res = await FitnesService.paymentUkassa(
      configStore.integration_code,
      paymentPayload
    );

    // Отправка цели Яндекс.Метрики.
    if(typeof (window as any).sendYandexGoal === 'function'){
      (window as any).sendYandexGoal('goToPaymentPage', {
        payments: payments1C.map((el: IPayment1C) => {
          const tariff = tariffs.find((tariff: ITariff) => tariff.id === el.purchase_id);
          const appointment: IAppointment | undefined = scheduleStore.appointments.find((appointment: IAppointment) => {
            return appointment.id === el.appointment_id;
          });
          return {
            tariff: tariff?.adminTitle,
            date: appointment?.datetime ? appointment.datetime.split('T')[0] : '',
            time: appointment?.datetime ? appointment.datetime.split('T')[1] : '',
            price: el.amount,
            discount: el.discount,
            count: el.count
          }
        }),
      });
    }

    return res.data;
  };

  const getPaymentInfo = async (uid: string) => {
    const payment_info: IPaymentInfo = await new Promise((resolve, reject) => {
      const intervalId = setInterval(async()=>{
        const response_payment_info = await FitnesService.getPaymentInfo(uid);
        const info = response_payment_info.data;
        // console.log('info', info);
        if(info.status === "succeeded") {
          clearInterval(intervalId);
          orders.value = [];
          priceArray.value = [];
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
    showAddGroupTariffWithChildrenPopup,
    promocode,
    showMessageAfterPayment,
    showPaymentPopup,
    orders,
    addOrder,
    totalAmount,
    totalDiscount,
    delTariff,
    updateCartCost,
    payment,
    getPaymentInfo
  };
});