import { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import "../../styles/user/ProfilePage.css";
import { updateUserDetails, getOneUser, getFollowing } from '../../routes/UserAPI';
import { getUserAchievements } from '../../routes/AchievementAPI';
import { useUserContext } from '../../contexts/UserContext';
import { getFavoritePosts, getPostsById } from '../../routes/PostAPI';
import post from "../../files/icons/post.png";
import daily_update from "../../files/icons/daily_update.png";
import achievement from "../../files/icons/achievement.png";
import arrowLeft from "../../files/icons/arrowLeft.png";
import arrowRight from "../../files/icons/arrowRight.png";
import like_profile from "../../files/icons/like_profile.png";
import comment_profile from "../../files/icons/comment_profile.png";
import statusCompleted from "../../files/icons/completed.png";
import statusFailed from "../../files/icons/failed.png";
import statusInProgress from "../../files/icons/inprogress.png";



export const ProfilePage = () => {
    const [skill, setSkill] = useState('');
    const [arrSkills, setArrSkills] = useState([]);
    const [arrAchievements, setArrAchievements] = useState([]);
    const [arrPosts, setArrPosts] = useState([]);
    const [arrFavorites, setArrFavorites] = useState([]);
    const [followingQTY, setFollowingQTY] = useState(0);
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const { user: loggedInUser } = useUserContext();
    let notifLength = loggedInUser.lengthNotificationsUser;
    const navigate = useNavigate();


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
                const postsRes = await getPostsById(userId);
                setArrPosts(postsRes.data);

            } catch (err) {
                console.error("fail to fetch posts", err);
            }

            try {
                const favoratesRes = await getFavoritePosts(userId);
                console.log("favoratesRes: ", favoratesRes.data);
                setArrFavorites(favoratesRes.data);
            } catch (err) {
                console.error("fail to fetch posts", err);
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

    const scrollPosts = (containerId, direction) => {
        const container = document.getElementById(containerId);
        const scrollAmount = 300;

        if (container) {
            if (direction === 'left') {
                container.scrollLeft += scrollAmount;
            } else {
                container.scrollLeft -= scrollAmount;
            }
        }
    };

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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return statusCompleted;
            case 'failed':
                return statusFailed;
            case 'in-progress':
                return statusInProgress;
            default:
                return null;
        }
    }

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

                        <NavLink to="/notifications">
                            <button className="routes_button notif_button_wrapper">
                                התראות
                                {userId === loggedInUser.userId && notifLength > 0 && (
                                    <span className="notifLength">{notifLength}</span>)}
                            </button></NavLink>

                        <NavLink to="/"><button className="routes_button">הודעות</button></NavLink>
                    </div>
                </div>

                <div className="profile-body">
                    <div className='detailsAndChat'>
                        <div className="section" id='details_section'>
                            <h3>פרטים אישיים</h3>
                            <div className="detail-row"><strong>מין:</strong> {userProfile.gender}</div>
                            <div className="detail-row"><strong>אימייל:</strong> {userProfile.email}</div>
                            <div className="detail-row"><strong>כינוי:</strong> {userProfile.nickname || "אין"}</div>
                            <div className="detail-row"><strong>הצטרפות:</strong> {new Date(userProfile.enterDate).toLocaleDateString('he-IL')}</div>
                            <div className="detail-row"><strong>מספר עוקבים:</strong> {followingQTY}</div>
                        </div>

                        <button className='startChat'>צ'אט עם {userProfile.nickname}</button>
                    </div>

                    <div className="section" id='skills_section'>
                        <h3>תחומי עניין</h3>
                        {userId === loggedInUser.userId && (
                            <div className='tags_input'>
                                <input
                                    type='text'
                                    value={skill}
                                    placeholder='הוסף כישור או תחום עניין'
                                    onChange={(e) => setSkill(e.target.value)} />
                                <button className='tags_btn' onClick={() => AddNewSkill(skill)}>הוסף</button>
                            </div>
                        )}

                        {arrSkills.length > 0 ? (
                            <div className="tags">
                                {arrSkills.map((tag, i) => (
                                    tag && <span key={i} className="tag">{`# ${tag}`}</span>
                                ))}
                            </div>
                        ) : (
                            <p className="no-posts-message">
                                {userId === loggedInUser.userId
                                    ? "עדיין לא הוספת כישורים"
                                    : `${userProfile.userName} עדיין לא הוסיף/ה כישורים`}
                            </p>
                        )}
                    </div>

                    <div className="section" id='posts_section'>
                        <h3>הפוסטים שלי</h3>
                        {arrPosts.length > 0 ? (
                            <div className="horizontal-posts-section">
                                {arrPosts.length > 3 && (
                                    <img
                                        src={arrowRight}
                                        className="scroll-button"
                                        onClick={() => scrollPosts('postsContainer', 'left')}
                                    />
                                )}

                                <div className="horizontal-posts-container" id="postsContainer">
                                    {arrPosts.slice().reverse().map((post, i) => (
                                        <div
                                            key={i}
                                            className="horizontal-post-card"
                                            onClick={() => navigate(`/single_post/${post._id}`)}
                                        >
                                            <p className="postingDate">
                                                {new Date(post.postingDate).toLocaleDateString('he-IL')}
                                            </p>
                                            <p className="post-text">
                                                {post.content.length > 100
                                                    ? post.content.slice(0, 56) + '...'
                                                    : post.content}
                                            </p>
                                            <div className="fileOfPost">
                                                {post.imagePost && post.imagePost.trim() !== "" && (
                                                    post.imagePost.endsWith('.mp4') ? (
                                                        <video className="post-image" src={post.imagePost} controls />
                                                    ) : (
                                                        <img
                                                            src={post.imagePost}
                                                            alt="post"
                                                            className="post-image_inProfile"
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <div className="likesAndComments">
                                                <div className="iconWithNumber">
                                                    <img src={comment_profile} alt="comments" />
                                                    <span>{post.comments.length}</span>
                                                </div>
                                                <div className="iconWithNumber">
                                                    <img src={like_profile} alt="likes" />
                                                    <span>{post.likes}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {arrPosts.length > 3 && (
                                    <img
                                        src={arrowLeft}
                                        className="scroll-button"
                                        onClick={() => scrollPosts('postsContainer', 'right')}
                                    />
                                )}
                            </div>
                        ) : (
                            <p className="no-posts-message">
                                {userId === loggedInUser.userId
                                    ? "עדיין לא פרסמת פוסטים"
                                    : `${userProfile.userName} עדיין לא פרסם/ה פוסטים`}
                            </p>
                        )}
                    </div>

                    <div className="section" id='favoritePosts_section'>
                        <h3>פוסטים מועדפים</h3>
                        {arrFavorites.length > 0 ? (
                            <div className="horizontal-posts-section">
                                {arrFavorites.length > 3 && (
                                    <img
                                        src={arrowRight}
                                        className="scroll-button"
                                        onClick={() => scrollPosts('favoritePostsContainer', 'left')}
                                    />
                                )}

                                <div className="horizontal-posts-container" id="favoritePostsContainer">
                                    {arrFavorites.slice().reverse().map((post, i) => (
                                        <div
                                            key={i}
                                            className="horizontal-post-card"
                                            onClick={() => navigate(`/single_post/${post._id}`)}
                                        >
                                            <div className='topFavoritePost'>
                                                <div className='urlAndName_favorite'>
                                                    <img src={post.userId?.profilePicture || "https://cdn-icons-png.freepik.com/256/12522/12522481.png?ga=GA1.1.1754982332.1740749915&semt=ais_hybrid"}
                                                        className='profilePicture_favorites' />
                                                    <p className='username_favorates'>{post.userId?.userName}</p>
                                                </div>
                                                <p className="postingDate">
                                                    {new Date(post.postingDate).toLocaleDateString('he-IL')}
                                                </p>
                                            </div>

                                            <p className="post-text">
                                                {post.content.length > 100
                                                    ? post.content.slice(0, 56) + '...'
                                                    : post.content}
                                            </p>
                                            <div className="fileOfPost">
                                                {post.imagePost && post.imagePost.trim() !== "" && (
                                                    post.imagePost.endsWith('.mp4') ? (
                                                        <video className="post-image" src={post.imagePost} controls />
                                                    ) : (
                                                        <img
                                                            src={post.imagePost}
                                                            alt="post"
                                                            className="post-image_inProfile"
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <div className="likesAndComments">
                                                <div className="iconWithNumber">
                                                    <img src={comment_profile} alt="comments" />
                                                    <span>{post.comments.length}</span>
                                                </div>
                                                <div className="iconWithNumber">
                                                    <img src={like_profile} alt="likes" />
                                                    <span>{post.likes}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {arrFavorites.length > 3 && (
                                    <img
                                        src={arrowLeft}
                                        className="scroll-button"
                                        onClick={() => scrollPosts('favoritePostsContainer', 'right')}
                                    />
                                )}
                            </div>
                        ) : (
                            <p className="no-posts-message">
                                {userId === loggedInUser.userId
                                    ? "עדיין לא סימנת פוסטים מועדפים"
                                    : `${userProfile.userName} עדיין לא סימן/ה פוסטים מועדפים`}
                            </p>
                        )}
                    </div>

                    {userId === loggedInUser.userId &&
                        <div className="buttom_section">
                            <div className="card-section">
                                <img src={post} className="icon" />
                                <h3>הוספת פוסט</h3>
                                <NavLink to="/addPost" className="save-btn">להוספה</NavLink>
                            </div>

                            <div className="card-section">
                                <img src={achievement} className="icon" />
                                <h3 id='linkToAchievement'>הוספת הישג</h3>
                                <NavLink to="/addAchievement" className="save-btn">להוספה</NavLink>
                            </div>

                            <div className="card-section" id="Achievement-section">
                                <div className="rightSideAchievement">
                                    <img src={daily_update} className="icon" id='achievementIcon' />
                                    <h3 id='achievement_h3'>עדכון יומי</h3>
                                    <p className='small_title'>הישגים וטבלאות מעקב</p>
                                </div>

                                <div className="leftSideAchievement">
                                    {arrAchievements.length > 0 ? (
                                        arrAchievements.map((achievement, i) => (
                                            <NavLink
                                                to={`/table/${achievement._id}`}
                                                key={i}
                                                className={`achievement-item ${achievement.statusTable === 'completed' ? 'completed-achievementTable' : ''}`}
                                            >
                                                # {achievement.title}
                                                {getStatusIcon(achievement.statusTable) && (
                                                    <img src={getStatusIcon(achievement.statusTable)} className="status-icon" />
                                                )}
                                            </NavLink>
                                        ))
                                    ).reverse() : (
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