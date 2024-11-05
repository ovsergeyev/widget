<script lang="ts" setup>
// import Offer from '@/types/IOffer';
// import { useClassesStore } from '@/store/classes';
import { ref, onBeforeMount } from 'vue';
import TheCalendar from './components/TheCalendar.vue';
import ScheduleBox from './components/ScheduleBox.vue';
import TariffsBox from './components/TariffsBox.vue';
import SelectedTariffs from './components/SelectedTariffs.vue';
import CartBox from './components/CartBox.vue';
import { useConfigStore } from './store/config';

const configStore = useConfigStore();

// const $scriptElement = document.querySelector('[integration]');
interface IConfig {
  title: string
}
const clientConfig = ref<IConfig>({
  title: '',
})

onBeforeMount(async ()=>{
  const $scriptElement: HTMLElement | null = document.querySelector("#app");
  if ($scriptElement){
    const integrationCode = $scriptElement.getAttribute('integration-code');
    if(integrationCode){
      clientConfig.value = await configStore.getConfig(integrationCode);
    }
    // clientConfig = config.find((el) => {
    //   return el.clientCode === clientCode;
    // },
}
})



// const classesStore = useClassesStore();

// const showElements = ref({
//   showDayBtn: true,
//   showCalendar: true,
//   showTariffBtn: false,
//   showTariffs: false,
//   showSelectedTariffs: false,
//   showPayBtn: false,
//   showLogin: false,
//   showPassReset: false,
//   showRegister: false,
// });
</script>
<template>
  <div class="fit-container">
    <h1>{{ clientConfig.title }}</h1>
    <div class="calendar-wrap">
      <TheCalendar />
      <schedule-box />
    </div>

    <!-- <test-tariffs /> -->

    <div class="tariff-box-wrap">
      <tariffs-box />
    </div>

    <div class="selected-wrap">
      <selected-tariffs />
      <cart-box />
    </div>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  font-family: 'Open Sans';
  color: #333a2a;
  font-size: 35px;
  font-weight: 400;
  margin-bottom: 26px;
}
.fit-container {
  max-width: 1162px;
  width: 100%;
  margin: 0 auto;
}
.calendar-wrap {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin-bottom: 26px;
}
.tariff-box-wrap {
  margin-bottom: 26px;
}
.selected-wrap {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}
</style>
