/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { apiClient } from '@/common';
import { IResponse } from '@/types/IResponse';
// import IAuthPayload from '@/types/IAuthPayload';

class AuthService {
  async login(payload: any): Promise<IResponse> {
    // apiClient.defaults.withCredentials = false;
    let response: IResponse;
    try {
      response = await apiClient.post('/auth/login', payload);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async logout(): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.post('/auth/logout');
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async getCurrentUser(): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.get('/users/get_current_user');
    } catch (error: any) {
      // throw error
      response = error;
    }

    return response;
  }
}

export default new AuthService();
