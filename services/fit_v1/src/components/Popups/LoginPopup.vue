<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useConfigStore } from '../../store/config';
import FitnesService from '@/services/FitnesService';
import IAuthPayload from '../../types/IAuthPayload';

const authStore = useAuthStore();

const showElement = ref(true);

const phone = ref();
const password = ref();
const errorAuth = ref();

const emits = defineEmits([
  'openForgotPassPopup',
  'openRegisterPopup',
  'hide',
]);

const hide = () => {
  emits('hide');
}

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

const clickForgotPass = () => {
  emits('openForgotPassPopup');
};

const clickRegister = () => {
  emits('openRegisterPopup');
};

const changePhone = (event: any) => {
  phone.value = event.target.value.replace(/[a-zA-Z;'~@#$%^&()!_*=-]/g, '');

  let value = phone.value.split(" ").join("");

  // добавление плюса
  if (value.length && value[0] !== '+') value = '+' + value;

  // изменение 8 на 7
  if (value[1] === '8'){
    value = '+7' + value.slice(2);
  }

  value = value.slice(0,2) + ' ' + value.slice(2)
  value = value.slice(0,6) + ' ' + value.slice(6)
  value = value.slice(0,10) + ' ' + value.slice(10)
  value = value.slice(0,13) + ' ' + value.slice(13)

  value = value.slice(0,16).trim()

  phone.value = value;
};

</script>

<template>
  <Dialog
    v-model:visible="showElement"
    class="login"
    style="max-width: 24rem;"
    modal
    header="Войти или зарегистрироваться"
    @hide="hide()"
  >
    <!-- <span class="p-text-secondary block mb-5">
    Update your information.</span> -->

    <div class="mb-4 text-sm font-medium">
      Если вы были зарегистрированы ранее 3 сентября 2024, пожалуйста зарегистрируйтесь повторно
    </div>

    <Button
      @click="clickRegister()"
      class="mb-6 w-full"
      raised
      severity="secondary"
      label="Зарегистрироваться"
    />

    <div class="flex items-center gap-3 mb-3">
      <label for="phone" class="font-semibold w-[5rem]">Телефон</label>
      <InputText
        id="phone"
        v-model.number="phone"
        @input="changePhone"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex items-center gap-3">
      <label for="password" class="font-semibold w-[5rem]"
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
    <div v-if="errorAuth" class="mt-2 text-red-700">
      Проверьте логин и пароль
    </div>

    <Button
      @click="signIn()"
      class="mt-4 w-full"
      raised
      label="Войти"
    />

    <div class="mt-4">
      <a class="text-green font-semibold hover:underline cursor-pointer" @click="clickForgotPass()">
        Забыли пароль?
      </a
      >
    </div>

    <!-- <div class="mt-4">
      Если у вас еще нет пароля для входа, вам нужно
      <a class="text-green font-semibold hover:underline cursor-pointer" @click="clickRegister()">
        зарегистрироваться
      </a>
    </div> -->
  </Dialog>
</template>