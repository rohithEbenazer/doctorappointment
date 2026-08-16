import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', duration = 4000) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const hideToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 20px',
          borderRadius: '12px',
          background: toast.type === 'error' ? '#fff1f2' : toast.type === 'info' ? '#f0f9ff' : '#f0fdf4',
          border: `1px solid ${toast.type === 'error' ? '#fecdd3' : toast.type === 'info' ? '#bae6fd' : '#bbf7d0'}`,
          color: toast.type === 'error' ? '#991b1b' : toast.type === 'info' ? '#075985' : '#166534',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          {toast.type === 'error' && <AlertCircle size={20} color="#dc2626" />}
          {toast.type === 'info' && <Info size={20} color="#0284c7" />}
          {toast.type === 'success' && <CheckCircle2 size={20} color="#16a34a" />}
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{toast.message}</span>
          <button onClick={hideToast} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '8px', opacity: 0.7 }}>
            <X size={16} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
