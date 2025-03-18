import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, django } from '../lib/axios';
import { Profile, RegisterData } from '../lib/types';

interface AuthState {
  token: string | null;
  profile: Profile | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: localStorage.getItem('token'),
      profile: null,
      isLoading: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const formData = new URLSearchParams();
          formData.append('username', username);
          formData.append('password', password);
          formData.append('grant_type', 'password');

          const response = await api.post('/v1/token', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });

          const { access_token } = response.data;
          localStorage.setItem('token', access_token);
          set({ token: access_token });

          // Login to Django
          await django.get(`/user/login?token=${access_token}`);

          // Immediately fetch profile after successful login
          try {
            const profileResponse = await api.get('/v1/profile');
            set({ profile: profileResponse.data });
          } catch (error) {
            console.error('Failed to fetch profile after login:', error);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const formData = new FormData();
          formData.append('username', data.username);
          formData.append('email', data.email);
          formData.append('password', data.password);
          formData.append('location', data.location);

          await django.post('/user/create', formData);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, profile: null });
      },

      fetchProfile: async () => {
        try {
          const response = await api.get('/v1/profile');
          set({ profile: response.data });
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);