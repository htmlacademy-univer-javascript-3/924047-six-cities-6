import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { checkAuth, login, logout } from './api';
import { ThunkExtraArguments } from '../index';
import { UserAuth } from '../../types/user';

const mockUserAuth: UserAuth = {
  name: 'Test User',
  email: 'test@example.com',
  avatarUrl: 'avatar.jpg',
  isPro: false,
  token: 'test-token',
};

describe('user API', () => {
  let mockAxios: MockAdapter;
  let axiosInstance: AxiosInstance;
  let extra: ThunkExtraArguments;

  beforeEach(() => {
    axiosInstance = axios.create();
    mockAxios = new MockAdapter(axiosInstance);
    extra = { axios: axiosInstance };
  });

  describe('checkAuth', () => {
    it('should check auth successfully', async () => {
      mockAxios.onGet('/login').reply(200, mockUserAuth);

      const result = await checkAuth()(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(checkAuth.fulfilled.type);
      expect(result.payload).toEqual(mockUserAuth);
    });

    it('should handle checkAuth error', async () => {
      mockAxios.onGet('/login').reply(500);

      const result = await checkAuth()(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(checkAuth.rejected.type);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      mockAxios.onPost('/login').reply(200, mockUserAuth);

      const result = await login({
        email: 'test@example.com',
        password: 'password',
      })(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(login.fulfilled.type);
      expect(result.payload).toEqual(mockUserAuth);
    });

    it('should handle login error with error message', async () => {
      const errorResponse = {
        details: [
          {
            messages: ['Invalid email or password'],
          },
        ],
      };
      mockAxios.onPost('/login').reply(400, errorResponse);

      const result = await login({
        email: 'test@example.com',
        password: 'wrong',
      })(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(login.rejected.type);
      if (result.type === login.rejected.type) {
        expect(result.payload).toBe('Invalid email or password');
      }
    });

    it('should handle login error without error message', async () => {
      mockAxios.onPost('/login').reply(500);

      const result = await login({
        email: 'test@example.com',
        password: 'password',
      })(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(login.rejected.type);
      if (result.type === login.rejected.type) {
        expect(result.payload).toBe('Unknown login error');
      }
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockAxios.onDelete('/logout').reply(204);

      const result = await logout()(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(logout.fulfilled.type);
      expect(result.payload).toBe(true);
    });

    it('should handle logout error', async () => {
      mockAxios.onDelete('/logout').reply(500);

      const result = await logout()(
        vi.fn(),
        vi.fn(),
        extra
      );

      expect(result.type).toBe(logout.rejected.type);
    });
  });
});

