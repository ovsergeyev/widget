import { defineStore } from 'pinia';
import { ref } from 'vue';
import FitnesService from '@/services/FitnesService';
import { useConfigStore } from './config';

export const useAuthStore = defineStore('auth', () => {
  const userToken = ref();
  const user = ref({
    id: '',
    name: '',
    last_name: '',
    second_name: '',
    phone: '',
  })
  const setUserToken = async (token: string) => {
    userToken.value = token;
    const configStore = useConfigStore();
    const res = await FitnesService.getUser(
      configStore.integration_code, token
    );
    const res_user = res.data.data;
    user.value.id = res_user.id;
    user.value.name = res_user.name;
    user.value.last_name = res_user.last_name;
    user.value.second_name = res_user.second_name;
    user.value.phone = res_user.phone;

    localStorage.setItem('user_token', userToken.value);
  };

  const waitForSetUserToken = () => {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(()=>{
        if(userToken.value) {
          clearInterval(intervalId);
          resolve(userToken)
        }
      }, 250);

      // setTimeout(() => {
      //   clearInterval(intervalId);
      //   reject(new Error('Timeout: user_token not set'))
      // }, 3000);
    });
  };

  return {
    userToken,
    user,
    setUserToken,
    waitForSetUserToken,
  };
});
