<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { ref } from 'vue';

const emits = defineEmits(['hide']);
const hide = () => {
  emits('hide');
};

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const showPopup = ref(true);
</script>

<template>
  <prime-dialog
    v-model:visible="showPopup"
    class="tariff-popup"
    modal
    :header="title"
    :style="{ width: '80%' }"
    @hide="hide()"
  >
    <div class="container-fluid">
      <div class="row" v-html="description" />
    </div>
  </prime-dialog>
</template>

<style lang="scss" scoped></style>
