import { createContext, useContext, useState, useEffect } from 'react';
import { getNotificationsByUser, markNotificationsAsRead } from '../routes/UserAPI';



const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

// ערכי ברירת מחדל למשתמש אורח
const defaultGuestUser = {
  userId: "guest",
  userName: "אורח",
  nickNameUser: "",
  userRole: "guest",
  genderUser: "אחר",
  profilePictureUser: "",
  tokenUser: null,
  skillsUser: [],
  tagsUser: [],
  enterDateUser: null,
  emailUser: "",
  notificationsUser: [],
  pointsUser: null
};

const getSkillsUser = () => {
  try {
    const stored = localStorage.getItem('skillsUser');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getTagsUser = () => {
  try {
    const stored = localStorage.getItem('tagsUser');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) return defaultGuestUser;

    return {
      userId,
      userName: localStorage.getItem('userName') || '',
      nickNameUser: localStorage.getItem('nickNameUser') || '',
      userRole: localStorage.getItem('userRole') || '',
      genderUser: localStorage.getItem('genderUser') || 'אחר',
      profilePictureUser: localStorage.getItem('profilePictureUser') || '',
      tokenUser: localStorage.getItem('tokenUser') || null,
      skillsUser: getSkillsUser(),
      tagsUser: getTagsUser(),
      enterDateUser: localStorage.getItem('enterDateUser') || null,
      emailUser: localStorage.getItem('emailUser') || '',
      notificationsUser: [],
      pointsUser: localStorage.getItem('pointsUser') || null
    };
  });

  const [notificationsCount, setNotificationsCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user?.userId || user.userId === 'guest') return;
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
    if (!user?.userId || user.userId === 'guest') return;
    try {
      await markNotificationsAsRead(user.userId);
      setUser(prev => ({
        ...prev,
        notificationsUser: prev.notificationsUser.map(n => ({ ...n, isRead: true }))
      }));
      setNotificationsCount(0);
    } catch (err) {
      console.error('faild to mark notification as read', err);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setUser(defaultGuestUser);
        return;
      }

      const updatedUser = {
        userId,
        userName: localStorage.getItem('userName') || '',
        nickNameUser: localStorage.getItem('nickNameUser') || '',
        userRole: localStorage.getItem('userRole') || '',
        genderUser: localStorage.getItem('genderUser') || 'אחר',
        profilePictureUser: localStorage.getItem('profilePictureUser') || '',
        tokenUser: localStorage.getItem('tokenUser') || null,
        skillsUser: getSkillsUser(),
        tagsUser: getTagsUser(),
        enterDateUser: localStorage.getItem('enterDateUser') || null,
        emailUser: localStorage.getItem('emailUser') || '',
        notificationsUser: [],
        pointsUser: localStorage.getItem('pointsUser') || null
      };

      setUser(updatedUser);
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
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
