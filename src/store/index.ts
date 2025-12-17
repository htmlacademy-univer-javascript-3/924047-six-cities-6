import {configureStore} from '@reduxjs/toolkit';
import {Reducer} from 'redux';
import {offersReducer, ReducerName} from './reducer.ts';

export const store = configureStore({
  reducer: {
    [ReducerName.offers]: offersReducer,
  } satisfies Record<ReducerName, Reducer>,
});
