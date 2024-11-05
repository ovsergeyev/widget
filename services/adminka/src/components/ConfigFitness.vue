<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useFitnesStore } from '@/store/fitnes';
import AddFictitiousUserPopup from './popups/AddFictitiousUserPopup.vue';
import AddScheduleSegmentPopup from './popups/AddScheduleSegmentPopup.vue';
import AddTariffPopup from './popups/AddTariffPopup.vue';
import AddPromocodePopup from './popups/AddPromocodePopup.vue';
import EditTariffPopup from './popups/EditTariffPopup.vue';
import { IFitnessTariff } from '@/types/IFitnessTariff';
import EditPromocodePopup from './popups/EditPromocodePopup.vue';
import tariffTypeOptions from '@/data/tariffTypeOptions';
import FitnesService from '@/services/FitnesService';

const authStore = useAuthStore();
const fitnesStore = useFitnesStore();
const widgetId = ref(0);

onMounted(async()=>{
  // if (!authStore.user.id){
  //   await authStore.getCurrentUser();
  // };
  // console.log('id', authStore.user.id)
  fitnesStore.currentUserId = authStore.user.id;
  await fitnesStore.get();
  // await updateFictitiousUsers();
});

const clickUpdateConfig = () => {
  fitnesStore.update();
};

const clickAddScheduleSegmentButton = () => {
  widgetId.value = fitnesStore.config.id;
  fitnesStore.showAddScheduleDialog = true;
};

const clickAddTariffButton = () => {
  widgetId.value = fitnesStore.config.id;
  fitnesStore.showAddTariffDialog = true;
};

const clickAddPromocodeButton = () => {
  widgetId.value = fitnesStore.config.id;
  fitnesStore.showAddPromocodeDialog = true;
};

const clickLoadTariffButton = async () => {
  console.log('click load')
  let famousUids = new Set();
  fitnesStore.config.tariffs.forEach((tariff: IFitnessTariff) => {
    famousUids.add(tariff.uid);
  });
  console.log('famous', famousUids);
  const res = await FitnesService.priceList(fitnesStore.config.integration_code)
  const allTariffs = res.data.data;
  const unknownTariffs = allTariffs.filter((tariff: any) => !famousUids.has(tariff.id));
  console.log('unk', unknownTariffs);
  unknownTariffs.forEach(async (unknownTariff: any) => {
    const tariff: IFitnessTariff = {
      uid: unknownTariff.id,
      widget_id: fitnesStore.config.id,
      title: unknownTariff.title,
      description: unknownTariff.available_time,
      is_new: true,
      start_date: null,
      end_date: null,
      type: 'fixed',
      is_monday: false,
      is_tuesday: false,
      is_wednesday: false,
      is_thursday: false,
      is_friday: false,
      is_saturday: false,
      is_sunday: false,
      is_holiday: false,
      count_adults: 1,
      count_children: 0,
      start_time: '08:00',
      end_time: '23:00'
    };

    await fitnesStore.create_or_update_tariff(tariff);
  });
  window.location.reload();
}

const clickEditTariffButton = (data: any) => {
  const currentTariff = fitnesStore.config.tariffs.find((tariff: any) => tariff.id === data.id);
  if(currentTariff){
    fitnesStore.currentTariff = {...currentTariff};
  }
  fitnesStore.showEditTariffDialog = true;
};

const clickEditPromocodeButton = (data: any) => {
  const currentPromocode = fitnesStore.config.promocodes.find((promocode: any) => promocode.id === data.id);
  if(currentPromocode){
    fitnesStore.currentPromocode = {...currentPromocode};
  }
  fitnesStore.showEditPromocodeDialog = true;
};

const clickEditUkassaButton = () => {
  fitnesStore.create_or_update_ukassa();
};

const clickDeleteScheduleSegmentButton = async (data: any) => {
  await fitnesStore.deleteScheduleSegment(data.id);
  window.location.reload();
};

const clickDeleteTariffButton = (data: any) => {
  fitnesStore.deleteTariff(data.id);
  window.location.reload();
};

const clickDeletePromocodeButton = async (data: any) => {
  fitnesStore.deletePromocode(data.id);
  await fitnesStore.get();
};

const updateFictitiousUsers = async () => {
  // const res = await FitnesService.getFictitiousUsers(fitnesStore.config.id);
  // fictitiousUsers.value = res.data;
}

const getTariffTypeName = (value: string) => {
  let result = '';
  const option = tariffTypeOptions.find(option => option.value === value);
  if(option) result = option.name;
  return result;
}

</script>

<template>
  <div class="card">
    <h3>Fitness Widget</h3>
    <Accordion value="3">
      <AccordionPanel value="0">
        <AccordionHeader><h4>Общие настройки</h4></AccordionHeader>
        <AccordionContent>
          <div class="field flex items-center gap-4">
            <label for="title" class="font-semibold w-64">Заголовок</label>
            <InputText
              id="title"
              v-model.trim="fitnesStore.config.title"
              required="true"
              autofocus
              class="w-full"
            />
          </div>

          <div class="field flex items-center gap-4">
            <label for="title" class="font-semibold w-64">Описание (блок тарифы)</label>
            <InputText
              id="title"
              v-model.trim="fitnesStore.config.description"
              required="true"
              autofocus
              class="w-full"
            />
          </div>

          <div class="field flex items-center gap-4">
            <label for="title" class="font-semibold w-64">Сообщение после оплаты</label>
            <InputText
              id="title"
              v-model.trim="fitnesStore.config.message_after_payment"
              required="true"
              autofocus
              class="w-full"
            />
          </div>

          <div class="field flex items-center gap-4">
            <label for="metrica" class="font-semibold w-64">Код Метрики</label>
            <InputText
              id="metrica"
              v-model.trim="fitnesStore.config.metrica_code"
              required="true"
              autofocus
              class="w-full"
            />
          </div>

          <div class="field flex items-center gap-4">
            <label for="api_url" class="font-semibold w-64">API URL</label>
            <InputText
              id="api_url"
              v-model.trim="fitnesStore.config.api_url"
              required="true"
              autofocus
              class="w-full"
            />
          </div>

          <div class="field flex items-center gap-4">
            <label for="api_key" class="font-semibold w-64">API KEY</label>
            <InputText
              id="api_key"
              v-model.trim="fitnesStore.config.api_key"
              required="true"
              autofocus
              class="w-full"
            />

          </div>

          <div class="field flex items-center gap-4">
            <label for="club_id" class="font-semibold w-64">CLUB ID</label>
            <InputText
              id="club_id"
              v-model.trim="fitnesStore.config.club_id"
              required="true"
              autofocus
              class="w-full"
            />
          </div>

          <div class="field flex items-center gap-4">
            <label for="service_id" class="font-semibold w-64">SERVICE ID</label>
            <InputText
              id="service_id"
              v-model.trim="fitnesStore.config.service_id"
              required="true"
              autofocus
              class="w-full"
            />
          </div>

          <div class="field flex items-center gap-4">
            <label for="username" class="font-semibold w-64">Логин</label>
            <InputText
              id="username"
              v-model.trim="fitnesStore.config.username"
              required="true"
              autofocus
              class="w-full"
            />
          </div>

          <div class="field flex items-center gap-4">
            <label for="password" class="font-semibold w-64">Пароль</label>
            <InputText
              id="password"
              v-model.trim="fitnesStore.config.password"
              required="true"
              type="password"
              autofocus
              class="w-full"
            />
          </div>

          <div class="flex justify-end">
            <Button label="Сохранить" @click="clickUpdateConfig" />
          </div>
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="1">
        <AccordionHeader><h4>Сегменты расписания</h4></AccordionHeader>
        <AccordionContent>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            class="mb-4"
            severity="success"
            @click="clickAddScheduleSegmentButton"
          />
          <DataTable :value="fitnesStore.config.schedule_segments" tableStyle="min-width: 50rem">
            <Column field="title" header="Заголовок"></Column>
            <Column field="start_time" header="Время начала"></Column>
            <Column field="end_time" header="Время окончания"></Column>
            <Column header="Удалить">
              <template #body="slotProps">
                <Button
                  icon="pi pi-trash"
                  class="mr-2"
                  severity="danger"
                  @click="clickDeleteScheduleSegmentButton(slotProps.data)"
                  rounded
                />
              </template>
            </Column>
          </DataTable>
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="2">
        <AccordionHeader><h4>Тарифы</h4></AccordionHeader>
        <AccordionContent>
          <div class="flex gap-4">
            <Button
              label="Добавить"
              icon="pi pi-plus"
              class="mb-4"
              severity="success"
              @click="clickAddTariffButton"
            />
            <Button
              label="Загрузить новые тарифы"
              icon="pi pi-plus"
              class="mb-4"
              severity="success"
              @click="clickLoadTariffButton"
            />
          </div>

          <DataTable :value="fitnesStore.config.tariffs" tableStyle="min-width: 50rem">
            <Column field="title" header="Заголовок">
              <template #body="slotProps">
                <div>
                  <Tag v-if="slotProps.data.is_new" severity="success" value="Новый" />
                  {{ slotProps.data.title }}
                </div>
              </template>
            </Column>
            <Column field="start_time" header="Время начала"></Column>
            <Column field="end_time" header="Время окончания"></Column>
            <Column header="Взрослых">
              <template #body="slotProps">
                {{ slotProps.data.count_adults }}
              </template>
            </Column>
            <Column header="Детей">
              <template #body="slotProps">
                {{ slotProps.data.count_children }}
              </template>
            </Column>
            <Column>
              <template #header>
                <div class="w-full text-center">Тип тарифа</div>
              </template>
              <template #body="slotProps">
                <div class="flex justify-center">
                  {{ getTariffTypeName(slotProps.data.type) }}
                </div>
              </template>
            </Column>
            <Column header="Дни">
              <template #body="slotProps">

                <div class="flex items-center gap-4 mb-4">
                  <label class="font-semibold w-36">Понедельник</label>
                  <Checkbox
                    v-model="slotProps.data.is_monday"
                    :binary="true"
                    disabled
                  />
                </div>

                <div class="flex items-center gap-4 mb-4">
                  <label class="font-semibold w-36">Вторник</label>
                  <Checkbox
                    v-model="slotProps.data.is_tuesday"
                    :binary="true"
                    disabled
                  />
                </div>

                <div class="flex items-center gap-4 mb-4">
                  <label class="font-semibold w-36">Среда</label>
                  <Checkbox
                    v-model="slotProps.data.is_wednesday"
                    :binary="true"
                    disabled
                  />
                </div>

                <div class="flex items-center gap-4 mb-4">
                  <label class="font-semibold w-36">Четверг</label>
                  <Checkbox
                    v-model="slotProps.data.is_thursday"
                    :binary="true"
                    disabled
                  />
                </div>

                <div class="flex items-center gap-4 mb-4">
                  <label class="font-semibold w-36">Пятница</label>
                  <Checkbox
                    v-model="slotProps.data.is_friday"
                    :binary="true"
                    disabled
                  />
                </div>

                <div class="flex items-center gap-4 mb-4">
                  <label class="font-semibold w-36">Суббота</label>
                  <Checkbox
                    v-model="slotProps.data.is_saturday"
                    :binary="true"
                    disabled
                  />
                </div>

                <div class="flex items-center gap-4 mb-4">
                  <label class="font-semibold w-36">Воскресенье</label>
                  <Checkbox
                    v-model="slotProps.data.is_sunday"
                    :binary="true"
                    disabled
                  />
                </div>

                <div class="flex items-center gap-4 mb-4">
                  <label class="font-semibold w-36">Праздники</label>
                  <Checkbox
                    v-model="slotProps.data.is_holiday"
                    :binary="true"
                    disabled
                  />
                </div>
              </template>
            </Column>
            <Column>
              <template #body="slotProps">
                <div class="flex justify-content-end">
                  <Button
                    icon="pi pi-pencil"
                    class="mr-2"
                    severity="success"
                    rounded
                    @click="clickEditTariffButton(slotProps.data)"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="mr-2"
                    severity="danger"
                    @click="clickDeleteTariffButton(slotProps.data)"
                    rounded
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="3">
        <AccordionHeader><h4>Промокоды</h4></AccordionHeader>
        <AccordionContent>
          <div class="flex gap-4">
            <Button
              label="Добавить"
              icon="pi pi-plus"
              class="mb-4"
              severity="success"
              @click="clickAddPromocodeButton"
            />
          </div>

          <DataTable :value="fitnesStore.config.promocodes" tableStyle="min-width: 50rem">
            <Column field="title" header="Название">
              <template #body="slotProps">
                <div>
                  {{ slotProps.data.title }}
                </div>
              </template>
            </Column>
            <Column field="title" header="Промокод">
              <template #body="slotProps">
                <div>
                  {{ slotProps.data.promocode }}
                </div>
              </template>
            </Column>
            <Column field="start_date" header="Дата начала"></Column>
            <Column field="end_date" header="Дата окончания"></Column>
            <Column field="start_time" header="Время начала"></Column>
            <Column field="end_time" header="Время окончания"></Column>
            <Column header="Автоматическое применение">
              <template #body="slotProps">
                <div class="flex items-center">
                  <Checkbox
                    v-model="slotProps.data.auto_apply"
                    :binary="true"
                    disabled
                  />
                </div>
              </template>
            </Column>
            <Column>
              <template #body="slotProps">
                <div class="flex justify-content-end">
                  <Button
                    icon="pi pi-pencil"
                    class="mr-2"
                    severity="success"
                    rounded
                    @click="clickEditPromocodeButton(slotProps.data)"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="mr-2"
                    severity="danger"
                    @click="clickDeletePromocodeButton(slotProps.data)"
                    rounded
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="4">
        <AccordionHeader><h4>Платежный шлюз (Ukassa)</h4></AccordionHeader>
        <AccordionContent>
          <div class="field flex items-center gap-4">
            <label for="account_id" class="font-semibold w-64">Идентификатор аккаунта</label>
            <InputNumber
              id="account_id"
              v-model="fitnesStore.ukassa.account_id"
              required="true"
              autofocus
              class="w-full"
            />
          </div>

          <div class="field flex items-center gap-4">
            <label for="secret_key" class="font-semibold w-64">Секретный ключ</label>
            <InputText
              id="secret_key"
              v-model.trim="fitnesStore.ukassa.secret_key"
              required="true"
              autofocus
              class="w-full"
            />
          </div>

          <div class="field flex items-center gap-4">
            <label for="back_url" class="font-semibold w-64">Ссылка после оплаты</label>
            <InputText
              id="back_url"
              v-model.trim="fitnesStore.ukassa.back_link"
              required="true"
              autofocus
              class="w-full"
            />
          </div>

          <div class="flex justify-end">
            <Button label="Сохранить" @click="clickEditUkassaButton" />
          </div>
        </AccordionContent>
      </AccordionPanel>

    </Accordion>
  </div>

  <AddScheduleSegmentPopup :widget-id="widgetId" />
  <AddTariffPopup :widget-id="widgetId" />
  <AddPromocodePopup :widget-id="widgetId" />
  <EditTariffPopup />
  <EditPromocodePopup />
  <AddFictitiousUserPopup
    :widget-id="widgetId"
    @update="updateFictitiousUsers"
  />

</template>