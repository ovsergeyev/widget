<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
// import { useCatalogStore } from '@/store/catalog';
import { ref } from 'vue';
import { useTariffsStore } from '@/store/tariffs';

// const catalogStore = useCatalogStore();
const tariffsStore = useTariffsStore();
// const emits = defineEmits(['selectTariff', 'hide']);
const clickSelectTariff = () => {
  console.log('clickSelectTariff');
  // emits('selectTariff');
  // showElements.value.showSelectedTariffs = true;
  // showElements.value.showTariffs = false;
  // showElements.value.showPayBtn = true;
};
const hide = () => {
  // emits('hide');
  console.log('test');
};
const showElement = ref(true);
</script>

<template>
  <prime-dialog
    v-model:visible="showElement"
    class="tariff-popup"
    modal
    header="Выбор тарифа"
    :style="{ width: '80%' }"
    @hide="hide()"
  >
    <div class="container-fluid">
      <div class="row">
        <div
          v-for="tariff in tariffsStore.availableTariffs"
          :key="tariff.id"
          class="tariff col-6"
        >
          <div class="tariff__card">
            <div class="tariff__header">
              <!-- Тариф 2 часа 30 минут -->
              {{ tariff.title }}
            </div>
            <div class="tariff_desc">
              <div v-html="tariff.description" />
              <div>Стоимость: {{ tariff.price }}</div>
              <div>
                Стоимость со скидкой: {{ tariff.discountPrice }}
              </div>
              <div>ID: {{ tariff.id }}</div>
            </div>
            <div class="tariff__footer">
              <div class="fit-btn-2" @click="clickSelectTariff()">
                Выбрать
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </prime-dialog>
</template>

<style lang="scss" scoped>
.tariff {
  &__card {
    border-radius: 10px;
    background-color: #b8c8ba;
    box-shadow: 0px 0px 10px 0px rgba(38, 38, 38, 0.1);
    padding: 24px;
    margin-bottom: 24px;
    // cursor: pointer;
  }

  &__header {
    font-size: 22px;
    color: #262626;
    font-weight: 500;
  }

  &__footer {
    margin-top: 24px;
    display: flex;
    justify-content: end;
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
</style>
