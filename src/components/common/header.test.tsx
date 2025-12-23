import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Header from './header';
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

// Mock logout action
vi.mock('../../store/user/api', async () => {
  const actual = await vi.importActual('../../store/user/api');
  return {
    ...actual as Record<string, unknown>,
    logout: Object.assign(
      vi.fn(() => ({ type: 'user/logout/pending' })),
      {
        pending: 'user/logout/pending',
        fulfilled: 'user/logout/fulfilled',
        rejected: 'user/logout/rejected',
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
      authorizationStatus: AuthorizationStatus.NoAuth,
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

describe('Header', () => {
  it('should render login link when user is not authorized', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
  });

  it('should render user info and logout button when user is authorized', () => {
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
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
  });

  it('should display favorites count', () => {
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
        favorites: [
          {
            id: '1',
            title: 'Test Offer',
            type: 'apartment' as const,
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
          },
        ],
      },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should call logout when sign out button is clicked', async () => {
    const user = userEvent.setup();
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
    });
    const dispatch = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    const signOutButton = screen.getByText('Sign out').closest('a');
    expect(signOutButton).toBeInTheDocument();

    await user.click(signOutButton!);

    expect(dispatch).toHaveBeenCalled();
  });

  it('should render logo link', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    const logoLink = screen.getByAltText('6 cities logo').closest('a');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });
});

