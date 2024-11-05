<script lang="ts" setup>
import { ref } from 'vue';
// import { IFitnesScheduleSegmentCreate } from '@/types/IFitnesScheduleSegment';
import { useFitnesStore } from '@/store/fitnes';
import { IFitnessTariff } from '@/types/IFitnessTariff';
import tariffTypeOptions from '@/data/tariffTypeOptions';
// import dayjs from 'dayjs';
// import 'dayjs/locale/ru';

interface ITariffTypeOption {
  name: string
  value: string
}

const props = withDefaults(defineProps<{
  widgetId: number
}>(), {
  widgetId: 0,
});

const fitnessStore = useFitnesStore();
const tariff = ref<IFitnessTariff>({
  uid: '',
  widget_id: 0,
  title: '',
  description: '',
  is_new: false,
  start_date: null,
  end_date: null,
  type: '',
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
  end_time: '10:00'
});

const start_date = ref<Date>()
const end_date = ref<Date>()

const tariffTypeOption = ref<ITariffTypeOption | null>();

const clickAddButton = async () => {
  tariff.value.widget_id = props.widgetId;
  if (tariffTypeOption.value && tariffTypeOption.value.value) tariff.value.type = tariffTypeOption.value.value;
  await fitnessStore.create_or_update_tariff(tariff.value);
  fitnessStore.showAddTariffDialog = false;
  window.location.reload();
};

const onDateSelectStartDate = (event: Date) => {
  const date = new Date(
    Date.UTC(event.getFullYear(), event.getMonth(), event.getDate())
  );
  const isoDate = date.toISOString();
  tariff.value.start_date = isoDate.split('T')[0];
}

const onDateSelectEndDate = (event: Date) => {
  const date = new Date(
    Date.UTC(event.getFullYear(), event.getMonth(), event.getDate())
  );
  const isoDate = date.toISOString();
  tariff.value.end_date = isoDate.split('T')[0];
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
    v-model:visible="fitnessStore.showAddTariffDialog"
    modal
    header="Добавление тарифа"
    :style="{ width: '32rem' }"
  >

    <div class="flex items-center gap-4 mb-4">
      <label for="uid" class="font-semibold w-36">UID</label>
      <InputText
        id="uid"
        class="flex-auto"
        autocomplete="off"
        v-model="tariff.uid"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="title" class="font-semibold w-36">Название</label>
      <InputText
        id="title"
        class="flex-auto"
        autocomplete="off"
        v-model="tariff.title"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="title" class="font-semibold w-36">Описание</label>
      <InputText
        id="title"
        class="flex-auto"
        autocomplete="off"
        v-model="tariff.description"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="start_date" class="font-semibold w-36">Дата начала</label>
      <DatePicker
        dateFormat="dd/mm/yy"
        class="flex-auto"
        v-model="start_date"
        @date-select="onDateSelectStartDate"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="end_date" class="font-semibold w-36">Дата окончания</label>
      <DatePicker
        v-model="end_date"
        dateFormat="dd/mm/yy"
        class="flex-auto"
        @date-select="onDateSelectEndDate"
      />
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
        v-model="tariff.is_monday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Вторник</label>
      <Checkbox
        v-model="tariff.is_tuesday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Среда</label>
      <Checkbox
        v-model="tariff.is_wednesday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Четверг</label>
      <Checkbox
        v-model="tariff.is_thursday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Пятница</label>
      <Checkbox
        v-model="tariff.is_friday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Суббота</label>
      <Checkbox
        v-model="tariff.is_saturday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Воскресенье</label>
      <Checkbox
        v-model="tariff.is_sunday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Праздники</label>
      <Checkbox
        v-model="tariff.is_holiday"
        :binary="true"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Взрослых: {{ tariff.count_adults }}</label>
      <Slider v-model="tariff.count_adults" :step="1" :max="10" class="flex-auto" />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Детей: {{ tariff.count_children }}</label>
      <Slider v-model="tariff.count_children" :step="1" :max="10" class="flex-auto" />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="start_time" class="font-semibold w-36">Время начала</label>
      <InputText
        id="start_time"
        class="flex-auto"
        autocomplete="off"
        v-model="tariff.start_time"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="end_time" class="font-semibold w-36">Время окончания</label>
      <InputText
        id="end_time"
        class="flex-auto"
        autocomplete="off"
        v-model="tariff.end_time"
      />
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Добавить" @click="clickAddButton"></Button>
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

