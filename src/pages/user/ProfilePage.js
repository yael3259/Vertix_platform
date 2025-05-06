import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import "../../styles/user/ProfilePage.css";
import { updateUserDetails } from '../../routes/UserAPI';
import { useUserContext } from '../../contexts/UserContext';



export const ProfilePage = () => {
    let [skill, setSkill] = useState('');
    let [arrSkills, setArrSkills] = useState([]);
    const { user } = useUserContext();

    // if (!user) {
    //     return;
    // }    
    
    const AddNewSkill = () => {
        setArrSkills([...arrSkills, skill]);
        setSkill('');
    }

    const UpdateDetails = async (data) => {
        console.log(data);
        try {
            let res = await updateUserDetails(data);
            console.log(res);
        }
        catch (err) {
            console.log("failed to update", err);
        }
    }

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
                            <button onClick={AddNewSkill}>הוסף</button>
                            {arrSkills.map((tag, i) => (
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
                            <h3>עריכת מידע אישי</h3>
                            <button className="save-btn">ערוך פרטים</button>
                        </div>

                        <div className="card-section">
                            <div className="icon">📁</div>
                            <h3>הוסף הישג</h3>
                            <NavLink to="/addAchievement" className="save-btn">הוסף הישג</NavLink>
                        </div>

                        <div className="card-section">
                            <div className="icon">📊</div>
                            <h3>טבלאות המעקב</h3>
                            <button className="save-btn">לטבלה</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};