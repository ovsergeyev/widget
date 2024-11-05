<!-- eslint-disable max-len -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable no-useless-escape -->
<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<!-- eslint-disable linebreak-style -->
<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
const authStore = useAuthStore();

const username = ref();
const password = ref();
const clickAuthButton = async () => {
  // console.log('login', login);
  // console.log('password', password);
  await authStore.signIn(username.value, password.value);
  // window.location.reload();
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key == 'Enter') {
    clickAuthButton();
  }
};

const toggleDialog = async (value: boolean) => {
  console.log('value', value)
  if(value){
    window.addEventListener('keydown', handleKeydown)
  } else {
    window.removeEventListener('keydown', handleKeydown)
  }
}

// const signIn = async () => {


// };

</script>

<template>
  <Dialog
    @show="toggleDialog(true)"
    @hide="toggleDialog(false)"
    v-model:visible="authStore.showLoginPopup"
    modal
    header="Авторизация"
    :style="{ width: '27rem' }"
  >
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">Логин</label>
      <InputText
        id="username"
        class="flex-auto"
        autocomplete="off"
        v-model="username"
      />
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label for="password" class="font-semibold w-24">Пароль</label>
      <InputText
        id="password"
        class="flex-auto"
        type="password"
        autocomplete="off"
        v-model="password"
      />
    </div>
    <div v-if="authStore.errorMessage" class="text-red-600 mb-4">
      {{ authStore.errorMessage }}
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Вход" @click="clickAuthButton()"></Button>
    </div>
  </Dialog>
</template>

