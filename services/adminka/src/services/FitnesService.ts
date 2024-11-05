/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { apiClient } from '@/common';
import { IResponse } from '@/types/IResponse';
import { IFitnesConfig } from '@/types/IFitnesConfig';
import { IFitnesScheduleSegmentCreate } from '@/types/IFitnesScheduleSegment';
import { IFitnessTariff } from '@/types/IFitnessTariff';
import { IFitnessPromocode } from '@/types/IFitnessPromocode';
import { IFitnessUkassa } from '@/types/IFitnessUkassa';
import { IFictitiousUser } from '@/types/IFictitiousUser';

class FitnesService {
  async getConfig(user_id: any): Promise<IResponse> {
    // apiClient.defaults.withCredentials = false;
    let response: IResponse;
    try {
      response = await apiClient.get(`/fitnes/get_config_by_user_id?id=${user_id}`);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async updateConfig(payload: IFitnesConfig): Promise<IResponse> {
    // apiClient.defaults.withCredentials = false;
    let response: IResponse;
    try {
      response = await apiClient.post('/fitnes/create_or_update_config', payload);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async createScheduleSegment(payload: IFitnesScheduleSegmentCreate): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.post('/fitnes/create_schedule_segment', payload);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async deleteScheduleSegment(id: number): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.delete(`/fitnes/delete_schedule_segment?id=${id}`);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async deleteTariff(id: number): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.delete(`/fitnes/delete_tariff?id=${id}`);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async deletePromocode(id: number): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.delete(`/fitness_promocode/delete_promocode?id=${id}`);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  // async getTariffsByWidgetId(widgetId: number): Promise<IResponse> {
  //   // apiClient.defaults.withCredentials = false;
  //   let response: IResponse;
  //   try {
  //     response = await apiClient.get(`/fitnes/get_tariffs_by_widget_id?widget_id=${widgetId}`);
  //   } catch (error: any) {
  //     response = error.response;
  //   }

  //   return response;
  // }

  async getFictitiousUsers(widget_id: number): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.get(`/fitnes/get_fictitious_users?widget_id=${widget_id}`);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async createFictitiousUser(payload: IFictitiousUser): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.post('/fitnes/create_fictitious_user', payload);
    }
    catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async deleteFictitiousUser(user_token: string): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.delete(`/fitnes/delete_fictitious_user?user_token=${user_token}`);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async createOrUpdateTariff(payload: IFitnessTariff): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.post('/fitnes/create_or_update_tariff', payload);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async createOrUpdatePromocode(payload: IFitnessPromocode): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.post('/fitness_promocode/create_or_update_promocode', payload);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async createOrUpdateUkassa(payload: IFitnessUkassa): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.post('/fitnes/create_or_update_ukassa', payload);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  priceList(integration_code: string): Promise<IResponse> {
    return apiClient.get(`/fitness_api/price_list?integration_code=${integration_code}`);
  }

}

export default new FitnesService();
