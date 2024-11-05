<script lang="ts" setup>
import { ref, inject } from 'vue';
import { computed, PropType } from 'vue';
// import IOrder from '../../types/IOrder';
import AddVisitingPopup from '../Popups/AddVisitingPopup.vue';
import DelVisitingPopup from '../Popups/DelVisitingPopup.vue';
import { useBookingStore } from '../../store/booking';
import { useScheduleStore } from '../../store/schedule';
import IOffer from '../../types/IOffer';
import IOrderGroupByTariff from '../../types/IOrderGroupByTariff';
import EventBus, {IEvent} from '../../utils/EventBus';
import { getPriceString } from '../../common';

const scheduleStore = useScheduleStore();
const bookingStore = useBookingStore();
const eventBus = inject('eventBus') as EventBus;

const props = defineProps({
  orderByTariff: {
    type: Object as PropType<IOrderGroupByTariff>,
    required: true
  }
})

const showAddVisitingPopup = ref(false);
const showDelVisitingPopup = ref(false);
const clickAddVisiting = () => {
  showAddVisitingPopup.value = true;
}

const clickDelVisiting = () => {
  showDelVisitingPopup.value = true;
}

const isActiveAddButton = computed(()=>{
  let result = false;
  const offer: IOffer | undefined = scheduleStore.offers.find((el: IOffer) => el.appointmentId === props.orderByTariff.appointmentId);
  if(offer){
    if(offer.availableSlots >= 1) result = true;
  }

  return result;
});

const clickDelTariff = () => {
  bookingStore.delTariff(props.orderByTariff);
  const event: IEvent = {
    type: 'change-cart'
  };
  eventBus.publish(event);
}

</script>

<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="text-xl text-text-primary font-semibold">{{ orderByTariff.tariff.adminTitle }}</div>
      <Button
        class="flex-shrink-0 text-green"
        @click="clickDelTariff"
        icon="pi pi-trash"
        severity="primary"
        text
        outlined
        rounded
      />
    </div>
    <!-- <div class="text-lg text-text-secondary pb-4">8:00 - 12:30</div> -->

    <div class="pb-4">
      <div>
        <span class="text-text-primary font-semibold">Посещение: </span>
        <span class="text-text-secondary">{{ orderByTariff.time }}</span>
      </div>

      <div>
        <span class="text-text-primary font-semibold">Стоимость: </span>
        <span class="text-text-secondary">{{ getPriceString(orderByTariff.price) }} ₽</span>
      </div>
    </div>


    <div class="flex flex-col xl:flex-row flex-wrap gap-4 pr-4">
      <Button
        class="text-xs sm:text-base xl:w-64"
        label="Добавить посещение"
        :disabled="!isActiveAddButton"
        @click="clickAddVisiting"
        raised
      />
      <Button
        class="text-xs sm:text-base xl:w-64"
        label="Удалить посещение"
        @click="clickDelVisiting"
        raised
      />
    </div>
  </div>
  <AddVisitingPopup
    v-if="showAddVisitingPopup"
    :order-by-tariff="orderByTariff"
    @hide="showAddVisitingPopup = false"
  />
  <DelVisitingPopup
    v-if="showDelVisitingPopup"
    :order-by-tariff="orderByTariff"
    @hide="showDelVisitingPopup = false"
  />
</template>