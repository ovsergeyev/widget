<script lang="ts" setup>
import { computed } from 'vue';
// import { useBookingStore } from '../store/booking';
import { useGroupOrdersStore } from '../store/groupOrders';
// import IOrderGroup from '../types/IOrderGroup';

const groupOrdersStore = useGroupOrdersStore();

const countTariffs = computed(() => {
  let count = groupOrdersStore.ordersByTariff.length
  return count.toString();
})

</script>

<template>
  <div
    class="fixed top-4 right-4 z-50"
    v-if="groupOrdersStore.ordersByTariff.length"
  >
    <Button
      v-smooth-scroll="'#cart'"
      class="text-green w-20 h-20 text-4xl bg-white hover:bg-white"
      :badge="countTariffs"
      size="large"
      icon="pi pi-shopping-cart" />
  </div>
</template>