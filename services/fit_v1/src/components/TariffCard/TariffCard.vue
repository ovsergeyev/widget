<script lang="ts" setup>
import { computed, PropType, inject } from 'vue';
import ITariff from '../../types/ITariff';
import { useCommonStore } from '../../store/common';
import { useBookingStore } from '../../store/booking';
import { useECommerceStore } from '../../store/eCommerce';
import { useScheduleStore } from '../../store/schedule';
import { useTariffsStore } from '../../store/tariffs';
import presets from './presets';
import { waitForElement } from '../../common';
import { IECommerceProduct } from '../../types/IECommerce';
import IOffer from '../../types/IOffer';
import EventBus, {IEvent} from '../../utils/EventBus';
import { getPriceString } from '../../common';

const bookingStore = useBookingStore();
const commonStore = useCommonStore();
const eCommerce = useECommerceStore();
const scheduleStore = useScheduleStore();
const tariffsStore = useTariffsStore();
const eventBus = inject('eventBus') as EventBus;

const props = defineProps({
  tariff: {
    type: Object as PropType<ITariff>,
    required: true
  }
})

const isActive = computed<boolean>(()=>{
  let result = false;
  const currentAppointmentId = commonStore.currentAppointmentId;
  const offer = scheduleStore.offers.find((el: IOffer) => el.appointmentId === currentAppointmentId);
  if(offer){
    const availableSlots = offer.availableSlots;
    if(availableSlots >= (props.tariff.countAdults + props.tariff.countChildren)){
      result = true;
    }
  }

  // result = false;
  return result;
});

const emits = defineEmits([
  'click-info'
]);

const clickInfo = () => {
  emits('click-info');
};

const clickAddButton = (tariff: ITariff) => {
  if(!isActive.value) return
  // console.log('isActive', isActive.value);
  tariffsStore.currentTariff = tariff;

  if(tariff.type === "group" && tariff.countChildren){
    bookingStore.showAddGroupTariffWithChildrenPopup = true;
  } else {
    bookingStore.addOrder(tariff, tariffsStore.lastDateTime);

    const event: IEvent = {
      type: 'change-cart'
    };
    eventBus.publish(event);

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

    const dayIso = tariffsStore.lastDateTime.split('T')[0];
    const time = tariffsStore.lastDateTime.split('T')[1];
    // Отправка цели Яндекс.Метрики.
    if(typeof (window as any).sendYandexGoal === 'function'){
      (window as any).sendYandexGoal('addTariffToCart', {
        tariff: tariff.adminTitle,
        price: tariff.price,
        day: dayIso,
        time: time
      });
    }

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
  }

};
</script>

<template>
  <div :class="[...presets.root.class, !isActive ? '!cursor-auto': '']" @click.stop="clickAddButton(tariff)">
    <div>
      <div :class="presets.header.class">
        <h4 :class="presets.title.class">{{ tariff.adminTitle ? tariff.adminTitle : tariff.title }}</h4>
        <div v-if="isActive" class="font-semibold text-text-primary">
          Стоимость: {{ getPriceString(tariff.price) }} ₽
        </div>
        <div v-if="!isActive" class="text-orange-900 font-semibold">
          Мест нет
        </div>
      </div>
      <!-- :class="!isActive ? 'mt-4': ''" -->
      <div
        class="text-text-primary mt-4"
        v-html="tariff.adminDescription ? tariff.adminDescription : tariff.availableTime "
      />
    </div>

    <div :class="presets.footer.class">
      <Button
        v-if="isActive"
        @click.stop="clickAddButton(tariff)"
        :class="presets.button.class"
        icon="pi pi-plus"
        severity="secondary"
        outlined
        rounded
      />
      <span :class="presets.link.class" @click.stop="clickInfo">Подробнее</span>
    </div>
  </div>
</template>