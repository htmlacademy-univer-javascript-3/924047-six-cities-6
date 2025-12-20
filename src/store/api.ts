import {createAsyncThunk} from '@reduxjs/toolkit';
import {Offer} from '../types/offer.ts';
import {ThunkExtraArguments} from './index.ts';
import {offersUrl, userUrl} from '../const/api.ts';
import {UserAuth} from '../types/user.ts';
import {AxiosError} from 'axios';

export const loadOffers = createAsyncThunk<
  Offer[],
  void,
  {
    extra: ThunkExtraArguments;
    rejectValue: string;
  }
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

export const checkAuth = createAsyncThunk<
  UserAuth,
  void,
  {
    extra: ThunkExtraArguments;
    rejectValue: string;
  }
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
  {
    extra: ThunkExtraArguments;
    rejectValue: string;
  }
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
  {
    extra: ThunkExtraArguments;
    rejectValue: string;
  }
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
