<script lang="ts" setup>
import ScheduleBox from '../components/ScheduleBox.vue';
import Calendar from '../components/Calendar.vue';
import ChoosingTariff from '../components/ChoosingTariff.vue';
import SelectionTariffs from '../components/SelectionTariffs.vue';
import Cart from '../components/Cart.vue';
</script>

<template>
  <div class="relative">
    <div class="container lg:flex gap-8 mb-8">
      <Calendar class="mb-8" />
      <ScheduleBox />
    </div>

    <div class="container mb-8">
      <ChoosingTariff />
    </div>

    <div class="container mb-8 flex flex-col lg:flex-row gap-8">
      <SelectionTariffs class="self-start" />
      <Cart class="self-start" />
    </div>

    <div class="fixed bottom-4 right-4">
      <Button class="text-green w-20 h-20 text-4xl bg-white hover:bg-white" badge="2" size="large" icon="pi pi-shopping-cart" />
    </div>
  </div>

</template>