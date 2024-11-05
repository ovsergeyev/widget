/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { apiClient } from '@/common';
import { IResponse } from '@/types/IResponse';
import { IUserCreate, IUserEdit } from '@/types/IUser';

class UsersService {
  async getUsers(): Promise<IResponse> {
    // apiClient.defaults.withCredentials = false;
    let response: IResponse;
    try {
      response = await apiClient.get('/users/get_users');
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async createUser(payload: IUserCreate): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.post('/users/create_user', payload);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async editUser(payload: IUserEdit): Promise<IResponse> {
    let response: IResponse;
    try {
      response = await apiClient.post('/users/update_user', payload);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async freezeUser(id: string): Promise<IResponse> {
    let response: IResponse;
    const payload = {
      id: id,
      is_active: false
    }
    try {
      response = await apiClient.post('/users/update_user', payload)
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async defrostUser(id: string): Promise<IResponse> {
    let response: IResponse;
    const payload = {
      id: id,
      is_active: true
    }
    try {
      response = await apiClient.post('/users/update_user', payload)
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

  async deleteUser(id: string): Promise<IResponse> {
    let response: IResponse;
    const payload = {
      id: id,
      is_deleted: true
    }
    try {
      response = await apiClient.post('/users/update_user', payload)
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }

}

export default new UsersService();
