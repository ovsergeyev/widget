<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useFitnesStore } from '@/store/fitnes';

const fitnessStore = useFitnesStore();
const start_date = ref<Date | null>()
const end_date = ref<Date | null>()

onMounted(()=>{
  updateDates();
});

watch(()=>fitnessStore.showEditPromocodeDialog, ()=>{updateDates()})

const updateDates = () => {
  if(fitnessStore.currentPromocode.start_date){
    if(fitnessStore.currentPromocode.start_date){
      console.log('date', fitnessStore.currentPromocode.start_date)
      start_date.value = new Date(fitnessStore.currentPromocode.start_date)
    }
  };
  if(fitnessStore.currentPromocode.end_date){
    if(fitnessStore.currentPromocode.end_date){
      end_date.value = new Date(fitnessStore.currentPromocode.end_date)
    }
  };
};

// const tariffTypeOption = ref<ITariffTypeOption | null>();

const clickEditButton = async () => {
  const currentPromocode = fitnessStore.currentPromocode;
  await fitnessStore.create_or_update_promocode(currentPromocode);
  await fitnessStore.get();
  fitnessStore.showEditPromocodeDialog = false;
};

const onDateSelectStartDate = (event: Date) => {
  const date = new Date(
    Date.UTC(event.getFullYear(), event.getMonth(), event.getDate())
  );
  const isoDate = date.toISOString();
  fitnessStore.currentPromocode.start_date = isoDate.split('T')[0];
}

const onDateSelectEndDate = (event: Date) => {
  const date = new Date(
    Date.UTC(event.getFullYear(), event.getMonth(), event.getDate())
  );
  const isoDate = date.toISOString();
  fitnessStore.currentPromocode.end_date = isoDate.split('T')[0];
}


</script>

<template>
  <Dialog
    v-model:visible="fitnessStore.showEditPromocodeDialog"
    modal
    header="Изменение промокода"
    :style="{ width: '32rem' }"
  >

    <div class="flex items-center gap-4 mb-4">
      <label for="title" class="font-semibold w-36">Название</label>
      <InputText
        id="title"
        class="flex-auto"
        autocomplete="off"
        v-model="fitnessStore.currentPromocode.title"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="promocode" class="font-semibold w-36">Промокод</label>
      <InputText
        id="promocode"
        class="flex-auto"
        autocomplete="off"
        v-model="fitnessStore.currentPromocode.promocode"
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
        v-model="fitnessStore.currentPromocode.start_time"
      />
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label for="end_time" class="font-semibold w-36">Время окончания</label>
      <InputText
        id="end_time"
        class="flex-auto"
        autocomplete="off"
        v-model="fitnessStore.currentPromocode.end_time"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-36">Авто применение</label>
      <Checkbox
        v-model="fitnessStore.currentPromocode.auto_apply"
        :binary="true"
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

