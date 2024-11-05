<script lang="ts" setup>
import { useAuthStore } from '@/store/auth';
import { computed } from "vue";

const authStore = useAuthStore();
const userLetter = computed(() => {
  let result = ''
  if (authStore.isLogin()) {
    const username = authStore.user.username
    if (username) result = username[0];
  }
  return result.toLocaleUpperCase()
});

const clickLogout = async () => {
  await authStore.logout();
  window.location.reload();
};
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <!-- <img :src="logoUrl" alt="logo" /> -->
      <!-- <span>Скрипты</span> -->
    </router-link>
    <!-- <span>Авторизация</span> -->

    <!-- <button
      class="p-link layout-menu-button layout-topbar-button"
      @click="onMenuToggle()"
    >
      <i class="pi pi-bars"></i>
    </button> -->

    <!-- <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      @click="onTopBarMenuButton()"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button> -->

    <!-- <div class="layout-topbar-menu" :class="topbarMenuClasses"> -->
    <div class="layout-topbar-menu">
    <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-calendar"></i>
        <span>Calendar</span>
      </button> -->
      <!-- <button @click="authStore.showLoginPopup = true" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button> -->
      <Avatar
        v-if="!authStore.isLogin()"
        icon="pi pi-user"
        class="mr-2 layout-topbar-menu__avatar"
        size="large"
        shape="circle"
        @click="authStore.showLoginPopup = true"
      />
      <Avatar
        v-if="authStore.isLogin()"
        :label="userLetter"
        icon="pi pi-user"
        class="mr-2 layout-topbar-menu__avatar"
        size="large"
        shape="circle"
        @click="clickLogout()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .layout-topbar-menu {
    &__avatar {
      cursor: pointer;
    }
  }
</style>
