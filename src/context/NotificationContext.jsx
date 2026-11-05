// ============================================================
// src/context/NotificationContext.jsx
// Toast notifications.
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);

  const hide = useCallback(() => {
    setNotification((prev) => (prev ? { ...prev, visible: false } : null));
  }, []);

  const show = useCallback(
    (text, icon = '🔔', duration = 3000) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setNotification({ text, icon, visible: true });
      timeoutRef.current = setTimeout(hide, duration);
    },
    [hide],
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notification && (
        <div
          className={`notification ${notification.visible ? 'show' : ''}`}
          role="status"
          aria-live="polite"
        >
          <span className="notification-icon">{notification.icon}</span>
          <span>{notification.text}</span>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return ctx;
}
