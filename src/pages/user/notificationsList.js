import React, { useState, useEffect } from 'react';
import "../../styles/user/notificationsList.css";
import { getNotificationsByUser, markNotificationsAsRead } from '../../routes/UserAPI';
import { useUserContext } from '../../contexts/UserContext';
import { formatDistanceToNow } from 'date-fns'
import { he } from 'date-fns/locale'
import no_alerts from "../../files/icons/no_alerts.png"



export const NotificationsList = () => {
    const { user, setNotificationsCount } = useUserContext();
    const [notifications, setNotifications] = useState([]);

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
        } catch (err) {
            console.error("Failed to get notifications", err);
        }
    };

    const timeAgo = (dateStr) => {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: he })
    }

    return (
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
