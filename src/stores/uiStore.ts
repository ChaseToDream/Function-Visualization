import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface UIStore {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  notifications: [],
  addNotification: (notification) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
    
    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, notification.duration || 3000);
    }
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
  
  activeModal: null,
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));

// 细粒度选择器 hooks
export const useNotifications = () => useUIStore((s) => s.notifications);
export const useIsSidebarOpen = () => useUIStore((s) => s.isSidebarOpen);

// 便捷 hook
export const useNotification = () => {
  const addNotification = useUIStore((s) => s.addNotification);
  const removeNotification = useUIStore((s) => s.removeNotification);
  return { addNotification, removeNotification };
};
