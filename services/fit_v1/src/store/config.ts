/* eslint-disable max-len */
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { IFitnesConfig } from '../types/IFitnesConfig';
import { IResponse } from '../types/IResponse';
import FitnesConfigService from '../services/FitnesConfigService';

export const useConfigStore = defineStore('config', () => {
  const config = ref<IFitnesConfig>({
    title: '',
    description: '',
    schedule_segments: [],
    tariffs: [],
    promocodes: [],
    message_after_payment: '',
    metrica_code: '',
  });
  const integration_code = ref('');
  const isConfigReceived = ref(false);

  const getConfig = async (code: string) => {
    integration_code.value = code
    try {
      const response: IResponse = await FitnesConfigService.getConfig(code);
      if (response.status == 200) {
        config.value = response.data;
        isConfigReceived.value = true;
      }
    } catch (e) {
      console.log('err', e);
    }
    return config.value;
  };

  return {
    config,
    integration_code,
    isConfigReceived,
    getConfig
  };
});
