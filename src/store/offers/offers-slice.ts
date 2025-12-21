import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { City, CitiesMap } from '../../types/city.ts';
import { Offer, OfferDetails, OffersByCity } from '../../types/offer.ts';
import { Feedback } from '../../types/feedback.ts';
import { defaultCity } from '../../const/cities.ts';
import { extractCities, groupOffersByCity } from '../../utils/cities-utils.ts';
import {
  getFavoriteOffers,
  getOfferComments,
  getOfferDetails,
  getOffersNearby,
  loadOffers,
  submitOfferComment,
  updateFavoriteOfferStatus,
} from './api.ts';
import {logout} from '../user/api.ts';

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
  isFavoritesLoading: boolean;
  favorites: Offer[];
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
  isFavoritesLoading: true,
  favorites: [],
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
      })
      .addCase(updateFavoriteOfferStatus.fulfilled, (state, action) => {
        const updateOffer = action.payload;

        if (state.currentOffer && state.currentOffer.id === updateOffer.id) {
          state.currentOffer.isFavorite = updateOffer.isFavorite;
        }

        Object.values(state.offers).forEach((cityOffers) => {
          cityOffers.forEach((offer) => {
            if (offer.id === updateOffer.id) {
              offer.isFavorite = updateOffer.isFavorite;
            }
          });
        });

        const cityOffer = state.currentCityOffers.find(
          (o) => o.id === updateOffer.id
        );
        if (cityOffer) {
          cityOffer.isFavorite = updateOffer.isFavorite;
        }

        const nearby = state.nearbyOffers.find(
          (offer) => offer.id === updateOffer.id
        );
        if (nearby) {
          nearby.isFavorite = updateOffer.isFavorite;
        }

        if (updateOffer.isFavorite) {
          const {id, title, type, price, city, location, isFavorite, isPremium, rating } = updateOffer;
          const previewImage = updateOffer.images[0];
          state.favorites.push({id, title, type, price, city, location, isFavorite, isPremium, rating, previewImage});
        } else {
          state.favorites = state.favorites.filter((offer) => offer.id !== updateOffer.id);
        }
      })
      .addCase(getFavoriteOffers.fulfilled, (state, action) => {
        state.isFavoritesLoading = false;
        state.favorites = action.payload;
      })
      .addCase(getFavoriteOffers.pending, (state) => {
        state.isFavoritesLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        if (state.currentOffer) {
          state.currentOffer.isFavorite = false;
        }
        state.nearbyOffers.forEach((offer) => {
          offer.isFavorite = false;
        });

        Object.values(state.offers).forEach((cityOffers) => {
          cityOffers.forEach((offer) => {
            offer.isFavorite = false;
          });
        });

        state.currentCityOffers.forEach((offer) => {
          offer.isFavorite = false;
        });

        state.favorites = [];
      });
  },
});

export const {
  setCity,
  setOffers,
  setActiveOffer,
} = offersSlice.actions;

export const offersReducer = offersSlice.reducer;
