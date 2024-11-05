<script setup>
import { ref, computed } from 'vue';

import AppMenuItem from './AppMenuItem.vue';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();

const model = ref([
  {
    label: 'Меню',
    items: [
      {
        label: 'Профиль',
        icon: 'pi pi-fw pi-home',
        to: '/',
        requiresAuth: true,
        role: 'admin'
      },
      {
        label: 'Пользователи',
        icon: 'pi pi-fw pi-id-card',
        to: '/users',
        requiresAuth: true,
        role: 'admin'
      },
      {
        label: 'Настройки',
        icon: 'pi pi-fw pi-id-card',
        to: '/settings',
        requiresAuth: true,
        role: 'client'
      },
      // {
      //   label: 'Виджеты',
      //   icon: 'pi pi-fw pi-id-card',
      //   to: '/widgets',
      //   requiresAuth: true,
      //   role: 'admin'
      // },
    ]
  }
]);

const filteredModel = computed(()=>{
  return model.value.map(menu => {
    return {
      ...menu,
      items: menu.items.filter(item => {
        if (item.requiresAuth && !authStore.isLogin()) {
          // console.log('test1');
          return false;
        }
        if (item.role && item.role !== authStore.user.role) {
          // console.log('test2');
          return false;
        }
        // console.log('test3', authStore.isLogin());
        return true;
      })
    }
  })
});

</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in filteredModel" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
