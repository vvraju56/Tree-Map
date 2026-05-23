import { create } from 'zustand';
import api from '../services/api';

const useTreeStore = create((set) => ({
  trees: [],
  currentTree: null,
  loading: false,
  error: null,

  fetchTrees: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/trees');
      set({ trees: data.trees, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch trees', loading: false });
    }
  },

  createTree: async (title, description = '') => {
    try {
      const { data } = await api.post('/trees', { title, description });
      set((s) => ({ trees: [data.tree, ...s.trees] }));
      return { success: true, tree: data.tree };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create tree' };
    }
  },

  fetchTree: async (id) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/trees/${id}`);
      set({ currentTree: data.tree, loading: false });
      return data.tree;
    } catch {
      set({ loading: false });
      return null;
    }
  },

  saveTree: async (id, updates) => {
    try {
      const { data } = await api.put(`/trees/${id}`, updates);
      set((s) => ({
        currentTree: data.tree,
        trees: s.trees.map((t) => (t.id === id ? data.tree : t)),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to save' };
    }
  },

  deleteTree: async (id) => {
    try {
      await api.delete(`/trees/${id}`);
      set((s) => ({ trees: s.trees.filter((t) => t.id !== id) }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete' };
    }
  },

  shareTree: async (id, access) => {
    try {
      const { data } = await api.post(`/trees/share/${id}`, { access });
      set((state) => ({
        currentTree: state.currentTree?.id === id
          ? { ...state.currentTree, shareToken: data.shareToken, shareAccess: data.shareAccess }
          : state.currentTree,
        trees: state.trees.map((tree) => (
          tree.id === id
            ? { ...tree, shareToken: data.shareToken, shareAccess: data.shareAccess }
            : tree
        )),
      }));
      return { success: true, shareToken: data.shareToken, shareAccess: data.shareAccess };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to share tree' };
    }
  },

  setCurrentTree: (tree) => set({ currentTree: tree }),
}));

export default useTreeStore;
