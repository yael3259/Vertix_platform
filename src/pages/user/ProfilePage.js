import { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import "../../styles/user/ProfilePage.css";
import { updateUserSkills, getOneUser, getFollowing, AddFriendToNetwork } from '../../routes/UserAPI';
import { getUserAchievements, getUserBoosts } from '../../routes/AchievementAPI';
import { useUserContext } from '../../contexts/UserContext';
import { getFavoritePosts, getPostsById } from '../../routes/PostAPI';
import { EditOptionsMenu } from '../../components/EditOptionsMenu';
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
import firstLevel from "../../files/icons/firstLevel.png";
import secondLevel from "../../files/icons/secondLevel.png";
import thirdLevel from "../../files/icons/thirdLevel.png";
import fourthLevel from "../../files/icons/fourthLevel.png";
import { MoreHorizontal } from "lucide-react";
import { EditPost } from '../post/EditPost';



export const ProfilePage = () => {
    const [skill, setSkill] = useState('');
    const [arrTags, setArrTags] = useState([]);
    const [arrSkills, setArrSkills] = useState([]);
    const [arrAchievements, setArrAchievements] = useState([]);
    const [arrBoosts, setArrBoosts] = useState([]);
    const [arrPosts, setArrPosts] = useState([]);
    const [arrFavorites, setArrFavorites] = useState([]);
    const [followingQTY, setFollowingQTY] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorAlert, setErrorAlert] = useState(null);
    const [bonusIcon, setBonusIcon] = useState('');
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const { user: loggedInUser, notificationsCount } = useUserContext();
    const [showBoostAlert, setShowBoostAlert] = useState(false);
    const [followedUserName, setFollowedUserName] = useState(false);
    const [showFollowAlert, setShowFollowAlert] = useState(false);
    const [activePostOptions, setActivePostOptions] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
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
                const [
                    userRes,
                    followingRes,
                    postsRes,
                    favoritesRes,
                    achievementsRes,
                    boostsRes
                ] = await Promise.all([
                    getOneUser(userId),
                    getFollowing(userId),
                    getPostsById(userId),
                    getFavoritePosts(userId),
                    getUserAchievements(userId),
                    getUserBoosts(userId),
                ]);

                setUserProfile(userRes.data);
                setArrSkills(userRes.data.skills || []);
                setArrTags(userRes.data.tags || []);
                setFollowingQTY(followingRes.data.count);
                setArrPosts(postsRes.data);
                setArrFavorites(favoritesRes.data);
                setArrAchievements(achievementsRes.data);
                setArrBoosts(boostsRes.data);

            } catch (err) {
                console.error("error fetching user data", err);
                setErrorAlert(err.response?.data?.message || "שגיאה");
            } finally {
                setIsLoading(false);
            }
        }
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    useEffect(() => {
        if (!userProfile) return;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.endsWith("_fireEmoji")) {
                const userId = key.slice(0, -10);

                if (userId === userProfile._id) {
                    const date = new Date();
                    const today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                    let parsed;

                    try {
                        parsed = JSON.parse(localStorage.getItem(key));
                    } catch {
                        continue;
                    }

                    if (today === parsed.day) {
                        setBonusIcon(parsed.emoji);
                    } else {
                        localStorage.removeItem(key);
                    }
                    break;
                }
            }
        }
    }, [userProfile]);

    useEffect(() => {
        if (errorAlert) {
            const timer = setTimeout(() => setErrorAlert(null), 5500);
            return () => clearTimeout(timer);
        }
    }, [errorAlert]);

    const refreshPosts = async () => {
        const postsRes = await getPostsById(userId);
        setArrPosts(postsRes.data);

        const favoritesRes = await getFavoritePosts(userId);
        setArrFavorites(favoritesRes.data);
    };

    const levels = [
        { max: 70, label: 'מתחיל.ה', images: [firstLevel] },
        { max: 200, label: 'מתקדמ.ת', images: [firstLevel, secondLevel] },
        { max: 450, label: 'אלופ.ה', images: [firstLevel, secondLevel, thirdLevel] },
        { max: Infinity, label: 'אגדה', images: [firstLevel, secondLevel, thirdLevel, fourthLevel] },
    ];

    const getLevelUser = (points) => {
        const level = levels.find(l => points <= l.max);

        return (
            <div className="levelDisplay">
                <div className="levelText">
                    <p>סטטוס</p>
                </div>
                <div className="levelIcons">
                    <h4>{level.label}</h4>
                    {level.images.map((img, i) => (
                        <img key={i} src={img} alt={level.label} className="levelIcon" />
                    ))}
                </div>
            </div>
        );
    };

    const toggleEditOptions = (postId) => {
        setActivePostOptions(prev => (prev === postId ? null : postId));
    };

    const closeEditOptions = () => {
        setActivePostOptions(null);
    };

    const openPostEditor = (postId) => {
        setEditingPostId(postId);
    };

    const closePostEditor = () => {
        setEditingPostId(null);
    };

    const refreshAfterDelete = (deletedId) => {
        setArrPosts(prev => prev.filter(p => p._id !== deletedId))
        setArrFavorites(prev => prev.filter(p => p._id !== deletedId))
    }

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
            await AddFriendToNetwork(userId, idOfFriend, token);
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

    if (isLoading) {
        return <div className='loading-spinner' />
    }

    if (!userProfile) {
        return <div className="profilePage" id='noUserLogged'>
            <img src={guestMode} className="no-user-icon" alt="אורח" />
            <strong>משתמש לא מחובר</strong>
            <p>התחבר או הרשם <NavLink to="/login" id='linkToLogin'>כאן</NavLink> כדי לצפות בפרופיל</p>
        </div>
    }

    return (
        <div className="profilePage" >
            {(showBoostAlert && loggedInUserId || showFollowAlert && loggedInUserId) && (
                <div className="overlay-background" onClick={() => { setShowBoostAlert(false) }}></div>
            )}

            {loggedInUserId && showBoostAlert && <BoostInvite onClose={handleCloseBoostInvite} />}
            {showFollowAlert && <FollowAlert onClose={handleCloseFollowAlert} followedUserName={userProfile?.userName} />}
            {errorAlert && <DynamicErrorAlert errorText={errorAlert} />}
            {editingPostId && <EditPost postId={editingPostId} onClose={closePostEditor} onPostEdited={refreshPosts} />}

            <div className="profile-dashboard">
                <div className="profile-header">
                    <div className='profilePicAndIcon'>
                        <img src={userProfile.profilePicture || avatar_profile} className="profile-picture" alt="תמונת פרופיל" />
                        {bonusIcon && <span className="bonusIcon">{bonusIcon}</span>}
                    </div>
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
                                <li><strong>כינוי</strong> {userProfile.nickname || "לא הוגדר"}</li>
                                <li><strong>מין</strong> {userProfile.gender}</li>
                                <li><strong>אימייל</strong> {userProfile.email}</li>
                                <li><strong>הצטרפות</strong> {new Date(userProfile.enterDate).toLocaleDateString('he-IL')}</li>
                                <li><strong>חברים</strong> {followingQTY}</li>
                                <li><div className="points_gem">
                                    <img src={gem} className="gemIconInProfile" alt="יהלום" />
                                    <strong>נקודות</strong></div>
                                    <strong>{userProfile.points}</strong></li>
                            </ul>
                        </div>

                        <div className="detailsAndNetwork">
                            {loggedInUserId ? (
                                <button className='dailyWheel-button' onClick={() => navigate("/profile/wheel")}>
                                    סיבוב בגלגל המזל
                                </button>
                            ) : (
                                <button className='addUserToNetwork' onClick={() => addFriend(userProfile._id)}>
                                    התחבר/י ל{userProfile.nickname ? userProfile.nickname : userProfile.userName}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="routes-buttons_mobile-display">
                        {loggedInUserId ? (
                            <button className='routes_button_in_mobile' id='dailyWheel-button' onClick={() => navigate("/profile/wheel")}>
                                סיבוב בגלגל המזל
                            </button>
                        ) : (
                            <button className='routes_button_in_mobile' onClick={() => addFriend(userProfile._id)}>
                                התחבר/י ל{userProfile.nickname ? userProfile.nickname : userProfile.userName}
                            </button>
                        )}

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

                    <div className='gemsReached'>
                        <div className="tooltip-wrapper">
                            {getLevelUser(userProfile.points)}
                            <div className="tooltip">
                                <div className="badge-item">
                                    <img src={firstLevel} alt="אבן בסיסית" />
                                    <span><strong>ספיר&nbsp;</strong> 0+ נקודות</span>
                                </div>
                                <div className="badge-item">
                                    <img src={secondLevel} alt="אבן מתקדמת" />
                                    <span><strong>רובי&nbsp;</strong> 70+ נקודות</span>
                                </div>
                                <div className="badge-item">
                                    <img src={thirdLevel} alt="אבן אלופה" />
                                    <span><strong>אמרלד&nbsp;</strong> 200+ נקודות</span>
                                </div>
                                <div className="badge-item">
                                    <img src={fourthLevel} alt="אבן אגדה" />
                                    <span><strong>טופז&nbsp;</strong> 450+ נקודות</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section" id='tags_section'>
                        <h3 className='titleTags'><FaTag className='iconForTitleInProfile' />שיאים</h3>
                        <div className='tagsContainer'>
                            <div className='goldTag' id='userTag'>
                                <p>{getTagValue("gold")} פעמים <br />במקום הראשון</p><img src={goldMedal} id='medalInProfile' alt="מדליית זהב" />
                            </div>
                            <div className='silverTag' id='userTag'>
                                <p>{getTagValue("silver")} פעמים <br />במקום השני</p><img src={silverMedal} id='medalInProfile' alt="מדליית כסף" />
                            </div>
                            <div className='bronzeTag' id='userTag'>
                                <p>{getTagValue("bronze")} פעמים <br />במקום השלישי</p><img src={bronzeMedal} id='medalInProfile' alt="מדליית ארד" />
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
                                        alt="חץ ימין"
                                        className="scroll-button"
                                        onClick={() => scrollPosts('postsContainer', 'left')}
                                    />
                                )}

                                <div className="horizontal-posts-container" id="postsContainer">
                                    {arrPosts.slice().reverse().map((post, i) => (
                                        <div key={i} className="horizontal-post-card">
                                            <div className='postOptionsAndDate'>
                                                {post.userId === loggedInUser.userId && (
                                                    <>
                                                        <button className="moreOptionsIconBtn" onClick={() => toggleEditOptions(post._id)}>
                                                            <MoreHorizontal className='moreOptionsIcon' />
                                                        </button>
                                                        {activePostOptions === post._id && (
                                                            <EditOptionsMenu
                                                                onEdit={post._id}
                                                                openPostEditor={() => {
                                                                    openPostEditor(post._id);
                                                                    closeEditOptions();
                                                                }}
                                                                onDelete={post._id}
                                                                onPostDeleted={() => refreshAfterDelete(post._id)}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                                <p className="postingDate">
                                                    {new Date(post.postingDate).toLocaleDateString('he-IL')}
                                                </p>
                                            </div>

                                            <div className='linkToSinglePost' onClick={() => navigate(`/profile/single_post/${post._id}`)}>
                                                <p className="post-text">
                                                    {post.content.length > 100 ? post.content.slice(0, 56) + '...' : post.content}
                                                </p>
                                                <div className="fileOfPost">
                                                    {post.imagePost && post.imagePost.trim() !== "" && (
                                                        post.imagePost.endsWith('.mp4') ? (
                                                            <video className="post-image" alt="וידאו-פוסט" src={post.imagePost} controls />
                                                        ) : (
                                                            <img src={post.imagePost} alt="תמונת פוסט" className="post-image_inProfile" />
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="likesAndComments">
                                                <div className="iconWithNumber">
                                                    <img src={comment_profile} alt="תגובות" />
                                                    <span>{post.comments.length}</span>
                                                </div>
                                                <div className="iconWithNumber">
                                                    <img src={like_profile} alt="לייקים" />
                                                    <span>{post.likes?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {arrPosts.length > 3 && (
                                    <img
                                        src={arrowLeft}
                                        alt="חץ שמאל"
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
                                        alt="חץ ימין"
                                        className="scroll-button"
                                        onClick={() => scrollPosts('favoritePostsContainer', 'left')}
                                    />
                                )}

                                <div className="horizontal-posts-container" id="favoritePostsContainer">
                                    {arrFavorites.slice().reverse().map((post, _) => (
                                        <div key={post._id} className="horizontal-post-card">
                                            <div className='topFavoritePost'>
                                                {post.userId?._id === loggedInUser.userId ? (
                                                    <div className='postOptionsAndDate' id='optionsAndDate'>
                                                        <button className="moreOptionsIconBtn" onClick={() => toggleEditOptions(post._id)}>
                                                            <MoreHorizontal className='moreOptionsIcon' />
                                                        </button>
                                                        {activePostOptions === post._id && (
                                                            <EditOptionsMenu
                                                                onEdit={post._id}
                                                                openPostEditor={() => {
                                                                    openPostEditor(post._id);
                                                                    closeEditOptions();
                                                                }}
                                                                onDelete={post._id}
                                                                onPostDeleted={() => refreshAfterDelete(post._id)}
                                                            />
                                                        )}

                                                        <p className="postingDate">
                                                            {new Date(post.postingDate).toLocaleDateString('he-IL')}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className='urlAndName_favorite'>
                                                            {post.userId?.profilePicture ? (
                                                                <img src={post.userId?.profilePicture} className="profilePicture_favorites" alt="תמונת פרופיל" />
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
                                                    </>
                                                )}
                                            </div>

                                            <div className='linkToSinglePost' onClick={() => navigate(`/profile/single_post/${post._id}`)}>
                                                <p className="post-text">
                                                    {post.content.length > 100
                                                        ? post.content.slice(0, 56) + '...'
                                                        : post.content}
                                                </p>
                                                <div className="fileOfPost">
                                                    {post.imagePost && post.imagePost.trim() !== "" && (
                                                        post.imagePost.endsWith('.mp4') ? (
                                                            <video className="post-image" alt="וידאו-פוסט" src={post.imagePost} controls />
                                                        ) : (
                                                            <img
                                                                src={post.imagePost}
                                                                alt="תמונת פוסט"
                                                                className="post-image_inProfile"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="likesAndComments">
                                                <div className="iconWithNumber">
                                                    <img src={comment_profile} alt="תגובות" />
                                                    <span>{post.comments.length}</span>
                                                </div>
                                                <div className="iconWithNumber">
                                                    <img src={like_profile} alt="לייקים" />
                                                    <span>{post.likes?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {arrFavorites.length > 3 && (
                                    <img
                                        src={arrowLeft}
                                        alt="חץ שמאל"
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
                                <img src={post} className="icon" alt="אייקון פוסט" />
                                <h3>הוספת פוסט</h3>
                                <NavLink to="/addPost" className="save-btn">להוספה</NavLink>
                            </div>

                            <div className="card-section">
                                <img src={achievement} className="icon" alt="אייקון הישג" />
                                <h3 id='linkToAchievement'>הוספת הישג</h3>
                                <NavLink to="/profile/addAchievement" className="save-btn">להוספה</NavLink>
                            </div>

                            <div className="card-section" id="Achievement-section">
                                <div className="rightSideAchievement">
                                    <img src={daily_update} className="icon" id='achievementIcon' alt="עדכון יומי בטבלה" />
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
                                                    <img src={getStatusIcon(item.statusTable)} className="status-icon" alt="סטטוס טבלה" />
                                                )}
                                            </NavLink>
                                        ))
                                    ) : (
                                        <div className='achievements_con'>
                                            <p className="no-achievements_txt">אין לך עדיין הישגים</p>
                                            <img src={no_achievements} className='no_achievements_icon' alt="אין הישגים" />
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