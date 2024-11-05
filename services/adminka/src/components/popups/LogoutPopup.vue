<!-- eslint-disable max-len -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable no-useless-escape -->
<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<!-- eslint-disable linebreak-style -->
<script lang="ts" setup>
import { useAuthStore } from '@/store/auth';
const authStore = useAuthStore();

const clickLogoutButton = () => {
  // console.log('login', login);
  // console.log('password', password);
  authStore.logout();
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key == 'Enter') {
    clickLogoutButton();
  }
};

const toggleDialog = async (value: boolean) => {
  if(value){
    window.addEventListener('keydown', handleKeydown)
  } else {
    window.removeEventListener('keydown', handleKeydown)
  }
}

</script>

<template>
  <Dialog
    @show="toggleDialog(false)"
    @hide="toggleDialog(true)"
    v-model:visible="authStore.showLogoutPopup"
    modal
    header="Выход"
    :style="{ width: '27rem' }"
  >
    <div class="flex justify-end gap-2">
      <Button type="button" label="Выход" @click="clickLogoutButton()"></Button>
    </div>
  </Dialog>
</template>

