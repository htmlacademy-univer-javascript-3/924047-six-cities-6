import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';

export const BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';
export const TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('six-cities-token');
    if (token) {
      config.headers['X-Token'] = token;
    }
    return config;
  });

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('six-cities-token');
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export const offersUrl = {
  offers: '/offers',
  offerDetails: (offerId: string) => `/offers/${offerId}`,
  offersNearby: (offerId: string) => `/offers/${offerId}/nearby`,
};

export const commentsUrl = {
  offerComments: (offerId: string) => `/comments/${offerId}`,
};

export const userUrl = {
  login: '/login',
  logout: '/logout',
};

export const favoritesUrl = {
  favorite: '/favorite',
  favoriteStatus: (offerId: string, status: number) => `/favorite/${offerId}/${status}`,
};
