<script lang="ts" setup>
import { ref } from "vue";
import { useUsersStore } from "@/store/users";
import { IUserCreate } from "@/types/IUser";

const usersStore = useUsersStore();
const user = ref<IUserCreate>({
  username: '',
  password: '',
  role: '',
});

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

const role = ref({
  value: 'client',
  label: 'Клиент'
});

const createUser = () => {
  user.value.role = role.value.value;
  usersStore.createUser(user.value);
  usersStore.showCreateDialog = false;
  console.log('us', user.value)
};



</script>

<template>
  <Dialog
    v-model:visible="usersStore.showCreateDialog"
    :style="{ width: '450px' }"
    header="Создание пользователя"
    :modal="true"
    class="p-fluid"
  >
    <!-- <img :src="'/demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
    <div class="field flex items-center gap-4">
      <label for="login" class="font-semibold w-24">Логин</label>
      <!-- :invalid="submitted && !product.name" -->
      <InputText
        id="login"
        v-model.trim="user.username"
        required="true"
        autofocus
      />
      <!-- <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small> -->
    </div>

    <div class="field flex items-center gap-4">
      <label for="login" class="font-semibold w-24">Пароль</label>
      <!-- :invalid="submitted && !product.name" -->
      <InputText
        id="login"
        v-model.trim="user.password"
        required="true"
        autofocus
      />
      <!-- <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small> -->
    </div>

    <div class="field flex items-center gap-4">
      <label for="inventoryStatus" class="font-semibold w-24">Роль</label>
      <Dropdown
        id="inventoryStatus"
        :options="roles"
        v-model="role"
        optionLabel="label"
        placeholder="Выберите роль"
        class="w-full"
      >
      </Dropdown>
    </div>

    <template #footer>
        <Button label="Добавить" @click="createUser()" />
    </template>
  </Dialog>
</template>