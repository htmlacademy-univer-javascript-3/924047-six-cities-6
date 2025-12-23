import { describe, it, expect } from 'vitest';
import { userReducer, UserState } from './user-slice';
import { checkAuth, login, logout } from './api';
import { AuthorizationStatus } from '../../const/routes';
import { UserAuth } from '../../types/user';

const mockUserAuth: UserAuth = {
  name: 'Test User',
  email: 'test@example.com',
  avatarUrl: 'avatar.jpg',
  isPro: false,
  token: 'test-token',
};

describe('userSlice', () => {
  const initialState: UserState = {
    error: null,
    authorizationStatus: AuthorizationStatus.Unknown,
    userAuth: null,
  };

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('checkAuth', () => {
    it('should handle checkAuth.fulfilled', () => {
      const action = {
        type: checkAuth.fulfilled.type,
        payload: mockUserAuth,
      };
      const result = userReducer(initialState, action);

      expect(result.userAuth).toEqual(mockUserAuth);
      expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
    });

    it('should handle checkAuth.rejected', () => {
      const action = { type: checkAuth.rejected.type };
      const result = userReducer(initialState, action);

      expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(result.userAuth).toBeNull();
    });
  });

  describe('login', () => {
    it('should handle login.fulfilled', () => {
      const action = {
        type: login.fulfilled.type,
        payload: mockUserAuth,
      };
      const result = userReducer(initialState, action);

      expect(result.userAuth).toEqual(mockUserAuth);
      expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
    });
  });

  describe('logout', () => {
    it('should handle logout.fulfilled', () => {
      const state = {
        ...initialState,
        userAuth: mockUserAuth,
        authorizationStatus: AuthorizationStatus.Auth,
      };
      const action = {
        type: logout.fulfilled.type,
        payload: true,
      };
      const result = userReducer(state, action);

      expect(result.userAuth).toBeNull();
      expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    });
  });
});

