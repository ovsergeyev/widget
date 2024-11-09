<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Tag from '../Tag/Tag.vue';
import { useScheduleStore } from '../../store/schedule';
import { useConfigStore } from '../../store/config';
import { useECommerceStore } from '../../store/eCommerce';
import { useTariffsStore } from '../../store/tariffs';
import { useCommonStore } from '../../store/common';
import presets from './presets';
import { waitForElement, getWordWithCaseByNumber } from '../../common';

import { IECommerceProduct } from '../../types/IECommerce';
import IOffer from '../../types/IOffer';
import ITariff from '../../types/ITariff';

const commonStore = useCommonStore();
const configStore = useConfigStore();
const eCommerceStore = useECommerceStore();
const scheduleStore = useScheduleStore();
const tariffsStore = useTariffsStore();
const showSeats = ref<boolean>(false);

onMounted(()=>{
  const url = new URL(window.location.href);
  const query = url.searchParams;

  if(query.has('seats')){
    showSeats.value = true;
  }
});

const getOffers = (startTime: string, endTime: string) => {
  const allOffers: Array<IOffer> = scheduleStore.schedule.offers;
  const result: Array<IOffer> = allOffers.filter((offer) => {
    if(
      offer.startTime
      >=
      startTime
      &&
      offer.startTime
      <
      endTime
    ) {
      return true;
    } else {
      return false;
    }
  });
  return result;
};

const clickTime = async (offer: IOffer) => {
  if (!offer.isActive || !offer.availableSlots) return;
  commonStore.currentAppointmentId = offer.appointmentId;
  await tariffsStore.setAvailableTariffs(
    `${offer.startDate}T${offer.startTime}`,
  );

  const impressions: IECommerceProduct[] = [];
  let position = 0;
  tariffsStore.availableTariffs.forEach((tariff: ITariff) => {
    position += 1;
    const product: IECommerceProduct = {
      id: tariff.id,
      name: tariff.adminTitle,
      category: 'Термальные источники',
      price: tariff.price,
      position: position
    }
    impressions.push(product);
  })
  eCommerceStore.addImpressions(impressions);

  const id = "#choosing-tariff";
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

  // Отправка цели Яндекс.Метрики
  (window as any).sendYandexGoal('timeClicked', { time: offer.startTime });
  // showElements.value.showTariffBtn = true;
  // bookingStore.selectedTime = offer.startTime;
};

const getTooltipText = (offer: IOffer) => {
  let result = '';
  if(!offer.isActive && !showSeats.value){
    result = "Занятие уже прошло"
  }
  if(((!offer.isActive && showSeats.value) || offer.isActive) && offer.availableSlots !== 0){
    if(showSeats.value){
      const word = getWordWithCaseByNumber(['место', 'места', 'мест'], offer.availableSlots);
      result = `Осталось ${offer.availableSlots} ${word}`;
    }
  }
  if(offer.isActive && offer.availableSlots === 0){
    // result = `Мест нет`
    result = ''
  }
  return result;
}

</script>

<template>
  <div :class="presets.root.class">
    <div
      v-if="scheduleStore.loading"
      class="w-full h-full absolute right-0 flex items-center justify-center z-10"
    >
      <i class="text-middle-green pi pi-spin pi-spinner" style="font-size: 6rem"></i>
      <!-- <i class="pi pi-spin pi-cog" style="font-size: 2rem"></i> -->
    </div>
    <div :class="presets.inner.class">
      <div :class="presets.date.class">
        <div class="flex gap-1 pr-10">
          <div class="text-text-primary text-6xl">
            {{ scheduleStore.schedule.dayNumber }}
          </div>
          <div class="flex flex-col justify-around">
            <div class="text-xl text-text-green">
              {{ scheduleStore.schedule.monthNumber }}
            </div>
            <div>
              {{ scheduleStore.schedule.weekDay }}
            </div>
          </div>
        </div>

      </div>

      <div
        class="flex-grow"
      >
        <div
          :class="presets.wrapSchedule.class"
          v-for="(segment, index) in configStore.config.schedule_segments"
          :key="segment.id"
        >
          <div :class="presets.title.class">{{ segment.title }}</div>
          <div :class="presets.subTitle.class">
            {{ segment.start_time }} - {{ segment.end_time }}
          </div>
          <div
            :class="[
              presets.wrapTags.class,
              index + 1 === configStore.config.schedule_segments.length
              ?
              '!border-b-0 !pb-0'
              :
              ''
            ]"
          >
            <Tag
              v-for="offer in getOffers(segment.start_time, segment.end_time)"
              :key="offer.startDate + offer.startTime"
              :is-active="!!offer.isActive && !!offer.availableSlots"
              @click="clickTime(offer)"
              :tooltip-text="getTooltipText(offer)"
            >
              {{ offer.startTime }}
            </Tag>
          </div>
        </div>

        <!-- <div class="pb-6">
          <div class="text-xl font-semibold">Утро</div>
          <div class="text-lg text-text-secondary pb-4">8:00 - 12:30</div>
          <div class="flex flex-wrap gap-3 pb-12 border-b-2 border-gray-border">
            <div class="bg-grey-background text-text-secondary text-sm font-semibold py-1 px-4 rounded-lg">
              8:00 - 10:30
            </div>
            <div class="bg-grey-background text-text-secondary text-sm font-semibold py-1 px-4 rounded-lg">
              8:00 - 10:30
            </div>
            <div class="bg-grey-background text-text-secondary text-sm font-semibold py-1 px-4 rounded-lg">
              8:00 - 10:30
            </div>
            <div class="bg-grey-background text-text-secondary text-sm font-semibold py-1 px-4 rounded-lg">
              8:00 - 10:30
            </div>
            <div class="bg-grey-background text-text-secondary text-sm font-semibold py-1 px-4 rounded-lg">
              8:00 - 10:30
            </div>
            <div class="bg-grey-background text-text-secondary text-sm font-semibold py-1 px-4 rounded-lg">
              8:00 - 10:30
            </div>
          </div>
        </div>
        <div>
          <div class="text-xl font-semibold">Утро</div>
          <div class="text-lg text-text-secondary pb-4">8:00 - 12:30</div>
          <div class="flex flex-wrap gap-3">
            <div class="bg-grey-background text-text-secondary text-sm font-semibold py-1 px-4 rounded-lg">
              8:00 - 10:30
            </div>
            <div class="bg-grey-background text-text-secondary text-sm font-semibold py-1 px-4 rounded-lg">
              8:00 - 10:30
            </div>
            <div class="bg-grey-background text-text-secondary text-sm font-semibold py-1 px-4 rounded-lg">
              8:00 - 10:30
            </div>
            <div class="bg-grey-background text-text-secondary text-sm font-semibold py-1 px-4 rounded-lg">
              8:00 - 10:30
            </div>
            <div class="bg-grey-background text-text-secondary text-sm font-semibold py-1 px-4 rounded-lg">
              8:00 - 10:30
            </div>
            <div class="bg-grey-background text-text-secondary text-sm font-semibold py-1 px-4 rounded-lg">
              8:00 - 10:30
            </div>
          </div>
        </div> -->

      </div>
    </div>
  </div>
</template>