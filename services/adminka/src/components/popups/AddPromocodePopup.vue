<script lang="ts" setup>
import { ref } from 'vue';
import { useFitnesStore } from '@/store/fitnes';
import { IFitnessPromocode } from '@/types/IFitnessPromocode';

const props = withDefaults(defineProps<{
  widgetId: number
}>(), {
  widgetId: 0,
});

const fitnessStore = useFitnesStore();
const promocode = ref<IFitnessPromocode>({
  title: '',
  widget_id: 0,
  promocode: '',
  start_date: null,
  end_date: null,
  start_time: null,
  end_time: null,
  auto_apply: false
})

const start_date = ref<Date>()
const end_date = ref<Date>()

// const tariffTypeOption = ref<ITariffTypeOption | null>();

const clickAddButton = async () => {
  promocode.value.widget_id = props.widgetId;
  await fitnessStore.create_or_update_promocode(promocode.value);
  await fitnessStore.get();
  fitnessStore.showAddPromocodeDialog = false;
};

const onDateSelectStartDate = (event: Date) => {
  const date = new Date(
    Date.UTC(event.getFullYear(), event.getMonth(), event.getDate())
  );
  const isoDate = date.toISOString();
  promocode.value.start_date = isoDate.split('T')[0];
}

const onDateSelectEndDate = (event: Date) => {
  const date = new Date(
    Date.UTC(event.getFullYear(), event.getMonth(), event.getDate())
  );
  const isoDate = date.toISOString();
  promocode.value.end_date = isoDate.split('T')[0];
}


</script>

<template>
  <Dialog
    v-model:visible="fitnessStore.showAddPromocodeDialog"
    modal
    header="Добавление промокода"
    :style="{ width: '32rem' }"
  >

    <div class="flex items-center gap-4 mb-4">
      <label for="title" class="font-semibold w-36">Название</label>
      <InputText
        id="title"
        class="flex-auto"
        autocomplete="off"
        v-model="promocode.title"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="promocode" class="font-semibold w-36">Промокод</label>
      <InputText
        id="promocode"
        class="flex-auto"
        autocomplete="off"
        v-model="promocode.promocode"
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
      <label for="start_date" class="font-semibold w-36">Дата окончания</label>
      <DatePicker
        dateFormat="dd/mm/yy"
        class="flex-auto"
        v-model="end_date"
        @date-select="onDateSelectEndDate"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="start_time" class="font-semibold w-36">Время начала</label>
      <InputText
        id="start_time"
        class="flex-auto"
        autocomplete="off"
        v-model="promocode.start_time"
      />
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label for="end_time" class="font-semibold w-36">Время окончания</label>
      <InputText
        id="end_time"
        class="flex-auto"
        autocomplete="off"
        v-model="promocode.end_time"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Авто применение</label>
      <Checkbox
        v-model="promocode.auto_apply"
        :binary="true"
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

