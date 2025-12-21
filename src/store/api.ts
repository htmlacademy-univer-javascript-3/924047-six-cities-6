import {createAsyncThunk} from '@reduxjs/toolkit';
import {Offer, OfferDetails} from '../types/offer.ts';
import {ThunkExtraArguments} from './index.ts';
import {commentsUrl, offersUrl, userUrl} from '../const/api.ts';
import {UserAuth} from '../types/user.ts';
import {AxiosError} from 'axios';
import {Feedback, FeedbackData} from '../types/feedback.ts';

export type AppThunkConfig = {
    extra: ThunkExtraArguments;
    rejectValue: string;
};

export const loadOffers = createAsyncThunk<
  Offer[],
  void,
  AppThunkConfig
>(
  'offers/loadOffers',
  async (_, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.get<Offer[]>(
        offersUrl.offers
      );

      return data;
    } catch {
      return rejectWithValue('Failed to load offers');
    }
  }
);

export const getOfferDetails = createAsyncThunk<
  OfferDetails,
  string,
  AppThunkConfig
>(
  'offers/getOfferDetails',
  async (offerId, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.get<OfferDetails>(offersUrl.offerDetails(offerId));

      return data;
    } catch {
      return rejectWithValue('Failed to load offer details');
    }
  }
);

export const getOffersNearby = createAsyncThunk<
  Offer[],
  string,
  AppThunkConfig
>(
  'offers/loadOffersNearby',
  async (offerId, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.get<Offer[]>(offersUrl.offersNearby(offerId));

      return data;
    } catch {
      return rejectWithValue('Failed to load offers nearby');
    }
  }
);

export const getOfferComments = createAsyncThunk<
  Feedback[],
  string,
  AppThunkConfig
>(
  'offer/getComments',
  async (offerId, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.get<Feedback[]>(commentsUrl.offerComments(offerId));

      return data;
    } catch {
      return rejectWithValue('Failed to load offer comments');
    }
  }
);

export const submitOfferComment = createAsyncThunk<
  Feedback,
  { offerId: string; feedbackData: FeedbackData },
  AppThunkConfig
>(
  'offer/submitComment',
  async ({offerId, feedbackData}, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.post<Feedback>(commentsUrl.offerComments(offerId), feedbackData);

      return data;
    } catch {
      return rejectWithValue('Failed submit offer comment');
    }
  }
);

export const checkAuth = createAsyncThunk<
  UserAuth,
  void,
  AppThunkConfig
>(
  'user/checkAuth',
  async (_, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.get<UserAuth>(
        userUrl.login,
      );

      return data;
    } catch {
      return rejectWithValue('Failed to load offers');
    }
  }
);

export const login = createAsyncThunk<
  UserAuth,
  { email: string; password: string },
  AppThunkConfig
>(
  'user/login',
  async ({ email, password }, { extra, rejectWithValue }) => {
    try {
      const { data } = await extra.axios.post<UserAuth>(
        userUrl.login, { email, password }
      );

      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{
        details?: { messages: string[] }[];
      }>;
      return rejectWithValue(axiosError.response?.data?.details?.[0]?.messages?.[0] ??
        'Unknown login error');
    }
  }
);

export const logout = createAsyncThunk<
  boolean,
  void,
  AppThunkConfig
>(
  'user/logout',
  async (_, { extra, rejectWithValue }) => {
    try {
      const response = await extra.axios.delete(
        userUrl.logout,
      );

      return response.status === 204;
    } catch {
      return rejectWithValue('Failed to load offers');
    }
  }
);
