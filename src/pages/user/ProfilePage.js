import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import "../../styles/user/ProfilePage.css";
import { updateUserDetails, getOneUser } from '../../routes/UserAPI';
import { useUserContext } from '../../contexts/UserContext';
import { getUserAchievements } from '../../routes/AchievementAPI';



export const ProfilePage = () => {
    let [skill, setSkill] = useState('');
    let [arrSkills, setArrSkills] = useState([]);
    let [arrAchievements, setArrAchievements] = useState([]);
    const { user } = useUserContext();
    let userId = user.userId;

    useEffect(() => {
        if (user) {
            getUser();
            getAchievements();
        }
    }, [user]);

    const getUser = async () => {
        try {
            let userData = await getOneUser(userId);
            setArrSkills(userData.data.skills);
        }
        catch (err) {
            console.log('could not get user', err);
        }
    };

    const AddNewSkill = async (skill) => {
        if (!skill) return;

        let userId = user.userId;
        try {
            let res = await updateUserDetails(userId, { skills: [skill] });
            console.log('skill added successfully', res.data);

            setArrSkills([...arrSkills, skill]);

            setSkill('');
        } catch (err) {
            console.log('could not add skill', err);
        }
    };

    const getAchievements = async () => {
        try {
            let res = await getUserAchievements(userId);
            console.log("success", res.data);
            setArrAchievements(res.data);
        } catch (err) {
            console.log("failed to get achievements", err);
        }
    };

    return (
        <div className="profilePage">
            <div className="profile-dashboard">
                <div className="profile-header">
                    <img src={user.profilePictureUser} alt="Profile" className="profile-picture" />
                    <div className="profile-info">
                        <h1>{user.userName}</h1>
                        <div className="nickname">{user.nickNameUser}</div>
                        <div>{user.userRole === 'USER' ? 'משתמש/ת רגיל/ה' : user.userRole === 'ADMIN' ? 'מנהל' : null}</div>
                    </div>
                    <div className="profile-buttons">
                        <button className="btn">עריכת פרופיל</button>
                        <button className="btn">לטבלה</button>
                        <button className="btn">הודעות</button>
                    </div>
                </div>

                <div className="profile-body">
                    <div className="section" id='details_section'>
                        <h3>פרטים אישיים</h3>
                        <div className="detail-row"><strong>מין:</strong> {user.genderUser}</div>
                        <div className="detail-row"><strong>אימייל:</strong> {user.emailUser}</div>
                        <div className="detail-row"><strong>כינוי:</strong> {user.nickNameUser}</div>
                        <div className="detail-row"><strong>הצטרפות:</strong> {new Date(user.enterDateUser).toLocaleDateString('he-IL')}</div>
                    </div>

                    <div className="section" id='skills_section'>
                        <h3>תחומי עניין</h3>
                        <div className="tags">
                            <input type='text'
                                value={skill}
                                placeholder='הוסף כישור או תחום עניין'
                                onChange={(e) => setSkill(e.target.value)}
                            />
                            <button onClick={() => AddNewSkill(skill)}>הוסף</button>

                            {Array.isArray(arrSkills) && arrSkills.map((tag, i) => (
                                tag && <span key={i} className="tag">{`# ${tag}`}</span>
                            ))}
                        </div>
                    </div>

                    <div className="section" id='posts_section'>
                        <h3>הפוסטים שלי</h3>
                    </div>

                    <div className="buttom_section">
                        <div className="card-section">
                            <div className="icon">✏️</div>
                            <h3>הוספת פוסט</h3>
                            <NavLink to="/addPost" className="save-btn">להוספה</NavLink>
                        </div>

                        <div className="card-section">
                            <div className="icon">📁</div>
                            <h3 id='linkToAchievement'>הוספת הישג</h3>
                            <NavLink to="/addAchievement" className="save-btn">להוספה</NavLink>
                        </div>

                        <div className="card-section" id="Achievement-section">
                            <div className="rightSideAchievement">
                                <div className="icon">📊</div>
                                <h3>עדכון יומי</h3>
                                <p className='small_title'>הישגים וטבלאות מעקב</p>
                            </div>

                            <div className="leftSideAchievement">
                                {arrAchievements.length > 0 ? (
                                    arrAchievements.map((achievement, i) => (
                                        <NavLink to={`/table/${achievement._id}`} key={i} className="achievement-item">
                                            # {achievement.title}
                                        </NavLink>
                                    ))
                                ) : (
                                    <p className="no-achievements">אין לך עדיין הישגים</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
