<script lang="ts" setup>
import { ref, inject, onMounted } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useGroupOrdersStore } from '../../store/groupOrders';
import { useCommonStore } from '../../store/common';
import { useBookingStore } from '../../store/booking';
import { useECommerceStore } from '../../store/eCommerce';
import { useScheduleStore } from '../../store/schedule';
import { useTariffsStore } from '../../store/tariffs';
import LoginPopup from '../Popups/LoginPopup.vue';
import ResetPopup from '../Popups/ResetPopup.vue';
import RegisterPopup from '../Popups/RegisterPopup.vue';
import PaymentPopup from '../Popups/PaymentPopup.vue';
import presets from './presets';
import { IECommerceProduct, IECommerceActionField, IECommercePurchase } from '../../types/IECommerce';
import IPaymentInfo from '../../types/IPaymentInfo';
import { IPayment1C } from '../../types/IPayment1C';
import ITariff from '../../types/ITariff';
import EventBus from '../../utils/EventBus';
import { getPriceString } from '../../common';
import { nextTick } from 'vue';

const authStore = useAuthStore();
const bookingStore = useBookingStore();
const commonStore = useCommonStore();
const eCommerce = useECommerceStore();
const groupOrdersStore = useGroupOrdersStore();
const scheduleStore = useScheduleStore();
const tariffStore = useTariffsStore();
const eventBus = inject('eventBus') as EventBus;

const products = ref<IECommerceProduct[]>([]);
const paymentUrl = ref<string>();

// const toast = useToast();

const showPopups = ref({
  loginPopup: false,
  registerPopup: false,
  forgotPassPopup: false,
});

onMounted(()=>{
  eventBus.subscribe('change-cart', () => {
    paymentUrl.value = undefined;
    nextTick(()=>{
      bookingStore.updateCartCost()
    })
  })
});

const openRegisterPopup = () => {
  showPopups.value.loginPopup = false;
  showPopups.value.registerPopup = true;
};

const openForgotPassPopup = () => {
  showPopups.value.loginPopup = false;
  showPopups.value.forgotPassPopup = true;
};

let blockPromocode = false;
const clickApplyPromocode = async () => {
  if( blockPromocode) return
  // Отправка цели Яндекс.Метрики
  if (typeof (window as any).sendYandexGoal === 'function') {
    (window as any).sendYandexGoal('applyPromocode', {
      promocode: bookingStore.promocode
    });
  }
  blockPromocode = true;
  await bookingStore.updateCartCost();
  blockPromocode = false;
};

const clickBuyButton = async() => {
  if(!authStore.userToken){
    const userToken = localStorage.getItem('user_token');
    if(userToken){
      authStore.setUserToken(userToken);
    } else {
      // Отправка цели Яндекс.Метрики
      if (typeof (window as any).sendYandexGoal === 'function') {
        (window as any).sendYandexGoal('startRegistration');
      }
      showPopups.value.registerPopup = true;
      return
    }
  }

  await authStore.waitForSetUserToken();

  const { uid, url } = await bookingStore.payment();

  paymentUrl.value = url;

  if(commonStore.isSafari){
    bookingStore.showPaymentPopup = true;
  } else {
    window.open(url, "_blank")?.focus();
  }

  //Ожидание оплаты
  const payment_info: IPaymentInfo | undefined = await bookingStore.getPaymentInfo(uid);

  scheduleStore.clearSeat();
  const date = tariffStore.lastDateTime.split('T')[0];
  scheduleStore.setSchedule(date);

  bookingStore.showMessageAfterPayment = true;

  console.log('payment_info', payment_info);

  payment_info.payments1C.forEach((payment1C: IPayment1C) => {
    const tariff: ITariff | undefined = tariffStore.allTariffs.find((el: ITariff) => el.id === payment1C.purchase_id);
    for(let i=0;i<payment1C.count;i++){
      const product: IECommerceProduct = {
        id: payment1C.purchase_id,
        name: tariff ? tariff.adminTitle : 'Тариф',
        category: 'Термальные источники',
        price: payment1C.amount / payment1C.count,
        quantity: 1
      }
      products.value.push(product)
    }
  })

  const actionField: IECommerceActionField = {
    id: payment_info.uid
  }

  const purchase: IECommercePurchase = {
    actionField: actionField,
    products: products.value,
  }

  eCommerce.addPurchase(purchase);
};

const clickPaymentLink = () => {
  paymentUrl.value = undefined;
};

</script>

<template>
  <!-- <div class="min-w-80 w-80 mx-auto bg-white rounded-xl shadow-md border overflow-hidden p-6 pb-8"> -->
  <div
    id="cart"
    :class="presets.root.class"
    v-if="groupOrdersStore.ordersByDate.length"
  >
    <div
      class="mb-6"
      v-for="orderGroupByDate in groupOrdersStore.ordersByDate"
      :key="orderGroupByDate.dayNumber + orderGroupByDate.monthNumber"
    >
      <div class="mb-2">
        <span :class="presets.boldText.class">Дата посещения: </span>
        <span :class="presets.text.class">{{ orderGroupByDate.dateString }}</span>
      </div>

      <div
        :class="presets.wrapOrder.class"
        v-for="orderByTariff in orderGroupByDate.ordersByTariff"
        :key="orderByTariff.date + orderByTariff.time"
      >
        <div>
          <span :class="presets.boldText.class">Посещение: </span>
          <span :class="presets.text.class">{{ orderByTariff.time }}</span>
        </div>
        <div>
          <span :class="presets.boldText.class">Взрослых: </span>
          <span :class="presets.text.class">{{ orderByTariff.getCountAdults() }}</span>
        </div>
        <div v-if="orderByTariff.getCountChildren()">
          <span :class="presets.boldText.class">Детей: </span>
          <span :class="presets.text.class">{{ orderByTariff.getCountChildren() }}</span>
        </div>
        <div>
          <span :class="presets.boldText.class">К оплате: </span>
          <span :class="presets.text.class">{{ getPriceString(orderByTariff.price) }} ₽</span>
        </div>
      </div>

    </div>

    <div class="flex flex-col gap-2 mb-6">
      <InputText
        placeholder="Введите промокод"
        v-model.trim="bookingStore.promocode"
        autofocus
      />
      <Button
      v-if="bookingStore.promocode && bookingStore.promocode.length > 2"
        label="Применить промокод"
        raised
        @click="clickApplyPromocode()"
      />
    </div>

    <div v-if="bookingStore.totalDiscount">
      <span :class="presets.boldText.class">Применена скидка: </span>
      <span :class="presets.text.class">{{ getPriceString(bookingStore.totalDiscount) }} ₽</span>
    </div>

    <div class="mb-4">
      <span :class="presets.boldText.class">Итого: </span>
      <span :class="presets.text.class">{{ getPriceString(bookingStore.totalAmount - bookingStore.totalDiscount) }} ₽</span>
    </div>

    <Button
      v-if="!paymentUrl"
      class="w-full"
      label="Оплатить"
      @click="clickBuyButton()"
      severity="secondary"
      raised
    />

    <a
      v-if="paymentUrl"
      @click="clickPaymentLink"
      class="w-full inline-flex justify-center leading-[normal] !border !border-solid !border-green px-3 py-2 gap-2 shadow-sm rounded-md !text-green
      !bg-light-green hover:bg-middle-green transition duration-200 ease-in-out cursor-pointer overflow-hidden select-none font-medium"
      :href="paymentUrl"
      target="_blank"
      ref="paymentLink"
    >
      Оплатить
    </a>

  </div>

  <login-popup
    v-if="showPopups.loginPopup"
    @hide="showPopups.loginPopup = false"
    @open-register-popup="openRegisterPopup"
    @open-forgot-pass-popup="openForgotPassPopup"
  />

  <reset-popup
    v-if="showPopups.forgotPassPopup"
    @hide="showPopups.forgotPassPopup = false"
  />

  <register-popup
    v-if="showPopups.registerPopup"
    @hide="showPopups.registerPopup = false"
  />

  <payment-popup
    v-if="bookingStore.showPaymentPopup && paymentUrl"
    @hide="bookingStore.showPaymentPopup = false"
    :url="paymentUrl"
  />
</template>