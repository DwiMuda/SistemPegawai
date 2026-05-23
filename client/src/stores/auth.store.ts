import { defineStore } from 'pinia';
import { api } from '@/utils/api';
import type { LoginCredentials, User, AuthResponse } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user_data') || 'null'),
    token: localStorage.getItem('access_token'),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isPegawai: (state) => state.user?.role === 'pegawai',
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        
        const { user, accessToken } = response.data.data;
        
        this.user = user;
        this.token = accessToken;
        
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal melakukan login. Silakan periksa koneksi Anda.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        this.clearAuth();
      }
    },

    clearAuth() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
    },

    async fetchProfile() {
      try {
        const response = await api.get('/auth/me');
        this.user = response.data.data;
        localStorage.setItem('user_data', JSON.stringify(this.user));
        return this.user;
      } catch (error) {
        console.error('Failed to fetch profile', error);
        return null;
      }
    },

    async updateProfile(data: any) {
      try {
        const response = await api.put('/auth/profile', data);
        await this.fetchProfile();
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal memperbarui profil');
      }
    },

    async changePassword(data: any) {
      try {
        const response = await api.put('/auth/password', data);
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengubah password');
      }
    }
  },
});
