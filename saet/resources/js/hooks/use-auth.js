import axios from 'axios';
import { create } from 'zustand'

const useAuth = create((set) => ({
  user: (window.__laravext.page_data.shared_props.auth?.user),
  refreshUser: async () => {
    try {
      axios.get('/api/user').then((response) => {
        set(() => ({ user: response.data.data }));
      });
    }
    catch (error) {
      set(() => ({ user: null }));
    }
  },
  logout: () => {
    set(() => ({ user: null }));
  }
}))

export default useAuth;