// import { createContext, useContext, useState, useEffect } from 'react';

// const UserContext = createContext();
// export const useUserContext = () => useContext(UserContext);


// export const UserProvider = ({ children }) => {

//   const getSkillsUser = () => {
//     try {
//       const stored = localStorage.getItem('skillsUser');
//       return stored ? JSON.parse(stored) : [];
//     } catch {
//       return [];
//     }
//   };

//   const [user, setUser] = useState(() => {
//     const storedUser = {
//       userId: localStorage.getItem('userId') || null,
//       userName: localStorage.getItem('userName') || '',
//       nickNameUser: localStorage.getItem('nickNameUser') || '',
//       userRole: localStorage.getItem('userRole') || '',
//       genderUser: localStorage.getItem('genderUser') || 'אחר',
//       profilePictureUser: localStorage.getItem('profilePictureUser') || '',
//       tokenUser: localStorage.getItem('tokenUser') || null,
//       skillsUser: getSkillsUser(),
//       tagsUser: localStorage.getItem('tagsUser') || [],
//       enterDateUser: localStorage.getItem('enterDateUser') || null,
//       emailUser: localStorage.getItem('emailUser') || '',
//       notificationsUser: localStorage.getItem('notificationsUser') || [],
//       lengthNotificationsUser: localStorage.getItem('lengthNotificationsUser') || null
//     };
//     return storedUser.userId ? storedUser : null;
//   });

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updatedUser = {
//         userId: localStorage.getItem('userId'),
//         userName: localStorage.getItem('userName'),
//         nickNameUser: localStorage.getItem('nickNameUser'),
//         userRole: localStorage.getItem('userRole'),
//         genderUser: localStorage.getItem('genderUser'),
//         profilePictureUser: localStorage.getItem('profilePictureUser'),
//         tokenUser: localStorage.getItem('tokenUser'),
//         skillsUser: getSkillsUser(),
//         tagsUser: localStorage.getItem('tagsUser'),
//         enterDateUser: localStorage.getItem('enterDateUser'),
//         emailUser: localStorage.getItem('emailUser'),
//         notificationsUser: localStorage.getItem('notificationsUser'),
//         lengthNotificationsUser: localStorage.getItem('lengthNotificationsUser')
//       };
//       setUser(updatedUser.userId ? updatedUser : null);
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };






// import { createContext, useContext, useState, useEffect } from 'react';
// import { getNotificationsByUser } from '../routes/UserAPI'; // או איפה שזה אצלך

// const UserContext = createContext();
// export const useUserContext = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   const getSkillsUser = () => {
//     try {
//       const stored = localStorage.getItem('skillsUser');
//       return stored ? JSON.parse(stored) : [];
//     } catch {
//       return [];
//     }
//   };

//   const [user, setUser] = useState(() => {
//     const storedUser = {
//       userId: localStorage.getItem('userId') || null,
//       userName: localStorage.getItem('userName') || '',
//       nickNameUser: localStorage.getItem('nickNameUser') || '',
//       userRole: localStorage.getItem('userRole') || '',
//       genderUser: localStorage.getItem('genderUser') || 'אחר',
//       profilePictureUser: localStorage.getItem('profilePictureUser') || '',
//       tokenUser: localStorage.getItem('tokenUser') || null,
//       skillsUser: getSkillsUser(),
//       tagsUser: localStorage.getItem('tagsUser') || [],
//       enterDateUser: localStorage.getItem('enterDateUser') || null,
//       emailUser: localStorage.getItem('emailUser') || '',
//       notificationsUser: localStorage.getItem('notificationsUser') || [],
//       lengthNotificationsUser: localStorage.getItem('lengthNotificationsUser') || null
//     };
//     return storedUser.userId ? storedUser : null;
//   });

//   const [notificationsCount, setNotificationsCount] = useState(0);

//   const fetchNotifications = async () => {
//     try {
//       if (user?.userId) {
//         const res = await getNotificationsByUser(user.userId);
//         setNotificationsCount(res.data.count); // בהנחה שאת מחזירה count מהשרת
//       }
//     } catch (err) {
//       console.log('שגיאה בקבלת התראות:', err);
//     }
//   };

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updatedUser = {
//         userId: localStorage.getItem('userId'),
//         userName: localStorage.getItem('userName'),
//         nickNameUser: localStorage.getItem('nickNameUser'),
//         userRole: localStorage.getItem('userRole'),
//         genderUser: localStorage.getItem('genderUser'),
//         profilePictureUser: localStorage.getItem('profilePictureUser'),
//         tokenUser: localStorage.getItem('tokenUser'),
//         skillsUser: getSkillsUser(),
//         tagsUser: localStorage.getItem('tagsUser'),
//         enterDateUser: localStorage.getItem('enterDateUser'),
//         emailUser: localStorage.getItem('emailUser'),
//         notificationsUser: localStorage.getItem('notificationsUser'),
//         lengthNotificationsUser: localStorage.getItem('lengthNotificationsUser')
//       };
//       setUser(updatedUser.userId ? updatedUser : null);
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser, notificationsCount, fetchNotifications }}>
//       {children}
//     </UserContext.Provider>
//   );
// };


import { createContext, useContext, useState, useEffect } from 'react';
import { getNotificationsByUser, markNotificationsAsRead } from '../routes/UserAPI'; // עדכני בהתאם

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
      tagsUser: JSON.parse(localStorage.getItem('tagsUser') || '[]'),
      enterDateUser: localStorage.getItem('enterDateUser') || null,
      emailUser: localStorage.getItem('emailUser') || '',
      notificationsUser: [],
    };
    return storedUser.userId ? storedUser : null;
  });

  const [notificationsCount, setNotificationsCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user?.userId) return;
    try {
      const res = await getNotificationsByUser(user.userId);
      const notifications = res.data.notifications || [];
      setUser(prev => ({
        ...prev,
        notificationsUser: notifications
      }));
      setNotificationsCount(notifications.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('שגיאה בקבלת התראות:', err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!user?.userId) return;
    try {
      await markNotificationsAsRead(user.userId);

      // עדכון סטייט מקומי
      setUser(prev => ({
        ...prev,
        notificationsUser: prev.notificationsUser.map(n => ({ ...n, isRead: true }))
      }));
      setNotificationsCount(0);
    } catch (err) {
      console.error('שגיאה בסימון התראות כנקראו:', err);
    }
  };

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
        tagsUser: JSON.parse(localStorage.getItem('tagsUser') || '[]'),
        enterDateUser: localStorage.getItem('enterDateUser'),
        emailUser: localStorage.getItem('emailUser'),
        notificationsUser: []
      };
      setUser(updatedUser.userId ? updatedUser : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        notificationsCount,
        setNotificationsCount,
        fetchNotifications,
        markAllNotificationsAsRead
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
