import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCommonStore = defineStore('common', () => {
  // const offers = ref<IOffer[]>([]);
  const currentAppointmentId = ref('');
  const isSafari = ref(false);


  return {
    currentAppointmentId,
    isSafari
  };
});
