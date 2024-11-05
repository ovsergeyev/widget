<!-- eslint-disable import/no-extraneous-dependencies -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-label-var -->
<!-- eslint-disable no-restricted-syntax -->
<!-- eslint-disable no-labels -->
<!-- eslint-disable no-unused-labels -->
<!-- eslint-disable vue/return-in-computed-property -->
<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<script lang="js" setup>
import { computed, ref, reactive } from 'vue';
import dayjs from 'dayjs';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Month from '@/classes/Month';
import { useScheduleStore } from '@/store/schedule';
import { useTariffsStore } from '@/store/tariffs';
import { useClassesStore } from '@/store/classes';
// import { useBookingStore } from '@/store/booking';

const scheduleStore = useScheduleStore();
const tariffStore = useTariffsStore();
// const bookingStore = useBookingStore();
const classesStore = useClassesStore();

const inputString = ref(null);
const rules = computed(() => ({
  inputString: {
    regex: helpers.withMessage(
      'Дата выходит за границы допустимого диапазона',
      helpers.regex(
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/,
      ),
    ),
  },
}));

const v$ = useVuelidate(rules, {
  inputString,
});

const currentDate = dayjs();
const currentMonthIndex = ref(currentDate.month());
const currentYear = ref(currentDate.year());

const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

const selectedMonth = ref(
  new Month(currentMonthIndex.value, currentYear.value),
);
const init = async () => {
  selectedMonth.value = new Month(
    currentMonthIndex.value,
    currentYear.value,
  );
  await classesStore.getMonthClasses(
    currentYear.value,
    currentMonthIndex.value,
  );
  scheduleStore.setSchedule(currentDate.format('YYYY-MM-DD'));
  selectedMonth.value.setActiveDay({
    iso: currentDate.format('YYYY-MM-DD'),
  });
  // const activeDay = selectedMonth.value.getActiveDay();
  // bookingStore.selectedDay = currentDate.format(activeDay.iso);
  // bookingStore.isWeekend = activeDay.isWeekend;
};

init();

const changeInputString = async () => {
  v$.value.inputString.$model = inputString.value;
  if (!v$.value.inputString.$errors.length) {
    const dateArr = inputString.value.split('/');
    const dayNumber = dateArr[0];
    const monthNumber = dateArr[1];
    const year = dateArr[2];
    console.log(dayNumber, monthNumber, year);
    selectedMonth.value = new Month(monthNumber - 1, year);
    selectedMonth.value.setActiveDay({
      iso: `${year}-${monthNumber}-${dayNumber}`,
    });
    await classesStore.getMonthClasses(year, monthNumber - 1);
    scheduleStore.setSchedule(`${year}-${monthNumber}-${dayNumber}`);
    tariffStore.clearAvailableTariffs();
  }
};

// console.log('selectedMonth', selectedMonth);

const prevMonth = async () => {
  currentMonthIndex.value -= 1;
  if (currentMonthIndex.value < 0) {
    currentMonthIndex.value = 11;
    currentYear.value -= 1;
  }
  selectedMonth.value = new Month(
    currentMonthIndex.value,
    currentYear.value,
  );
  await classesStore.getMonthClasses(
    currentYear.value,
    currentMonthIndex.value,
  );
  // console.log('selectedMonth.value', selectedMonth.value);
  // console.log('test', selectedMonth);
};

const nextMonth = async () => {
  // console.log('next');
  currentMonthIndex.value += 1;
  if (currentMonthIndex.value > 11) {
    currentMonthIndex.value = 0;
    currentYear.value += 1;
  }
  selectedMonth.value = new Month(
    currentMonthIndex.value,
    currentYear.value,
  );
  classesStore.getMonthClasses(
    currentYear.value,
    currentMonthIndex.value,
  );
  // console.log('test', selectedMonth);
};

const clickDay = async (day) => {
  // console.log('click day', day.day.month, currentMonthIndex.value);
  if (day.day.month() < currentMonthIndex.value) {
    await prevMonth();
  }
  if (day.day.month() > currentMonthIndex.value) {
    await nextMonth();
  }
  selectedMonth.value.setActiveDay(day);
  scheduleStore.setSchedule(day.iso);
  tariffStore.clearAvailableTariffs();
  // bookingStore.selectedDay = day.iso;
  // bookingStore.isWeekend = day.isWeekend;
};
</script>

<template>
  <div class="calendar__wrapper">
    <div class="calendar__wrap-input">
      <label>
        <InputMask
          v-model="inputString"
          class="calendar__input"
          mask="99/99/9999"
          autocomplete="off"
          placeholder="ДД/ММ/ГГГГ"
          @blur="changeInputString()"
        />
      </label>
      <div v-if="v$.inputString.$errors.length" class="error-message">
        {{ v$.inputString.$errors[0].$message }}
      </div>
    </div>

    <div class="calendar">
      <div class="calendar__header">
        <div class="calendar__arrow-left" @click="prevMonth">
          <img src="@/assets/arrow_left.png" alt="prev_month" />
        </div>
        <div class="calendar__title">
          {{ selectedMonth.title }} {{ selectedMonth.year }}
          <!-- <div class="calendar__title-left">

        </div>
        <div class="calendar__title-right">
          <i @click="prevMonth" class="pi pi-chevron-up calendar__arrow"></i>
          <i @click="nextMonth" class="pi pi-chevron-down calendar__arrow"></i>
        </div> -->
        </div>
        <div class="calendar__arrow-right" @click="nextMonth">
          <img src="@/assets/arrow_right.png" alt="next_month" />
        </div>
      </div>

      <div class="calendar__week-days">
        <div
          v-for="weekDay in weekDays"
          :key="weekDay"
          class="calendar__week-day"
        >
          {{ weekDay }}
        </div>
      </div>
      <div class="calendar__days">
        <div
          v-for="day in selectedMonth.days"
          :key="day"
          class="calendar__wrap-day"
          @click="clickDay(day)"
        >
          <div class="calendar__day" :class="day.classes">
            {{ day.number }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar {
  font-family: 'Open Sans', Arial, sans-serif;
  font-size: 20px;
  background-color: #e4e9e3;
  width: 393px;
  height: 366px;
  color: #333a2a;
  user-select: none;
  border-radius: 34px;
  padding-bottom: 60px;
  &__wrap-input {
    margin-bottom: 20px;
  }
  &__input {
    width: 393px;
    height: 49px;
    border: none;
    background-color: #f2f2f2;
    border-radius: 110px;
    outline: none !important;
    padding: 0 20px;
    font-size: 20px;
    color: #898989;
  }
  &__header {
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    padding: 24px;
    padding-top: 28px;
    padding-bottom: 16px;
  }
  &__arrow-right {
    cursor: pointer;
    padding-left: 10px;
  }
  &__arrow-left {
    cursor: pointer;
    padding-right: 10px;
  }
  &__arrow-right img,
  &__arrow-left img {
    width: 7.5px;
    height: 15px;
  }
  // &__title {
  //   // display: flex;
  //   // justify-content: space-between;
  //   // font-weight: 600;
  //   // padding-left: 12px;
  //   // padding-bottom: 12px;
  //   // text-align: center;
  //   // &-left {
  //   //   padding-top: 6px;
  //   // }
  //   // &-right {
  //   //   padding-right: 12px;
  //   //   padding-top: 9px;
  //   //   width: 60px;
  //   //   display: flex;
  //   //   justify-content: space-between;
  //   // }
  // }
  // &__arrow {
  //   cursor: pointer;
  //   border-radius: 50%;
  //   width: 20px;
  //   height: 20px;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   &:hover {
  //     background-color: #A8BEA7;
  //     color: #444D44;
  //     transition: background-color 0.5s ease;
  //   }
  // }
  &__week-days {
    // border: 1px solid black;
    color: #898989;
    padding: 0 12px;
    margin-bottom: 4px;
    font-weight: 400;
    size: 20px;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
  }
  &__days {
    display: grid;
    padding: 0 12px;
    size: 20px;
    font-weight: 400;
    color: #333a2a;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(5, 1fr);
    height: calc(100% - 65px);
    // border: 1px solid red;
  }
  &__wrap-day {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.5s ease;
    border-radius: 50%;
    // max-width: 38px;
    // border: 1px solid red;
    cursor: pointer;
  }
  &__day {
    width: 37px;
    height: 37px;
    line-height: 37px;
    border-radius: 50%;
    text-align: center;
    &:hover {
      background-color: #a8bea7;
      color: #444d44;
    }
    &.active:not(.prev-month, .next-month) {
      background-color: #a8bea7;
      color: #444d44;
    }
    &.prev-month,
    &.next-month {
      color: #7d877d;
    }
  }
}
.error-message {
  color: #dc3545;
  padding-left: 20px;
  margin-top: 4px;
}
</style>
