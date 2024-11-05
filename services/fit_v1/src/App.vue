<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, provide } from 'vue';
import AddGroupTariffWithChildrenPopup from './components/Popups/AddGroupTariffWithChildrenPopup.vue';
import Calendar from './components/Calendar.vue';
import ScheduleBox from './components/ScheduleBox/ScheduleBox.vue';
import ChoosingTariff from './components/ChoosingTariff/ChoosingTariff.vue';
import SelectionTariffs from './components/SelectionTariffs/SelectionTariffs.vue';
import SuccessPaymentPopup from './components/Popups/SuccessPaymentPopup.vue';
import Cart from './components/Cart/Cart.vue';
import CartButton from './components/CartButton.vue';
import { useCommonStore } from './store/common';
import { useConfigStore } from './store/config';
import { useBookingStore } from './store/booking';
import EventBus from './utils/EventBus';

// TODO занятие мест для тестирования
// import { useScheduleStore } from './store/schedule';
// import ITakePlace from './types/ITakePlace';
// const scheduleStore = useScheduleStore();
// const takePlace: ITakePlace = {
//   appointmentId: "4cba9abd-8d13-4572-a6c2-a9f6e7b74d58",
//   isUnlimited: false,
//   count: 56
// };
// scheduleStore.takeSeat(takePlace);

const commonStore = useCommonStore();
const configStore = useConfigStore();
const bookingStore = useBookingStore();
const mode = ref('base');

const eventBus = new EventBus();
provide('eventBus', eventBus);

interface IConfig {
  title: string
}
const clientConfig = ref<IConfig>({
  title: '',
})

const initYandexMetrica = (metricaCode: number) => {
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  ym(metricaCode, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true,
      ecommerce:"dataLayer"
  });

  // Добавляем глобальный метод для отправки целей
  (window as any).sendYandexGoal = (goal: string, params?: object) => {
    if (metricaCode) {
      ym(metricaCode, 'reachGoal', goal, params);
    }
  };
}

onMounted(()=>{
  // (window as any).dataLayer = []

  const userAgent = window.navigator.userAgent.toLowerCase();
  commonStore.isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
})

onBeforeMount(async ()=>{
  const $scriptElement: HTMLElement | null = document.querySelector("#app");
  if ($scriptElement){
    const integrationCode = $scriptElement.getAttribute('integration-code');
    if(integrationCode){
      clientConfig.value = await configStore.getConfig(integrationCode);
        if(configStore.config.metrica_code){
          initYandexMetrica(+configStore.config.metrica_code);
        }
    }
    const modeAttribute = $scriptElement.getAttribute('mode');
    if(modeAttribute){
      mode.value = modeAttribute;
      // if(mode.value === 'success_popup'){
      //   bookingStore.showMessageAfterPayment = true;
      // }
    }
    // clientConfig = config.find((el) => {
    //   return el.clientCode === clientCode;
    // },
  }

  const url = new URL(window.location.href);
  const query = url.searchParams;

  if(query.has('successful_payment')){
    bookingStore.showMessageAfterPayment = true;

    query.delete('successful_payment');
    url.search = query.toString();
    window.history.replaceState({}, '', url.toString());
  }
  if(query.has('logout')){
    localStorage.removeItem('user_token');

    query.delete('logout');
    url.search = query.toString();
    window.history.replaceState({}, '', url.toString());
  }

});

</script>

<template>
    <div v-if="mode === 'base'" class="relative">
      <div class="container">
        <h1 class="text-3xl md:text-4xl">{{ clientConfig.title }}</h1>
      </div>
      <div class="container lg:flex gap-8 mb-8">
        <Calendar class="mb-8" />
        <ScheduleBox />
      </div>

      <div class="container mb-8">
        <ChoosingTariff />
      </div>

      <div class="container mb-8 flex flex-col lg:flex-row gap-8">
        <SelectionTariffs class="self-start" />
        <Cart />
      </div>

      <CartButton />
    </div>

    <Toast />
    <AddGroupTariffWithChildrenPopup
      v-if="bookingStore.showAddGroupTariffWithChildrenPopup"
      @hide="bookingStore.showAddGroupTariffWithChildrenPopup = false"
    />
    <SuccessPaymentPopup />
</template>
