import { TokenCache } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value;
    } catch (error) {
      console.error('Error getting token from SecureStore:', error);
      return undefined;
    }
  },
  async saveToken(key: string, token: string) {
    try {
      await SecureStore.setItemAsync(key, token);
    } catch (error) {
      console.error('Error saving token to SecureStore:', error);
    }
  },
  async removeToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing token from SecureStore:', error);
    }
  },
};