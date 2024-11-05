<script lang="ts" setup>
import TariffCard from './TariffCard.vue';
</script>

<template>
  <div class="bg-green rounded-xl p-6 shadow-md overflow-hidden flex flex-col xl:flex-row">
    <div class="mr-12 w-full xl:max-w-64 pb-6 max-h-80 flex flex-col xl:justify-between">
      <div>
        <h3 class="text-white">Тарифы</h3>
        <div class="text-text-green text-justify">
          Текст описание Это место для всестороннего расслабления и восстановления сил, где представлены различные виды бассейнов, бань, соляная пещера, аромапарные и дополнительных устройств, таких как душ.
        </div>
      </div>

    </div>

    <div class="flex flex-wrap gap-6 lg:justify-center">
      <TariffCard />
      <TariffCard />
      <TariffCard />
      <!-- <TariffCard />
      <TariffCard />
      <TariffCard />
      <TariffCard />
      <TariffCard /> -->
    </div>

  </div>

</template>