import {City} from '../types/city.ts';
import {Offer} from '../types/offer.ts';
import {citiesDataMock} from '../mocks/cities.ts';
import {createReducer} from '@reduxjs/toolkit';
import {setCity, setOffers} from './action.ts';

export enum ReducerName {
  offers = 'offers'
}

export type OffersState = {
  city: City;
  offers: Offer[];
};

export const initialState: OffersState = {
  city: citiesDataMock[0],
  offers: [],
};

export const offersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(setOffers, (state, action) => {
      state.offers = action.payload;
    });
});
