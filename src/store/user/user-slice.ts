import { createSlice } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../../const/routes.ts';
import { UserAuth } from '../../types/user.ts';
import { checkAuth, login, logout } from './api.ts';

export enum UserReducerName {
  user = 'user',
}

export type UserState = {
  error: string | null;
  authorizationStatus: AuthorizationStatus;
  userAuth: UserAuth | null;
};

const initialState: UserState = {
  error: null,
  authorizationStatus: AuthorizationStatus.Unknown,
  userAuth: null,
};

export const userSlice = createSlice({
  name: UserReducerName.user,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.userAuth = action.payload;
        state.authorizationStatus = AuthorizationStatus.Auth;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userAuth = action.payload;
        state.authorizationStatus = AuthorizationStatus.Auth;
        localStorage.setItem('six-cities-token', action.payload.token);
      })
      .addCase(logout.fulfilled, (state) => {
        state.userAuth = null;
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        localStorage.removeItem('six-cities-token');
      });
  },
});

export const userReducer = userSlice.reducer;
