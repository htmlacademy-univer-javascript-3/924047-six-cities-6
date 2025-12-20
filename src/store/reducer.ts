import {CitiesMap, City} from '../types/city.ts';
import {Offer, OfferDetails, OffersByCity} from '../types/offer.ts';
import {createReducer} from '@reduxjs/toolkit';
import {setActiveOffer, setCity, setOffers} from './action.ts';
import {extractCities, groupOffersByCity} from '../utils/cities-utils.ts';
import {defaultCity} from '../const/cities.ts';
import {UserAuth} from '../types/user.ts';
import {AuthorizationStatus} from '../const/routes.ts';
import {
  checkAuth,
  getOfferComments,
  getOfferDetails,
  getOffersNearby,
  loadOffers,
  login,
  logout,
  submitOfferComment
} from './api.ts';
import {Feedback} from '../types/feedback.ts';

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
  currentOffer: OfferDetails | null;
  nearbyOffers: Offer[];
  feedbacks: Feedback[];
  isOfferLoading: boolean;
  isCommentsLoading: boolean;
  isCommentSubmitting: boolean;
};

export const initialOffersState: OffersState = {
  currentCity: defaultCity,
  cities: {},
  offers: {},
  currentCityOffers: [],
  activeOfferId: null,
  isOffersLoading: true,
  error: null,
  currentOffer: null,
  nearbyOffers: [],
  feedbacks: [],
  isOfferLoading: false,
  isCommentsLoading: false,
  isCommentSubmitting: false,
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
    })
    .addCase(getOfferDetails.pending, (state) => {
      state.isOfferLoading = true;
      state.currentOffer = null;
    })
    .addCase(getOfferDetails.fulfilled, (state, action) => {
      state.isOfferLoading = false;
      state.currentOffer = action.payload;
    })
    .addCase(getOfferDetails.rejected, (state) => {
      state.isOfferLoading = false;
      state.currentOffer = null;
    })
    .addCase(getOffersNearby.fulfilled, (state, action) => {
      state.nearbyOffers = action.payload;
    })
    .addCase(getOfferComments.pending, (state) => {
      state.isCommentsLoading = true;
    })
    .addCase(getOfferComments.fulfilled, (state, action) => {
      state.isCommentsLoading = false;
      state.feedbacks = action.payload;
    })
    .addCase(getOfferComments.rejected, (state) => {
      state.isCommentsLoading = false;
      state.feedbacks = [];
    })
    .addCase(submitOfferComment.pending, (state) => {
      state.isCommentSubmitting = true;
    })
    .addCase(submitOfferComment.fulfilled, (state, action) => {
      state.isCommentSubmitting = false;
      state.feedbacks.push(action.payload);
    })
    .addCase(submitOfferComment.rejected, (state) => {
      state.isCommentSubmitting = false;
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
