import React, { createContext, useContext, useState, useEffect } from 'react';




const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = {
      userId: localStorage.getItem('userId') || null,
      userName: localStorage.getItem('userName') || '',
      nickNameUser: localStorage.getItem('nickNameUser') || '',
      userRole: localStorage.getItem('userRole') || '',
      genderUser: localStorage.getItem('genderUser') || 'אחר',
      profilePictureUser: localStorage.getItem('profilePictureUser') || '',
      tokenUser: localStorage.getItem('tokenUser') || null,
      skillsUser: localStorage.getItem('skillsUser') || null,
      tagsUser: localStorage.getItem('tagsUser') || null,
      enterDateUser: localStorage.getItem('enterDateUser') || null,
      emailUser: localStorage.getItem('emailUser') || ''
    };
    return storedUser.userId ? storedUser : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = {
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName'),
        nickNameUser: localStorage.getItem('nickNameUser'),
        userRole: localStorage.getItem('userRole'),
        genderUser: localStorage.getItem('genderUser'),
        profilePictureUser: localStorage.getItem('profilePictureUser'),
        tokenUser: localStorage.getItem('tokenUser'),
        skillsUser: localStorage.getItem('skillsUser'),
        tagsUser: localStorage.getItem('tagsUser'),
        enterDateUser: localStorage.getItem('enterDateUser'),
        emailUser: localStorage.getItem('emailUser')
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
