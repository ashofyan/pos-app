import {api} from '../../../core/api/axios';

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginRequest = async (payload: LoginPayload) => {
  const response = await api.post('/login', payload);

  return response.data;
};
