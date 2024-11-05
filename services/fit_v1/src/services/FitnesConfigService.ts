/* eslint-disable max-len */
import { apiClient } from '@/common';
import { IResponse } from '@/types/IResponse';
import { IFitnesConfig } from '@/types/IFitnesConfig';

class FitnesConfigService {
  async getConfig(user_id: any): Promise<IResponse> {
    let response: IResponse;
    try {
      const url = `/fitnes/get_config_by_integration_code?integration_code=${user_id}`
      response = await apiClient.get(url);
    } catch (error: any) {
      response = error.response;
    }

    return response;
  }
}

export default new FitnesConfigService();
