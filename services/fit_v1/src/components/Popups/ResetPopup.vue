<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useConfigStore } from '@/store/config';
import FitnesService from '../../services/FitnesService';
import IError from '../../types/IError';
import IChangePassPayload from '../../types/IChangePassPayload';
import IConfirmPayload from '../../types/IConfirmPayload';

const authStore = useAuthStore();

const showElements = ref({
  view1: true,
  view2: false,
});

const emits = defineEmits(['hide', 'reopen']);
const hide = () => {
  if (!showElements.value.view2) {
    emits('hide');
  }
};

const phone = ref();
const confirmationCode = ref();
const password = ref('');
const confirmPassword = ref('');
const errorObj = reactive<IError>({
  code: 0,
  type: '',
  message: '',
});
const passToken = ref();

const clearError = () => {
  errorObj.code = 0;
  errorObj.type = '';
  errorObj.message = '';
};

const sendCode = async () => {
  const localPhone = phone.value.replace(/[()\-\+\s]/g, '');
  const payload: IConfirmPayload = {
    phone: localPhone,
    auth_type: 'sms',
  };
  const configStore = useConfigStore();
  // eslint-disable-next-line
  const res = await FitnesService.confirmPhone(configStore.integration_code, payload);
  // const { data, result } = res.data;
};

const clickSendSMS = () => {
  if (
    !phone.value ||
    phone.value.replace(/[()\-\+\s]/g, '').length < 11
  ) {
    errorObj.code = 1;
    errorObj.message = 'Проверьте правильность ввода';
    errorObj.type = 'phone number';
    return;
  }
  clearError();
  sendCode();
  showElements.value.view1 = false;
  showElements.value.view2 = true;
};

const changePassword = async () => {
  const localPhone = phone.value.replace(/[()\-\+\s]/g, '');
  const payload: IChangePassPayload = {
    phone: localPhone,
    pass_token: passToken.value,
    password: password.value,
  };
  const configStore = useConfigStore();
  // eslint-disable-next-line
  const res = await FitnesService.changePassword(configStore.integration_code, payload);
  const { data, result } = res.data;
  if (result && data.user_token) {
    authStore.setUserToken(data.user_token);
  }
};

const checkPassword = () => {
  if (
    password.value === confirmPassword.value &&
    errorObj.code === 2
  ) {
    clearError();
  }
};

const confirmPhone = async () => {
  const localPhone = phone.value.replace(/[()\-\+\s]/g, '');
  const payload: IConfirmPayload = {
    phone: localPhone,
    auth_type: 'sms',
    confirmation_code: confirmationCode.value,
  };
  const configStore = useConfigStore();
  // eslint-disable-next-line
  const res = await FitnesService.confirmPhone(configStore.integration_code, payload);
  const { data, result, error, error_message } = res.data;

  if (result) {
    clearError();
    passToken.value = data.pass_token;
    // authStore.setUserToken(data.pass_token);
  } else {
    errorObj.code = error;
    errorObj.type = 'code';
    errorObj.message = error_message;
    return false;
  }
  return true;
};

const clickChangePassword = async () => {
  if (password.value !== confirmPassword.value) {
    errorObj.code = 2;
    errorObj.type = 'password';
    errorObj.message = 'Пароль и подтверждение пароля не совпадают';
    return;
  }

  if (!password.value || password.value.length < 8) {
    errorObj.code = 3;
    errorObj.type = 'password';
    errorObj.message = 'Пароль должен содержать минимум 8 символов';
    return;
  }
  if (!confirmationCode.value || confirmationCode.value.length < 4) {
    errorObj.code = 4;
    errorObj.type = 'code';
    errorObj.message = 'Не верный код подтверждения';
    return;
  }
  const statusConfirmPhone = await confirmPhone();
  if (!statusConfirmPhone) return;
  await changePassword();
  showElements.value.view2 = false;
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
    v-model:visible="showElements.view1"
    class=""
    modal
    header="Сброс пароля"
    style="max-width: 24rem;"
    @hide="hide()"
  >
    <div class="flex items-center gap-3 mb-3">
      <label for="phone" class="">Телефон</label>
      <InputText
        id="phone"
        v-model.number="phone"
        @input="changePhone"
        class="flex-auto"
        autocomplete="off"
      />
    </div>

    <div
      v-if="errorObj.message && errorObj.code == 1"
      class=""
    >
      <span>{{ errorObj.message }} </span>
    </div>

    <Button
      label="Отправить смс"
      class="w-full" raised
      @click="clickSendSMS()"
    />

  </Dialog>

  <Dialog
    v-model:visible="showElements.view2"
    class=""
    modal
    header="Сброс пароля"
    style="max-width: 24rem;"
    @hide="hide()"
  >
    <div class="flex flex-col mb-4">
      <label for="password" class="font-semibold mb-2">
        Пароль
      </label>
      <InputText
        id="password"
        v-model="password"
        :input="checkPassword()"
        type="password"
        placeholder="Пароль"
        class="flex-auto"
        autocomplete="off"
      />
    </div>

    <div class="flex flex-col mb-4">
      <label for="confirm_password" class="font-semibold mb-2">
        Подтверждение пароля
      </label>
      <InputText
        id="confirm_password"
        v-model="confirmPassword"
        type="password"
        placeholder="Потверждение пароля"
        :input="checkPassword()"
        class="flex-auto"
        autocomplete="off"
      />
    </div>

    <div class="mt-2 text-green text-center">
      Сообщение с кодом подтверждения отправлено по СМС
    </div>

    <div class="flex flex-col mt-4">
      <label for="confirm-code" class="font-semibold mb-2">
        Код из СМС
      </label>
      <InputText
        id="confirm-code"
        v-model="confirmationCode"
        class="flex-auto"
        autocomplete="off"
      />
    </div>

    <div
      v-if="errorObj.message && errorObj.code !== 1"
      class="mt-4"
    >
      <span class="text-red-700">
        {{ errorObj.message }}
      </span>
    </div>

    <Button
      class="mt-4 w-full"
      label="Изменить пароль"
      @click="clickChangePassword()"
    />

  </Dialog>
</template>