<script lang="ts" setup>
import presets from './presets';

defineProps({
  isActive: {
    type: Boolean,
    required: true
  },
  tooltipText: {
    type: String
  }
});

</script>

<template>
  <div
    :class="isActive ? presets.tag.class : presets.disabledTag.class"
    class="relative group"
  >
    <div
      v-if="tooltipText"
      class="absolute top-[-40px] !border !border-green !border-solid !bg-white rounded-md !shadow-md !px-2 !py-1 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      {{ tooltipText }}
      <div class="pi pi-sort-down-fill absolute bottom-[-11px] left-1/2 -translate-x-1/2 !text-green" />
    </div>

    <slot></slot>
  </div>
</template>