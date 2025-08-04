import { useState, useEffect } from "react";
import "../styles/Feed.css";
import { NavLink, useNavigate } from "react-router-dom";
import { getAllPosts, addComment, addToFavoritePosts, toggleLikePost } from "../routes/PostAPI";
import { getAllUsers, getOneUser } from "../routes/UserAPI";
import { AddFriendToNetwork, getRandomUsers } from "../routes/UserAPI";
import commentIcon from "../files/icons/commentIcon.png";
import starIcon from "../files/icons/starIcon.png";
import categoryIcon from "../files/icons/categoryIcon.png";
import empty_likeIcon from "../files/icons/empty_likeIcon.png";
import fill_likeIcon from "../files/icons/fill_likeIcon.png";
import filterIcon from "../files/icons/filterIcon.png";
import networkIcon from "../files/icons/networkIcon.png";
import { FaPaperPlane } from 'react-icons/fa';
import { useUserContext } from '../contexts/UserContext';
import { FaBell, FaUserFriends, FaEdit } from "react-icons/fa";
import { getMedal } from "./LeaderBoard";
import { FollowAlert } from "../components/FollowAlert";
import { FavoritePostAlert } from "../components/FavoritePostAlert";



export const Feed = () => {
    const [arr, setArr] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [randomUsers, setRandomUsers] = useState([]);
    const [arrSkills, setArrSkills] = useState([]);
    const [arrTopUsers, setArrTopUsers] = useState([]);
    const [comment, setComment] = useState('');
    const navigate = useNavigate();
    const { user, fetchNotifications, notificationsCount } = useUserContext();
    const [likedPosts, setLikedPosts] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('הכל');
    const [userNameFilter, setUserNameFilter] = useState('');
    const [followedUserName, setFollowedUserName] = useState('');
    const [showFollowAlert, setShowFollowAlert] = useState(false);
    const [showFavoritePostAlert, setShowFavoritePostAlert] = useState(false);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [showMobileAddFriend, setShowMobileAddFriend] = useState(false);
    let token = user.tokenUser;

    const categories = ['הכל', ...new Set(arr.map(post => post.category))];


    const filteredPosts = arr.filter(post => {
        const matchCategory = selectedCategory === 'הכל' || post.category === selectedCategory;
        const matchUser = !userNameFilter || post.userId?.userName.toLowerCase().includes(userNameFilter.toLowerCase());
        return matchCategory && matchUser;
    });

    useEffect(() => {
        loadPosts(page);
        fetchUserSkills();
        fetchTopThreeUsers();
        loadRandomUsers();
    }, [page]);


    const loadPosts = (currentPage = '') => {
        setLoading(true);

        getAllPosts(currentPage, 15)
            .then((res) => {
                console.log(res.data);
                const postsWithFlag = res.data.map(post => ({
                    ...post,
                    showComments: false,
                    likesCount: post.likes?.length || 0
                }));

                const sortedPosts = postsWithFlag.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));

                if (currentPage === 1) {
                    setArr(sortedPosts);
                    setIsLoading(false);
                } else {
                    setArr((prevArr) => {
                        const newPosts = sortedPosts.filter(post => !prevArr.some(existingPost => existingPost._id === post._id));
                        return [...prevArr, ...newPosts];
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 1500);
            });
    };

    const LoadMorePosts = () => {
        setPage(page + 1);
    };

    const timeAgo = (timestamp) => {
        const now = new Date();
        const postDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - postDate) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInSeconds / 3600);
        const diffInDays = Math.floor(diffInSeconds / 86400);

        if (diffInMinutes < 60) {
            return `${diffInMinutes} דקות`;
        } else if (diffInHours < 24) {
            return `${diffInHours} שעות`;
        } else if (diffInDays < 365) {
            return `${diffInDays} ימים`;
        } else {
            return `יותר משנה`;
        }
    };

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

    const toggleComments = (postId) => {
        setArr(prevArr =>
            prevArr.map(post =>
                post._id === postId ? { ...post, showComments: !post.showComments } : post
            )
        );
    };

    const addCommentToPost = async (postId, commentText) => {
        if (!commentText.trim())
            return;

        try {
            let res = await addComment(postId, commentText, user.userId);
            const newComment = res.data;

            setArr(prevArr =>
                prevArr.map(post => {
                    if (post._id === postId) {
                        return { ...post, comments: [...post.comments, newComment] };
                    }
                    return post;
                })
            );
            setComment('');
            await fetchNotifications();

        } catch (err) {
            console.log('error adding comment', err);
        }
    };

    const addPostToFavoritePosts = async (postId, userId) => {
        try {
            let res = await addToFavoritePosts(postId, userId);
            console.log("success", res.data);
            setShowFavoritePostAlert(true);
        }
        catch (err) {
            console.log("faild to add post to favorites", err);
        }
    }

    const toggleLike = async (postId) => {
        let userId = user.userId;

        try {
            const res = await toggleLikePost(userId, postId);
            console.log("succsses", res.data);

            setArr(prevArr =>
                prevArr.map(post =>
                    post._id === postId ? { ...post, likes: res.data.likes } : post
                )
            );

            setLikedPosts(prev => ({ ...prev, [postId]: res.data.liked }));
        } catch (err) {
            console.error("failed to like post", err);
        }
    };

    const fetchUserSkills = async () => {
        let userId = user.userId;
        try {
            const res = await getOneUser(userId);
            setArrSkills(res.data.skills || []);
            console.log("User's skills loaded:", res.data);
        } catch (err) {
            console.error("Error loading skills", err);
        }
    }

    const fetchTopThreeUsers = async () => {
        try {
            const res = await getAllUsers();
            const sortedByPoints = res.data.sort((a, b) => b.points - a.points).slice(0, 3);
            setArrTopUsers(sortedByPoints || []);
            console.log("top tree users:", sortedByPoints);
            isLoading(false);
        }
        catch (err) {
            console.error("Error loading top users", err);
        }
    }

    const loadRandomUsers = () => {
        getRandomUsers()
            .then((res) => {
                setRandomUsers(res.data);
            })
            .catch((err) => {
                console.log("Error loading random users:", err);
            });
    };

    const addFriend = async (idOfFriend, followedUserName) => {
        const userId = user.userId;
        try {
            const res = await AddFriendToNetwork(userId, idOfFriend, token);
            console.log("success", res);
            setFollowedUserName(followedUserName);
            setShowFollowAlert(true);
        }
        catch (err) {
            console.log("Cuold not add this user to network", err);
        }
    }

    const handleCloseFollowAlert = () => {
        setShowFollowAlert(false);
    };

    const handleCloseFavoritePostAlert = () => {
        setShowFavoritePostAlert(false);
    };

    const linkToAddPostForm = () => {
        navigate("/addPost");
    }

    return (
        <div className="feed_page">
            <div className="feed_layout">
                {(showMobileFilter || showMobileAddFriend || showFollowAlert) && (
                    <div className="overlay-background" onClick={() => {
                        setShowMobileFilter(false);
                        setShowMobileAddFriend(false);
                    }}></div>
                )}

                {showFollowAlert && <FollowAlert onClose={handleCloseFollowAlert} followedUserName={followedUserName} />}
                {showFavoritePostAlert && <FavoritePostAlert onClose={handleCloseFavoritePostAlert} />}

                <div className="left_side">
                    <div className={`left ${showMobileFilter ? 'show-mobile-filter' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <div className="filterIconInLable">
                            <p className="filterLabal">סינון פוסטים</p>
                            <img src={filterIcon} className="filterIconVisible" />
                        </div>
                        <div className="filters">
                            <p>לפי קטגוריות</p>
                            <select onChange={(e) => setSelectedCategory(e.target.value)} >
                                {categories.map((category, index) => (
                                    <option key={index} value={category} >{category}</option>
                                ))}
                            </select>
                            <p>לפי משתמש</p>
                            <input
                                type="text"
                                placeholder="הקלד/י שם משתמש"
                                onChange={(e) => setUserNameFilter(e.target.value)} />
                        </div>
                    </div>

                    <div className="miniProfile">
                        <div>
                            <div className="miniProfile_top">
                                {user?.profilePictureUser ?
                                    (<img src={user.profilePictureUser} className="avatar-fallback" id="miniProfile_avatar" />) :
                                    (<div className="avatar-fallback" id="mini_profile-avatar_fallback">{(user?.userName || 'אורח').charAt(0).toUpperCase()}</div>)}

                                <div className="miniProfile_user-Info">
                                    <div className="miniProfile_userName">{user.userName || "אורח"}</div>
                                    <div className="miniProfile_nickname">{user.nickname}</div>
                                    <div className="miniProfile_title">
                                        {!user.userId === "guest" ? 'משתמש.ת לא מחובר.ת' : "משתמש.ת מחובר.ת"}
                                    </div>
                                </div>
                            </div>

                            {arrSkills?.length > 0 && (
                                <div className="miniProfile_skillsRow">
                                    {arrSkills.slice(0, 3).map((skill, i) => (
                                        <span key={i} className="miniProfile_skill">#{skill}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="miniProfile_actions">
                            <div
                                className="miniProfile_actionIcon"
                                onClick={() => navigate('/profile/network/' + user.userId)} title="הרשת שלי"><FaUserFriends />
                            </div>

                            <div
                                className="miniProfile_actionIcon" id="notifAction"
                                onClick={() => navigate('/notifications')} title="התראות"><FaBell />
                                {notificationsCount > 0 && (<span className="miniProfile_notificationBadge">{notificationsCount}</span>)}
                            </div>

                            <div
                                className="miniProfile_actionIcon"
                                onClick={() => navigate('/profile/edit')} title="עריכת פרופיל"><FaEdit />
                            </div>
                        </div>
                    </div>

                    <NavLink to={"/board"} className="linkToBoard" title="מעבר ללוח המובילים">
                        <div className="top3Users_inProfile">
                            <p className="titleTop3">משתמשים מובילים</p>
                            {isLoading ?
                                <div className="top3_noDisplay"></div>
                                : arrTopUsers?.length > 0 && (
                                    <div className="miniProfile_usersRow">
                                        {arrTopUsers.map((user, i) => (
                                            <span key={i} className="topUser"><span>{getMedal(i)}</span>{user.userName.length > 7 ? user.userName.slice(0, 7) + "..." : user.userName}</span>
                                        ))}
                                    </div>
                                )}
                        </div>
                    </NavLink>
                </div>

                <div className="feed_part" >
                    <div className="addpost_feed" onClick={() => { linkToAddPostForm() }}>יצירת פוסט חדש</div>

                    <div className="mobile-network-filter">
                        <img src={networkIcon} className="networkIcon" onClick={() => setShowMobileAddFriend(!showMobileAddFriend)} title="הוספת חברים" />
                        <img src={filterIcon} className="filterIcon" onClick={() => setShowMobileFilter(!showMobileFilter)} title="סינון פוסטים" />
                    </div>

                    {isLoading ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="skeleton-post"></div>
                    ))
                        : filteredPosts.map((item) => (
                            <div className="grid-item" key={item._id} >
                                <div className="top_post">
                                    <div className="userName_txt" id="categoryPart">
                                        <img src={categoryIcon} className="categoryIcon" />
                                        <p className="category_txt">{item.category}</p>
                                    </div>
                                    <div className="userName_txt">
                                        <p id="userName_txt">{item.userId?.userName}</p>
                                        <div onClick={() => fetchToProfile(item.userId?._id)}>
                                            {item.userId?.profilePicture ? (
                                                <img src={item.userId.profilePicture} className="profile_Picture" />
                                            ) : (
                                                <div className="avatar-fallback" id="avatar-fallback_feed">
                                                    {(item.userId?.userName || 'אורח').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="postingDate_txt">לפני {timeAgo(item.postingDate)}</p>
                                <p className={`item-content ${!item.imagePost && item.content.length <= 100 ? "noImageInPost" : ""}`}
                                    style={{ backgroundColor: item.backgroundColor }}>
                                    {item.content}</p>
                                {item.imagePost && item.imagePost.trim() !== "" && (
                                    item.imagePost.endsWith('.mp4') ? (
                                        <video className="post-image" src={item.imagePost} autoPlay loop playsInline controls />
                                    ) : (
                                        <img src={item.imagePost} className="post-image" />
                                    )
                                )}

                                <div className="item-likes-comments">
                                    <p tabIndex="0" className="comments" onClick={() => toggleComments(item._id)}>
                                        <span>{item.comments.length} תגובות</span>
                                        <img src={commentIcon} alt="comment icon" className="comment-icon" />
                                    </p>
                                    <p className="favorite">
                                        <span>מועדף</span>
                                        <img src={starIcon} className="star-icon" onClick={() => addPostToFavoritePosts(item._id, user.userId)} />
                                    </p>
                                    <p className="likes">
                                        <span>{item.likes?.length || 0} לייקים</span>
                                        <img
                                            src={likedPosts[item._id] ? fill_likeIcon : empty_likeIcon}
                                            alt="like icon"
                                            className="like-icon"
                                            onClick={() => toggleLike(item._id)}
                                        />
                                    </p>
                                </div>

                                {item.showComments && (
                                    <>
                                        <div id="border-top"></div>
                                        <div className="addComment">
                                            <button className="send-comment-btn" onClick={() => addCommentToPost(item._id, comment)}><FaPaperPlane /></button>
                                            <input
                                                type="text"
                                                placeholder="הוספת תגובה..."
                                                value={comment}
                                                className="comment-input"
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                            <div onClick={() => fetchToProfile(user.userId)}>
                                                {user.profilePictureUser ? (
                                                    <img src={user.profilePictureUser} className="userUrlInCommentInput" />
                                                ) : (
                                                    <div className="avatar-fallback" id="avatar-fallback_inAddCommentInput">
                                                        {(user.userName || 'אורח').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {item.comments.map((comment) => (
                                            <div className="comment" key={comment._id}>
                                                <div className="comment-header">
                                                    <p className="comment-avatar" />
                                                    <div className="comment-details">
                                                        <span className="comment-date">לפני {(timeAgo(comment.commentDate))}</span>
                                                        <div className="userDeatails_comment">
                                                            <span className="comment-author">{comment.userId?.userName}</span>
                                                            <div onClick={() => fetchToProfile(comment.userId?._id)}>
                                                                {comment.userId?.profilePicture ? (
                                                                    <img src={comment.userId.profilePicture} className="userUrlInComment" />
                                                                ) : (
                                                                    <div className="avatar-fallback" id="avatar-fallback_inAddComment">
                                                                        {(comment.userId?.userName || '').charAt(0).toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="comment-text">{comment.text}</p>
                                            </div>
                                        )).reverse()}
                                    </>
                                )}
                            </div>
                        ))}

                    <div className="load-more">
                        <button onClick={LoadMorePosts} disabled={loading} className="load-button">
                            {loading ? <div className="spinner" /> : "טען עוד"}
                        </button>
                    </div>
                </div>
                <div className={`right ${showMobileAddFriend ? 'show-mobile-add-friend' : ''}`}>
                    <p className="right-title">הוספת חברים חדשים</p>
                    <div className="random-users">
                        {randomUsers.length > 0 ? (
                            randomUsers.map((user, index) => (
                                <div key={user.userId} className="random-user">
                                    <button className="add-friend-btn" onClick={() => addFriend(user._id, user.userName)}>+</button>
                                    <p className="name_to_connect">{user.userName}</p>

                                    <div onClick={() => fetchToProfile(user._id)}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://cdn-icons-png.freepik.com/256/12522/12522481.png";
                                        }}>
                                        {user.profilePicture ? (
                                            <img src={user.profilePicture} className="profile_Picture" />
                                        ) : (
                                            <div className="avatar-fallback" id="avatar-fallback_feed">
                                                {(user.userName || 'אורח').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="noRandomUsers">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="noRandomUser"></div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
