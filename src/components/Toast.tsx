import { useEffect } from 'react';
import '../styles/Toast.css';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface ToastProps {
  message: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast = ({ message, onClose }: ToastProps) => {
  useEffect(() => {
    const duration = message.duration || 3000;
    const timer = setTimeout(() => {
      onClose(message.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div className={`toast toast-${message.type}`}>
      <span className="toast-icon">{getIcon(message.type)}</span>
      <span className="toast-message">{message.message}</span>
      <button
        className="toast-close"
        onClick={() => onClose(message.id)}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
};
