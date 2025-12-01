/**
 * Authentication Utilities
 * Helper functions for managing JWT tokens and authentication state
 */

export const authUtils = {
  /**
   * Store JWT tokens in localStorage
   */
  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  },

  /**
   * Remove all tokens (logout)
   */
  clearTokens() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  /**
   * Get authorization header for API requests
   */
  getAuthHeader(): HeadersInit {
    const token = this.getAccessToken();
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  },

  /**
   * Decode JWT token (without verification - for client-side only)
   * Note: Never trust this data for security-critical operations
   */
  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  /**
   * Get user ID from stored access token
   */
  getUserId(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded?.userId || null;
  },

  /**
   * Get vector ID from stored access token
   */
  getVectorId(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded?.vectorId || null;
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  },

  /**
   * Check if access token needs refresh (expires in less than 5 minutes)
   */
  shouldRefreshToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return false;
    const expiresIn = decoded.exp * 1000 - Date.now();
    return expiresIn < 5 * 60 * 1000; // 5 minutes
  },
};
