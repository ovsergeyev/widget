<script lang="ts" setup>
// import EditProfile from '@/components/EditProfile.vue';
import ConfigFitness from '@/components/ConfigFitness.vue';
import { useAuthStore } from '@/store/auth';
import { useFitnesStore } from '@/store/fitnes';

const authStore = useAuthStore();
const fitnesStore = useFitnesStore();

fitnesStore.currentUserId = authStore.user.id;

</script>
<template>
  <div class="">
    <ConfigFitness />
  </div>
</template>