<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<script lang="ts" setup>
import { ref } from 'vue';
// import { defineComponent } from 'vue';
// import HelloWorld from './components/HelloWorld.vue';
import Offer from '@/types/IOffer';
// import FitnesService from '@/services/FitnesService';
import { useClassesStore } from '@/store/classes';
import { useCatalogStore } from '@/store/catalog';
// import { useBookingStore } from './store/booking';
// import TheCalendar from './components/TheCalendar.vue';
// import TariffsPopup from './components/TariffsPopup.vue';
import LoginPopup from './components/LoginPopup.vue';
import ResetPopup from './components/ResetPopup.vue';
import RegisterPopup from './components/RegisterPopup.vue';

const classesStore = useClassesStore();
const catalogStore = useCatalogStore();
// const bookingStore = useBookingStore();

const showElements = ref({
  showDayBtn: true,
  showCalendar: false,
  showTariffBtn: false,
  showTariffs: false,
  showSelectedTariffs: false,
  showPayBtn: false,
  showLogin: false,
  showPassReset: false,
  showRegister: false,
});

const clickShowDayBtn = () => {
  showElements.value.showCalendar = true;
  showElements.value.showDayBtn = false;
};

// const clickTime = (offer: Offer) => {
//   if (!offer.isActive) return;
//   console.log('offer', offer);
//   showElements.value.showTariffBtn = true;
//   bookingStore.selectedTime = offer.startTime;
// };

const selectTariff = () => {
  showElements.value.showSelectedTariffs = true;
  showElements.value.showTariffs = false;
  showElements.value.showPayBtn = true;
};

const clickTariffBtn = async () => {
  await catalogStore.getTariffs();
  showElements.value.showTariffs = true;
  showElements.value.showTariffBtn = false;
};

const clickGoToPay = () => {
  showElements.value.showLogin = true;
};

const openForgotPassPopup = () => {
  showElements.value.showLogin = false;
  showElements.value.showPassReset = true;
};

const openRegisterPopup = () => {
  showElements.value.showLogin = false;
  showElements.value.showRegister = true;
};

// name: 'App';
// components: {
//   TheCalendar,
// };

// export default defineComponent({
//   name: 'App',
//   components: {
//     TheCalendar,
//   },
// });
</script>

<template>
  <div class="container">
    <h1>Оформление посещения в термальную зону</h1>
    <div class="row">
      <div v-if="showElements.showDayBtn" class="col-3">
        <button class="fit-btn" @click="clickShowDayBtn()">
          Выбрать день и сеанс
        </button>
      </div>
      <div class="col-9">
        <div v-if="showElements.showCalendar" class="session">
          <!-- <TheCalendar /> -->
          <div class="session__cards">
            <div
              v-for="offer in classesStore.schedule"
              :key="offer.startDate + offer.startTime"
              class="session__card"
            >
              <div
                class="session__box"
                :class="{
                  'not-active':
                    !offer.isActive || !offer.availableSlots,
                }"
                @click="clickTime(offer)"
              >
                {{ offer.startTime }} - {{ offer.endTime }}
              </div>
              <div
                v-if="offer.isActive && offer.availableSlots"
                class="session__label"
              >
                Свободных мест {{ offer.availableSlots }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-3">
        <div
          v-if="showElements.showTariffBtn"
          class="fit-btn"
          style="margin-bottom: 24px"
          @click="clickTariffBtn()"
        >
          Выбрать тариф
        </div>
      </div>
    </div>

    <!-- <tariffs-popup
      v-if="showElements.showTariffs"
      @selectTariff="selectTariff()"
      @hide = "showElements.showTariffs = false"
    /> -->

    <div class="row">
      <div class="col-9">
        <div
          v-if="showElements.showSelectedTariffs"
          class="selected-tariffs"
        >
          <div class="selected-tariffs__tariff">
            <span class="fit-bold">Тариф:</span> Будние 2 ч 30 мин
            (онлайн) - 2900 ₽
          </div>

          <div class="selected-tariffs__buttons">
            <div class="fit-btn-2">Добавить еще</div>
            <div class="fit-btn-2">Добавить детский тариф</div>
          </div>

          <div class="promocode">
            <div>Промокод</div>
            <label for="promofield">
              <input id="promofield" type="text" />
            </label>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div
          v-if="showElements.showSelectedTariffs"
          class="order-info"
        >
          <div><span class="fit-bold">Итого:</span> 2 гостей</div>
          <div>
            <span class="fit-bold">Дата посещения:</span>
            {{ bookingStore.selectedDay }}
          </div>
          <div>
            <span class="fit-bold">Сеанс:</span>
            {{ bookingStore.selectedTime }}
          </div>
          <div><span class="fit-bold">К оплате:</span> 2 900 ₽</div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-3">
        <div
          v-if="showElements.showPayBtn"
          class="fit-btn"
          @click="clickGoToPay()"
        >
          Перейти к оплате
        </div>
      </div>
    </div>

    <login-popup
      v-if="showElements.showLogin"
      @hide="showElements.showLogin = false"
      @open-forgot-pass-popup="openForgotPassPopup"
      @open-register-popup="openRegisterPopup"
    />

    <reset-popup
      v-if="showElements.showPassReset"
      @hide="showElements.showPassReset = false"
    />

    <register-popup
      v-if="showElements.showRegister"
      @hide="showElements.showRegister = false"
    />
  </div>
</template>

<style scoped lang="scss">
h1 {
  margin-bottom: 24px;
}
.fit-bold {
  font-weight: 500;
}
.fit-btn {
  background-color: #b8c8ba;
  font-size: 16px;
  border: none;
  border-radius: 16px;
  color: black;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 55px;
  cursor: pointer;
  padding: 0 24px;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    border-color 0.2s ease-in-out;
  &:hover {
    color: #ffffff;
    background-color: #5d7261;
  }
}

.fit-btn-2 {
  border: none;
  display: inline-block;
  color: #ffffff;
  font-size: 16px;
  border: 1px solid b8c8ba;
  font-weight: 300;
  border-radius: 15px;
  background-color: #5d7261;
  cursor: pointer;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    border-color 0.2s ease-in-out;
  box-shadow: 0px 0px 10px 0px rgba(38, 38, 38, 0.1);
  padding: 6px 24px;
  &:hover {
    color: #262626;
    background-color: #ffffff;
  }
}

.session {
  display: flex;
  justify-content: start;
  &__cards {
    padding-left: 24px;
  }
  &__card {
    display: flex;
  }
  &__box {
    border-left: 5px solid #73db57;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
    margin-bottom: 12px;
    margin-right: 12px;
    border-radius: 5px;
    padding-left: 6px;
    width: 110px;
    cursor: pointer;
    &.not-active {
      border-left: 5px solid #ccc;
      background-color: #eee;
      cursor: auto;
    }
  }
}

.selected-tariffs {
  border-color: #b8c8ba;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
  &__tariff {
    margin-bottom: 16px;
    padding: 24px;
    border-radius: 10px;
    border: 1px solid #b8c8ba;
  }
  &__buttons .fit-btn-2 {
    margin-right: 24px;
    margin-bottom: 24px;
  }
}

.order-info {
  border-color: #b8c8ba;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  padding: 24px;
}
</style>
