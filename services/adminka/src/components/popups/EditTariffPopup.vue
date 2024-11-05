<script lang="ts" setup>
// import { IFitnesScheduleSegmentCreate } from '@/types/IFitnesScheduleSegment';
import { ref, onMounted, watch } from 'vue';
import { useFitnesStore } from '@/store/fitnes';
import tariffTypeOptions from '@/data/tariffTypeOptions';

interface ITariffTypeOption {
  name: string
  value: string
}

const fitnessStore = useFitnesStore();

const tariffTypeOption = ref<ITariffTypeOption | null>();
const startDate = ref<Date | null>()
const endDate = ref<Date | null>()

onMounted(()=>{
  updateDates();
});

watch(()=>fitnessStore.showEditTariffDialog, ()=>{updateDates()})

const updateDates = () => {
  if(fitnessStore.currentTariff.start_date){
    startDate.value = new Date(fitnessStore.currentTariff.start_date)
  };
  if(fitnessStore.currentTariff.end_date){
    endDate.value = new Date(fitnessStore.currentTariff.end_date)
  };
};

const setTariffOption = () => {
  const currentTariff = fitnessStore.currentTariff;
  tariffTypeOption.value = tariffTypeOptions.find(el => el.value === currentTariff.type);
};

// const tariff = computed(() => {
//   const allTariffs: Array<IFitnessTariff> = fitnessStore.config.tariffs;
//   return allTariffs.find((tariff) => tariff.uid === props.uid);
// });

const clickEditButton = async () => {
  const currentTariff = fitnessStore.currentTariff;
  let tariffType = '';
  if (tariffTypeOption.value && tariffTypeOption.value.value) tariffType = tariffTypeOption.value.value;
  currentTariff.type = tariffType;
  currentTariff.is_new = false;
  await fitnessStore.create_or_update_tariff(currentTariff);
  await fitnessStore.get();
  fitnessStore.showEditTariffDialog = false;
  window.location.reload();
};

const onDateSelectStartDate = (event: Date) => {
  const date = new Date(
    Date.UTC(event.getFullYear(), event.getMonth(), event.getDate())
  );
  const isoDate = date.toISOString();
  console.log('isoDate', isoDate)
  fitnessStore.currentTariff.start_date = isoDate.split('T')[0];
}

const onDateSelectEndDate = (event: Date) => {
  const date = new Date(
    Date.UTC(event.getFullYear(), event.getMonth(), event.getDate())
  );
  const isoDate = date.toISOString();
  fitnessStore.currentTariff.end_date = isoDate.split('T')[0];
}

const clickClearStartDate = () => {
  fitnessStore.currentTariff.start_date = null;
  startDate.value = null;
}

const clickClearEndDate = () => {
  fitnessStore.currentTariff.end_date = null;
  endDate.value = null;
}

// const segment = ref<IFitnesScheduleSegmentCreate>({
//   title: '',
//   widget_id: 0,
//   end_time: '',
//   start_time: '',
// });

// const addSegment = async () => {
//   segment.value.widget_id = props.widgetId;
//   await fitnessStore.addScheduleSegment(segment.value);
//   fitnessStore.showAddScheduleDialog = false;
//   window.location.reload();
// }

</script>

<template>
  <Dialog
    v-model:visible="fitnessStore.showEditTariffDialog"
    modal
    @show="setTariffOption"
    header="Изменение тарифа"
    :style="{ width: '32rem' }"
  >

  <div class="flex items-center gap-4 mb-4">
      <label for="title" class="font-semibold w-36">Название</label>
      <InputText
        id="title"
        class="flex-auto"
        autocomplete="off"
        v-model="fitnessStore.currentTariff.title"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="title" class="font-semibold w-36">Описание</label>
      <InputText
        id="title"
        class="flex-auto"
        autocomplete="off"
        v-model="fitnessStore.currentTariff.description"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="start_date" class="font-semibold w-36">Дата начала</label>
      <InputGroup
        class="flex-auto max-w-[240px]"
      >
        <DatePicker
          dateFormat="dd/mm/yy"
          v-model="startDate"
          @date-select="onDateSelectStartDate"
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          aria-label="Clear"
          @click="clickClearStartDate"
        />
      </InputGroup>
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="end_date" class="font-semibold w-36">Дата окончания</label>
      <InputGroup
        class="flex-auto max-w-[240px]"
      >
        <DatePicker
          v-model="endDate"
          dateFormat="dd/mm/yy"
          @date-select="onDateSelectEndDate"
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          aria-label="Clear"
          @click="clickClearEndDate"
        />
      </InputGroup>
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Тип тарифа</label>
      <Select
        v-model="tariffTypeOption"
        class="flex-auto"
        placeholder="Выберите тип"
        optionLabel="name"
        :options="tariffTypeOptions"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Понедельник</label>
      <Checkbox
        v-model="fitnessStore.currentTariff.is_monday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Вторник</label>
      <Checkbox
        v-model="fitnessStore.currentTariff.is_tuesday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Среда</label>
      <Checkbox
        v-model="fitnessStore.currentTariff.is_wednesday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Четверг</label>
      <Checkbox
        v-model="fitnessStore.currentTariff.is_thursday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Пятница</label>
      <Checkbox
        v-model="fitnessStore.currentTariff.is_friday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Суббота</label>
      <Checkbox
        v-model="fitnessStore.currentTariff.is_saturday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Воскресенье</label>
      <Checkbox
        v-model="fitnessStore.currentTariff.is_sunday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Праздники</label>
      <Checkbox
        v-model="fitnessStore.currentTariff.is_holiday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Взрослых: {{ fitnessStore.currentTariff.count_adults }}</label>
      <Slider v-model="fitnessStore.currentTariff.count_adults" :step="1" :max="10" class="flex-auto" />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Детей: {{ fitnessStore.currentTariff.count_children }}</label>
      <Slider v-model="fitnessStore.currentTariff.count_children" :step="1" :max="10" class="flex-auto" />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="start_time" class="font-semibold w-36">Время начала</label>
      <InputText
        id="start_time"
        class="flex-auto"
        autocomplete="off"
        v-model="fitnessStore.currentTariff.start_time"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="end_time" class="font-semibold w-36">Время окончания</label>
      <InputText
        id="end_time"
        class="flex-auto"
        autocomplete="off"
        v-model="fitnessStore.currentTariff.end_time"
      />
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Сохранить" @click="clickEditButton"></Button>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
.p-datepicker {
  border: 0px solid transparent;
  box-shadow: none;
  padding: 0;
}
</style>