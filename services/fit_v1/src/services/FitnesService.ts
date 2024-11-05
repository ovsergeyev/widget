/* eslint-disable max-len */
import { apiClient } from '@/common';
import IAuthPayload from '@/types/IAuthPayload';
import IConfirmPayload from '@/types/IConfirmPayload';
import IChangePassPayload from '@/types/IChangePassPayload';
import IResponseData from '@/types/IResponseData';
import IRegAndAuthPayload from '@/types/IRegAndAuthPayload';
import { IUkassaPayment } from '@/types/IUkassaPayment';
import { IFitnessCart } from '@/types/IFitnessCart';


class FitnesService {
  classes(integration_code: string, payload: any): Promise<IResponseData> {
    return apiClient.post(`/fitness_api/group_classes?integration_code=${integration_code}`, payload);
  }

  priceList(integration_code: string): Promise<IResponseData> {
    return apiClient.get(`/fitness_api/price_list?integration_code=${integration_code}`);
  }

  auth(integration_code: string, payload: IAuthPayload): Promise<IResponseData> {
    return apiClient.post(`/fit-auth/auth_client?integration_code=${integration_code}`, payload);
  }

  confirmPhone(integration_code: string, payload: IConfirmPayload): Promise<IResponseData> {
    return apiClient.post(`/fit-auth/confirm_phone?integration_code=${integration_code}`, payload);
  }

  changePassword(
    integration_code: string,
    payload: IChangePassPayload,
  ): Promise<IResponseData> {
    return apiClient.post(`/fit-auth/password_set?integration_code=${integration_code}`, payload);
  }

  regAndAuth(integration_code: string, payload: IRegAndAuthPayload): Promise<IResponseData> {
    return apiClient.post(`/fit-auth/reg_and_auth?integration_code=${integration_code}`, payload);
  }

  getUser(integration_code: string, user_token: string): Promise<IResponseData> {
    return apiClient.get(`/fit-auth/get_user?integration_code=${integration_code}&user_token=${user_token}`);
  }

  paymentUkassa(integration_code: string, payload: IUkassaPayment): Promise<IResponseData> {
    return apiClient.post(`/fitness_api/payment_ukassa?integration_code=${integration_code}`, payload);
  }

  cartCost(integration_code: string, payload: IFitnessCart): Promise<IResponseData> {
    return apiClient.post(`/fitness_api/cart_cost?integration_code=${integration_code}`, payload);
  }

  getPaymentInfo(uid: string): Promise<IResponseData> {
    return apiClient.post(`/fitness_api/get_payment_info?uid=${uid}`);
  }

}

export default new FitnesService();
