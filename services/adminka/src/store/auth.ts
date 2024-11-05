import { defineStore } from "pinia";
import { ref, reactive } from 'vue';
import AuthService from '@/services/AuthService';
// import { setCookie } from '@/common';
import { IResponse } from '@/types/IResponse';
import { IAccessToken } from '@/types/IAccessToken';
import { IUser, IUserLogin } from "@/types/IUser";

export const useAuthStore = defineStore('auth', () => {
  const user = reactive({
    id: 0 as number,
    username: '' as string,
    role: '' as string
  });
  const showLoginPopup = ref(false);
  const showLogoutPopup = ref(false);
  const errorMessage = ref('');
  const token = ref<IAccessToken | null>(null);
  const authChecked = false;
  const signIn = async (username: string, password: string) => {
    const payload: IUserLogin = {
      username,
      password,
    };

    const response: IResponse = await AuthService.login(payload);

    if (response.status == 200) {
      token.value = response.data;
      console.log('tokens', token.value);
      // setCookie("access_token", token.access_token, token.expire);
      await getCurrentUser()
      showLoginPopup.value = false;
      // authStore.auth(username.value, password.value);
    } else {
      errorMessage.value = response.data.detail
    }
    // console.log('login', login);
    // console.log('password', password);
    // const foundUser = users.find((el: { login: string, password: string }) => {
    //   let result = true;
    //   if (el.login !== login) result = false;
    //   if (el.password !== password) result = false;
    //   return result
    // });
    // if (foundUser) {
    //   user.login = foundUser.login;
    //   user.roles = foundUser.roles;
    //   showLoginPopup.value = false;
    // }
    // if (!foundUser) {
    //   errorMessage.value = "Неправильный ввод логина и/или пароля"
    // }

  }

  const logout = async () => {
    console.log('logout')
    const response: IResponse = await AuthService.logout();
    user.username = ''
    user.role = ''
    console.log('response', response)
    showLogoutPopup.value = false;
  }

  const isLogin = () => {
    let result = false
    if (user.username) result = true
    // if (result) {
    //   console.log(user)
    // }
    return result
  }

  const getCurrentUser = async () => {
    const response: IResponse = await AuthService.getCurrentUser();
    // console.log('response', response)
    if (response.status == 200) {
      const currentUser: IUser = response.data;
      // console.log('user', user);
      user.id = currentUser.id
      user.username = currentUser.username;
      user.role = currentUser.role;
      return user
    } else {
      // errorMessage.value = response.data.detail
      // console.log('error', response.data.detail)
      throw response
    }
  }

  return {
    showLoginPopup,
    showLogoutPopup,
    user,
    errorMessage,
    authChecked,
    signIn,
    logout,
    isLogin,
    getCurrentUser
  };
});