import { create } from 'zustand';
import { puterService } from '../services/puter-service';

interface User {
  id: string;
  username: string;
  email: string;
  preferences?: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  signIn: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const user = await puterService.signIn();
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Authentication failed',
        isLoading: false,
      });
    }
  },

  signOut: async () => {
    try {
      await puterService.signOut();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Sign out failed',
      });
    }
  },

  updateProfile: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    try {
      const updatedUser = { ...user, ...updates };
      await puterService.setKV('user_profile', updatedUser);
      
      set({ user: updatedUser });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Profile update failed',
      });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      
      try {
        const isSignedIn = await puterService.isSignedIn();
        
        if (isSignedIn) {
          const user = await puterService.getUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (puterError) {
        console.warn('Puter auth check failed, using fallback mode:', puterError);
        // For now, assume not authenticated when Puter fails
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Auth check failed',
        isLoading: false,
      });
    }
  },
}));
