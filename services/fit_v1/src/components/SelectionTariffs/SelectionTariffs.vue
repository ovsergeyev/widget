<script lang="ts" setup>
// import { useBookingStore } from '../../store/booking';
import { useGroupOrdersStore } from '../../store/groupOrders';
import SelectionTariff from '../SelectionTariff/SelectionTariff.vue';
import presets from './presets';

// const bookingStore = useBookingStore();
const groupOrderStore = useGroupOrdersStore();
</script>

<template>
  <div
    id="selection-tariffs"
    :class="presets.root.class"
    v-if="groupOrderStore.ordersByDate.length"
  >
    <div
      :class="presets.wrapDay.class"
      v-for="orderGroupByDate in groupOrderStore.ordersByDate"
      :key="orderGroupByDate.dayNumber + orderGroupByDate.monthNumber"
    >
      <div class="pb-6">
        <div class="flex gap-1 pr-10">
          <div class="text-text-primary text-6xl">{{ orderGroupByDate.dayNumber }}</div>
          <div class="flex flex-col justify-around">
            <div class="text-xl text-text-green">{{ orderGroupByDate.monthNumber }}</div>
            <div>{{ orderGroupByDate.weekDay }}</div>
          </div>
        </div>
      </div>

      <div class="pl-4 flex-grow">

        <div
          v-for="(orderByTariff, index) in orderGroupByDate.ordersByTariff"
          :class="[
              presets.wrapTariffs.class,
              index + 1 !== orderGroupByDate.ordersByTariff.length
              ?
              '!border-b-2 border-solid border-border'
              :
              ''

          ]"
          :key="orderByTariff.tariff.id"
        >
          <SelectionTariff
            :orderByTariff="orderByTariff"
          />
        </div>

      </div>

    </div>
  </div>
</template>