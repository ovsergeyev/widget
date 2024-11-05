<script lang="ts" setup>
import { ref } from 'vue';

const emits = defineEmits(['hide']);
const hide = () => {
  emits('hide');
};

defineProps({
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
  <Dialog
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
  </Dialog>
</template>