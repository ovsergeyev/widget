<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AppTopbar from '@/components/AppTopbar.vue';
import AppSidebar from '@/layout/AppSidebar.vue';
import LoginPopup from '@/components/popups/LoginPopup.vue';
import LogoutPopup from '@/components/popups/LogoutPopup.vue';
import { useAuthStore } from '@/store/auth';
import { IUser } from '@/types/IUser';

const authStore = useAuthStore();

const containerClass = computed(() => ({
  'layout-theme-light': true,
  'layout-theme-dark': false,
  'layout-overlay': false,
  'layout-static': true,
  'layout-static-inactive': false,
  'layout-overlay-active': true,
  'layout-mobile-active': false,
  // 'p-input-filled': true,
  // 'p-ripple-disabled': true,
}));

onMounted(async () => {
  try {
    const currentUser = await authStore.getCurrentUser()
    console.log('current_user', currentUser)
    authStore.user.username = currentUser.username
    authStore.user.role = currentUser.role
    authStore.authChecked = true;
  } catch (e){}

  if(!authStore.isLogin()){
    authStore.showLoginPopup = true;
  }
});


</script>

<template>
  <div class="layout-wrapper" :class="containerClass">
    <app-topbar></app-topbar>
    <div class="layout-sidebar"  v-if="authStore.isLogin()">
      <app-sidebar></app-sidebar>
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view></router-view>
      </div>
      <!-- <app-footer></app-footer> -->
    </div>
    <!-- <app-config></app-config> -->
    <div class="layout-mask">
    </div>
    <div class="popups">
      <login-popup />
      <logout-popup />
    </div>
  </div>
</template>
