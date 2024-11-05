<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useAuthStore } from '../../store/auth';
import { useConfigStore } from '../../store/config';
import FitnesService from '../../services/FitnesService';
import IChangePassPayload from '../../types/IChangePassPayload';
import IConfirmPayload from '../../types/IConfirmPayload';
import IError from '../../types/IError';
import IRegAndAuthPayload from '../../types/IRegAndAuthPayload';
import agreement from '@/data/agreement';

const authStore = useAuthStore();

const showElements = ref({
  view1: true,
  view2: false,
  view3: false,
  view4: false,
  counter: false,
});

const emits = defineEmits(['hide']);

const phone = ref();
const password = ref();
const confirmPassword = ref();
const acceptedAgreement = ref();
const confirmationCode = ref();

const firstName = ref();
const middleName = ref();
const lastName = ref();
const email = ref();
const birthday = ref();

const errorObj = reactive<IError>({
  code: 0,
  type: '',
  message: '',
});

const passToken = ref();

const hide = () => {
  if (showElements.value.view4) return
  if (!showElements.value.view2 && !showElements.value.view3) {
    emits('hide');
  }
};

const clearError = () => {
  errorObj.code = 0;
  errorObj.type = '';
  errorObj.message = '';
};

const checkPassword = () => {
  if (
    password.value === confirmPassword.value &&
    errorObj.code === 2
  ) {
    clearError();
  }
};

const showTermsOfService = () => {
  showElements.value.view1 = false;
  showElements.value.view4 = true;
};

const sendCode = async () => {
  const localPhone = phone.value.replace(/[()\-\+\s]/g, '');
  const payload: IConfirmPayload = {
    phone: localPhone,
    auth_type: 'sms',
  };

  const configStore = useConfigStore();
  await FitnesService.confirmPhone(configStore.integration_code, payload);
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
    passToken.value = data.pass_token
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
    pass_token: passToken.value,
    password: password.value,
  };
  const configStore = useConfigStore();
  // eslint-disable-next-line
  const res = await FitnesService.changePassword(configStore.integration_code, payload);
  // const { data, result } = res.data;
  // if (result && data.user_token) {
  //   authStore.setUserToken(data.user_token);
  // }
};

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

  showElements.value.view2 = false;
  showElements.value.view3 = true;
};

const auth = async () => {
  const localPhone = phone.value.replace(/[()\-\+\s]/g, '');
  const payload: IRegAndAuthPayload = {
    phone: localPhone,
    pass_token: passToken.value,
    password: password.value,
    last_name: lastName.value,
    name: firstName.value,
    second_name: middleName.value,
    email: email.value,
    birthday: birthday.value,
  };
  const configStore = useConfigStore();
  const res = await FitnesService.regAndAuth(configStore.integration_code, payload);
  const { data, result, error, error_message } = res.data;

  if (result) {
    clearError();
    // VueCookies.set('userToken', data.pass_token);
    authStore.setUserToken(data.user_token);
    // Отправка цели Яндекс.Метрики
    if (typeof (window as any).sendYandexGoal === 'function') {
      (window as any).sendYandexGoal('completeRegistration');
    }
  } else {
    errorObj.code = error;
    errorObj.type = 'code';
    errorObj.message = error_message;
    return false;
  }
  return true;
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
    email: helpers.withMessage('Введите корректный email', (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    })
  },
  birthday: {
    required: helpers.withMessage('Поле обязательное', required),
    format: helpers.withMessage('Введите дату в формате ДД.ММ.ГГГГ', (value: string) => {
      const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
      return dateRegex.test(value);
    }),
    range: helpers.withMessage('Дата выходит за границу допустимого диапазона', (value: string) => {
      const parts = value.split('.');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      if (year < 1930 || year > 2099) {
        return false;
      }

      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        daysInMonth[1] = 29;
      }

      if (day < 1 || day > daysInMonth[month - 1]) {
        return false;
      }

      return true;
    }),
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

  await auth();
  showElements.value.view3 = false;
};

// const insertSpaces = (str: string, positions: number[]) => {
//   let result = '';
//   let currentIndex = 0;
//   for (const pos of positions) {
//     console.log('currentIndex', currentIndex)
//     console.log('pos', pos)
//     result += str.slice(currentIndex, pos) + ' ';
//     console.log('result', result)
//     currentIndex = pos;
//   }
//   result += str.slice(currentIndex);
//   return result;
// }

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

const preventInvalidInput = (event: KeyboardEvent) => {
  const allowedKeysShort = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  const allowedKeysLong = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  const key = event.key;

  if (typeof v$.value.birthday.$model === 'string' && v$.value.birthday.$model.length === 10 && !allowedKeysLong.includes(key)) {
    event.preventDefault();
  } else if (typeof v$.value.birthday.$model === 'string' && v$.value.birthday.$model.length < 10 && !allowedKeysShort.includes(key)) {
    event.preventDefault();
  }
};

const changeBirthDay = (event: any) => {
  let value = event.target.value.replace(/\D/g, '');

  if (value.length > 2) {
    value = value.substring(0, 2) + '.' + value.substring(2);
  }

  if (value.length > 5) {
    value = value.substring(0, 5) + '.' + value.substring(5);
  }

  value = value.substring(0, 10);
  v$.value.birthday.$model = value;
};

</script>

<template>
  <Dialog
    v-model:visible="showElements.view1"
    class=""
    modal
    header="Регистрация"
    style="max-width: 24rem;"
    @hide="hide()"
  >

    <div class="flex flex-col mb-4">
      <label for="password" class="font-semibold mb-2">
        Телефон
      </label>
      <InputText
        id="phone"
        v-model.number="phone"
        @input="changePhone"
        class="flex-auto"
        autocomplete="off"
      />
    </div>

    <div class="flex flex-col mb-4">
      <label for="password" class="font-semibold mb-2">
        Пароль
      </label>
      <InputText
        id="password"
        v-model="password"
        type="password"
        class="flex-auto"
        autocomplete="off"
        @input="checkPassword()"
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
        class="flex-auto"
        autocomplete="off"
        @input="checkPassword()"
      />
    </div>

    <div class="flex gap-4 items-center mb-4">
      <Checkbox v-model="acceptedAgreement" :binary="true" />
      <span class="">
        Я ознакомлен с правилами и согласен на
        <a
          class="font-semibold text-green cursor-pointer hover:underline"
          @click="showTermsOfService()"
          >обработку персональных данных</a
        >
      </span>
    </div>

    <div
      v-if="errorObj.message"
      class="mb-4 text-red-700"
    >
      <span>{{ errorObj.message }} </span>
    </div>

    <Button
      label="Зарегистрироваться"
      @click="clickRegister()"
      class="w-full"
      raised
    />
  </Dialog>

  <Dialog
    v-model:visible="showElements.view2"
    class=""
    modal
    header="Регистрация"
    style="max-width: 24rem;"
    @hide="hide()"
  >
    <div class="text-green mb-4">
      Сообщение с кодом подтверждения отправлено по СМС
    </div>

    <div class="flex flex-col">
      <label for="confirm-code" class="font-semibold mb-2">
        Код подтверждения
      </label>

      <InputText
        id="confirm-code"
        v-model="confirmationCode"
        class="flex-auto"
        autocomplete="off"
      />
    </div>

    <div v-if="errorObj.message" class="mt-4 text-red-700">
      <span>{{ errorObj.message }} </span>
    </div>

    <Button
      label="Подтвердить"
      class="mt-4 w-full"
      raised
      @click="clickConfirm()"
    />
  </Dialog>

  <Dialog
    v-model:visible="showElements.view3"
    modal
    header="Расскажите о себе"
    class="w-[24rem]"
    @hide="hide()"
  >
    <div class="flex flex-col">
      <label for="last-name" class="font-semibold mb-2">
        Фамилия
      </label>
      <InputText
        id="last-name"
        v-model="v$.lastName.$model"
        autocomplete="off"
      />
    </div>

    <div v-if="v$.lastName.$errors.length" class="text-red-700 mt-2">
      {{ v$.lastName.$errors[0].$message }}
    </div>

    <div class="flex flex-col mt-4">
      <label for="first-name" class="font-semibold mb-2">
        Имя
      </label>
      <InputText
        id="first-name"
        v-model="v$.firstName.$model"
        autocomplete="off"
      />
    </div>

    <div v-if="v$.firstName.$errors.length"  class="text-red-700 mt-2">
      {{ v$.firstName.$errors[0].$message }}
    </div>

    <div class="flex flex-col mt-4">
      <label for="middle-name" class="font-semibold mb-2">
        Отчество
      </label>
      <InputText
        id="middle-name"
        v-model="v$.middleName.$model"
        autocomplete="off"
      />
    </div>

    <div v-if="v$.middleName.$errors.length" class="text-red-700 mt-2">
      {{ v$.middleName.$errors[0].$message }}
    </div>

    <div class="flex flex-col mt-4">
      <label for="e-mail" class="font-semibold mb-2">
        E-mail
      </label>
      <InputText
        id="e-mail"
        v-model="v$.email.$model"
        autocomplete="off"
      />
    </div>

    <div v-if="v$.email.$errors.length" class="text-red-700 mt-2">
      {{ v$.email.$errors[0].$message }}
    </div>

    <div class="flex flex-col mt-4">
      <label for="birthday" class="font-semibold mb-2">
        Дата рождения
      </label>
      <InputText
        id="birthday"
        @keydown="preventInvalidInput($event)"
        @input="changeBirthDay"
        placeholder="ДД.ММ.ГГГГ"
        v-model="v$.birthday.$model"
        autocomplete="off"
      />
    </div>

    <div v-if="v$.birthday.$errors.length" class="text-red-700 mt-2">
      {{ v$.birthday.$errors[0].$message }}
    </div>

    <Button
      label="Отправить"
      class="w-full mt-4"
      @click="clickSendAbout()"
      raised
    />

  </Dialog>

  <Dialog
    v-model:visible="showElements.view4"
    modal
    @hide="showElements.view1 = true"
  >
    <div v-html="agreement" />
  </Dialog>
</template>