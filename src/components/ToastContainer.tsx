import { Toast, type ToastMessage } from './Toast';
import '../styles/Toast.css';

interface ToastContainerProps {
  messages: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer = ({ messages, onClose }: ToastContainerProps) => {
  return (
    <div className="toast-container">
      {messages.map((message) => (
        <Toast key={message.id} message={message} onClose={onClose} />
      ))}
    </div>
  );
};
