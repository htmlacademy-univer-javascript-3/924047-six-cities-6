import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { OffersContainer } from './offers-container';
import { offersReducer } from '../../store/offers/offers-slice';
import { userReducer } from '../../store/user/user-slice';
import { AuthorizationStatus } from '../../const/routes';
import { createAPI } from '../../const/api';
import { setOffers } from '../../store/offers/offers-slice';
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

// Mock MapWidget
vi.mock('../../widgets/map/map', () => ({
  default: () => <div data-testid="map-widget">Map</div>,
}));

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
      name: 'Amsterdam',
      location: { latitude: 52.37454, longitude: 4.897976, zoom: 13 },
    },
    location: { latitude: 52.37454, longitude: 4.897976, zoom: 13 },
    isFavorite: true,
    isPremium: true,
    rating: 5,
    previewImage: 'test2.jpg',
  },
];

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
      currentCityOffers: mockOffers,
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
    ...initialState,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { axios: createAPI() },
      },
    }),
});

describe('OffersContainer', () => {
  it('should render offers count', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersContainer />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('2 places to stay in Amsterdam')).toBeInTheDocument();
  });

  it('should render EmptyOffers when no offers', () => {
    const store = createMockStore({
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
          <OffersContainer />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
  });

  it('should render Select component', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersContainer />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Sort by')).toBeInTheDocument();
  });

  it('should render map widget', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersContainer />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('map-widget')).toBeInTheDocument();
  });

  it('should dispatch setOffers when sort changes', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const dispatch = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersContainer />
        </MemoryRouter>
      </Provider>
    );

    const selectButton = screen.getByText('Popular');
    await user.click(selectButton);

    const option = screen.getByText('Price: low to high');
    await user.click(option);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: setOffers.type,
    }));
  });
});

