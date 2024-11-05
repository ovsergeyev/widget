<script lang="ts" setup>
import { ref } from 'vue';

// const authStore = useAuthStore();
const showElement = ref(true);

defineProps({
  url: {
    type: String,
    required: true
  }
});

const emits = defineEmits([
  'hide',
]);

const hide = () => {
  emits('hide');
}

const clickButton = () => {
  // Отправка цели Яндекс.Метрики. Переход на страницу оплаты
  if (typeof (window as any).sendYandexGoal === 'function') {
    (window as any).sendYandexGoal('goToPaymentPage');
  }
  hide()
}

</script>

<template>
  <Dialog
    v-model:visible="showElement"
    class="login"
    style="max-width: 24rem;"
    modal
    header="Переход на оплату"
    @hide="hide()"
  >

    <a
      v-if="url"
      class="w-full inline-flex justify-center leading-[normal] !border !border-solid !border-green px-3 py-2 gap-2 shadow-sm rounded-md !text-green
      !bg-light-green hover:bg-middle-green transition duration-200 ease-in-out cursor-pointer overflow-hidden select-none font-medium"
      :href="url"
      target="_blank"
      @click="clickButton"
    >
      Перейти
    </a>

  </Dialog>
</template>