<script lang="ts" setup>
import { ref, inject } from 'vue';
import { useBookingStore } from '../../store/booking';
import { useECommerceStore } from '../../store/eCommerce';
import { useTariffsStore } from '../../store/tariffs';
import { IECommerceProduct } from '../../types/IECommerce';
import ITariff from '../../types/ITariff';
import { waitForElement } from '../../common';
import EventBus, {IEvent} from '../../utils/EventBus';

const bookingStore = useBookingStore();
const eCommerce = useECommerceStore();
const tariffStore = useTariffsStore();
const eventBus = inject('eventBus') as EventBus;

// const props = defineProps({
//   uid: {
//     type: String,
//     required: true,
//   },
// });

const showPopup = ref(true);
// const isError = ref(false);
const isConsent = ref(false);

const emits = defineEmits(['hide']);
const hide = () => {
  emits('hide');
}

// const addChildren = () => {
//   const status = bookingStore.addChildren(props.uid);
//   if (!status) {
//     isError.value = true;
//   } else {
//     hide();
//   }
// }

const addGroupTariff = () => {
  const tariff: ITariff | undefined = tariffStore.currentTariff;
  const datetime: string = tariffStore.lastDateTime;
  if(tariff && datetime){
    const event: IEvent = {
      type: 'change-cart'
    };
    eventBus.publish(event);

    bookingStore.addOrder(tariff, datetime);

    const products: IECommerceProduct[] = [];
    const product: IECommerceProduct = {
      id: tariff.id,
      category: 'Термальные источники',
      name: tariff.adminTitle,
      price: tariff.price,
      quantity: 1
    }
    products.push(product)
    eCommerce.addProducts(products);

    const dayIso = datetime.split('T')[0];
    const time = datetime.split('T')[1];
    // Отправка цели Яндекс.Метрики.
    if(typeof (window as any).sendYandexGoal === 'function'){
      (window as any).sendYandexGoal('addTariffToCart', {
        tariff: tariff.adminTitle,
        price: tariff.price,
        day: dayIso,
        time: time
      });
    }
  }
  showPopup.value = false;

  const id = "#selection-tariffs";
  const targetEl = document.querySelector(id);

  if (targetEl) {
    targetEl.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  } else {
    waitForElement(id, 500, 10000).then(() => {
      const newTargetEl = document.querySelector(id);
      if(newTargetEl){
        newTargetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  }
};

</script>

<template>
  <Dialog
    v-model:visible="showPopup"
    modal
    header="Добавление группового тарифа"
    @hide="hide()"
  >

    <p class="">
      В тариф включена стоимость детского посещения
    </p>

    <div class="flex gap-4 items-center mb-4">
      <checkbox
        v-model="isConsent"
        :binary="true"
      />
      <p class="">
        Сопровождающий является законным представителем, или имеет
        письменное согласие от законного представителя на посещение
        ребенка.
      </p>
    </div>

    <div
      class="flex justify-end"
    >
      <Button
        :disabled="!isConsent"
        label="Добавить"
        raised
        @click="addGroupTariff"
      />
    </div>

  </Dialog>
</template>