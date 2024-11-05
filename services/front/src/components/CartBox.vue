<!-- eslint-disable linebreak-style -->
<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useBookingStore } from '@/store/booking';
import { useAuthStore } from '@/store/auth';
import IOrderGroup from '@/types/IOrderGroup';
import IOrder from '@/types/IOrder';
import LoginPopup from './LoginPopup.vue';
import RegisterPopup from './RegisterPopup.vue';
import ResetPopup from './ResetPopup.vue';

const authStore = useAuthStore();

const showPopups = ref({
  loginPopup: false,
  registerPopup: false,
  forgotPassPopup: false,
});

const openRegisterPopup = () => {
  showPopups.value.loginPopup = false;
  showPopups.value.registerPopup = true;
};

const openForgotPassPopup = () => {
  showPopups.value.loginPopup = false;
  showPopups.value.forgotPassPopup = true;
};

const totalAmount = (orderGroups: IOrderGroup[]) => {
  let amount = 0;
  orderGroups.forEach((orderGroup: IOrderGroup) => {
    orderGroup.orders.forEach((order: IOrder) => {
      amount += order.price;
    });
  });
  return amount - bookingStore.total_discount;
};

const countQuestString = (order: IOrder) => {
  const count = order.adults + order.children;
  let result;
  if (count % 10 === 1 && count % 100 !== 11) {
    result = `${count} гость`;
  } else if (
    count % 10 >= 2 &&
    count % 10 <= 4 &&
    (count % 100 < 10 || count % 100 >= 20)
  ) {
    result = `${count} гостя`;
  } else {
    result = `${count} гостей`;
  }
  return result;
};

const clickApplyPromocode = async () => {
  await bookingStore.updateCost();
};

const clickBuyButton = async() => {
  if(!authStore.userToken){
    const userToken = localStorage.getItem('user_token');
    if(userToken){
      authStore.setUserToken(userToken);
    } else {
      showPopups.value.loginPopup = true;
    }
  }
  await authStore.waitForSetUserToken();
  console.log('Токен установлен');

  const payment_info = await bookingStore.payment();

  console.log('payment_info', payment_info);
  dataLayer.push(payment_info);
}

const bookingStore = useBookingStore();
</script>
<template>
  <div
    v-if="
      bookingStore.orderGroups.length
    "
    class="cart-box"
  >
    <div
      v-for="orderGroup in bookingStore.orderGroups"
      :key="orderGroup.dayNumber + orderGroup.monthNumber"
      class="cart-box__group"
    >
      <div class="cart-box__title">
        <span>Дата посещения: </span>{{ orderGroup.dateString }}
      </div>
      <div
        v-for="order in orderGroup.orders"
        :key="order.date + order.time"
        class="cart-box__session"
      >
        <div class="cart-box__line">
          <span>Сеанс: </span>{{ order.time }}
        </div>
        <div class="cart-box__line">
          <span>Гостей: </span>{{ countQuestString(order) }}
        </div>
        <div class="cart-box__line">
          <span>К оплате: </span>{{ order.price }} ₽
        </div>
      </div>
    </div>

    <div v-if="bookingStore.total_discount" class="cart-box__discount">
      <span class="font-semibold">Применена скидка: </span>
      <span class="cart-box__discount-amount">
        {{ bookingStore.total_discount }} ₽
      </span>
    </div>

    <div class="cart-box__price">
      <span>Итого: </span
      >{{ totalAmount(bookingStore.orderGroups) }} ₽
    </div>

    <div class="cart-box__promocode">
      <div class="field">
        <label for="account_id" class="font-semibold">Промокод:</label>
        <InputText
          id="account_id"
          v-model.trim="bookingStore.promocode"
          required="true"
          autofocus
          class="w-full mb-3"
        />
        <div
          class="cart-box__btn"
          v-if="bookingStore.promocode && bookingStore.promocode.length > 3"
          @click="clickApplyPromocode()"
        >
          Применить промокод
        </div>
      </div>
    </div>

    <div class="cart-box__footer">
      <div
        class="cart-box__btn"
        @click="clickBuyButton()"
      >
        Оплатить
      </div>
    </div>
  </div>
  <login-popup
    v-if="showPopups.loginPopup"
    @hide="showPopups.loginPopup = false"
    @open-register-popup="openRegisterPopup"
    @open-forgot-pass-popup="openForgotPassPopup"
  />
  <register-popup
    v-if="showPopups.registerPopup"
    @hide="showPopups.registerPopup = false"
  />
  <reset-popup
    v-if="showPopups.forgotPassPopup"
    @hide="showPopups.forgotPassPopup = false"
  />
</template>

<style lang="scss" scoped>
.cart-box {
  border: 1px solid #cbcbcb;
  border-radius: 34px;
  font-family: 'Open Sans';
  width: 393px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px 38px;

  &__group {
    width: 100%;
    margin-bottom: 0px;
  }

  &__session {
    border: 1px solid #cbcbcb;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 12px;
  }

  &__title {
    color: #898989;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 12px;
    & span {
      font-weight: 600;
      color: #333a2a;
    }
  }

  &__promocode {
    width: 100%;
    margin-bottom: 18px;
    & span {
      font-weight: 600;
      color: #333a2a;
    }
  }

  &__discount {
    width: 100%;
    margin-bottom: 18px;
    & &-amount{
      // font-weight: 600;
      color: #898989;
    }
  }

  &__price {
    width: 100%;
    color: #898989;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 16px;
    & span {
      font-weight: 600;
      color: #333a2a;
    }
  }

  &__line {
    color: #898989;
    font-size: 16px;
    font-weight: 400;
    & span {
      font-weight: 600;
      color: #333a2a;
    }
  }

  &__footer {
    // margin-top: 24px;
    width: 100%;
  }
  // height: auto;
  &__btn {
    // width: 100%;
    // height: 49px;
    // line-height: 49px;
    // border-radius: 110px;
    // text-align: center;
    // background-color: #5D694E;
    border: 1px solid #b8c9b9;
    height: 49px;
    line-height: 49px;
    border-radius: 110px;
    text-align: center;
    // color: #F5F5F5;
    cursor: pointer;
    transition-duration: 0.2s;
    &:hover {
      background-color: #f5f5f5;
      color: #5d694e;
    }
  }
}
</style>
