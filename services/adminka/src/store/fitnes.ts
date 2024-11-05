import { defineStore } from "pinia";
import { ref } from 'vue';
import FitnesService from "@/services/FitnesService";
import { IResponse } from '@/types/IResponse';
import { IFitnesConfig } from "@/types/IFitnesConfig";
import { IFitnesScheduleSegmentCreate } from '@/types/IFitnesScheduleSegment';
import { IFitnessTariff } from "@/types/IFitnessTariff";
import { IFitnessPromocode } from "@/types/IFitnessPromocode";
import { IFitnessUkassa } from "@/types/IFitnessUkassa";

export const useFitnesStore = defineStore('fitnes', () => {
  const showConfigDialog = ref(false);
  const showAddTariffDialog = ref(false);
  const showAddPromocodeDialog = ref(false);
  const showEditTariffDialog = ref(false);
  const showEditPromocodeDialog = ref(false);
  const showAddScheduleDialog = ref(false);
  const showAddFictitiousUserDialog = ref(false);
  const currentUserId = ref<number|null>(null);
  const currentTariff = ref<IFitnessTariff>({
    uid: '',
    widget_id: 0,
    title: '',
    description: '',
    start_date: null,
    end_date: null,
    is_new: false,
    type: '',
    is_monday: false,
    is_tuesday: false,
    is_wednesday: false,
    is_thursday: false,
    is_friday: false,
    is_saturday: false,
    is_sunday: false,
    is_holiday: false,
    count_adults: 0,
    count_children: 0,
    start_time: '08:00',
    end_time: '10:00'
  });

  const currentPromocode = ref<IFitnessPromocode>({
    id: 0,
    title: '',
    widget_id: 0,
    promocode: '',
    start_date: null,
    end_date: null,
    start_time: null,
    end_time: null,
    auto_apply: false
  });

  const config = ref<IFitnesConfig>({
    id: 0,
    user_id: 0,
    title: '',
    description: '',
    metrica_code: '',
    message_after_payment: '',
    api_url: '',
    api_key: '',
    club_id: '',
    service_id: '',
    username: '',
    password: '',
    schedule_segments: [],
    tariffs: [],
    promocodes: [],
    payment_gateways: [],
    integration_code: '',
  });

  const ukassa = ref<IFitnessUkassa>({
    account_id: null,
    secret_key: '',
    widget_id: 0,
    back_link: ''
  });

  const get = async () => {
    try {
      const response: IResponse = await FitnesService.getConfig(currentUserId.value);
      if (response.status == 200) {
        const data = response.data
        if(data.payment_gateways.length){
          ukassa.value = data.payment_gateways[0];
        }
        data.tariffs = data.tariffs.sort((a: IFitnessTariff, b: IFitnessTariff) => {
          let result = 0;
          if(a.start_time && b.start_time){
            a.start_time + a.uid < b.start_time + b.uid ? result = -1 : result = 1;
          }

          return result;
        });
        config.value = data;
      }
    } catch (e) {
      console.log('err', e);
    }
  }

  const update = async () => {
    try {
      config.value.user_id = Number(currentUserId.value);
      const response: IResponse = await FitnesService.updateConfig(config.value);
      if (response.status == 200) {
        const data = response.data
        console.log('data', data)
      }
    } catch (e) {
      console.log('err', e);
    }
  }

  const clear = () => {
    currentUserId.value = null
    config.value = {
      id: 0,
      user_id: 0,
      title: '',
      description: '',
      message_after_payment: '',
      api_url: '',
      api_key: '',
      club_id: '',
      service_id: '',
      username: '',
      password: '',
      schedule_segments: [],
      tariffs: [],
      promocodes: [],
      payment_gateways: [],
      metrica_code: '',
      integration_code: ''
    }
  }

  const addScheduleSegment = async (payload: IFitnesScheduleSegmentCreate) => {
    await FitnesService.createScheduleSegment(payload);
  }

  const deleteScheduleSegment = async (id: number) => {
    await FitnesService.deleteScheduleSegment(id);
  };

  const deleteTariff = async (id: number) => {
    await FitnesService.deleteTariff(id);
  };

  const deletePromocode = async (id: number) => {
    await FitnesService.deletePromocode(id);
  };

  const create_or_update_tariff = async (payload: IFitnessTariff) => {
    try {
      const response: IResponse = await FitnesService.createOrUpdateTariff(payload);
      if (response.status == 200) {
        const data = response.data
        console.log('data', data)
      }
    } catch (e) {
      console.log('err', e);
    }
  }

  const create_or_update_promocode = async(payload: IFitnessPromocode) => {
    try {
      const response: IResponse = await FitnesService.createOrUpdatePromocode(payload);
      if (response.status == 200) {
        const data = response.data
        console.log('data', data)
      }
    } catch (e) {
      console.log('err', e)
    }
  }

  const create_or_update_ukassa = async () => {
    try {
      ukassa.value.widget_id = config.value.id;
      const response: IResponse = await FitnesService.createOrUpdateUkassa(ukassa.value);
      if (response.status == 200) {
        const data = response.data
        console.log('data', data)
      }
    } catch (e) {
      console.log('err', e);
    }
  }

  return {
    config,
    currentUserId,
    currentTariff,
    currentPromocode,
    showConfigDialog,
    showAddFictitiousUserDialog,
    showAddTariffDialog,
    showAddPromocodeDialog,
    showAddScheduleDialog,
    showEditTariffDialog,
    showEditPromocodeDialog,
    ukassa,
    addScheduleSegment,
    deleteScheduleSegment,
    create_or_update_tariff,
    create_or_update_promocode,
    create_or_update_ukassa,
    deleteTariff,
    deletePromocode,
    get,
    update,
    clear
  }
});