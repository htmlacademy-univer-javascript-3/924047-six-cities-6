import axios from 'axios';

export const BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';
export const TIMEOUT = 5000;

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

export const offersUrl = {
  offers: '/offers',
};
