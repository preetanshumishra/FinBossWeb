import { create } from 'zustand';
import type { ToastMessage } from '../components/Toast';

interface ToastState {
  messages: ToastMessage[];
  addToast: (message: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

let toastId = 0;

export const useToastStore = create<ToastState>((set) => ({
  messages: [],

  addToast: (message: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${++toastId}`;
    const newMessage: ToastMessage = {
      ...message,
      id,
      duration: message.duration || 3000,
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    // Auto-remove after duration
    if (message.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        }));
      }, message.duration || 3000);
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    }));
  },

  clearAll: () => {
    set({ messages: [] });
  },
}));
