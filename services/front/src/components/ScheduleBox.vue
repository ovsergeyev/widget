<script lang="ts" setup>
import { useScheduleStore } from '@/store/schedule';
import { useTariffsStore } from '@/store/tariffs';
import { useConfigStore } from '@/store/config';
import IOffer from '@/types/IOffer';

const configStore = useConfigStore();
const scheduleStore = useScheduleStore();
const tariffsStore = useTariffsStore();

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

const clickTime = (offer: IOffer) => {
  //TODO
  // if (!offer.isActive) return;
  console.log('offer', offer);
  tariffsStore.setAvailableTariffs(
    `${offer.startDate}T${offer.startTime}`,
  );
  // showElements.value.showTariffBtn = true;
  // bookingStore.selectedTime = offer.startTime;
};
</script>
<template>
  <div v-if="scheduleStore.schedule" class="schedule">
    <div class="schedule__left">
      <div class="schedule__date">
        <div class="schedule__day">
          {{ scheduleStore.schedule.dayNumber }}
        </div>
        <div class="schedule__date-inner">
          <div class="schedule__month">
            {{ scheduleStore.schedule.monthNumber }}
          </div>
          <div class="schedule__week-day">
            {{ scheduleStore.schedule.weekDay }}
          </div>
        </div>
      </div>
    </div>
    <div class="schedule__right">
      <div
        v-for="segment in configStore.config.schedule_segments"
        :key="segment.id"
        class="schedule__card"
      >
        <div class="schedule__title">{{ segment.title }}</div>
        <div class="schedule__range">
          {{ segment.start_time }} - {{ segment.end_time }}
        </div>
        <div class="schedule__wrap-time">
          <div
            v-for="offer in getOffers(segment.start_time, segment.end_time)"
            :key="offer.startDate + offer.startTime"
            class="schedule__time"
            :class="{
              'not-active': !offer.availableSlots || !offer.isActive,
            }"
            @click="clickTime(offer)"
          >
            {{ offer.startTime }} - {{ offer.endTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.schedule {
  max-width: 747px;
  width: 100%;
  border: 1px solid #cbcbcb;
  border-radius: 34px;
  display: flex;
  font-family: 'Open Sans';
  justify-content: flex-start;
  padding-left: 38px;
  &__left {
    width: 200px;
    padding-top: 24px;
  }
  &__right {
    flex-grow: 1;
  //   // width: 100%;
  //   // margin-right: 1px;
  }
  &__date {
    display: flex;
    // border: 1px solid red;
    // height: 68px;
  }
  &__date-inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // border: 1px solid green;
    margin: 8px 0 2px 6px;
  }
  &__day {
    color: #333a2a;
    font-size: 68px;
    line-height: 68px;
    font-weight: 400;
  }
  &__month {
    color: #b8c9b9;
    font-size: 19px;
    font-weight: 400;
    line-height: 19px;
    height: 50%;
  }
  &__week-day {
    color: #333a2a;
    font-size: 19px;
  }
  &__card {
    padding-top: 24px;
    padding-bottom: 46px;
    max-width: 442px;
    &:not(:last-of-type) {
      border-bottom: 1px solid #cbcbcb;
    }
  }
  &__title {
    color: #333a2a;
    font-weight: 600;
    font-size: 19px;
  }
  &__range {
    color: #898989;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 14px;
  }
  &__wrap-time {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    gap: 14px;
  }
  &__time {
    width: 100px;
    height: 29px;
    background-color: #f2f2f2;
    border-radius: 7px;
    text-align: center;
    line-height: 29px;
    font-size: 12px;
    font-weight: 600;
    transition-duration: 0.15s;
    cursor: pointer;
    &:hover {
      background-color: #bbc7b9;
    }
    &.not-active {
      color: #898989;
      cursor: default;
      background-color: #f2f2f2;
    }
  }
}
</style>
