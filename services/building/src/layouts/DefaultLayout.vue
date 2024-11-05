<script lang="ts" setup>
import { ref } from 'vue';
import { menubar } from '../assets/presets/menubar';
import { useRouter } from 'vue-router';
const router = useRouter();

const items = ref([
  {
    label: 'Главная',
    icon: 'pi pi-fw pi-home',
    command: () => router.push('/home')
  },
  {
    label: 'Кнопки',
    icon: '',
    command: () => router.push('/buttons')
  },
  {
    label: 'Формы',
    icon: '',
    command: () => router.push('/forms')
  },
  {
    label: 'Календарь',
    icon: '',
    command: () => router.push('/calendar')
  },
  {
    label: 'Карточки',
    icon: '',
    command: () => router.push('/cards')
  },
  {
    label: 'Типография',
    icon: '',
    command: () => router.push('/typography')
  },
  {
    label: 'Виджет',
    icon: '',
    command: () => router.push('/widget')
  },
  {
    label: 'Тест',
    icon: '',
    command: () => router.push('/test')
  },
])

</script>

<template>
  <div class="layout-wrapper">
    <div class="layout-header mb-4">
      <Menubar :model="items" :dt="menubar" />
    </div>

    <div class="layout-content">
      <slot></slot>
    </div>

    <div class="layout-footer">

    </div>
  </div>
</template>