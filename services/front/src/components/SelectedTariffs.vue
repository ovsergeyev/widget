<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<!-- eslint-disable linebreak-style -->
<script lang="ts" setup>
import { ref } from 'vue';
import { useBookingStore } from '@/store/booking';
import AddChildrenPopup from '@/components/AddChildrenPopup.vue';

const bookingStore = useBookingStore();
const showChildrenPopup = ref(false);

const uidForChildrenPopup = ref('');

const addChildren = (uid: string) => {
  showChildrenPopup.value = true;
  uidForChildrenPopup.value = uid;
};
const delChildren = (uid: string) => {
  bookingStore.delChildren(uid);
};
</script>
<template>
  <div v-if="bookingStore.orderGroups.length" class="selected-tariff">
    <div
      v-for="orderGroup in bookingStore.orderGroups"
      :key="orderGroup.dayNumber + orderGroup.monthNumber"
      class="selected-tariff__inner"
    >
      <div class="selected-tariff__left">
        <div class="selected-tariff__date">
          <div class="selected-tariff__day">
            {{ orderGroup.dayNumber }}
          </div>
          <div class="selected-tariff__date-inner">
            <div class="selected-tariff__month">
              {{ orderGroup.monthNumber }}
            </div>
            <div class="selected-tariff__week-day">
              {{ orderGroup.weekDay }}
            </div>
          </div>
        </div>
      </div>
      <div class="selected-tariff__right">
        <div
          v-for="order in orderGroup.orders"
          :key="order.tariffId"
          class="selected-tariff__card"
        >
          <div class="selected-tariff__title">
            {{ order.title }}
          </div>
          <div class="selected-tariff__text">
            <span>Посещение:</span> {{ order.time }}
          </div>
          <div class="selected-tariff__text">
            <span>Стоимость:</span> {{ order.price }} ₽
          </div>
          <div class="selected-tariff__buttons">
            <div
              v-if="order.children < 2 && order.adults === 1"
              class="selected-tariff__button"
              @click="addChildren(order.uid)"
            >
              Добавить детский тариф
            </div>
            <div
              v-if="order.children < 4 && order.adults === 2"
              class="selected-tariff__button"
              @click="addChildren(order.uid)"
            >
              Добавить детский тариф
            </div>
            <div
              v-if="
                (order.children && order.adults === 1)
                ||
                (order.children > 1 && order.adults > 1)
              "
              class="selected-tariff__button"
              @click="delChildren(order.uid)"
            >
              Удалить детский тариф
            </div>
          </div>
          <div
            class="selected-tariff__delete"
            @click="bookingStore.delTariff(order.uid)"
          >
            <img src="@/assets/trash.png" alt="Удалить тариф" />
          </div>
          <!-- <div class="selected-tariff__wrap-time">
            <div class="selected-tariff__time not-active">8:00 - 10-30</div>
            <div class="selected-tariff__time">9:00 - 11-30</div>
            <div class="selected-tariff__time">10:00 - 12-30</div>
            <div class="selected-tariff__time">8:00 - 10-30</div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
  <add-children-popup
    v-if="showChildrenPopup"
    :uid="uidForChildrenPopup"
    @hide="showChildrenPopup = false"
  />
</template>

<style lang="scss" scoped>
.selected-tariff {
  max-width: 747px;
  width: 100%;
  border: 1px solid #cbcbcb;
  border-radius: 34px;
  font-family: 'Open Sans';
  &__inner {
    display: flex;
    justify-content: flex-start;
    padding-left: 38px;
    width: 100%;
  }
  &__left {
    width: 200px;
    padding-top: 24px;
  }
  &__right {
    width: 100%;
    padding-right: 24px;
  }
  // &__right {
  //   // width: 100%;
  //   // margin-right: 1px;
  // }
  &__date {
    display: flex;
    // border: 1px solid red;
    // height: 68px;
  }
  &__date-inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // border: 1px solid green;
    margin: 8px 0 2px 6px;
  }
  &__day {
    color: #333a2a;
    font-size: 68px;
    line-height: 68px;
    font-weight: 400;
  }
  &__month {
    color: #b8c9b9;
    font-size: 19px;
    font-weight: 400;
    line-height: 19px;
    height: 50%;
  }
  &__week-day {
    color: #333a2a;
    font-size: 19px;
  }
  &__card {
    padding-top: 24px;
    padding-bottom: 46px;
    position: relative;
    &:not(:last-of-type) {
      border-bottom: 1px solid #cbcbcb;
    }
  }
  &__title {
    color: #333a2a;
    font-weight: 600;
    font-size: 19px;
    margin-bottom: 12px;
  }
  &__text {
    color: #898989;
    font-size: 16px;
    font-weight: 400;
    & span {
      font-weight: 600;
      color: #333a2a;
    }
  }
  &__wrap-time {
    display: flex;
    justify-content: start;
    gap: 14px;
  }
  &__time {
    width: 100px;
    height: 29px;
    background-color: #f2f2f2;
    border-radius: 7px;
    text-align: center;
    line-height: 29px;
    font-size: 12px;
    font-weight: 600;
    transition-duration: 0.15s;
    cursor: pointer;
    &:hover {
      background-color: #bbc7b9;
    }
    &.not-active {
      color: #898989;
      cursor: default;
    }
  }
  &__button {
    display: inline-block;
    padding: 0 15px;
    margin-top: 10px;
    margin-right: 10px;
    // background-color: #F5F5F5;
    border: 1px solid #b8c9b9;
    height: 32px;
    line-height: 32px;
    border-radius: 110px;
    text-align: center;
    color: #5d694e;
    cursor: pointer;
    user-select: none;
    transition-duration: 0.2s;
    &:hover {
      background-color: #f5f5f5;
      color: #5d694e;
    }
  }
  &__delete {
    position: absolute;
    top: 20px;
    right: 0;
    cursor: pointer;
    & img {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
