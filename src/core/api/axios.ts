import axios from 'axios';
import {API_URL, API_URL_TENANT} from '@env';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const urlTenant = axios.create({
  baseURL: API_URL_TENANT,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
