<script lang="ts" setup>
import { useFitnesStore } from '@/store/fitnes';
const fitnesStore = useFitnesStore();

const clickUpdateConfig = () => {
  fitnesStore.update();
  fitnesStore.showConfigDialog = false;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key == 'Enter') {
    clickUpdateConfig();
  }
};

const toggleDialog = async (value: boolean) => {
  if(value){
    await fitnesStore.get()
    window.addEventListener('keydown', handleKeydown)
  } else {
    fitnesStore.clear()
    window.removeEventListener('keydown', handleKeydown)
  }
}



</script>

<template>
  <Dialog
    v-model:visible="fitnesStore.showConfigDialog"
    @show="toggleDialog(true)"
    @hide="toggleDialog(false)"
    :style="{ width: '450px' }"
    header="Конфигурация Fitnes"
    :modal="true"
    class="p-fluid"
  >
    <!-- <img :src="'/demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
    <div class="field flex items-center gap-4">
      <label for="title" class="font-semibold w-32">Заголовок</label>
      <InputText
        id="title"
        v-model.trim="fitnesStore.config.title"
        required="true"
        autofocus
      />
      <!-- <small class="p-invalid">Name is required.</small> -->
    </div>

    <!-- <img :src="'/demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
    <div class="field flex items-center gap-4">
      <label for="api_url" class="font-semibold w-32">API URL</label>
      <InputText
        id="api_url"
        v-model.trim="fitnesStore.config.api_url"
        required="true"
        autofocus
      />
      <!-- <small class="p-invalid">Name is required.</small> -->
    </div>

    <!-- <img :src="'/demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
    <div class="field flex items-center gap-4">
      <label for="api_key" class="font-semibold w-32">API KEY</label>
      <InputText
        id="api_key"
        v-model.trim="fitnesStore.config.api_key"
        required="true"
        autofocus
      />
      <!-- <small class="p-invalid">Name is required.</small> -->
    </div>

    <div class="field flex items-center gap-4">
      <label for="club_id" class="font-semibold w-32">CLUB ID</label>
      <InputText
        id="club_id"
        v-model.trim="fitnesStore.config.club_id"
        required="true"
        autofocus
      />
      <!-- <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small> -->
    </div>

    <div class="field flex items-center gap-4">
      <label for="service_id" class="font-semibold w-32">SERVICE ID</label>
      <InputText
        id="service_id"
        v-model.trim="fitnesStore.config.service_id"
        required="true"
        autofocus
      />
      <!-- <small class="p-invalid">Name is required.</small> -->
    </div>

    <div class="field flex items-center gap-4">
      <label for="username" class="font-semibold w-32">Логин</label>
      <InputText
        id="username"
        v-model.trim="fitnesStore.config.username"
        required="true"
        autofocus
      />
    </div>

    <div class="field flex items-center gap-4">
      <label for="password" class="font-semibold w-32">Пароль</label>
      <InputText
        id="password"
        v-model.trim="fitnesStore.config.password"
        required="true"
        type="password"
        autofocus
      />
    </div>

    <!-- <div class="field flex items-center gap-4">
      <label for="inventoryStatus" class="font-semibold w-32">Роль</label>
      <Dropdown
        id="inventoryStatus"
        :options="roles"
        v-model="role"
        optionLabel="label"
        placeholder="Выберите роль"
        class="w-full"
      >
      </Dropdown>
    </div> -->

    <template #footer>
        <Button label="Сохранить" @click="clickUpdateConfig" />
    </template>
  </Dialog>
</template>