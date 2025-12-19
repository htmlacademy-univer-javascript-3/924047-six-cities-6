import {configureStore} from '@reduxjs/toolkit';
import {Reducer} from 'redux';
import {offersReducer, ReducerName} from './reducer.ts';
import {axiosClient} from '../const/api.ts';
import {AxiosInstance} from 'axios';

export type ThunkExtraArguments = {axios: AxiosInstance};

export const store = configureStore({
  reducer: {
    [ReducerName.offers]: offersReducer,
  } satisfies Record<ReducerName, Reducer>,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {extraArgument: {axios: axiosClient} satisfies ThunkExtraArguments},
  }),
});
