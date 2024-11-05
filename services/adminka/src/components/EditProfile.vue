<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useUsersStore } from '@/store/users';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const usersStore = useUsersStore();
const route = useRoute();

const roles = [
  {
    value: 'admin',
    label: 'Администратор'
  },
  {
    value: 'client',
    label: 'Клиент'
  },
]

const user = ref();
const role = ref();

const initial = async()=>{
  // console.log('store', usersStore.users)
  if (!usersStore.users.length){
    await usersStore.getUsers();
  }
  if(route.params.user_id){
    user.value = usersStore.users.find((u)=>u.id === +route.params.user_id);
  } else {
    user.value = usersStore.users.find((u)=>u.id === +authStore.user.id);
  };

  role.value = roles.find((el) => el.value === user.value.role);
}
initial();

const submitUser = () => {
  user.value.role = role.value.value
  usersStore.currentEditUser = user.value
  usersStore.editUser();
  usersStore.showEditDialog = false;
}

</script>
<template>
  <Card v-if="user" class="max-w-xl">
    <template #title><h3>Профиль</h3></template>
    <template #content>
      <div class="field flex items-center">
        <label for="login" class="font-semibold w-24">Логин</label>
        <InputText
          id="login"
          v-model.trim="user.username"
          required="true"
          class="w-full"
          autofocus
        />
      </div>

      <div class="field flex items-center">
        <label for="inventoryStatus" class="font-semibold w-24">Роль</label>
        <Dropdown
          id="inventoryStatus"
          v-model="role"
          :options="roles"
          optionLabel="label"
          placeholder="Выберите роль"
          class="w-full"
        >
        </Dropdown>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <Button label="Изменить" @click="submitUser" />
      </div>
    </template>
  </Card>
</template>