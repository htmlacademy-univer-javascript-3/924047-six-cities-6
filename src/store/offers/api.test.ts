import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  loadOffers,
  getOfferDetails,
  getOffersNearby,
  getOfferComments,
  submitOfferComment,
  getFavoriteOffers,
  updateFavoriteOfferStatus,
} from './api';
import { ThunkExtraArguments } from '../index';
import { Offer, OfferDetails, PlaceType } from '../../types/offer';
import { Feedback, FeedbackData } from '../../types/feedback';

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

describe('offers API', () => {
  let mockAxios: MockAdapter;
  let axiosInstance: AxiosInstance;
  let extra: ThunkExtraArguments;

  beforeEach(() => {
    axiosInstance = axios.create();
    mockAxios = new MockAdapter(axiosInstance);
    extra = { axios: axiosInstance };
  });

  describe('loadOffers', () => {
    it('should load offers successfully', async () => {
      const offers = [mockOffer];
      mockAxios.onGet('/offers').reply(200, offers);

      const result = await loadOffers()(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(loadOffers.fulfilled.type);
      expect(result.payload).toEqual(offers);
    });

    it('should handle loadOffers error', async () => {
      mockAxios.onGet('/offers').reply(500);

      const result = await loadOffers()(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(loadOffers.rejected.type);
    });
  });

  describe('getOfferDetails', () => {
    it('should get offer details successfully', async () => {
      mockAxios.onGet('/offers/1').reply(200, mockOfferDetails);

      const result = await getOfferDetails('1')(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(getOfferDetails.fulfilled.type);
      expect(result.payload).toEqual(mockOfferDetails);
    });

    it('should handle getOfferDetails error', async () => {
      mockAxios.onGet('/offers/1').reply(500);

      const result = await getOfferDetails('1')(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(getOfferDetails.rejected.type);
    });
  });

  describe('getOffersNearby', () => {
    it('should get nearby offers successfully', async () => {
      const offers = [mockOffer];
      mockAxios.onGet('/offers/1/nearby').reply(200, offers);

      const result = await getOffersNearby('1')(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(getOffersNearby.fulfilled.type);
      expect(result.payload).toEqual(offers);
    });

    it('should handle getOffersNearby error', async () => {
      mockAxios.onGet('/offers/1/nearby').reply(500);

      const result = await getOffersNearby('1')(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(getOffersNearby.rejected.type);
    });
  });

  describe('getOfferComments', () => {
    it('should get offer comments successfully', async () => {
      const feedbacks = [mockFeedback];
      mockAxios.onGet('/comments/1').reply(200, feedbacks);

      const result = await getOfferComments('1')(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(getOfferComments.fulfilled.type);
      expect(result.payload).toEqual(feedbacks);
    });

    it('should handle getOfferComments error', async () => {
      mockAxios.onGet('/comments/1').reply(500);

      const result = await getOfferComments('1')(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(getOfferComments.rejected.type);
    });
  });

  describe('submitOfferComment', () => {
    it('should submit offer comment successfully', async () => {
      const feedbackData: FeedbackData = {
        comment: 'Test comment',
        rating: 5,
      };
      mockAxios.onPost('/comments/1').reply(200, mockFeedback);

      const result = await submitOfferComment({
        offerId: '1',
        feedbackData,
      })(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(submitOfferComment.fulfilled.type);
      expect(result.payload).toEqual(mockFeedback);
    });

    it('should handle submitOfferComment error', async () => {
      const feedbackData: FeedbackData = {
        comment: 'Test comment',
        rating: 5,
      };
      mockAxios.onPost('/comments/1').reply(500);

      const result = await submitOfferComment({
        offerId: '1',
        feedbackData,
      })(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(submitOfferComment.rejected.type);
    });
  });

  describe('getFavoriteOffers', () => {
    it('should get favorite offers successfully', async () => {
      const offers = [mockOffer];
      mockAxios.onGet('/favorite').reply(200, offers);

      const result = await getFavoriteOffers()(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(getFavoriteOffers.fulfilled.type);
      expect(result.payload).toEqual(offers);
    });

    it('should handle getFavoriteOffers error', async () => {
      mockAxios.onGet('/favorite').reply(500);

      const result = await getFavoriteOffers()(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(getFavoriteOffers.rejected.type);
    });
  });

  describe('updateFavoriteOfferStatus', () => {
    it('should update favorite offer status successfully', async () => {
      const updatedOffer = {
        ...mockOfferDetails,
        isFavorite: true,
      };
      mockAxios.onPost('/favorite/1/1').reply(200, updatedOffer);

      const result = await updateFavoriteOfferStatus({
        offerId: '1',
        status: 1,
      })(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(updateFavoriteOfferStatus.fulfilled.type);
      expect(result.payload).toEqual(updatedOffer);
    });

    it('should handle updateFavoriteOfferStatus error', async () => {
      mockAxios.onPost('/favorite/1/1').reply(500);

      const result = await updateFavoriteOfferStatus({
        offerId: '1',
        status: 1,
      })(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(updateFavoriteOfferStatus.rejected.type);
    });
  });
});

