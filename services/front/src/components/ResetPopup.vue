<!-- eslint-disable camelcase -->
<!-- eslint-disable no-useless-escape -->
<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<!-- eslint-disable linebreak-style -->
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import FitnesService from '@/services/FitnesService';
import IConfirmPayload from '@/types/IConfirmPayload';
import IChangePassPayload from '@/types/IChangePassPayload';
import IError from '@/types/IError';
import { useAuthStore } from '@/store/auth';
import { useConfigStore } from '@/store/config';

const authStore = useAuthStore();

const emits = defineEmits(['hide', 'reopen']);

const showElements = ref({
  view1: true,
  view2: false,
});

const hide = () => {
  if (!showElements.value.view2) {
    emits('hide');
  }
};

const phone = ref();
const confirmationCode = ref();
// const userToken = ref();
const errorObj = reactive<IError>({
  code: 0,
  type: '',
  message: '',
});

// const retryTimer = (second = 5) => {
//   retryTime.value = second;
//   const intervalId = setInterval(() => {
//     retryTime.value -= 1;
//     if (retryTime.value === 0) clearInterval(intervalId);
//   }, 1000);
// };

const sendCode = async () => {
  const localPhone = phone.value.replace(/[()\-\+\s]/g, '');
  const payload: IConfirmPayload = {
    phone: localPhone,
    auth_type: 'sms',
  };
  const configStore = useConfigStore();
  // eslint-disable-next-line
  const res = await FitnesService.confirmPhone(configStore.integration_code, payload);
  const { data, result } = res.data;
};

const clearError = () => {
  errorObj.code = 0;
  errorObj.type = '';
  errorObj.message = '';
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
    authStore.setUserToken(data.pass_token);
  } else {
    errorObj.code = error;
    errorObj.type = 'code';
    errorObj.message = error_message;
    return false;
  }
  return true;
};

const password = ref('');
const confirmPassword = ref('');

const changePassword = async () => {
  const localPhone = phone.value.replace(/[()\-\+\s]/g, '');
  const payload: IChangePassPayload = {
    phone: localPhone,
    pass_token: authStore.userToken,
    password: password.value,
  };
  const configStore = useConfigStore();
  // eslint-disable-next-line
  const res = await FitnesService.changePassword(configStore.integration_code, payload);
  const { data, result } = res.data;
  if (result && data.user_token) {
    console.log('ut!', data.user_token);
    authStore.setUserToken(data.user_token);
  }
};

const clickSendSMS = async () => {
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

const checkPassword = () => {
  if (
    password.value === confirmPassword.value &&
    errorObj.code === 2
  ) {
    clearError();
  }
};
</script>
<template>
  <prime-dialog
    v-model:visible="showElements.view1"
    class="reset-password"
    modal
    header="Сброс пароля"
    :style="{ width: '25rem' }"
    @hide="hide()"
  >
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
    <div
      v-if="errorObj.message && errorObj.code == 1"
      class="reset-password__error gap-3 mb-3"
    >
      <span>{{ errorObj.message }} </span>
    </div>
    <div class="flex justify-content-center gap-2 mb-3">
      <button class="fit-btn-2" @click="clickSendSMS()">
        Отправить смс
      </button>
    </div>
  </prime-dialog>

  <prime-dialog
    v-model:visible="showElements.view2"
    class="reset-password"
    modal
    header="Сброс пароля"
    :style="{ width: '25rem' }"
    @hide="hide()"
  >
    <div class="flex align-items-center gap-3 mb-3">
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
    <div class="flex align-items-center gap-3 mb-3">
      <InputText
        id="password"
        v-model="confirmPassword"
        type="password"
        :input="checkPassword()"
        class="flex-auto"
        placeholder="Подтверждение пароля"
        autocomplete="off"
      />
    </div>
    <div class="reset-password__text gap-3 mb-3">
      Сообщение с кодом подтверждения отправлено по СМС
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <InputText
        id="confirm-code"
        v-model="confirmationCode"
        class="flex-auto"
        placeholder="Код подтверждения"
        autocomplete="off"
      />
    </div>
    <div
      v-if="errorObj.message && errorObj.code !== 1"
      class="reset-password__error gap-3 mb-3"
    >
      <span>{{ errorObj.message }} </span>
    </div>
    <div class="flex justify-content-center gap-2 mb-3">
      <button class="fit-btn-2" @click="clickChangePassword()">
        Изменить пароль
      </button>
    </div>
  </prime-dialog>
</template>

<style scoped lang="scss">
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

.reset-password {
  &__text {
    font-size: 12px;
    color: green;
    text-align: center;
  }
  &__error {
    font-size: 12px;
    color: #dc3545;
  }
  &__retry-send {
    color: #334155;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
