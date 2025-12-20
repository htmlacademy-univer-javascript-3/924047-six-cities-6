import {configureStore} from '@reduxjs/toolkit';
import {Reducer} from 'redux';
import {offersReducer, OffersReducerName, userReducer, UserReducerName} from './reducer.ts';
import {createAPI} from '../const/api.ts';
import {AxiosInstance} from 'axios';

export type ThunkExtraArguments = {axios: AxiosInstance};
type RootReducerName = OffersReducerName | UserReducerName;

export const store = configureStore({
  reducer: {
    [OffersReducerName.offers]: offersReducer,
    [UserReducerName.user]: userReducer,
  } satisfies Record<RootReducerName, Reducer>,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {extraArgument: {axios: createAPI()} satisfies ThunkExtraArguments},
  }),
});
