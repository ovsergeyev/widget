<!-- eslint-disable linebreak-style -->
<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from 'primevue/usetoast';
import { onMounted } from "vue";
import { useUsersStore } from "@/store/users";
// import { useFitnesStore } from "@/store/fitnes";
import { useRouter } from "vue-router";
import CreateUserPopup from "@/components/popups/CreateUserPopup.vue"
import EditUserPopup from "@/components/popups/EditUserPopup.vue";
import ConfigFitnesPopup from "@/components/popups/ConfigFitnesPopup.vue";

const toast = useToast();
// const showEditUserDialog = ref(false);
// const showFreezeUserDialog = ref(false);
const showFreezeUsersDialog = ref(false);
const showDeleteUsersDialog = ref(false);
// const submitted = ref(false);

const usersStore = useUsersStore();
// const fitnesStore = useFitnesStore();

const router = useRouter();

// const user = {
//   login: '',
//   password: '',
//   role: '',
// };

onMounted(()=>{
  usersStore.getUsers();
});

const show = () => {
  toast.add({ severity: 'error', summary: 'Код не скопирован', life: 3000 });
};

// const clickFreezeUsers = () => {
//   showFreezeUsersDialog.value = true;
//   toast.add({ severity: 'error', summary: 'Ошибка', detail: "Не удалось заморозить пользователей", life: 3000 });
// };

// const clickDeleteUsers = () => {
//   showDeleteUsersDialog.value = true;
//   toast.add({ severity: 'error', summary: 'Ошибка', detail: "Не удалось удалить пользователей", life: 3000 });
// };

// const submitUser = () => {
//   toast.add({ severity: 'error', summary: 'Ошибка', detail: "Не удалось удалить пользователя", life: 3000 });
// };

// TODO
// const product = {
//   name: 'product name'
// }

// const roles = [
//   {
//     label: 'Администратор',
//     value: 'admin'
//   },
//   {
//     label: 'Клиент',
//     value: 'client'
//   }
// ];

const clickAddButton = () => {
  usersStore.showCreateDialog = true;
};

const clickConfigWidget = (data: any) => {
  router.push({
    'name': 'profile',
    'params': {
      'user_id': data.id
    }
  })
  // console.log('data', data);
  // fitnesStore.currentUserId = data.id
  // fitnesStore.showConfigDialog = true;
  // showEditUserDialog.value = true;
};

const clickEditUser = (data: any) => {
  console.log('data in clickEditUser', data);
  console.log('data value', data.value)
  usersStore.currentEditUser = data
  usersStore.showEditDialog = true
  // showEditUserDialog.value = true;
};

const clickFreezeUser = (data: any) => {
  usersStore.currentFreezeUserId = data.id
  usersStore.showFreezeDialog = true;
};

const clickDefrostUser = async (data: any) => {
  usersStore.currentFreezeUserId = data.id
  await usersStore.defrostUser()
  window.location.reload();
};

const notConfirmFreezeUser = () => {
  usersStore.showFreezeDialog = false;
  usersStore.currentFreezeUserId = null;
};

const notConfirmDeleteUser = () => {
  usersStore.showDeleteDialog = false;
  usersStore.currentDeleteUserId = null;
}

const freezeUser = async () => {
  // console.log('freeze user', usersStore.currentFreezeUserId)
  await usersStore.freezeUser()
  usersStore.showFreezeDialog = false;
  window.location.reload();
}

const clickDeleteUser = (data: any) => {
  console.log('data in clickDeleteUser', data);
  usersStore.currentDeleteUserId = data.id;
  usersStore.showDeleteDialog = true;
  // toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Пользователь не удален', life: 3000 });
};

const deleteUser = async () => {
  await usersStore.deleteUser();
  usersStore.showDeleteDialog = false;
  window.location.reload()
};

const widgetCode = "<code></code>";

</script>
<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar>
          <template v-slot:start>
            <div class="my-2">
              <Button
                label="Добавить"
                icon="pi pi-plus"
                class="mr-2"
                severity="success"
                @click="clickAddButton()"
              />
              <!-- <Button
                label="Заморозить"
                icon="pi pi-asterisk"
                class="mr-2"
                severity="warning"
                @click="clickFreezeUsers()"
              />
              <Button
                label="Удалить"
                icon="pi pi-trash"
                severity="danger"
                @click="clickDeleteUsers()"
              /> -->
            </div>
          </template>
        </Toolbar>

        <!-- v-model:selection="selectedProducts" -->
        <!-- :filters="filters" -->
        <!-- :paginator="true"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        :rows="10" -->
        <DataTable
          ref="dt"
          :value="usersStore.users"
          dataKey="id"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Пользователи</h5>
              <!-- <IconField iconPosition="left" class="block mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                <InputText class="w-full sm:w-auto" placeholder="Search..." />
              </IconField> -->
            </div>
          </template>

          <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
          <Column field="id" header="Id" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <!-- <span class="p-column-title">Code</span> -->
              {{ slotProps.data.id }}
            </template>
          </Column>
          <Column field="name" header="Имя" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{ slotProps.data.username }}
            </template>
          </Column>
          <!-- <Column header="Image" headerStyle="width:14%; min-width:10rem;">
              <template #body="slotProps">
                  <span class="p-column-title">Image</span>
                  <img :src="'/demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image" class="shadow-2" width="100" />
              </template>
          </Column> -->
            <!-- <Column field="price" header="Price" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Price</span>
                    {{ formatCurrency(slotProps.data.price) }}
                </template>
            </Column> -->
            <Column field="role" header="Роль" :sortable="true" headerStyle="width:14%; min-width:10rem;">
              <template #body="slotProps">
                <span class="p-column-title">Category</span>
                {{ slotProps.data.role }}
              </template>
            </Column>
            <!-- <Column field="rating" header="Reviews" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Rating</span>
                    <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
                </template>
            </Column> -->
            <Column field="status" header="Статус" :sortable="true" headerStyle="width:14%; min-width:10rem;">
              <template #body="slotProps">
                <span class="p-column-title">Status</span>
                <!-- <Tag :severity="getBadgeSeverity(slotProps.data.inventoryStatus)">{{ slotProps.data.inventoryStatus }}</Tag> -->
                <Tag :severity="slotProps.data.is_active ? 'success': 'danger'">
                  {{ slotProps.data.is_active  ? "Активный" : "Не активный" }}
                </Tag>
              </template>
            </Column>
            <Column field="code" header="Код встраивания">
              <template class="relative">
                <div class="relative">
                  <Toast />
                  <Textarea v-model="widgetCode" rows="5" class="max-width w-full" />
                  <div class="absolute bottom-3 right-2 flex justify-content-end">
                    <!-- <Button type="button" label="Вход" @click="clickAuthButton()"></Button> -->
                    <!-- <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editProduct(slotProps.data)" /> -->
                    <!-- <Button icon="pi pi-check" rounded outlined aria-label="Copy code" /> -->
                    <Button
                      icon="pi pi-copy"
                      severity="secondary"
                      text rounded
                      aria-label="Copy code"
                      @click="show()"
                    />
                    <Button icon="pi pi-check" rounded aria-label="Copy code" />
                  </div>
                </div>
              </template>
            </Column>
            <Column headerStyle="min-width:10rem">
              <template #body="slotProps">
                <div class="flex justify-content-end">
                  <Button
                    icon="pi pi-cog"
                    class="mr-2"
                    severity="info"
                    rounded
                    @click="clickConfigWidget(slotProps.data)"
                  />
                  <Button
                    icon="pi pi-pencil"
                    class="mr-2"
                    severity="success"
                    rounded
                    @click="clickEditUser(slotProps.data)"
                  />
                  <Button
                    v-if="slotProps.data.is_active"
                    icon="pi pi-asterisk"
                    class="mr-2"
                    severity="warning"
                    rounded
                    @click="clickFreezeUser(slotProps.data)"
                  />
                  <Button
                    v-if="!slotProps.data.is_active"
                    icon="pi pi-asterisk"
                    class="mr-2"
                    severity="success"
                    rounded
                    @click="clickDefrostUser(slotProps.data)"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="mr-2"
                    severity="danger"
                    rounded
                    @click="clickDeleteUser(slotProps.data)"
                  />
                </div>
              </template>
            </Column>
        </DataTable>

      <Dialog v-model:visible="usersStore.showFreezeDialog" :style="{ width: '450px' }" header="Подтвердите действие" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>Вы уверены что хотите заморозить пользователя?</span>
        </div>
        <template #footer>
          <Button label="Нет" icon="pi pi-times" text @click="notConfirmFreezeUser()" />
          <Button label="Да" icon="pi pi-check" text @click="freezeUser()" />
        </template>
      </Dialog>

      <Dialog v-model:visible="showFreezeUsersDialog" :style="{ width: '450px' }" header="Подтвердите действие" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>Вы уверены что хотите заморозить пользователей?</span>
        </div>
        <template #footer>
          <Button label="Нет" icon="pi pi-times" text />
          <Button label="Да" icon="pi pi-check" text />
        </template>
      </Dialog>

      <Dialog v-model:visible="showDeleteUsersDialog" :style="{ width: '450px' }" header="Подтвердите действие" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>Вы уверены что хотите удалить пользователей?</span>
        </div>
        <template #footer>
          <Button label="Нет" icon="pi pi-times" text />
          <Button label="Да" icon="pi pi-check" text />
        </template>
      </Dialog>

      <Dialog v-model:visible="usersStore.showDeleteDialog" :style="{ width: '450px' }" header="Подтвердите действие" :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>Вы уверены что хотите удалить пользователя?</span>
        </div>
        <template #footer>
          <Button label="Нет" icon="pi pi-times" text @click="notConfirmDeleteUser()" />
          <Button label="Да" icon="pi pi-check" text @click="deleteUser()"/>
        </template>
      </Dialog>

      </div>
    </div>
    <config-fitnes-popup />
    <create-user-popup />
    <edit-user-popup />
  </div>
</template>
