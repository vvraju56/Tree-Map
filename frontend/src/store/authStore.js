import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({ user: data.user, token: data.token, loading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Login failed';
          set({ error: msg, loading: false });
          return { success: false, message: msg };
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', { name, email, password });
          set({ user: data.user, token: data.token, loading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Registration failed';
          set({ error: msg, loading: false });
          return { success: false, message: msg };
        }
      },

      logout: () => {
        set({ user: null, token: null });
        delete api.defaults.headers.common['Authorization'];
      },

      initAuth: () => {
        const { token } = get();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },
    }),
    {
      name: 'tree-map-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;
