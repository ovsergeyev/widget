<script lang="ts" setup>
import { ref, PropType } from 'vue';
import { useBookingStore } from '../../store/booking';
import IOrder from '../../types/IOrder';

const bookingStore = useBookingStore();

const props = defineProps({
  order: {
    type: Object as PropType<IOrder>,
    required: true,
  },
});

const showPopup = ref(true);

const clickAcceptButton = () => {
  const adults = props.order.adults;
  const children = props.order.children;
  const countDelChildren = children - (adults - 1) * 2;

  for(let count=0; count < countDelChildren; count++){
    bookingStore.delChildren(props.order.uid);
  };

  bookingStore.delAdult(props.order.uid)

  showPopup.value = false;
}


</script>

<template>
  <Dialog
    v-model:visible="showPopup"
    modal
    header="Удаление взрослого тарифа"
  >
    <div class="pb-4 text-red-700">
      На один "взрослый тариф" возможно добавить не более двух детских
      тарифов.
    </div>

    <div class="mb-4">
      Вы подтверждаете удаление детских тарифов сверх допустимой нормы?
    </div>

    <div class="flex justify-center gap-6">
      <Button
        class="w-32"
        @click="clickAcceptButton"
        label="Да"
        raised
      />

      <Button
        class="w-32"
        @click="showPopup = false"
        label="Отмена"
        raised
      />
    </div>

  </Dialog>
</template>