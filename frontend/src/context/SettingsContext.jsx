import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const { token } = useAuth();

  const refresh = async () => {
    try {
      if (token) {
        const { data } = await api.get('/settings');
        setSettings(data.data);
      } else {
        const { data } = await api.get('/settings/public');
        setSettings(data.data);
      }
    } catch {
      // fallback default settings
      setSettings((prev) => prev || {
        pharmacyName: 'DawoStock Pharmacy',
        address: 'Maka Al Mukarama Road, Mogadishu, Somalia',
        city: 'Mogadishu',
        phone: '+252 61 5550000',
        whatsappNumber: '+252 61 5550000',
        emergencyPhone: '+252 61 5551111',
        email: 'info@dawostock.so',
        currencySymbol: '$',
      });
    }
  };

  useEffect(() => {
    refresh();
  }, [token]);

  const money = (n) => {
    const symbol = settings?.currencySymbol || '$';
    const num = Number(n || 0);
    return `${symbol}${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, refresh, money }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () =>
  useContext(SettingsContext) || {
    settings: {
      pharmacyName: 'DawoStock Pharmacy',
      address: 'Maka Al Mukarama Road, Mogadishu, Somalia',
      city: 'Mogadishu',
      phone: '+252 61 5550000',
      whatsappNumber: '+252 61 5550000',
      emergencyPhone: '+252 61 5551111',
      email: 'info@dawostock.so',
      currencySymbol: '$',
    },
    money: (n) => `$${Number(n || 0).toFixed(2)}`,
  };
