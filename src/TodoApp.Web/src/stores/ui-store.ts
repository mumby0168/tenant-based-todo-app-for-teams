import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Theme
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Notifications
  notifications: Array<{
    id: string;
    message: string;
    severity: 'error' | 'warning' | 'info' | 'success';
    timestamp: number;
  }>;
  addNotification: (message: string, severity: 'error' | 'warning' | 'info' | 'success') => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      // Sidebar
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      
      // Theme
      themeMode: 'light',
      toggleTheme: () => set((state) => ({ 
        themeMode: state.themeMode === 'light' ? 'dark' : 'light' 
      })),
      
      // Notifications
      notifications: [],
      addNotification: (message, severity) => {
        const notification = {
          id: Date.now().toString(),
          message,
          severity,
          timestamp: Date.now(),
        };
        set((state) => ({ 
          notifications: [...state.notifications, notification] 
        }));
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== notification.id),
          }));
        }, 5000);
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'ui-preferences',
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        themeMode: state.themeMode,
      }),
    }
  )
);