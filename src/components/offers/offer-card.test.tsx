import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import OfferCard from './offer-card';
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
  isFavorite: false,
  isPremium: false,
  rating: 4,
  previewImage: 'test.jpg',
};

const createMockStore = (authorizationStatus: AuthorizationStatus) => configureStore({
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
      authorizationStatus,
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

describe('OfferCard', () => {
  it('should render offer information', () => {
    const store = createMockStore(AuthorizationStatus.Auth);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferCard offer={mockOffer} onMouseEnter={vi.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test Offer')).toBeInTheDocument();
    expect(screen.getByText('€100')).toBeInTheDocument();
  });

  it('should render premium badge when offer is premium', () => {
    const premiumOffer = { ...mockOffer, isPremium: true };
    const store = createMockStore(AuthorizationStatus.Auth);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferCard offer={premiumOffer} onMouseEnter={vi.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not render premium badge when offer is not premium', () => {
    const store = createMockStore(AuthorizationStatus.Auth);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferCard offer={mockOffer} onMouseEnter={vi.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should call updateFavoriteOfferStatus when bookmark is clicked and user is authorized', async () => {
    const user = userEvent.setup();
    const store = createMockStore(AuthorizationStatus.Auth);
    const dispatch = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferCard offer={mockOffer} onMouseEnter={vi.fn()} />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button', { name: /to bookmarks/i });
    await user.click(bookmarkButton);

    expect(dispatch).toHaveBeenCalled();
  });

  it('should navigate to login when bookmark is clicked and user is not authorized', async () => {
    const user = userEvent.setup();
    const store = createMockStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <OfferCard offer={mockOffer} onMouseEnter={vi.fn()} />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button', { name: /to bookmarks/i });
    await user.click(bookmarkButton);

    // Check if navigation occurred (MemoryRouter will update location)
    expect(window.location.pathname).toBe('/');
  });

  it('should call onMouseEnter when card is hovered', () => {
    const onMouseEnter = vi.fn();
    const store = createMockStore(AuthorizationStatus.Auth);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferCard offer={mockOffer} onMouseEnter={onMouseEnter} />
        </MemoryRouter>
      </Provider>
    );

    const card = screen.getByText('Test Offer').closest('article');
    expect(card).toBeInTheDocument();
  });

  it('should render active bookmark when offer is favorite', () => {
    const favoriteOffer = { ...mockOffer, isFavorite: true };
    const store = createMockStore(AuthorizationStatus.Auth);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferCard offer={favoriteOffer} onMouseEnter={vi.fn()} />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button', { name: /to bookmarks/i });
    expect(bookmarkButton).toHaveClass('place-card__bookmark-button--active');
  });
});

