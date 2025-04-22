import React from 'react';
import './profilePage.css';



export const ProfilePage = () => {

    const profile = {
        userName: "נועם כהן",
        nickname: "@noamco",
        email: "noam@example.com",
        gender: "נקבה",
        role: "משתמשת רגילה",
        joinDate: "01/01/2024",
        tags: ["#עיצוב", "#טכנולוגיה", "#צילום"],
        profilePicture: "https://cdn-icons-png.freepik.com/256/10796/10796964.png?ga=GA1.1.1754982332.1740749915&semt=ais_hybrid"
    };

    return (
        <div className="profilePage">
            <div className="profile-dashboard">
                <div className="profile-header">
                    <img src={profile.profilePicture} alt="Profile" className="profile-picture" />
                    <div className="profile-info">
                        <h1>{profile.userName}</h1>
                        <div className="nickname">{profile.nickname}</div>
                        <div className="meta">מין: {profile.gender} | תפקיד: {profile.role}</div>
                        <div className="join-date">הצטרפות: {profile.joinDate}</div>
                    </div>
                    <div className="profile-buttons">
                        <button className="btn">עריכת פרופיל</button>
                        <button className="btn">לטבלה</button>
                        <button className="btn">הודעות</button>
                    </div>
                </div>

                <div className="profile-body">
                    <div className="section">
                        <h3>פרטים אישיים</h3>
                        <div className="detail-row"><strong>אימייל:</strong> {profile.email}</div>
                        <div className="detail-row"><strong>סיסמה:</strong> ********</div>
                        <div className="detail-row"><strong>כינוי:</strong> {profile.nickname}</div>
                    </div>

                    <div className="section">
                        <h3>תחומי עניין</h3>
                        <div className="tags">
                            {profile.tags.map((tag, i) => (
                                <span key={i} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div className="buttom_section">
                        <div className="card-section">
                            <div className="icon">✏️</div>
                            <h3>עריכת מידע אישי</h3>
                            <button className="save-btn">ערוך פרטים</button>
                        </div>

                        <div className="card-section">
                            <div className="icon">📁</div>
                            <h3>ניהול קבצים</h3>
                            <button className="save-btn">הצג קבצים</button>
                        </div>

                        <div className="card-section">
                            <div className="icon">📊</div>
                            <h3>טבלת המעקב</h3>
                            <button className="save-btn">לטבלה</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};