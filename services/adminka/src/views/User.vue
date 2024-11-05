<script lang="ts" setup>
import { useRoute } from 'vue-router';
import EditProfile from '@/components/EditProfile.vue';
import ConfigFitness from '@/components/ConfigFitness.vue';
import { useFitnesStore } from '@/store/fitnes';

const route = useRoute();
const fitnesStore = useFitnesStore();
fitnesStore.currentUserId = '' + route.params.user_id;
</script>

<template>
  <div class="flex flex-column gap-5">
    <EditProfile />
    <ConfigFitness />
  </div>
</template>