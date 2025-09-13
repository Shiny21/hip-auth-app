import React, { useState, useEffect } from 'react';
import { eventBus } from '../event-bus/EventBus';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe('notification', (payload: Toast) => {
      const newToast: Toast = {
        id: Math.random().toString(36).substr(2, 9),
        message: payload.message,
        type: payload.type
      };
      
      setToasts((prev) => [...prev, newToast]);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
      }, 5000);
    });

    return unsubscribe;
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastStyle = (type: Toast['type']) => {
    switch (type) {
      case 'success': return { backgroundColor: '#4caf50', color: 'white' };
      case 'error': return { backgroundColor: '#f44336', color: 'white' };
      case 'warning': return { backgroundColor: '#ff9800', color: 'white' };
      case 'info': return { backgroundColor: '#2196f3', color: 'white' };
      default: return { backgroundColor: '#333', color: 'white' };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            ...getToastStyle(toast.type),
            padding: '12px 16px',
            marginBottom: '10px',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            cursor: 'pointer'
          }}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;