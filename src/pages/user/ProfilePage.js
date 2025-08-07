import { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import "../../styles/user/ProfilePage.css";
import { updateUserSkills, getOneUser, getFollowing, AddFriendToNetwork } from '../../routes/UserAPI';
import { getUserAchievements, getUserBoosts } from '../../routes/AchievementAPI';
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
import no_achievements from "../../files/icons/no_achievements.png";
import gem from "../../files/icons/gem.png";
import avatar_profile from "../../files/icons/avatar-profile.png"
import { FaIdBadge, FaTag, FaRegFileAlt, FaStar } from "react-icons/fa";
import { BoostInvite } from '../../components/BoostInvite';
import goldMedal from "../../files/icons/gold-medal.png";
import silverMedal from "../../files/icons/silver-medal.png";
import bronzeMedal from "../../files/icons/bronze-medal.png";
import guestMode from "../../files/icons/guestMode.png"
import { FollowAlert } from '../../components/FollowAlert';
import { DynamicErrorAlert } from '../../components/DynamicErrorAlert';



export const ProfilePage = () => {
    const [skill, setSkill] = useState('');
    const [arrTags, setArrTags] = useState([]);
    const [arrSkills, setArrSkills] = useState([]);
    const [arrAchievements, setArrAchievements] = useState([]);
    const [arrBoosts, setArrBoosts] = useState([]);
    const [arrPosts, setArrPosts] = useState([]);
    const [arrFavorites, setArrFavorites] = useState([]);
    const [followingQTY, setFollowingQTY] = useState(0);
    const [errorAlert, setErrorAlert] = useState(null);
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const { user: loggedInUser, notificationsCount } = useUserContext();
    const [showBoostAlert, setShowBoostAlert] = useState(false);
    const [followedUserName, setFollowedUserName] = useState(false);
    const [showFollowAlert, setShowFollowAlert] = useState(false);
    const loggedInUserId = userId === loggedInUser.userId;
    const navigate = useNavigate();
    let token = loggedInUser.tokenUser;


    useEffect(() => {
        // הצגת הזמנה להצטרפות לבוסט בכל יום ראשון
        const today = new Date().getDay();
        if (today === 0) {
            setShowBoostAlert(true);
        } else {
            setShowBoostAlert(false);
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await getOneUser(userId);
                setUserProfile(res.data);
                setArrSkills(res.data.skills || []);
                setArrTags(res.data.tags || []);
            } catch (err) {
                console.error("Error loading user", err);
                return;
            }

            try {
                const followingRes = await getFollowing(userId);
                setFollowingQTY(followingRes.data.count);
            } catch (err) {
                console.error("error loading followings", err);
            }

            try {
                const postsRes = await getPostsById(userId);
                setArrPosts(postsRes.data);

            } catch (err) {
                console.error("fail to fetch posts", err);
            }

            try {
                const favoratesRes = await getFavoritePosts(userId);
                setArrFavorites(favoratesRes.data);
            } catch (err) {
                console.error("fail to fetch posts", err);
            }

            try {
                const achievementsRes = await getUserAchievements(userId);
                setArrAchievements(achievementsRes.data);
            } catch (err) {
                console.error("Error loading achievements", err);
            }

            try {
                const boostsRes = await getUserBoosts(userId);
                setArrBoosts(boostsRes.data);
            } catch (err) {
                console.error("Error loading boosts", err);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const allAchievements = [
        ...arrAchievements.map((a) => ({ ...a, type: "achievement" })),
        ...arrBoosts.map((b) => ({ ...b, type: "boost" }))
    ].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    const handleCloseBoostInvite = () => {
        setShowBoostAlert(false);
    };

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

    const getTagValue = (tagName) => {
        const tag = arrTags.find(t => t.name === tagName);
        return tag ? tag.value : 0;
    };

    const AddNewSkill = async (skill) => {
        const newSkill = skill.trim();
        if (!newSkill || arrSkills.includes(newSkill)) return;

        try {
            await updateUserSkills(loggedInUser.userId, { skills: [newSkill] });
            setArrSkills(prev => [...prev, newSkill]);
            setSkill('');
        } catch (err) {
            console.error('Failed to add skill:', err);
            setErrorAlert(err.response.data.message || "שגיאה");
        }
    };

    const addFriend = async (idOfFriend) => {
        const userId = loggedInUser.userId;

        try {
            const res = await AddFriendToNetwork(userId, idOfFriend, token);
            setFollowedUserName(followedUserName);
            setShowFollowAlert(true);
        }
        catch (err) {
            console.error("failed to add user to network", err);
            setErrorAlert(err.response.data.message || "שגיאה");
        }
    }

    const handleCloseFollowAlert = () => {
        setShowFollowAlert(false);
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
        return <div className="profilePage" id='noUserLogged'>
            <img src={guestMode} className="no-user-icon" />
            <strong>משתמש לא מחובר</strong>
            <p>התחבר או הרשם <NavLink to="/login" id='linkToLogin'>כאן</NavLink> כדי לצפות בפרופיל</p>
        </div>
    }

    return (
        <div className="profilePage">
            {(showBoostAlert && loggedInUserId || showFollowAlert && loggedInUserId) && (
                <div className="overlay-background" onClick={() => {
                    setShowBoostAlert(false);
                }}></div>
            )}
            {loggedInUserId && showBoostAlert && <BoostInvite onClose={handleCloseBoostInvite} />}
            {showFollowAlert && <FollowAlert onClose={handleCloseFollowAlert} followedUserName={userProfile?.userName} />}
            {errorAlert && <DynamicErrorAlert errorText={errorAlert} />}

            <div className="profile-dashboard">
                <div className="profile-header">
                    {userProfile.profilePicture ? (
                        <img src={userProfile.profilePicture || avatar_profile} className="profile-picture" />) :
                        (<div className="avatar-fallback_InProfile">
                            {(userProfile.userName || 'אורח').charAt(0).toUpperCase()}
                        </div>)}
                    <div className="profile-info">
                        <h1>{userProfile.userName}</h1>
                        <div className="nickname">{userProfile.nickname}</div>
                        <div className="role_inProfile">{userProfile.role === 'USER' ? 'משתמש.ת רגיל.ה' : userProfile.role === 'ADMIN' ? 'מנהל.ת' : null}</div>
                    </div>
                    <div className="profile-buttons">
                        <NavLink to={`/profile/network/${userId}`}><button className="routes_button">{loggedInUserId ? "הרשת שלי" : "חברים"}</button></NavLink>

                        {loggedInUserId && <NavLink to="/notifications">
                            <button className="routes_button notif_button_wrapper">
                                התראות
                                {loggedInUserId && notificationsCount > 0 && (
                                    <span className="notifLength">{notificationsCount}</span>)}
                            </button></NavLink>}

                        {loggedInUserId && <NavLink to="/profile/edit">
                            <button className="routes_button">עריכה</button></NavLink>}
                    </div>
                </div>

                <div className="profile-body">
                    <div className="detailsAndNetwork" id='details_section'>
                        <div className="userInfoInProfile" >
                            <h3><FaIdBadge className='iconForTitleInProfile' />פרטים אישיים</h3>
                            <ul>
                                <li><strong>כינוי</strong> {userProfile.nickname || "אין"}</li>
                                <li><strong>מין</strong> {userProfile.gender}</li>
                                <li><strong>אימייל</strong> {userProfile.email}</li>
                                <li><strong>הצטרפות</strong> {new Date(userProfile.enterDate).toLocaleDateString('he-IL')}</li>
                                <li><strong>עוקבים</strong> {followingQTY}</li>
                                <li><div className="points_gem"><img src={gem} className="gemIconInProfile" /><strong>נקודות</strong></div><strong>{userProfile.points}</strong></li>
                            </ul>
                        </div>

                        {userId !== loggedInUser.userId && <button className='addUserToNetwork' onClick={() => addFriend(userProfile._id)}>התחבר/י ל{userProfile.nickname ? userProfile.nickname : userProfile.userName}</button>}
                    </div>

                    <div className="routes-buttons_mobile-display">
                        {userId !== loggedInUser.userId && <button className='addUserToNetwork' id='Network_in_mobile' onClick={() => addFriend(userProfile._id)}>התחבר/י ל{userProfile.nickname ? userProfile.nickname : userProfile.userName}</button>}

                        <NavLink to={`/network/${userId}`}><button className="routes_button_in_mobile">{loggedInUserId ? "הרשת שלי" : "חברים"}</button></NavLink>

                        {loggedInUserId && <NavLink to="/notifications">
                            <button className="routes_button_in_mobile notif_button_wrapper">
                                התראות
                                {loggedInUserId && notificationsCount > 0 && (
                                    <span className="notifLength" id='notifLength_in-mobile'>{notificationsCount}</span>)}
                            </button></NavLink>}

                        {loggedInUserId && <NavLink to="/profile/edit">
                            <button className="routes_button_in_mobile">עריכה</button></NavLink>}
                    </div>

                    <div className="section" id='tags_section'>
                        <h3 className='titleTags'><FaTag className='iconForTitleInProfile' />שיאים</h3>
                        <div className='tagsContainer'>
                            <div className='goldTag' id='userTag'>
                                <p>{getTagValue("gold")} פעמים <br />במקום הראשון</p><img src={goldMedal} id='medalInProfile' />
                            </div>
                            <div className='silverTag' id='userTag'>
                                <p>{getTagValue("silver")} פעמים <br />במקום השני</p><img src={silverMedal} id='medalInProfile' />
                            </div>
                            <div className='bronzeTag' id='userTag'>
                                <p>{getTagValue("bronze")} פעמים <br />במקום השלישי</p><img src={bronzeMedal} id='medalInProfile' />
                            </div>
                        </div>
                    </div>

                    <div className="section" id='skills_section'>
                        <h3><FaTag className='iconForTitleInProfile' />תחומי עניין</h3>
                        {loggedInUserId && (
                            <div className='skills_input'>
                                <input
                                    type='text'
                                    value={skill}
                                    placeholder='הוספת כישור או תחום עניין'
                                    onChange={(e) => setSkill(e.target.value)} />
                                <button className='skills_btn' onClick={() => AddNewSkill(skill)}>אישור</button>
                            </div>
                        )}

                        {arrSkills.length > 0 ? (
                            <div className="skills">
                                {arrSkills.map((skill, i) => (
                                    skill && <span key={i} className="skill">{`# ${skill}`}</span>
                                ))}
                            </div>
                        ) : (
                            <p className="no-posts-message">
                                {loggedInUserId
                                    ? "עדיין לא הוספת כישורים"
                                    : `${userProfile.userName} עדיין לא הוסיף/ה כישורים`}
                            </p>
                        )}
                    </div>

                    <div className="section" id='posts_section'>
                        <h3><FaRegFileAlt className='iconForTitleInProfile' />הפוסטים שלי</h3>
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
                                            onClick={() => navigate(`/profile/single_post/${post._id}`)}
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
                                                    <span>{post.likes?.length || 0}</span>
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
                                {loggedInUserId
                                    ? "עדיין לא פרסמת פוסטים"
                                    : `${userProfile.userName} עדיין לא פרסם/ה פוסטים`}
                            </p>
                        )}
                    </div>

                    <div className="section" id='favoritePosts_section'>
                        <h3><FaStar className='iconForTitleInProfile' />פוסטים מועדפים</h3>
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
                                            onClick={() => navigate(`/profile/single_post/${post._id}`)}
                                        >
                                            <div className='topFavoritePost'>
                                                <div className='urlAndName_favorite'>
                                                    {post.userId?.profilePicture ? (
                                                        <img src={post.userId?.profilePicture} className="profilePicture_favorites" />
                                                    ) : (
                                                        <div className="avatar-fallback" id="avatar-fallback_postInFeed">
                                                            {(post.userId?.userName || 'אורח').charAt(0).toUpperCase()}
                                                        </div>
                                                    )}

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
                                                    <span>{post.likes?.length || 0}</span>
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
                                {loggedInUserId
                                    ? "עדיין לא סימנת פוסטים מועדפים"
                                    : `${userProfile.userName} עדיין לא סימן/ה פוסטים מועדפים`}
                            </p>
                        )}
                    </div>

                    {loggedInUserId &&
                        <div className="buttom_section">
                            <div className="card-section">
                                <img src={post} className="icon" />
                                <h3>הוספת פוסט</h3>
                                <NavLink to="/addPost" className="save-btn">להוספה</NavLink>
                            </div>

                            <div className="card-section">
                                <img src={achievement} className="icon" />
                                <h3 id='linkToAchievement'>הוספת הישג</h3>
                                <NavLink to="/profile/addAchievement" className="save-btn">להוספה</NavLink>
                            </div>

                            <div className="card-section" id="Achievement-section">
                                <div className="rightSideAchievement">
                                    <img src={daily_update} className="icon" id='achievementIcon' />
                                    <h3 id='achievement_h3'>עדכון יומי</h3>
                                    <p className='small_title'>הישגים וטבלאות מעקב</p>
                                </div>

                                <div className="leftSideAchievement">
                                    {allAchievements.length > 0 ? (
                                        allAchievements.map((item, i) => (
                                            <NavLink
                                                to={`/profile/table/${item._id}`}
                                                key={i}
                                                className={`achievement-item ${item.statusTable === 'completed' ? 'completed-achievementTable' : ''}`}
                                                id={item.type === "boost" ? 'boostStyle' : ''}
                                            >
                                                {item.type === "boost" && <div className="boost-badge">בוסט</div>}
                                                # {item.title}
                                                {getStatusIcon(item.statusTable) && (
                                                    <img src={getStatusIcon(item.statusTable)} className="status-icon" />
                                                )}
                                            </NavLink>
                                        ))
                                    ) : (
                                        <div className='achievements_con'>
                                            <p className="no-achievements_txt">אין לך עדיין הישגים</p>
                                            <img src={no_achievements} className='no_achievements_icon' />
                                        </div>
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