<!-- eslint-disable linebreak-style -->
<script lang="ts" setup>
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
</script>
<template>
  {{  authStore.user.role }}
</template>
