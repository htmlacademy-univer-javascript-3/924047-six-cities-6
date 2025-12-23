import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import AuthorizedRoute from './authorized-route';
import { offersReducer } from '../../store/offers/offers-slice';
import { userReducer } from '../../store/user/user-slice';
import { AuthorizationStatus } from '../../const/routes';
import { createAPI } from '../../const/api';

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
      userAuth: authorizationStatus === AuthorizationStatus.Auth ? {
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        token: 'token',
      } : null,
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { axios: createAPI() },
      },
    }),
});

describe('AuthorizedRoute', () => {
  it('should render children when user is authorized', () => {
    const store = createMockStore(AuthorizationStatus.Auth);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthorizedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </AuthorizedRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authorized', () => {
    const store = createMockStore(AuthorizationStatus.NoAuth);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthorizedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </AuthorizedRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should show spinner when authorization status is unknown', () => {
    const store = createMockStore(AuthorizationStatus.Unknown);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthorizedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </AuthorizedRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});

