import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { translations } from '../utils/translations';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = [
  {
    label: "Abreham Tadesse (Customer - Gold Tier)",
    labelAmharic: "አብርሃም ታደሰ (ሸማች - የወርቅ ደረጃ)",
    phone: "+251911333333",
    password: "password123",
    role: "customer",
    badge: "Gold Member",
    tag: "Customer",
    tagAmharic: "ሸማች",
  },
  {
    label: "Dawit Haile (Kaldi's Coffee Cashier)",
    labelAmharic: "ዳዊት ኃይሌ (የካልዲስ ቡና ካሼር)",
    phone: "+251911111111",
    password: "password123",
    role: "merchant_cashier",
    badge: "Kaldi's POS",
    tag: "Cashier",
    tagAmharic: "ካሼር",
  },
  {
    label: "System Administrator",
    labelAmharic: "ዋና ሲስተም አስተዳዳሪ",
    phone: "+251911000000",
    password: "password123",
    role: "admin",
    badge: "Platform Admin",
    tag: "Admin",
    tagAmharic: "አስተዳዳሪ",
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ethio_rewards_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ethio_rewards_token') || null);
  const [loading, setLoading] = useState(true);

  // Language state: DEFAULT IS AMHARIC ('am')
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem('ethio_rewards_lang');
    // If user explicitly chose 'en', use 'en'; otherwise DEFAULT TO AMHARIC ('am')
    return savedLang === 'en' ? 'en' : 'am';
  });

  const isAmharic = lang === 'am';

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === 'am' ? 'en' : 'am';
      localStorage.setItem('ethio_rewards_lang', next);
      return next;
    });
  };

  const changeLanguage = (newLang) => {
    const chosen = newLang === 'en' ? 'en' : 'am';
    setLang(chosen);
    localStorage.setItem('ethio_rewards_lang', chosen);
  };

  // Translation helper function
  const t = (key) => {
    const langDict = translations[lang] || translations.am;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    // Fallback to English, then return key
    return translations.en[key] || key;
  };

  const refreshUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('ethio_rewards_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('Could not refresh user session:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = async (loginId, password) => {
    const res = await api.post('/auth/login', { loginId, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('ethio_rewards_token', res.data.token);
      localStorage.setItem('ethio_rewards_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('ethio_rewards_token', res.data.token);
      localStorage.setItem('ethio_rewards_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ethio_rewards_token');
    localStorage.removeItem('ethio_rewards_user');
  };

  const switchDemoAccount = async (account) => {
    return await login(account.phone, account.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        switchDemoAccount,
        lang,
        isAmharic,
        toggleLanguage,
        changeLanguage,
        t,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
