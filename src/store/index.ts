import { configureStore } from '@reduxjs/toolkit';
import { offersReducer } from './offers-slice';
import { userReducer } from './user-slice';
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
