import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import "../../styles/user/ProfilePage.css";
import { updateUserDetails, getOneUser, getFollowing } from '../../routes/UserAPI';
import { getUserAchievements } from '../../routes/AchievementAPI';
import { useUserContext } from '../../contexts/UserContext';



export const ProfilePage = () => {
    const [skill, setSkill] = useState('');
    const [arrSkills, setArrSkills] = useState([]);
    const [arrAchievements, setArrAchievements] = useState([]);
    const [followingQTY, setFollowingQTY] = useState(0);
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const { user: loggedInUser } = useUserContext();


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await getOneUser(userId);
                setUserProfile(res.data);
                setArrSkills(res.data.skills || []);
                console.log("User loaded:", res.data);
            } catch (err) {
                console.error("Error loading user", err);
                return;
            }

            try {
                const followingRes = await getFollowing(userId);
                setFollowingQTY(followingRes.data.count);
                console.log("Following count:", followingRes.data.count);
            } catch (err) {
                console.error("Error loading followings", err);
            }

            try {
                const achievementsRes = await getUserAchievements(userId);
                setArrAchievements(achievementsRes.data);
                console.log("Achievements:", achievementsRes.data);
            } catch (err) {
                console.error("Error loading achievements", err);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const AddNewSkill = async (skill) => {
        if (!skill || !userProfile) return;

        try {
            const res = await updateUserDetails(userProfile._id, { skills: [...arrSkills, skill] });
            console.log('Skill added:', res.data);

            setArrSkills(prev => [...prev, skill]);
            setSkill('');
        } catch (err) {
            console.log('Failed to add skill:', err);
        }
    };

    if (!userProfile) {
        return <div className="profilePage"><p>טוען פרופיל...</p></div>;
    }

    return (
        <div className="profilePage">
            <div className="profile-dashboard">
                <div className="profile-header">
                    <img src={userProfile.profilePicture} alt="Profile" className="profile-picture" />
                    <div className="profile-info">
                        <h1>{userProfile.userName}</h1>
                        <div className="nickname">{userProfile.nickname}</div>
                        <div className="nickname">{userProfile.role === 'USER' ? 'משתמש.ת רגיל.ה' : userProfile.role === 'ADMIN' ? 'מנהל.ת' : null}</div>
                    </div>
                    <div className="profile-buttons">
                        <NavLink to={`/network/${userId}`}><button className="routes_button">הרשת שלי</button></NavLink>
                        <NavLink to="/"><button className="routes_button">לטבלה</button></NavLink>
                        <NavLink to="/"><button className="routes_button">הודעות</button></NavLink>
                    </div>
                </div>

                <div className="profile-body">
                    <div className="section" id='details_section'>
                        <h3>פרטים אישיים</h3>
                        <div className="detail-row"><strong>מין:</strong> {userProfile.gender}</div>
                        <div className="detail-row"><strong>אימייל:</strong> {userProfile.email}</div>
                        <div className="detail-row"><strong>כינוי:</strong> {userProfile.nickname || "אין"}</div>
                        <div className="detail-row"><strong>הצטרפות:</strong> {new Date(userProfile.enterDate).toLocaleDateString('he-IL')}</div>
                        <div className="detail-row"><strong>מספר עוקבים:</strong> {followingQTY}</div>
                    </div>

                    <div className="section" id='skills_section'>
                        <h3>תחומי עניין</h3>
                        <div className="tags">
                            {userId === loggedInUser.userId &&
                                <><input
                                    type='text'
                                    value={skill}
                                    placeholder='הוסף כישור או תחום עניין'
                                    onChange={(e) => setSkill(e.target.value)} />

                                    <button onClick={() => AddNewSkill(skill)}>הוסף</button></>
                            }

                            {arrSkills.map((tag, i) => (
                                tag && <span key={i} className="tag">{`# ${tag}`}</span>
                            ))}
                        </div>
                    </div>

                    <div className="section" id='posts_section'>
                        <h3>הפוסטים שלי</h3>
                    </div>

                    {userId === loggedInUser.userId &&
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
                    }
                </div>
            </div>
        </div>
    );
};
