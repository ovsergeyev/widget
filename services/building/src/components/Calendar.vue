<script lang="ts" setup>
import { ref, watch, computed } from 'vue';

const date = ref<Date | null>(null);

const formattedDate = computed(() => {
  if (!date.value) return '';
  return date.value.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\./g, '/');
});

const inputMaskDate = ref('');

watch(date, (newDate) => {
  inputMaskDate.value = formattedDate.value;
});

const updateDate = () => {
  if (inputMaskDate.value.length === 10) {
    const [day, month, year] = inputMaskDate.value.split('/');
    date.value = new Date(`${year}-${month}-${day}`);
  } else {
    date.value = null;
  }
};
</script>

<template>
  <div class="flex flex-col">
    <InputMask mask="99/99/9999" placeholder="ДД/ММ/ГГГГ" v-model="inputMaskDate" @blur="updateDate()" class="mb-6" />
    <DatePicker v-model="date" dateFormat="dd/mm/yy" inline />
  </div>
</template>