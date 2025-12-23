import { describe, it, expect } from 'vitest';
import { offersReducer, OffersState } from './offers-slice';
import {
  setCity,
  setOffers,
  setActiveOffer,
} from './offers-slice';
import {
  loadOffers,
  getOfferDetails,
  getOffersNearby,
  getOfferComments,
  submitOfferComment,
  updateFavoriteOfferStatus,
  getFavoriteOffers,
} from './api';
import { logout } from '../user/api';
import { defaultCity } from '../../const/cities';
import { Offer, OfferDetails, PlaceType } from '../../types/offer';
import { Feedback } from '../../types/feedback';
import { City } from '../../types/city';

const mockOffer: Offer = {
  id: '1',
  title: 'Test Offer',
  type: PlaceType.Apartment,
  price: 100,
  city: {
    name: 'Amsterdam',
    location: { latitude: 52.37454, longitude: 4.897976, zoom: 13 },
  },
  location: { latitude: 52.37454, longitude: 4.897976, zoom: 13 },
  isFavorite: false,
  isPremium: false,
  rating: 4,
  previewImage: 'test.jpg',
};

const mockOfferDetails: OfferDetails = {
  ...mockOffer,
  description: 'Test description',
  bedrooms: 2,
  goods: ['WiFi', 'TV'],
  host: {
    name: 'Test Host',
    avatarUrl: 'avatar.jpg',
    isPro: true,
  },
  images: ['img1.jpg', 'img2.jpg'],
  maxAdults: 4,
};

const mockFeedback: Feedback = {
  id: 1,
  date: '2024-01-01T00:00:00.000Z',
  user: {
    name: 'Test User',
    avatarUrl: 'avatar.jpg',
    isPro: false,
  },
  comment: 'Test comment',
  rating: 5,
};

const mockCity: City = {
  name: 'Paris',
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
};

describe('offersSlice', () => {
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

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(offersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setCity', () => {
      const state = {
        ...initialState,
        offers: {
          [mockCity.name]: [mockOffer],
        },
      };
      const action = setCity(mockCity);
      const result = offersReducer(state, action);

      expect(result.currentCity).toEqual(mockCity);
      expect(result.currentCityOffers).toEqual([mockOffer]);
    });

    it('should handle setCity with empty offers', () => {
      const action = setCity(mockCity);
      const result = offersReducer(initialState, action);

      expect(result.currentCity).toEqual(mockCity);
      expect(result.currentCityOffers).toEqual([]);
    });

    it('should handle setOffers', () => {
      const offers = [mockOffer];
      const action = setOffers(offers);
      const result = offersReducer(initialState, action);

      expect(result.currentCityOffers).toEqual(offers);
    });

    it('should handle setActiveOffer', () => {
      const action = setActiveOffer('1');
      const result = offersReducer(initialState, action);

      expect(result.activeOfferId).toBe('1');
    });
  });

  describe('loadOffers', () => {
    it('should handle loadOffers.pending', () => {
      const action = { type: loadOffers.pending.type };
      const result = offersReducer(initialState, action);

      expect(result.isOffersLoading).toBe(true);
    });

    it('should handle loadOffers.fulfilled', () => {
      const offers = [mockOffer];
      const action = {
        type: loadOffers.fulfilled.type,
        payload: offers,
      };
      const result = offersReducer(initialState, action);

      expect(result.isOffersLoading).toBe(false);
      expect(result.offers[mockOffer.city.name]).toEqual([mockOffer]);
      expect(result.cities[mockOffer.city.name]).toEqual(mockOffer.city);
      expect(result.currentCityOffers).toEqual([mockOffer]);
    });

    it('should handle loadOffers.rejected', () => {
      const action = {
        type: loadOffers.rejected.type,
        error: { message: 'Error message' },
      };
      const result = offersReducer(initialState, action);

      expect(result.isOffersLoading).toBe(false);
      expect(result.error).toBe('Error message');
    });

    it('should handle loadOffers.rejected without error message', () => {
      const action = {
        type: loadOffers.rejected.type,
        error: {},
      };
      const result = offersReducer(initialState, action);

      expect(result.isOffersLoading).toBe(false);
      expect(result.error).toBe('Failed to load offers');
    });
  });

  describe('getOfferDetails', () => {
    it('should handle getOfferDetails.pending', () => {
      const action = { type: getOfferDetails.pending.type };
      const result = offersReducer(initialState, action);

      expect(result.isOfferLoading).toBe(true);
      expect(result.currentOffer).toBeNull();
    });

    it('should handle getOfferDetails.fulfilled', () => {
      const action = {
        type: getOfferDetails.fulfilled.type,
        payload: mockOfferDetails,
      };
      const result = offersReducer(initialState, action);

      expect(result.isOfferLoading).toBe(false);
      expect(result.currentOffer).toEqual(mockOfferDetails);
    });

    it('should handle getOfferDetails.rejected', () => {
      const action = { type: getOfferDetails.rejected.type };
      const result = offersReducer(initialState, action);

      expect(result.isOfferLoading).toBe(false);
      expect(result.currentOffer).toBeNull();
    });
  });

  describe('getOffersNearby', () => {
    it('should handle getOffersNearby.fulfilled', () => {
      const offers = [mockOffer];
      const action = {
        type: getOffersNearby.fulfilled.type,
        payload: offers,
      };
      const result = offersReducer(initialState, action);

      expect(result.nearbyOffers).toEqual(offers);
    });
  });

  describe('getOfferComments', () => {
    it('should handle getOfferComments.pending', () => {
      const action = { type: getOfferComments.pending.type };
      const result = offersReducer(initialState, action);

      expect(result.isCommentsLoading).toBe(true);
    });

    it('should handle getOfferComments.fulfilled', () => {
      const feedbacks = [mockFeedback];
      const action = {
        type: getOfferComments.fulfilled.type,
        payload: feedbacks,
      };
      const result = offersReducer(initialState, action);

      expect(result.isCommentsLoading).toBe(false);
      expect(result.feedbacks).toEqual(feedbacks);
    });

    it('should handle getOfferComments.rejected', () => {
      const action = { type: getOfferComments.rejected.type };
      const result = offersReducer(initialState, action);

      expect(result.isCommentsLoading).toBe(false);
      expect(result.feedbacks).toEqual([]);
    });
  });

  describe('submitOfferComment', () => {
    it('should handle submitOfferComment.pending', () => {
      const action = { type: submitOfferComment.pending.type };
      const result = offersReducer(initialState, action);

      expect(result.isCommentSubmitting).toBe(true);
    });

    it('should handle submitOfferComment.fulfilled', () => {
      const action = {
        type: submitOfferComment.fulfilled.type,
        payload: mockFeedback,
      };
      const result = offersReducer(initialState, action);

      expect(result.isCommentSubmitting).toBe(false);
      expect(result.feedbacks).toContainEqual(mockFeedback);
    });

    it('should handle submitOfferComment.rejected', () => {
      const state = {
        ...initialState,
        isCommentSubmitting: true,
      };
      const action = { type: submitOfferComment.rejected.type };
      const result = offersReducer(state, action);

      expect(result.isCommentSubmitting).toBe(false);
    });
  });

  describe('updateFavoriteOfferStatus', () => {
    it('should handle updateFavoriteOfferStatus.fulfilled - add to favorites', () => {
      const favoriteOffer = {
        ...mockOfferDetails,
        isFavorite: true,
      };
      const action = {
        type: updateFavoriteOfferStatus.fulfilled.type,
        payload: favoriteOffer,
      };
      const result = offersReducer(initialState, action);

      expect(result.favorites).toHaveLength(1);
      expect(result.favorites[0].id).toBe(favoriteOffer.id);
      expect(result.favorites[0].isFavorite).toBe(true);
    });

    it('should handle updateFavoriteOfferStatus.fulfilled - remove from favorites', () => {
      const favoriteOffer = {
        ...mockOfferDetails,
        isFavorite: false,
      };
      const state = {
        ...initialState,
        favorites: [mockOffer],
      };
      const action = {
        type: updateFavoriteOfferStatus.fulfilled.type,
        payload: favoriteOffer,
      };
      const result = offersReducer(state, action);

      expect(result.favorites).toHaveLength(0);
    });

    it('should update currentOffer when favorite status changes', () => {
      const state = {
        ...initialState,
        currentOffer: mockOfferDetails,
      };
      const favoriteOffer = {
        ...mockOfferDetails,
        isFavorite: true,
      };
      const action = {
        type: updateFavoriteOfferStatus.fulfilled.type,
        payload: favoriteOffer,
      };
      const result = offersReducer(state, action);

      expect(result.currentOffer?.isFavorite).toBe(true);
    });

    it('should update offers in offers object when favorite status changes', () => {
      const state = {
        ...initialState,
        offers: {
          [mockOffer.city.name]: [mockOffer],
        },
      };
      const favoriteOffer = {
        ...mockOfferDetails,
        isFavorite: true,
      };
      const action = {
        type: updateFavoriteOfferStatus.fulfilled.type,
        payload: favoriteOffer,
      };
      const result = offersReducer(state, action);

      expect(result.offers[mockOffer.city.name][0].isFavorite).toBe(true);
    });

    it('should update currentCityOffers when favorite status changes', () => {
      const state = {
        ...initialState,
        currentCityOffers: [mockOffer],
      };
      const favoriteOffer = {
        ...mockOfferDetails,
        isFavorite: true,
      };
      const action = {
        type: updateFavoriteOfferStatus.fulfilled.type,
        payload: favoriteOffer,
      };
      const result = offersReducer(state, action);

      expect(result.currentCityOffers[0].isFavorite).toBe(true);
    });

    it('should update nearbyOffers when favorite status changes', () => {
      const state = {
        ...initialState,
        nearbyOffers: [mockOffer],
      };
      const favoriteOffer = {
        ...mockOfferDetails,
        isFavorite: true,
      };
      const action = {
        type: updateFavoriteOfferStatus.fulfilled.type,
        payload: favoriteOffer,
      };
      const result = offersReducer(state, action);

      expect(result.nearbyOffers[0].isFavorite).toBe(true);
    });
  });

  describe('getFavoriteOffers', () => {
    it('should handle getFavoriteOffers.pending', () => {
      const action = { type: getFavoriteOffers.pending.type };
      const result = offersReducer(initialState, action);

      expect(result.isFavoritesLoading).toBe(true);
    });

    it('should handle getFavoriteOffers.fulfilled', () => {
      const favorites = [mockOffer];
      const action = {
        type: getFavoriteOffers.fulfilled.type,
        payload: favorites,
      };
      const result = offersReducer(initialState, action);

      expect(result.isFavoritesLoading).toBe(false);
      expect(result.favorites).toEqual(favorites);
    });
  });

  describe('logout', () => {
    it('should handle logout.fulfilled - clear favorites', () => {
      const state = {
        ...initialState,
        favorites: [mockOffer],
        currentOffer: {
          ...mockOfferDetails,
          isFavorite: true,
        },
        nearbyOffers: [
          {
            ...mockOffer,
            isFavorite: true,
          },
        ],
        offers: {
          [mockOffer.city.name]: [
            {
              ...mockOffer,
              isFavorite: true,
            },
          ],
        },
        currentCityOffers: [
          {
            ...mockOffer,
            isFavorite: true,
          },
        ],
      };
      const action = {
        type: logout.fulfilled.type,
        payload: true,
      };
      const result = offersReducer(state, action);

      expect(result.favorites).toEqual([]);
      expect(result.currentOffer?.isFavorite).toBe(false);
      expect(result.nearbyOffers[0].isFavorite).toBe(false);
      expect(result.offers[mockOffer.city.name][0].isFavorite).toBe(false);
      expect(result.currentCityOffers[0].isFavorite).toBe(false);
    });
  });
});

