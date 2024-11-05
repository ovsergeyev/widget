/* eslint-disable camelcase */
export default interface IConfirmPayload {
  phone: string;
  auth_type: string;
  confirmation_code?: string;
}
