import { create } from 'zustand';
import { UserPreferences } from '@shared/schema';
import { WordPressConnection } from '@shared/schema';
import { puterService } from '../services/puter-service';

interface SettingsState {
  preferences: UserPreferences;
  wpConnections: WordPressConnection[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  loadPreferences: () => Promise<void>;
  addWPConnection: (connection: Omit<WordPressConnection, 'id' | 'createdAt'>) => Promise<void>;
  removeWPConnection: (connectionId: string) => Promise<void>;
  testWPConnection: (connectionId: string) => Promise<boolean>;
  loadWPConnections: () => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  defaultAIModel: 'claude',
  defaultWordCount: 2000,
  autoSaveInterval: 30,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  preferences: defaultPreferences,
  wpConnections: [],
  isLoading: false,
  error: null,

  updatePreferences: async (updates: Partial<UserPreferences>) => {
    try {
      const { preferences } = get();
      const updatedPreferences = { ...preferences, ...updates };
      
      await puterService.setKV('user_preferences', updatedPreferences);
      
      set({ preferences: updatedPreferences });
      
      // Apply theme change immediately
      if (updates.theme) {
        document.documentElement.classList.toggle('dark', updates.theme === 'dark');
      }
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update preferences',
      });
    }
  },

  loadPreferences: async () => {
    try {
      set({ isLoading: true, error: null });
      
      let preferences = defaultPreferences;
      
      try {
        const savedPreferences = await puterService.getKV('user_preferences');
        preferences = savedPreferences || defaultPreferences;
      } catch (puterError) {
        console.warn('Failed to load preferences from Puter, using defaults:', puterError);
        preferences = defaultPreferences;
      }
      
      set({
        preferences,
        isLoading: false,
      });
      
      // Apply theme
      document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
      
    } catch (error) {
      set({
        preferences: defaultPreferences,
        error: error instanceof Error ? error.message : 'Failed to load preferences',
        isLoading: false,
      });
    }
  },

  addWPConnection: async (connection) => {
    try {
      set({ isLoading: true, error: null });
      
      const connectionId = Date.now();
      const newConnection = {
        ...connection,
        id: connectionId,
        createdAt: new Date(),
      };
      
      await puterService.setKV(`wp_connection_${connectionId}`, newConnection);
      
      const { wpConnections } = get();
      set({
        wpConnections: [...wpConnections, newConnection as WordPressConnection],
        isLoading: false,
      });
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add WordPress connection',
        isLoading: false,
      });
    }
  },

  removeWPConnection: async (connectionId: string) => {
    try {
      await puterService.setKV(`wp_connection_${connectionId}`, null);
      
      const { wpConnections } = get();
      set({
        wpConnections: wpConnections.filter(conn => conn.id !== parseInt(connectionId)),
      });
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove WordPress connection',
      });
    }
  },

  testWPConnection: async (connectionId: string): Promise<boolean> => {
    try {
      const { wpConnections } = get();
      const connection = wpConnections.find(conn => conn.id === parseInt(connectionId));
      
      if (!connection) {
        throw new Error('Connection not found');
      }
      
      // Test WordPress REST API connectivity
      const response = await fetch(`${connection.url}/wp-json/wp/v2/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
      
    } catch (error) {
      console.error('WordPress connection test failed:', error);
      return false;
    }
  },

  loadWPConnections: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Load all WordPress connections from Puter.kv
      // This is a simplified implementation - in practice, you'd need to 
      // store connection IDs separately and load them individually
      const connections: WordPressConnection[] = [];
      
      set({
        wpConnections: connections,
        isLoading: false,
      });
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load WordPress connections',
        isLoading: false,
      });
    }
  },
}));
