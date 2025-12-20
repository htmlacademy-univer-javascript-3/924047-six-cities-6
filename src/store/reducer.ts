import {CitiesMap, City} from '../types/city.ts';
import {Offer, OffersByCity} from '../types/offer.ts';
import {createReducer} from '@reduxjs/toolkit';
import {setActiveOffer, setCity, setOffers} from './action.ts';
import {extractCities, groupOffersByCity} from '../utils/citiesUtils.ts';
import {defaultCity} from '../const/cities.ts';
import {UserAuth} from '../types/user.ts';
import {AuthorizationStatus} from '../const/routes.ts';
import {checkAuth, loadOffers, login, logout} from './api.ts';

export enum OffersReducerName {
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

export const initialOffersState: OffersState = {
  currentCity: defaultCity,
  cities: {},
  offers: {},
  currentCityOffers: [],
  activeOfferId: null,
  isOffersLoading: true,
  error: null,
};

export const offersReducer = createReducer(initialOffersState, (builder) => {
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

export enum UserReducerName {
  user = 'user'
}

export type UserState = {
  error: string | null;
  authorizationStatus: AuthorizationStatus;
  userAuth: UserAuth | null;
};

export const initialUserState: UserState = {
  error: null,
  authorizationStatus: AuthorizationStatus.Unknown,
  userAuth: null
};

export const userReducer = createReducer(initialUserState, (builder) => {
  builder
    .addCase(checkAuth.fulfilled, (state, action) => {
      state.userAuth = action.payload;
      state.authorizationStatus = AuthorizationStatus.Auth;
    })
    .addCase(checkAuth.rejected, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.userAuth = action.payload;
      state.authorizationStatus = AuthorizationStatus.Auth;
      localStorage.setItem('six-cities-token', action.payload.token);
    })
    .addCase(logout.fulfilled, (state) => {
      state.userAuth = null;
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      localStorage.removeItem('six-cities-token');
    });
});
