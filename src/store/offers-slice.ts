import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { City, CitiesMap } from '../types/city';
import { Offer, OfferDetails, OffersByCity } from '../types/offer';
import { Feedback } from '../types/feedback';
import { defaultCity } from '../const/cities';
import { extractCities, groupOffersByCity } from '../utils/cities-utils';
import {
  getOfferComments,
  getOfferDetails,
  getOffersNearby,
  loadOffers,
  submitOfferComment,
} from './api';

export enum OffersReducerName {
  offers = 'offers',
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

const initialState: OffersState = {
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

export const offersSlice = createSlice({
  name: OffersReducerName.offers,
  initialState,
  reducers: {
    setCity(state, action: PayloadAction<City>) {
      state.currentCity = action.payload;
      state.currentCityOffers =
        state.offers[action.payload.name] ?? [];
    },
    setOffers(state, action: PayloadAction<Offer[]>) {
      state.currentCityOffers = action.payload;
    },
    setActiveOffer(state, action: PayloadAction<Offer['id']>) {
      state.activeOfferId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOffers.pending, (state) => {
        state.isOffersLoading = true;
      })
      .addCase(
        loadOffers.fulfilled,
        (state, action: PayloadAction<Offer[]>) => {
          state.isOffersLoading = false;

          const grouped = groupOffersByCity(action.payload);
          state.cities = extractCities(action.payload);
          state.offers = grouped;
          state.currentCityOffers =
            grouped[state.currentCity.name] ?? [];
        }
      )
      .addCase(loadOffers.rejected, (state, action) => {
        state.isOffersLoading = false;
        state.error = action.error.message ?? 'Failed to load offers';
      })
      .addCase(getOfferDetails.pending, (state) => {
        state.isOfferLoading = true;
        state.currentOffer = null;
      })
      .addCase(
        getOfferDetails.fulfilled,
        (state, action: PayloadAction<OfferDetails>) => {
          state.isOfferLoading = false;
          state.currentOffer = action.payload;
        }
      )
      .addCase(getOfferDetails.rejected, (state) => {
        state.isOfferLoading = false;
        state.currentOffer = null;
      })
      .addCase(
        getOffersNearby.fulfilled,
        (state, action: PayloadAction<Offer[]>) => {
          state.nearbyOffers = action.payload;
        }
      )
      .addCase(getOfferComments.pending, (state) => {
        state.isCommentsLoading = true;
      })
      .addCase(
        getOfferComments.fulfilled,
        (state, action: PayloadAction<Feedback[]>) => {
          state.isCommentsLoading = false;
          state.feedbacks = action.payload;
        }
      )
      .addCase(getOfferComments.rejected, (state) => {
        state.isCommentsLoading = false;
        state.feedbacks = [];
      })
      .addCase(submitOfferComment.pending, (state) => {
        state.isCommentSubmitting = true;
      })
      .addCase(
        submitOfferComment.fulfilled,
        (state, action: PayloadAction<Feedback>) => {
          state.isCommentSubmitting = false;
          state.feedbacks.push(action.payload);
        }
      )
      .addCase(submitOfferComment.rejected, (state) => {
        state.isCommentSubmitting = false;
      });
  },
});

export const {
  setCity,
  setOffers,
  setActiveOffer,
} = offersSlice.actions;

export const offersReducer = offersSlice.reducer;
