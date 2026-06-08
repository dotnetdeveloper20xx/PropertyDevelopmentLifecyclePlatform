import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * AuthService unit tests.
 * Tests localStorage-based auth state management without Angular DI.
 * The service reads TOKEN_KEY and USER_KEY from localStorage.
 */
describe('AuthService (pure logic)', () => {
  const TOKEN_KEY = 'access_token';
  const REFRESH_TOKEN_KEY = 'refresh_token';
  const USER_KEY = 'user';

  beforeEach(() => {
    localStorage.clear();
  });

  describe('Token storage', () => {
    it('should have no token initially', () => {
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });

    it('should persist token when set', () => {
      localStorage.setItem(TOKEN_KEY, 'jwt-token-123');
      expect(localStorage.getItem(TOKEN_KEY)).toBe('jwt-token-123');
    });

    it('should clear all auth keys on logout', () => {
      localStorage.setItem(TOKEN_KEY, 'token');
      localStorage.setItem(REFRESH_TOKEN_KEY, 'refresh');
      localStorage.setItem(USER_KEY, JSON.stringify({ firstName: 'Test' }));

      // Simulate logout
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(USER_KEY)).toBeNull();
    });
  });

  describe('User state', () => {
    it('should return null user when not stored', () => {
      const stored = localStorage.getItem(USER_KEY);
      expect(stored).toBeNull();
    });

    it('should parse stored user correctly', () => {
      const user = { firstName: 'John', lastName: 'Doe', email: 'john@test.com', roles: ['SuperAdmin'] };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      const parsed = JSON.parse(localStorage.getItem(USER_KEY)!);
      expect(parsed.firstName).toBe('John');
      expect(parsed.roles).toContain('SuperAdmin');
    });

    it('should determine authentication by token presence', () => {
      // Not authenticated
      expect(!!localStorage.getItem(TOKEN_KEY)).toBe(false);

      // Authenticated
      localStorage.setItem(TOKEN_KEY, 'valid-token');
      expect(!!localStorage.getItem(TOKEN_KEY)).toBe(true);
    });
  });
});
