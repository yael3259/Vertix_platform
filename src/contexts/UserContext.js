// UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';


const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);



export const UserProvider = ({ children }) => {

  const getSkillsUser = () => {
    try {
      const stored = localStorage.getItem('skillsUser');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const [user, setUser] = useState(() => {
    const storedUser = {
      userId: localStorage.getItem('userId') || null,
      userName: localStorage.getItem('userName') || '',
      nickNameUser: localStorage.getItem('nickNameUser') || '',
      userRole: localStorage.getItem('userRole') || '',
      genderUser: localStorage.getItem('genderUser') || 'אחר',
      profilePictureUser: localStorage.getItem('profilePictureUser') || '',
      tokenUser: localStorage.getItem('tokenUser') || null,
      skillsUser: getSkillsUser(),
      tagsUser: localStorage.getItem('tagsUser') || [],
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
        skillsUser: getSkillsUser(),
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
