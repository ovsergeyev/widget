<script lang="ts" setup>
import { ref } from 'vue';
import { useFitnesStore } from '@/store/fitnes';
import { IFictitiousUser } from '@/types/IFictitiousUser';
import FitnesService from '@/services/FitnesService';

const fitnessStore = useFitnesStore();

const props = withDefaults(defineProps<{
  widgetId: number
}>(), {
  widgetId: 0,
});

const emits = defineEmits(['update']);

const userToken = ref('');

const clickCreateUser = async () => {
  if(!userToken.value || !props.widgetId) return;
  const payload: IFictitiousUser = {
    user_token: userToken.value,
    widget_id: props.widgetId
  }

  await FitnesService.createFictitiousUser(payload);
  emits('update');
  userToken.value = '';
  fitnessStore.showAddFictitiousUserDialog = false;
}


// const clickAddButton = async () => {
//   tariff.value.widget_id = props.widgetId;
//   await fitnessStore.create_or_update_tariff(tariff.value);
//   fitnessStore.showAddTariffDialog = false;
//   window.location.reload();
// };

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
const show = ref(true);

</script>

<template>
  <!-- v-model:visible="fitnessStore.showAddTariffDialog" -->
  <Dialog
    modal
    v-model:visible="fitnessStore.showAddFictitiousUserDialog"
    header="Добавление фиктивного пользователя"
    :style="{ width: '32rem' }"
  >
    <div class="flex flex-col mb-4">
      <label for="uid" class="font-semibold mb-2">Токен пользователя</label>
      <InputText
        id="uid"
        class="flex-auto"
        autocomplete="off"
        v-model="userToken"
      />
    </div>

    <Button
      label="Добавить"
      class="w-full"
      @click="clickCreateUser"
    />

  </Dialog>
</template>

