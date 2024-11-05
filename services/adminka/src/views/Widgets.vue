<!-- eslint-disable linebreak-style -->
<script lang="ts" setup>
const products: any = [];
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
          :value="products"
          dataKey="id"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Виджеты</h5>
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

          <Column field="name" header="Название" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{ slotProps.data.username }}
            </template>
          </Column>
        </DataTable>

      </div>
    </div>
    <create-user-popup />
    <edit-user-popup />
  </div>
</template>
