<!-- eslint-disable no-useless-escape -->
<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<!-- eslint-disable linebreak-style -->
<script lang="ts" setup>
import { ref } from 'vue';
import FitnesService from '@/services/FitnesService';
import IAuthPayload from '@/types/IAuthPayload';
import { useAuthStore } from '@/store/auth';
import { useConfigStore } from '@/store/config';

const authStore = useAuthStore();

const emits = defineEmits([
  'openForgotPassPopup',
  'openRegisterPopup',
  'hide',
]);
const showElement = ref(true);
const clickForgotPass = () => {
  emits('openForgotPassPopup');
};

const clickRegister = () => {
  emits('openRegisterPopup');
};

const hide = () => {
  emits('hide');
};

const errorAuth = ref(false);
const phone = ref();
const password = ref();

const signIn = async () => {
  const localPhone = phone.value.replace(/[()\-\+\s]/g, '');
  const payload: IAuthPayload = {
    phone: localPhone,
    password: password.value,
  };

  const configStore = useConfigStore();
  const res = await FitnesService.auth(configStore.integration_code, payload);
  const { data, result } = res.data;
  if (result) {
    authStore.setUserToken(data.user_token);
    hide();
  } else {
    errorAuth.value = true;
  }
};
</script>

<template>
  <prime-dialog
    v-model:visible="showElement"
    class="login"
    modal
    header="Войти"
    :style="{ width: '25rem' }"
    @hide="hide()"
  >
    <!-- <span class="p-text-secondary block mb-5">
    Update your information.</span> -->
    <div class="flex align-items-center gap-3 mb-3">
      <label for="phone" class="font-semibold w-6rem">Телефон</label>
      <InputMask
        id="phone"
        v-model="phone"
        mask="+9(999)999-99-99"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3">
      <label for="password" class="font-semibold w-6rem"
        >Пароль</label
      >
      <InputText
        id="password"
        v-model="password"
        type="password"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div v-if="errorAuth" class="error-message">
      Проверьте логин и пароль
    </div>
    <div class="flex justify-content-center gap-2 mb-3 mt-5">
      <!-- <prime-button type="button" label="Cancel"
      severity="secondary" @click="showElements.showLogin = false">
      </prime-button> -->
      <!-- <prime-button type="button" label="Вход"
      @click="showElements.showLogin = false"></prime-button> -->
      <button class="fit-btn-2" @click="signIn()">Войти</button>
    </div>

    <div class="login__text flex justify-content-center mb-3">
      <a href="#" class="login__link" @click="clickForgotPass()"
        >Забыли пароль?</a
      >
    </div>
    <div class="login__text">
      Если у вас еще нет пароля для входа, вам нужно
      <a href="#" class="login__link" @click="clickRegister()"
        >зарегистрироваться</a
      >
    </div>
  </prime-dialog>
</template>

<style lang="scss" scoped>
.fit-btn-2 {
  border: none;
  display: inline-block;
  color: #ffffff;
  font-size: 16px;
  border: 1px solid b8c8ba;
  font-weight: 300;
  border-radius: 15px;
  background-color: #5d7261;
  cursor: pointer;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    border-color 0.2s ease-in-out;
  box-shadow: 0px 0px 10px 0px rgba(38, 38, 38, 0.1);
  padding: 6px 24px;
  &:hover {
    color: #262626;
    background-color: #ffffff;
  }
}

.login {
  &__text {
    font-size: 15px;
    text-align: center;
  }
  &__link {
    color: #9fafa5;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 16px;
}

// :deep(.p-dialog-header-close){
//   outline: 0px solid transparent!important;
//   border: 1px solid red;
// }
</style>
