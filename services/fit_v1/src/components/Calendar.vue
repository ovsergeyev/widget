<script lang="ts" setup>
import { ref, watch, computed, onMounted, onBeforeMount } from 'vue';
import { useScheduleStore } from '../store/schedule';
import { useTariffsStore } from '../store/tariffs';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';

const scheduleStore = useScheduleStore();
const tariffsStore = useTariffsStore();

const date = ref<Date | null>(null);
const inputMaskDate = ref('');

onBeforeMount(() => {
  const currentDate = new Date();
  date.value = currentDate;
  inputMaskDate.value = formattedDate.value;
  changeDate(currentDate, false);
})

const formattedDate = computed(() => {
  if (!date.value) return '';
  const result = date.value.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\./g, '/');
  // console.log('result', result);
  return result;
});

watch(date, (newDate) => {
  inputMaskDate.value = formattedDate.value;
});

const changeInput = () => {
  if (inputMaskDate.value.length === 10) {
    const [day, month, year] = inputMaskDate.value.split('/');
    date.value = new Date(`${year}-${month}-${day}`);
    changeDate(date.value);
  } else {
    date.value = null;
  }
};

const changeDate = async (date: Date, sendGoal = true) => {
  if(!date) return

  tariffsStore.availableTariffs = [];

  const isoDate = dayjs(date).format('YYYY-MM-DD');
  scheduleStore.setSchedule(isoDate);

  // Отправка цели Яндекс.Метрики
  if (typeof (window as any).sendYandexGoal === 'function' && sendGoal) {
    (window as any).sendYandexGoal('dateChanged', { isoDate });
  }
}

</script>

<template>
  <div class="flex flex-col">
    <InputMask mask="99/99/9999" placeholder="ДД/ММ/ГГГГ" v-model="inputMaskDate" @blur="changeInput()" class="mb-6" />
    <DatePicker v-model="date" dateFormat="dd/mm/yy" inline @update:modelValue="changeDate(date)" />
  </div>
</template>