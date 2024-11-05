<script lang="ts" setup>
import { ref } from 'vue';
import { useConfigStore } from '../../store/config';
import { useBookingStore } from '../../store/booking';

const configStore = useConfigStore();
const bookingStore = useBookingStore();

const show = ref(true);

</script>

<template>
  <Dialog
    v-model:visible="bookingStore.showMessageAfterPayment"
    class="login"
    style="width: 36rem;"
    modal
    header="Успешная оплата"
  >

    <template #header>
      <div class="font-semibold text-xl text-green">Успешная оплата</div>
    </template>

    <div
      v-html="configStore.config.message_after_payment"
      class="mb-4"
    />

    <div class="flex justify-end">
      <Button
        label="Закрыть"
        severity="secondary"
        @click="bookingStore.showMessageAfterPayment = false"
      />
    </div>

  </Dialog>
</template>