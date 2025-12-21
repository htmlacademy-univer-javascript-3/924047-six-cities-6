import {createAsyncThunk} from '@reduxjs/toolkit';
import {ThunkExtraArguments} from '../index.ts';
import {UserAuth} from '../../types/user.ts';
import {AxiosError} from 'axios';
import {userUrl} from '../../const/api.ts';

export type AppThunkConfig = {
  extra: ThunkExtraArguments;
  rejectValue: string;
};

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
