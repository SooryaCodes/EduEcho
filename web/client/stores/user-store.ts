import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserType } from '@/types';

interface UserState {
  currentUser: User | null;
  setUser: (user: User | null) => void;
  updateUserType: (type: UserType) => void;
  updateLanguage: (language: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      
      setUser: (user) => set({ currentUser: user }),
      
      updateUserType: (type) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, type }
            : null,
        })),
      
      updateLanguage: (language) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, language }
            : null,
        })),
      
      clearUser: () => set({ currentUser: null }),
    }),
    {
      name: 'eduecho-user',
    }
  )
);

