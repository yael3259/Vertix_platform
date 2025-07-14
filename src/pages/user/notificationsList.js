import { useState, useEffect } from 'react';
import "../../styles/user/notificationsList.css";
import { NavLink, useNavigate } from 'react-router-dom';
import { getNotificationsByUser, markNotificationsAsRead } from '../../routes/UserAPI';
import { useUserContext } from '../../contexts/UserContext';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import no_alerts from "../../files/icons/no_alerts.png";
import achieved from "../../files/icons/achieved.gif";
import network from "../../files/icons/network.gif";
import boost_complete from "../../files/icons/boost_complete.gif";
import { getOneUser } from '../../routes/UserAPI';



export const NotificationsList = () => {
    const { user, setNotificationsCount } = useUserContext();
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        markNotifications();
    }, []);

    useEffect(() => {
        if (user) {
            getNotifications();
        }
    }, [user]);

    const markNotifications = async () => {
        try {
            const res = await markNotificationsAsRead(user.userId);
            setNotificationsCount(0);
            console.log("succsses", res);
        } catch (err) {
            console.error("fail to mark notifications as read", err);
        }
    };

    const getNotifications = async () => {
        try {
            const res = await getNotificationsByUser(user.userId);
            setNotifications(res.data.notifications || []);
            const count = res.data.count;
            console.log(res.data);
        } catch (err) {
            console.error("Failed to get notifications", err);
        }
    };

    const timeAgo = (dateStr) => {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: he })
    }

    const fetchToProfile = async (userId) => {
        try {
            let res = await getOneUser(userId);
            console.log("success", res.data);
            navigate(`/profile/${userId}`);
        }
        catch (err) {
            console.log("Error fetching user", err);
        }
    }

    console.log("boostId:", notifications);

    return (
        <div className='notifBody'>
            <div className="notification-container">
                <h1 className="notifications-title">התראות</h1>
                <p className="notifications-subtitle">
                    כאן יופיעו תגובות חדשות, מעקבים ועדכונים מהטבלאות האישיות שלך
                </p>
                {notifications.length === 0 ? (
                    <div className="no-notifications">
                        <img
                            src={no_alerts}
                            className="no-notifications-img"
                        />
                        <h2 className="no-notifications-title">אין התראות</h2>
                        <p className="no-notifications-text">ברגע שתתקבל תגובה, מעקב או עדכון בטבלאות, תופיע כאן התראה</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div key={notification._id} className={`notification ${notification.type === 'comment' ? 'notification-comment' : ''}`}>
                            {notification.type === 'comment' &&
                                <div onClick={() => fetchToProfile(notification.fromUserId?._id)}>
                                    {notification.fromUserId?.profilePicture ? (
                                        <img src={notification.fromUserId?.profilePicture} className="profile-pic" />
                                    ) : (
                                        <div className="avatar-fallback" id="avatar-fallback_inNotification">
                                            {(notification.fromUserId?.userName || 'אורח').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            }
                            {notification.type === 'follow' && <img className="profile-pic" id='networkNotif' src={network} />}
                            {notification.type === 'table' && <img className="profile-pic" id='achievedNotif' src={achieved} />}
                            {notification.type === 'boost' && <img className="profile-pic" id='achievedNotif' src={boost_complete} />}

                            <div className="content">
                                <div className="top-row">
                                    <div className="user">
                                        {notification.type === 'follow' && (
                                            <NavLink
                                                to={`/profile/${notification.fromUserId?._id}`}
                                                className="followNotif"
                                                title={`מעבר לפרופיל של ${notification.fromUserId?.userName}`} >
                                                <p className='spanUserName'>{notification.fromUserId?.userName || "user"} התחיל/ה לעקוב אחריך</p>
                                            </NavLink>
                                        )}

                                        {notification.type === 'table' && (
                                            <NavLink to={`/profile/table/${notification.achievementId._id}`} className="notificationOfAchievement" title="מעבר לטבלה">
                                                <span className="notification-title">כל הכבוד! 🎉</span>
                                                <span className='completedSuccssesTitle'>
                                                    השלמת בהצלחה את ההישג&nbsp;
                                                    <b id="boldAchievementName"># {notification.achievementTitle}</b>
                                                </span>
                                            </NavLink>
                                        )}

                                        {notification.type === 'boost' && (
                                            <NavLink to={`/profile/table/${notification.boostId._id}`} className="notificationOfBoost" title="מעבר לטבלה">
                                                <span className="notification-title">🔥 עשית את זה</span>
                                                <span className='completedSuccssesTitle'>
                                                    השלמת בהצלחה את הבוסט&nbsp;
                                                    <b id="boldAchievementName"># {notification.boostTitle}</b>
                                                </span>
                                            </NavLink>
                                        )}

                                        {notification.type === 'comment' && (
                                            <>
                                                <span>{notification.fromUserId?.userName || "user"}</span>
                                                <span className='spanUserName'> הגיב/ה לך על פוסט</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="dateNotification">{timeAgo(notification.creatingDate)}</div>
                                </div>

                                <div className="textNotification">
                                    {notification.type === 'comment' && notification.postId?._id && (
                                        <NavLink to={`/profile/single_post/${notification.postId._id}`} className="commentNotif" title="מעבר לפוסט המלא">
                                            <span>
                                                {notification.commentText.length > 50
                                                    ? notification.commentText.slice(0, 56) + '...'
                                                    : notification.commentText}
                                            </span>
                                        </NavLink>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ).reverse()}
            </div>
        </div>
    );
};
