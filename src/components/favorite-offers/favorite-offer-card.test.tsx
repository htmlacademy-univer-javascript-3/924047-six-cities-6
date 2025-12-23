import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import FavoriteOfferCard from './favorite-offer-card';
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
    delete: vi.fn(),
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
  isFavorite: true,
  isPremium: false,
  rating: 4,
  previewImage: 'test.jpg',
};

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

describe('FavoriteOfferCard', () => {
  it('should render offer information', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteOfferCard offer={mockOffer} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test Offer')).toBeInTheDocument();
    expect(screen.getByText('€100')).toBeInTheDocument();
  });

  it('should render premium badge when offer is premium', () => {
    const premiumOffer = { ...mockOffer, isPremium: true };
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteOfferCard offer={premiumOffer} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should call updateFavoriteOfferStatus when bookmark is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const dispatch = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteOfferCard offer={mockOffer} />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button', { name: /in bookmarks/i });
    await user.click(bookmarkButton);

    expect(dispatch).toHaveBeenCalled();
  });

  it('should render active bookmark button', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteOfferCard offer={mockOffer} />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button', { name: /in bookmarks/i });
    expect(bookmarkButton).toHaveClass('place-card__bookmark-button--active');
  });
});

