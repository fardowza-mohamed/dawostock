import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  const refresh = async () => {
    const { data } = await api.get('/notifications', { params: { limit: 8 } });
    setItems(data.data || []);
    setUnread(data.unread || 0);
  };

  useEffect(() => {
    refresh().catch(() => {});
    const id = setInterval(() => refresh().catch(() => {}), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <NotificationContext.Provider value={{ items, unread, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () =>
  useContext(NotificationContext) || { items: [], unread: 0, refresh: async () => {} };
