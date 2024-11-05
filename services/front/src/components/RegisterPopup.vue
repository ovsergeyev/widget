<!-- eslint-disable camelcase -->
<!-- eslint-disable no-useless-escape -->
<!-- eslint-disable import/extensions -->
<!-- eslint-disable import/no-unresolved -->
<!-- eslint-disable linebreak-style -->
<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import IError from '@/types/IError';
import IConfirmPayload from '@/types/IConfirmPayload';
import IChangePassPayload from '@/types/IChangePassPayload';
import IRegAndAuthPayload from '@/types/IRegAndAuthPayload';
import agreement from '@/data/agreement';
import FitnesService from '@/services/FitnesService';
import { useAuthStore } from '@/store/auth';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useConfigStore } from '@/store/config';

const authStore = useAuthStore();
const emits = defineEmits(['hide']);

const errorObj = reactive<IError>({
  code: 0,
  type: '',
  message: '',
});

const phone = ref();
const password = ref();
const confirmPassword = ref();
const acceptedAgreement = ref();
const confirmationCode = ref();
// const userToken = ref();

const firstName = ref();
const middleName = ref();
const lastName = ref();
const email = ref();
// const gender = ref();
const birthday = ref();

const showElements = ref({
  view1: true,
  view2: false,
  view3: false,
  view4: false,
  counter: false,
});

const clearError = () => {
  errorObj.code = 0;
  errorObj.type = '';
  errorObj.message = '';
};

const hide = () => {
  if (!showElements.value.view2 && !showElements.value.view3) {
    emits('hide');
  }
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
  const { data, result } = res.data;
  console.log('data', data);
  console.log('result', result);
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
  console.log('data', data);
  console.log('result', result);

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

const auth = async () => {
  const localPhone = phone.value.replace(/[()\-\+\s]/g, '');
  const payload: IRegAndAuthPayload = {
    phone: localPhone,
    pass_token: authStore.userToken,
    password: password.value,
    last_name: lastName.value,
    name: firstName.value,
    second_name: middleName.value,
    email: email.value,
    birthday: birthday.value,
  };
  const configStore = useConfigStore();
  // eslint-disable-next-line
  const res = await FitnesService.regAndAuth(configStore.integration_code, payload);
  const { data, result, error, error_message } = res.data;
  console.log('data', data);
  console.log('result', result);
  if (result) {
    clearError();
    // VueCookies.set('userToken', data.pass_token);
    authStore.setUserToken(data.pass_token);
  } else {
    errorObj.code = error;
    errorObj.type = 'code';
    errorObj.message = error_message;
    return false;
  }
  return true;
};

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
  if (result && data.pass_token) {
    return true;
  }
  return false;
};

const clickRegister = async () => {
  if (
    !phone.value ||
    phone.value.replace(/[()\-\+\s]/g, '').length < 11
  ) {
    errorObj.code = 1;
    errorObj.message = 'Проверьте правильность ввода телефона';
    errorObj.type = 'phone number';
    return;
  }

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

  if (!acceptedAgreement.value) {
    errorObj.code = 4;
    errorObj.type = 'accepted agreement';
    errorObj.message =
      'Вы не приняли соглашение о персональных данных';
    return;
  }
  clearError();
  sendCode();
  showElements.value.view1 = false;
  showElements.value.view2 = true;
};
// const clickSendSMS = () => {
//   showElements.value.counter = true;
// };
const clickConfirm = async () => {
  if (!confirmationCode.value) {
    errorObj.code = 5;
    errorObj.type = 'confirm code';
    errorObj.message = 'Введите код подтверждения';
    return;
  }
  const confirmStatus = await confirmPhone();
  if (confirmStatus) {
    clearError();
    changePassword();
  } else {
    return;
  }
  // const registerStatus = await auth();
  // if (registerStatus) {
  //   showElements.value.view1 = false;
  //   showElements.value.view2 = false;
  // }
  showElements.value.view2 = false;
  showElements.value.view3 = true;
};

const showTermsOfService = () => {
  showElements.value.view1 = false;
  showElements.value.view4 = true;
};

const checkPassword = () => {
  if (
    password.value === confirmPassword.value &&
    errorObj.code === 2
  ) {
    clearError();
  }
};

const rules = computed(() => ({
  lastName: {
    required: helpers.withMessage('Поле обязательное', required),
  },
  firstName: {
    required: helpers.withMessage('Поле обязательное', required),
  },
  middleName: {
    required: helpers.withMessage('Поле обязательное', required),
  },
  email: {
    required: helpers.withMessage('Поле обязательное', required),
  },
  birthday: {
    required: helpers.withMessage('Поле обязательное', required),
  },
}));

const v$ = useVuelidate(rules, {
  lastName,
  firstName,
  middleName,
  email,
  birthday,
});

const clickSendAbout = async () => {
  v$.value.$touch();
  if (v$.value.$error) return;

  const registerStatus = await auth();
  showElements.value.view3 = false;
};
</script>
<template>
  <prime-dialog
    v-model:visible="showElements.view1"
    class="register"
    modal
    header="Регистрация"
    :style="{ width: '25rem' }"
    @hide="hide()"
  >
    <!-- <span class="p-text-secondary block mb-5">
    Update your information.</span> -->
    <div class="flex align-items-center gap-3 mb-3">
      <!-- <label for="phone" class="font-semibold w-6rem">Телефон</label> -->
      <InputMask
        id="phone"
        v-model="phone"
        placeholder="Телефон"
        mask="+9(999)999-99-99"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <!-- <label for="password" class="font-semibold w-6rem">Пароль</label> -->
      <InputText
        id="password"
        v-model="password"
        type="password"
        placeholder="Пароль"
        class="flex-auto"
        autocomplete="off"
        @input="checkPassword()"
      />
    </div>
    <div class="flex align-items-center gap-3">
      <!-- <label for="password" class="font-semibold w-6rem">
      Подтверждение пароля</label> -->
      <InputText
        id="password"
        v-model="confirmPassword"
        type="password"
        class="flex-auto"
        placeholder="Подтверждение пароля"
        autocomplete="off"
        @input="checkPassword()"
      />
    </div>
    <div
      v-if="errorObj.message"
      class="register__error gap-3 mt-1 mb-3"
    >
      <span>{{ errorObj.message }} </span>
    </div>
    <div class="mb-3 mt-3">
      <input-checkbox v-model="acceptedAgreement" :binary="true" />
      <span class="register__text">
        Я ознакомлен с правилами и согласен на
        <a
          href="#"
          class="register__link"
          @click="showTermsOfService()"
          >обработку персональных данных</a
        >
      </span>
    </div>
    <!-- <div class="flex justify-content-center gap-2 mb-3">
      <button class="fit-btn-2">Отправить смс</button>
    </div> -->
    <div class="flex justify-content-center gap-2 mb-3">
      <button class="fit-btn-2" @click="clickRegister()">
        Зарегистрироваться
      </button>
    </div>
  </prime-dialog>

  <prime-dialog
    v-model:visible="showElements.view2"
    class="register"
    modal
    header="Регистрация"
    :style="{ width: '25rem' }"
    @hide="hide()"
  >
    <div class="register__text-whatsapp gap-3 mb-3">
      Сообщение с кодом подтверждения отправлено по СМС
    </div>
    <div class="flex align-items-center gap-3">
      <!-- <label for="confirm-code"
      class="font-semibold w-6rem">Пароль</label> -->
      <InputText
        id="confirm-code"
        v-model="confirmationCode"
        class="flex-auto"
        placeholder="Код подтверждения"
        autocomplete="off"
      />
    </div>
    <div v-if="errorObj.message" class="register__error gap-3 mt-1">
      <span>{{ errorObj.message }} </span>
    </div>
    <div class="flex justify-content-center gap-2 mt-3 mb-3">
      <button class="fit-btn-2" @click="clickConfirm()">
        Подтвердить
      </button>
    </div>
  </prime-dialog>

  <prime-dialog
    v-model:visible="showElements.view3"
    class="register"
    modal
    header="Расскажите о себе"
    :style="{ width: '25rem' }"
    @hide="hide()"
  >
    <div class="flex align-items-center gap-3">
      <InputText
        id="confirm-code"
        v-model="v$.lastName.$model"
        class="flex-auto"
        placeholder="Фамилия"
        autocomplete="off"
      />
    </div>
    <span v-if="v$.lastName.$errors.length" class="register__error">
      {{ v$.lastName.$errors[0].$message }}
    </span>
    <div class="flex align-items-center gap-3 mt-3">
      <InputText
        id="confirm-code"
        v-model="v$.firstName.$model"
        class="flex-auto"
        placeholder="Имя"
        autocomplete="off"
      />
    </div>
    <span v-if="v$.firstName.$errors.length" class="register__error">
      {{ v$.firstName.$errors[0].$message }}
    </span>
    <div class="flex align-items-center gap-3 mt-3">
      <!-- <label for="confirm-code"
      class="font-semibold w-6rem">Пароль</label> -->
      <InputText
        id="confirm-code"
        v-model="v$.middleName.$model"
        class="flex-auto"
        placeholder="Отчество"
        autocomplete="off"
      />
    </div>
    <span v-if="v$.middleName.$errors.length" class="register__error">
      {{ v$.middleName.$errors[0].$message }}
    </span>
    <div class="flex align-items-center gap-3 mt-3">
      <InputText
        id="confirm-code"
        v-model="v$.email.$model"
        class="flex-auto"
        placeholder="E-mail"
        autocomplete="off"
      />
    </div>
    <span v-if="v$.email.$errors.length" class="register__error">
      {{ v$.email.$errors[0].$message }}
    </span>
    <div class="flex align-items-center gap-3 mt-3">
      <!-- <label for="confirm-code"
      class="font-semibold w-6rem">Пароль</label> -->
      <InputText
        id="confirm-code"
        v-model="v$.birthday.$model"
        placeholder="Дата рождения"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <span v-if="v$.birthday.$errors.length" class="register__error">
      {{ v$.birthday.$errors[0].$message }}
    </span>
    <div class="flex justify-content-center gap-2 mt-3 mb-3">
      <button class="fit-btn-2" @click="clickSendAbout()">
        Отправить
      </button>
    </div>
  </prime-dialog>

  <prime-dialog
    v-model:visible="showElements.view4"
    class="register"
    modal
    :style="{ width: '25rem' }"
    @hide="showElements.view1 = true"
  >
    <div v-html="agreement" />
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

.register {
  &__text {
    font-size: 15px;
    text-align: center;
  }
  &__text-whatsapp {
    font-size: 12px;
    color: green;
    text-align: center;
  }
  &__link {
    color: #9fafa5;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  &__error {
    font-size: 12px;
    color: #dc3545;
  }
}
</style>
