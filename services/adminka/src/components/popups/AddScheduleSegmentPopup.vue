<script lang="ts" setup>
import { ref } from 'vue';
import { IFitnesScheduleSegmentCreate } from '@/types/IFitnesScheduleSegment';
import { useFitnesStore } from '@/store/fitnes';

const props = withDefaults(defineProps<{
  widgetId: number
}>(), {
  widgetId: 0,
});

const fitnessStore = useFitnesStore();

const segment = ref<IFitnesScheduleSegmentCreate>({
  title: '',
  widget_id: 0,
  end_time: '',
  start_time: '',
});

const addSegment = async () => {
  segment.value.widget_id = props.widgetId;
  await fitnessStore.addScheduleSegment(segment.value);
  fitnessStore.showAddScheduleDialog = false;
  // window.location.reload();
}

</script>

<template>
  <Dialog
    v-model:visible="fitnessStore.showAddScheduleDialog"
    modal
    header="Добавление сегмента расписания"
    :style="{ width: '32rem' }"
  >

    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-36">Заголовок</label>
      <InputText
        id="username"
        class="flex-auto"
        autocomplete="off"
        v-model="segment.title"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-36">Время начала</label>
      <InputText
        id="username"
        class="flex-auto"
        autocomplete="off"
        v-model="segment.start_time"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-36">Время окончания</label>
      <InputText
        id="username"
        class="flex-auto"
        autocomplete="off"
        v-model="segment.end_time"
      />
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Добавить" @click="addSegment"></Button>
    </div>
  </Dialog>
</template>

