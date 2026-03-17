import { useCallback, useEffect, useState } from 'react';

export interface IAppNotification {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

const DEFAULT_AUTO_HIDE_MS = 4000;

export function useNotification(autoHideMs = DEFAULT_AUTO_HIDE_MS) {
  const [notification, setNotification] = useState<IAppNotification | null>(null);

  const showNotification = useCallback((value: IAppNotification) => {
    setNotification(value);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeoutId = setTimeout(() => {
      hideNotification();
    }, autoHideMs);

    return () => clearTimeout(timeoutId);
  }, [autoHideMs, hideNotification, notification]);

  return {
    notification,
    showNotification,
    hideNotification,
  };
}
