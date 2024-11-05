<script lang="ts" setup>
import { ref } from 'vue';
import ITariff from '@/types/ITariff';
import { useTariffsStore } from '@/store/tariffs';
import { useBookingStore } from '@/store/booking';
import TariffPopup from './TariffPopup.vue';

const tariffsStore = useTariffsStore();
const bookingStore = useBookingStore();
tariffsStore.fetchAllTariffs();

const clickAddButton = (tariff: ITariff) => {
  bookingStore.addOrder(tariff, tariffsStore.lastDateTime);
  console.log('add tariff', tariff);
};

const showTariffPopup = ref(false);
const popupTitle = ref('');
const popupDescription = ref('');
const openAboutPopup = (tariff: ITariff) => {
  showTariffPopup.value = true;
  popupTitle.value = tariff.title;
  popupDescription.value = tariff.description;
};
</script>

<template>
  <div v-if="tariffsStore.availableTariffs.length" class="tariffs">
    <div class="tariffs__left">
      <div class="tariffs__header">
        <div class="tariffs__desc-title">Тарифы</div>
        <div class="tariffs__desc-text">
          Текст описание Это место для всестороннего расслабления и
          восстановления сил, где представлены различные виды
          бассейнов, бань, соляная пещера, аромапарные и
          дополнительных устройств, таких как душ
        </div>
      </div>
      <div class="tariffs__footer">
        <!-- <div class="tariffs__button">
          Выбрать тариф
        </div> -->
      </div>
    </div>
    <div class="tariffs__right">
      <div
        v-for="tariff in tariffsStore.availableTariffs"
        :key="tariff.id"
        class="tariffs__card"
      >
        <div class="tariffs__card-main">
          <div class="tariffs__card-title">
            {{ tariff.title }}
          </div>
          <div class="tariffs__card-desc">
            <!-- {{ tariff.id }} -->
            {{ tariff.availableTime }}
          </div>
        </div>
        <div class="tariffs__card-footer">
          <div
            class="tariffs__add-button"
            @click="clickAddButton(tariff)"
          >
            <img src="@/assets/plus.png" alt="add button" />
          </div>
          <div class="tariffs__info" @click="openAboutPopup(tariff)">
            Подробней
          </div>
        </div>
      </div>
    </div>
  </div>
  <tariff-popup
    v-if="showTariffPopup"
    :description="popupDescription"
    :title="popupTitle"
    @hide="showTariffPopup = false"
  />
</template>

<style lang="scss" scoped>
.tariffs {
  font-family: 'Open Sans';
  background-color: #5d694e;
  max-width: 1162px;
  border-radius: 34px;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  &__left {
    width: 335px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 40px;
  }
  &__right {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  &__desc-title {
    color: white;
    font-size: 35px;
    margin-bottom: 25px;
    line-height: 21px;
  }
  &__desc-text {
    font-size: 13px;
    color: #b8c9b9;
    font-weight: 400;
    // max-width: 235px;
  }
  &__card {
    width: 226px;
    height: 300px;
    background-color: #b8c9b9;
    border-radius: 21px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__card-title {
    color: #333a2a;
    font-weight: 700;
    font-size: 19px;
    line-height: 26px;
    height: 62px;
    max-width: 190px;
    margin-bottom: 24px;
  }
  &__card-footer {
    display: flex;
    justify-content: space-between;
  }
  &__add-button img {
    width: 31px;
    height: 31px;
    cursor: pointer;
    transition-duration: 0.2s;
    &:hover {
      transform: rotate(90deg);
    }
  }
  &__info {
    color: #5d694e;
    font-size: 13px;
    font-weight: 400;
    line-height: 31px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  &__button {
    border: 1px solid #b8c9b9;
    height: 49px;
    line-height: 49px;
    border-radius: 110px;
    text-align: center;
    color: #f5f5f5;
    cursor: pointer;
    transition-duration: 0.2s;
    &:hover {
      background-color: #f5f5f5;
      color: #5d694e;
    }
  }
}
// :deep(.p-carousel-next) {
//   background-color: transparent!important;
//   border-radius: 50%!important;
// }
// :deep(.p-carousel-prev) {
//   background-color: transparent!important;
//   border-radius: 50%!important;
//   margin-right: 10px;
// }
</style>
