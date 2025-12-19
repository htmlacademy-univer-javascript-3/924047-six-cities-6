import {CitiesMap, City} from '../types/city.ts';
import {Offer, OffersByCity} from '../types/offer.ts';
import {createAsyncThunk, createReducer} from '@reduxjs/toolkit';
import {setActiveOffer, setCity, setOffers} from './action.ts';
import {offersUrl} from '../const/api.ts';
import {extractCities, groupOffersByCity} from '../utils/citiesUtils.ts';
import {defaultCity} from '../const/cities.ts';
import {ThunkExtraArguments} from './index.ts';

export enum ReducerName {
  offers = 'offers'
}

export type OffersState = {
  currentCity: City;
  cities: CitiesMap;
  offers: OffersByCity;
  currentCityOffers: Offer[];
  activeOfferId: Offer['id'] | null;
  isOffersLoading: boolean;
  error: string | null;
};

export const initialState: OffersState = {
  currentCity: defaultCity,
  cities: {},
  offers: {},
  currentCityOffers: [],
  activeOfferId: null,
  isOffersLoading: true,
  error: null,
};

export const loadOffers = createAsyncThunk<
    Offer[],
    void,
    {
      extra: ThunkExtraArguments;
      rejectValue: string;
    }
>(
  'offers/loadOffers',
  async (_, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.get<Offer[]>(
        offersUrl.offers
      );

      return data;
    } catch {
      return rejectWithValue('Failed to load offers');
    }
  }
);


export const offersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setCity, (state, action) => {
      const city = action.payload;
      state.currentCity = city;
      state.currentCityOffers = state.offers[city.name];
    })
    .addCase(setActiveOffer, (state, action) => {
      state.activeOfferId = action.payload;
    })
    .addCase(setOffers, (state, action) => {
      state.currentCityOffers = action.payload;
    })
    .addCase(loadOffers.pending, (state) => {
      state.isOffersLoading = true;
    })
    .addCase(loadOffers.fulfilled, (state, action) => {
      state.isOffersLoading = false;
      const offers = groupOffersByCity(action.payload);
      state.cities = extractCities(action.payload);
      state.offers = offers;
      state.currentCityOffers = offers[state.currentCity.name];
    })
    .addCase(loadOffers.rejected, (state, action) => {
      state.isOffersLoading = false;
      state.error = action.error.message ?? 'Failed to load offers';
    });
});
