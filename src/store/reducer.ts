import {CitiesMap, City} from '../types/city.ts';
import {Offer, OffersByCity} from '../types/offer.ts';
import {cities} from '../mocks/cities.ts';
import {createAsyncThunk, createReducer} from '@reduxjs/toolkit';
import {setActiveOffer, setCity, setOffers} from './action.ts';
import {axiosConfig, offersUrl} from '../const/api.ts';
import {extractCities, groupOffersByCity} from '../utils/citiesUtils.ts';
import axios, {AxiosError} from 'axios';

export enum ReducerName {
  offers = 'offers'
}

export type OffersState = {
  city: City;
  cities: CitiesMap;
  offers: Offer[];
  activeOfferId: Offer['id'] | null;
  isLoading: boolean;
  error: string | null;
};

export const initialState: OffersState = {
  city: cities[0],
  cities: {},
  offers: [],
  activeOfferId: null,
  isLoading: false,
  error: null,
};

type LoadOffersResponse = {
  cities: CitiesMap;
  offers: OffersByCity;
};

export const loadOffers = createAsyncThunk<
    LoadOffersResponse,
    void,
    { rejectValue: string }>(
      'offers/loadOffers',
      async (_, { rejectWithValue }) => {
        try {
          const response = await axios.get<Offer[]>(
            offersUrl.offers,
            axiosConfig
          );

          return {
            cities: extractCities(response.data),
            offers: groupOffersByCity(response.data),
          };
        } catch (error) {
          const err = error as AxiosError;
          // eslint-disable-next-line no-console
          console.error('Error loading offers', err.message);
          return rejectWithValue('Failed to load offers');
        }
      }
    );

export const offersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(setOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(setActiveOffer, (state, action) => {
      state.activeOfferId = action.payload;
    })
    .addCase(loadOffers.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(loadOffers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cities = action.payload.cities;
      // state.offers = action.payload.offers;
    })
    .addCase(loadOffers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ?? 'Failed to load offers';
    });
});
