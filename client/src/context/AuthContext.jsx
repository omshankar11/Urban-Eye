import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser  = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  // Guest mode — no real token, read-only access to public data
  const loginAsGuest = () => {
    const guestUser = { fullName: 'Guest', role: 'Guest', email: '' };
    setUser(guestUser);
    setToken('guest');
    localStorage.setItem('user', JSON.stringify(guestUser));
    localStorage.setItem('token', 'guest');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isGuest = token === 'guest';

  return (
    <AuthContext.Provider value={{ user, token, login, loginAsGuest, logout, loading, isGuest }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
