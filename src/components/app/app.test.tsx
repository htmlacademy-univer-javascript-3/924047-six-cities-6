import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { HelmetProvider } from 'react-helmet-async';
import App from './app';
import { offersReducer } from '../../store/offers/offers-slice';
import { userReducer } from '../../store/user/user-slice';
import { AppRoute, AuthorizationStatus } from '../../const/routes';
import { createAPI } from '../../const/api';

// Mock BrowserRouter to use MemoryRouter instead for testing
let currentRoute = '/';
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as Record<string, unknown>,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => {
      const { MemoryRouter: MR } = actual as typeof import('react-router-dom');
      return <MR initialEntries={[currentRoute]}>{children}</MR>;
    },
  };
});

// Mock the API to avoid actual HTTP calls
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

// Mock the pages to simplify testing
vi.mock('../../pages/main-page', () => ({
  default: () => <div data-testid="main-page">Main Page</div>,
}));

vi.mock('../../pages/login-page', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('../../pages/favorites-page', () => ({
  default: () => <div data-testid="favorites-page">Favorites Page</div>,
}));

vi.mock('../../pages/offer-page', () => ({
  default: () => <div data-testid="offer-page">Offer Page</div>,
}));

vi.mock('../../pages/not-found-page', () => ({
  default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

// Mock async thunks to avoid actual API calls
vi.mock('../../store/user/api', async () => {
  const actual = await vi.importActual('../../store/user/api');
  return {
    ...actual as Record<string, unknown>,
    checkAuth: Object.assign(
      vi.fn(() => ({ type: 'user/checkAuth/pending' })),
      {
        pending: 'user/checkAuth/pending',
        fulfilled: 'user/checkAuth/fulfilled',
        rejected: 'user/checkAuth/rejected',
      }
    ),
  };
});

vi.mock('../../store/offers/api', async () => {
  const actual = await vi.importActual('../../store/offers/api');
  return {
    ...actual as Record<string, unknown>,
    getFavoriteOffers: Object.assign(
      vi.fn(() => ({ type: 'offers/getFavorite/pending' })),
      {
        pending: 'offers/getFavorite/pending',
        fulfilled: 'offers/getFavorite/fulfilled',
        rejected: 'offers/getFavorite/rejected',
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

const createMockStore = (initialState = {}) => configureStore({
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
      authorizationStatus: AuthorizationStatus.Unknown,
      userAuth: null,
    },
    ...initialState,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { axios: createAPI() },
      },
    }),
});

const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  currentRoute = route;
  const store = createMockStore();
  // BrowserRouter is mocked to use MemoryRouter with currentRoute
  return render(
    <Provider store={store}>
      <HelmetProvider>
        {ui}
      </HelmetProvider>
    </Provider>
  );
};

describe('App Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render MainPage for root route', () => {
    renderWithProviders(<App />, { route: AppRoute.Root });
    expect(screen.getByTestId('main-page')).toBeInTheDocument();
  });

  it('should render LoginPage for login route', () => {
    renderWithProviders(<App />, { route: AppRoute.Login });
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should render FavoritesPage for favorites route', () => {
    const store = createMockStore({
      user: {
        error: null,
        authorizationStatus: AuthorizationStatus.Auth,
        userAuth: {
          name: 'Test User',
          email: 'test@example.com',
          avatarUrl: 'avatar.jpg',
          isPro: false,
          token: 'token',
        },
      },
    });
    currentRoute = AppRoute.Favorites;
    render(
      <Provider store={store}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Provider>
    );
    expect(screen.getByTestId('favorites-page')).toBeInTheDocument();
  });

  it('should render OfferPage for offer route', () => {
    renderWithProviders(<App />, { route: '/offer/123' });
    expect(screen.getByTestId('offer-page')).toBeInTheDocument();
  });

  it('should render NotFoundPage for unknown route', () => {
    renderWithProviders(<App />, { route: '/unknown-route' });
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });

  it('should render NotFoundPage for invalid offer route', () => {
    renderWithProviders(<App />, { route: '/offer' });
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});

