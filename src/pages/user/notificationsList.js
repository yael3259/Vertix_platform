import React, { useState, useEffect } from 'react';
import "../../styles/user/notificationsList.css";
import { getNotificationsByUser } from '../../routes/UserAPI';
import { useUserContext } from '../../contexts/UserContext';
import { formatDistanceToNow } from 'date-fns'
import { he } from 'date-fns/locale'



export const NotificationsList = () => {
    const { user } = useUserContext();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            getNotifications();
        }
    }, [user]);

    const getNotifications = async () => {
        try {
            const res = await getNotificationsByUser(user.userId);
            setNotifications(res.data.notifications || []);
            const count = res.data.count;
        } catch (err) {
            console.error("Failed to get notifications", err);
        }
    };

    const timeAgo = (dateStr) => {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: he })
    }

    return (
        <div className="notification-container">
            {notifications.length === 0 ? (
                <p>אין התראות חדשות</p>
            ) : (
                notifications.map((notification) => (
                    <div key={notification._id} className="notification">
                        {notification.type === 'comment' && <img className="profile-pic" src={notification.fromUserId?.profilePicture} />}
                        {notification.type === 'follow' && <img className="profile-pic" src={""} />}
                        {notification.type === 'table' && <img className="profile-pic" src={""} />}

                        <div className="content">
                            <div className="top-row">
                                <div className="user">
                                    {notification.type === 'comment' && (
                                        <>
                                            <span>{notification.fromUserId?.userName || "user"}</span>
                                            <span className='spanUserName'> הגיב/ה לך על פוסט</span>
                                        </>
                                    )}
                                    {notification.type === 'follow' && (
                                        <>
                                            <span>{notification.fromUserId?.userName || "user"}</span>
                                            <span className='spanUserName'> התחיל/ה לעקוב אחריך</span>
                                        </>
                                    )}
                                    {notification.type === 'table' && (
                                        <>
                                            <span>עדכון</span>
                                            <span className='spanUserName'> יש עדכון בטבלה שלך</span>
                                        </>
                                    )}
                                </div>
                                <div className="dateNotification">{timeAgo(notification.creatingDate)}</div>
                            </div>
                            <div className="textNotification">
                                {notification.type === 'comment' && <>
                                    <span>{notification.commentText}</span>
                                </>}
                            </div>
                        </div>
                    </div>
                ))
            ).reverse()}
        </div>
    );
};
