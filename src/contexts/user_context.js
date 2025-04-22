import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = {
      userId: localStorage.getItem('userId') || null,
      userName: localStorage.getItem('userName') || '',
      userRole: localStorage.getItem('userRole') || '',
      url: localStorage.getItem('url') || ''
    };
    return storedUser.userId ? storedUser : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = {
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName'),
        userRole: localStorage.getItem('userRole'),
        url: localStorage.getItem('url')
      };

      setUser(updatedUser.userId ? updatedUser : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
