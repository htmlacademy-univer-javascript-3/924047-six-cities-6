import { configureStore } from '@reduxjs/toolkit';
import { offersReducer } from './offers/offers-slice.ts';
import { userReducer } from './user/user-slice.ts';
import { createAPI } from '../const/api';
import { AxiosInstance } from 'axios';

export type ThunkExtraArguments = {
  axios: AxiosInstance;
};

export const store = configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { axios: createAPI() } satisfies ThunkExtraArguments,
      },
    }),
});
