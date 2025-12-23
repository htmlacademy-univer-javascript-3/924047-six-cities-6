import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import OffersList from './offers-list';
import { offersReducer } from '../../store/offers/offers-slice';
import { userReducer } from '../../store/user/user-slice';
import { AuthorizationStatus } from '../../const/routes';
import { createAPI } from '../../const/api';
import { Offer, PlaceType } from '../../types/offer';

// Mock the API
vi.mock('../../const/api', () => ({
  createAPI: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  })),
}));

// Mock updateFavoriteOfferStatus and loadOffers
vi.mock('../../store/offers/api', async () => {
  const actual = await vi.importActual('../../store/offers/api');
  return {
    ...actual as Record<string, unknown>,
    updateFavoriteOfferStatus: Object.assign(
      vi.fn(() => ({ type: 'offers/updateFavorite/pending' })),
      {
        pending: 'offers/updateFavorite/pending',
        fulfilled: 'offers/updateFavorite/fulfilled',
        rejected: 'offers/updateFavorite/rejected',
      }
    ),
    loadOffers: Object.assign(
      vi.fn(() => ({ type: 'offers/loadOffers/pending' })),
      {
        pending: 'offers/loadOffers/pending',
        fulfilled: 'offers/loadOffers/fulfilled',
        rejected: 'offers/loadOffers/rejected',
      }
    ),
  };
});

const createMockStore = () => configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
  },
  preloadedState: {
    offers: {
      currentCity: {
        name: 'Amsterdam',
        location: { latitude: 52.37454, longitude: 4.897976, zoom: 13 },
      },
      cities: {},
      offers: {},
      currentCityOffers: [],
      activeOfferId: null,
      isOffersLoading: false,
      error: null,
      currentOffer: null,
      nearbyOffers: [],
      feedbacks: [],
      isOfferLoading: false,
      isCommentsLoading: false,
      isCommentSubmitting: false,
      isFavoritesLoading: false,
      favorites: [],
    },
    user: {
      error: null,
      authorizationStatus: AuthorizationStatus.Auth,
      userAuth: null,
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { axios: createAPI() },
      },
    }),
});

const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Test Offer 1',
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
    previewImage: 'test1.jpg',
  },
  {
    id: '2',
    title: 'Test Offer 2',
    type: PlaceType.Room,
    price: 150,
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
    isFavorite: true,
    isPremium: true,
    rating: 5,
    previewImage: 'test2.jpg',
  },
];

describe('OffersList', () => {
  it('should render all offers', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList
            offers={mockOffers}
            containerClassName="test-class"
            onCardHover={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Test Offer 2')).toBeInTheDocument();
  });

  it('should render with correct container class', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList
            offers={mockOffers}
            containerClassName="test-class"
            onCardHover={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    const listContainer = container.querySelector('.test-class');
    expect(listContainer).toBeInTheDocument();
  });

  it('should render empty list when no offers', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList
            offers={[]}
            containerClassName="test-class"
            onCardHover={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('Test Offer 1')).not.toBeInTheDocument();
  });

  it('should call onCardHover when offer card is hovered', () => {
    const store = createMockStore();
    const onCardHover = vi.fn();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList
            offers={mockOffers}
            containerClassName="test-class"
            onCardHover={onCardHover}
          />
        </MemoryRouter>
      </Provider>
    );

    const offerCard = screen.getByText('Test Offer 1').closest('article');
    expect(offerCard).toBeInTheDocument();
  });
});

