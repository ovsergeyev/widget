import { defineStore } from "pinia";
import { ref } from 'vue';
import UsersService from '@/services/UsersService';
import { IResponse } from '@/types/IResponse';
import { IUser, IUserCreate, IUserEdit } from "@/types/IUser";

export const useUsersStore = defineStore('users', () => {
  const users = ref<IUser[]>([]);
  const currentEditUser = ref<IUserEdit>({
    id: 0,
    username: '',
    password: "",
    role: "",
    is_active: false,
    is_deleted: false
  });
  const currentFreezeUserId = ref();
  const currentDeleteUserId = ref();
  const showCreateDialog = ref(false);
  const showEditDialog = ref(false);
  const showFreezeDialog = ref(false);
  const showDeleteDialog = ref(false);
  const getUsers = async () => {
    try {
      const response: IResponse = await UsersService.getUsers();
      if (response.status == 200) {
        users.value = response.data.filter((user: IUser) => user.is_deleted === false)
      }
      // console.log('users', users)
    } catch (e) {
      console.log('err', e);
    }
  };
  const createUser = async (payload: IUserCreate) => {
    try {
      const response: IResponse = await UsersService.createUser(payload);
      console.log('resp', response);
    } catch (e) {
      console.log('err', e)
    }
  };

  const editUser = async () => {
    try {
      // const response: IResponse = await UsersService.editUser(currentEditUser.value);
      const response: IResponse = await UsersService.editUser(currentEditUser.value);
      console.log('resp', response)
    } catch (e) {
      console.log('err', e)
    }
  };

  const freezeUser = async () => {
    try {
      // const response: IResponse = await UsersService.editUser(currentEditUser.value);
      const response: IResponse = await UsersService.freezeUser(currentFreezeUserId.value);
      console.log('resp', response)
    } catch (e) {
      console.log('err', e)
    }
  };

  const defrostUser = async () => {
    try {
      // const response: IResponse = await UsersService.editUser(currentEditUser.value);
      const response: IResponse = await UsersService.defrostUser(currentFreezeUserId.value);
      console.log('resp', response)
    } catch (e) {
      console.log('err', e)
    }
  };

  const deleteUser = async () => {
    try {
      // const response: IResponse = await UsersService.editUser(currentEditUser.value);
      const response: IResponse = await UsersService.deleteUser(currentDeleteUserId.value);
      console.log('resp', response)
    } catch (e) {
      console.log('err', e)
    }
  };

  return {
    users,
    showCreateDialog,
    showEditDialog,
    showFreezeDialog,
    showDeleteDialog,
    currentEditUser,
    currentFreezeUserId,
    currentDeleteUserId,
    getUsers,
    createUser,
    editUser,
    freezeUser,
    defrostUser,
    deleteUser,
  }
  // const user = reactive({
  //   username: null as string | null,
  //   role: null as string | null
  // });
  // const showLoginPopup = ref(false);
  // const showLogoutPopup = ref(false);
  // const errorMessage = ref('');
  // const token = ref<IAccessToken | null>(null);
  // const signIn = async (username: string, password: string) => {
  //   const payload: IUserLogin = {
  //     username,
  //     password,
  //   };

  //   const response: IResponse = await AuthService.login(payload);

  //   if (response.status == 200) {
  //     token.value = response.data;
  //     console.log('tokens', token.value);
  //     // setCookie("access_token", token.access_token, token.expire);
  //     const currentUser: IUser = await getCurrentUser()
  //     user.username = currentUser.username;
  //     user.role = currentUser.role;
  //     showLoginPopup.value = false;
  //     // authStore.auth(username.value, password.value);
  //   } else {
  //     errorMessage.value = response.data.detail
  //   }
  //   // console.log('login', login);
  //   // console.log('password', password);
  //   // const foundUser = users.find((el: { login: string, password: string }) => {
  //   //   let result = true;
  //   //   if (el.login !== login) result = false;
  //   //   if (el.password !== password) result = false;
  //   //   return result
  //   // });
  //   // if (foundUser) {
  //   //   user.login = foundUser.login;
  //   //   user.roles = foundUser.roles;
  //   //   showLoginPopup.value = false;
  //   // }
  //   // if (!foundUser) {
  //   //   errorMessage.value = "Неправильный ввод логина и/или пароля"
  //   // }

  // }

  // const logout = async () => {
  //   console.log('logout')
  //   const response: IResponse = await AuthService.logout();
  //   user.username = ''
  //   user.role = ''
  //   console.log('response', response)
  //   showLogoutPopup.value = false;
  // }

  // const isLogin = () => {
  //   let result = false
  //   if (user.username) result = true
  //   if (result) {
  //     console.log(user)
  //   }
  //   return result
  // }

  // const getCurrentUser = async () => {
  //   const response: IResponse = await AuthService.getCurrentUser();
  //   // console.log('response', response)
  //   if (response.status == 200) {
  //     const user: IUser = response.data;
  //     // console.log('user', user);
  //     return user
  //   } else {
  //     // errorMessage.value = response.data.detail
  //     // console.log('error', response.data.detail)
  //     throw response
  //   }
  // }

  // return {
  //   showLoginPopup,
  //   showLogoutPopup,
  //   user,
  //   errorMessage,
  //   signIn,
  //   logout,
  //   isLogin,
  //   getCurrentUser
  // };
});