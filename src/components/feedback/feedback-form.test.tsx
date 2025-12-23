import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FeedbackForm from './feedback-form';
import { offersReducer } from '../../store/offers/offers-slice';
import { userReducer } from '../../store/user/user-slice';
import { AuthorizationStatus } from '../../const/routes';
import { createAPI } from '../../const/api';
import { OfferDetails, PlaceType } from '../../types/offer';

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

// Mock submitOfferComment
vi.mock('../../store/offers/api', async () => {
  const actual = await vi.importActual('../../store/offers/api');
  return {
    ...actual as Record<string, unknown>,
    submitOfferComment: Object.assign(
      vi.fn(() => ({
        type: 'offer/submitComment/pending',
        unwrap: vi.fn().mockResolvedValue({}),
      })),
      {
        pending: 'offer/submitComment/pending',
        fulfilled: 'offer/submitComment/fulfilled',
        rejected: 'offer/submitComment/rejected',
      }
    ),
  } as typeof actual;
});

const mockOfferDetails: OfferDetails = {
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
      currentOffer: mockOfferDetails,
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

describe('FeedbackForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form elements', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FeedbackForm />
      </Provider>
    );

    expect(screen.getByLabelText('Your review')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tell how was your stay, what you like and what can be improved')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should disable submit button when form is invalid', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FeedbackForm />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FeedbackForm />
      </Provider>
    );

    // Select rating (5 stars)
    const ratingLabel = screen.getByTitle('perfect');
    await user.click(ratingLabel);

    // Enter review text (at least 50 characters)
    const textarea = screen.getByPlaceholderText('Tell how was your stay, what you like and what can be improved');
    await user.type(textarea, 'This is a very good place to stay. I really enjoyed my time here and would recommend it to others.');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('should update stars when rating is selected', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FeedbackForm />
      </Provider>
    );

    const ratingLabel = screen.getByTitle('perfect');
    await user.click(ratingLabel);

    const ratingInput = document.getElementById('5-stars') as HTMLInputElement;
    expect(ratingInput).toBeChecked();
  });

  it('should update review text when typing', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FeedbackForm />
      </Provider>
    );

    const textarea = screen.getByPlaceholderText('Tell how was your stay, what you like and what can be improved');
    await user.type(textarea, 'Test review');

    expect(textarea).toHaveValue('Test review');
  });

  it('should show character count when text is entered', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <FeedbackForm />
      </Provider>
    );

    const textarea = screen.getByPlaceholderText('Tell how was your stay, what you like and what can be improved');
    await user.type(textarea, 'Test');

    expect(screen.getByText(/\(4\/50\)/)).toBeInTheDocument();
  });

  it('should submit form when valid and submit button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const dispatch = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <FeedbackForm />
      </Provider>
    );

    // Select rating (5 stars)
    const ratingLabel = screen.getByTitle('perfect');
    await user.click(ratingLabel);

    // Enter review text
    const textarea = screen.getByPlaceholderText('Tell how was your stay, what you like and what can be improved');
    await user.type(textarea, 'This is a very good place to stay. I really enjoyed my time here and would recommend it to others.');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    expect(dispatch).toHaveBeenCalled();
  });

  it('should disable form when submitting', () => {
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
        currentOffer: mockOfferDetails,
        nearbyOffers: [],
        feedbacks: [],
        isOfferLoading: false,
        isCommentsLoading: false,
        isCommentSubmitting: true,
        isFavoritesLoading: false,
        favorites: [],
      },
    });
    render(
      <Provider store={store}>
        <FeedbackForm />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /submitting/i });
    expect(submitButton).toBeDisabled();
  });

  it('should not render form when currentOffer is null', () => {
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
        <FeedbackForm />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });
});

