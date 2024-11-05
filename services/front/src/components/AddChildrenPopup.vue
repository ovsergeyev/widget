<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { ref } from 'vue';
import { useBookingStore } from '@/store/booking';

const bookingStore = useBookingStore();

const props = defineProps({
  uid: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['hide']);
const hide = () => {
  emits('hide');
};

const showPopup = ref(true);

const isConsent = ref(false);
const isError = ref(false);

const addChildren = (uid: string) => {
  const status = bookingStore.addChildren(uid);
  if (!status) {
    isError.value = true;
  } else {
    hide();
  }
};
</script>

<template>
  <prime-dialog
    v-model:visible="showPopup"
    class="children-popup"
    modal
    header="Добавление детского тарифа"
    @hide="hide()"
  >
    <div v-if="!isError" class="children-popup__consent">
      <input-checkbox
        v-model="isConsent"
        class="children-popup__checkbox"
        :binary="true"
      />
      <span
        >Сопровождающий является законным представителем, или имеет
        письменное согласие от законного представителя на посещение
        ребенка.</span
      >
    </div>

    <div v-if="!isError">
      Оплата за посещение ребенка (6-14 лет) будет на месте с
      представлением документа подтверждающего возраст.
    </div>

    <div v-if="isError" class="children-popup__error">
      На один "взрослый тариф" возможно добавить не более двух детских
      тарифов.
    </div>

    <div
      v-if="isConsent && !isError"
      class="children-popup__button"
      @click="addChildren(uid)"
    >
      Добавить детский тариф
    </div>
  </prime-dialog>
</template>

<style lang="scss" scoped>
.children-popup {
  &__consent {
    display: flex;
    margin-bottom: 16px;
    & span {
      line-height: 20px;
    }
  }
  &__checkbox {
    margin-right: 8px;
  }
  &__error {
    color: #dc3545;
    // padding-left: 20px;
    // margin-top: 4px;
  }
  &__button {
    display: inline-block;
    padding: 0 15px;
    margin-top: 10px;
    // background-color: #F5F5F5;
    border: 1px solid #b8c9b9;
    height: 32px;
    line-height: 32px;
    border-radius: 110px;
    text-align: center;
    color: #5d694e;
    cursor: pointer;
    user-select: none;
    transition-duration: 0.2s;
    &:hover {
      background-color: #f5f5f5;
      color: #5d694e;
    }
  }
}
</style>
