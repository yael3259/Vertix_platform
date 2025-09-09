import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, addComment, addToFavoritePosts, toggleLikePost } from '../../routes/PostAPI';
import { getOneUser } from '../../routes/UserAPI';
import { useUserContext } from '../../contexts/UserContext';
import { FavoritePostAlert } from '../../components/FavoritePostAlert';
import { DynamicErrorAlert } from '../../components/DynamicErrorAlert';
import commentIcon from "../../files/icons/commentIcon.png";
import display_loading from "../../files/icons/display_loading.png";
import starIcon from "../../files/icons/starIcon.png";
import categoryIcon from "../../files/icons/categoryIcon.png";
import empty_likeIcon from "../../files/icons/empty_likeIcon.png";
import fill_likeIcon from "../../files/icons/fill_likeIcon.png";
import { FaPaperPlane } from 'react-icons/fa';
import "../../styles/Feed.css";
import "../../styles/post/SinglePost.css";



export const SinglePost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user: loggedInUser } = useUserContext();
    const [errorAlert, setErrorAlert] = useState(null);
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [likedPosts, setLikedPosts] = useState({});
    const [showFavoritePostAlert, setShowFavoritePostAlert] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await getPostById(postId);
                setPost({ ...res.data, showComments: true });
            } catch (err) {
                console.error("failed to get post", err);
            }
        };
        fetchPost();
    }, [postId]);

    useEffect(() => {
        if (errorAlert) {
            const timer = setTimeout(() => setErrorAlert(null), 5500);
            return () => clearTimeout(timer);
        }
    }, [errorAlert]);

    const timeAgo = (timestamp) => {
        const now = new Date();
        const postDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - postDate) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInSeconds / 3600);
        const diffInDays = Math.floor(diffInSeconds / 86400);

        if (diffInMinutes < 60) return `${diffInMinutes} דקות`;
        if (diffInHours < 24) return `${diffInHours} שעות`;
        if (diffInDays < 365) return `${diffInDays} ימים`;
        return `יותר משנה`;
    };

    const fetchToProfile = async (userId) => {
        try {
            await getOneUser(userId);
            navigate(`/profile/${userId}`);
        } catch (err) {
            console.error("Error fetching user", err);
        }
    };

    const toggleComments = () => {
        setPost(prev => ({ ...prev, showComments: !prev.showComments }));
    };

    const addCommentToPost = async () => {
        if (!comment.trim()) return;

        try {
            if (loggedInUser.userId === "guest") {
                setErrorAlert("משתמש לא מחובר");
                return;
            }
            const res = await addComment(post._id, comment, loggedInUser.userId);
            const newComment = res.data;
            setPost(prev => ({
                ...prev,
                comments: [...prev.comments, newComment]
            }));
            setComment('');
        } catch (err) {
            console.error('error adding comment', err);
            setErrorAlert(err.response.data.message || "שגיאה");
        }
    };

    const addPostToFavoritePosts = async (postId, userId) => {
        try {
            await addToFavoritePosts(postId, userId);
            setShowFavoritePostAlert(true);
        } catch (err) {
            console.error("faild to add post to favorites", err);
            setErrorAlert(err.response.data.message || "שגיאה");
        }
    }

    const handleCloseFavoritePostAlert = () => {
        setShowFavoritePostAlert(false);
    };

    const toggleLike = async (postId) => {
        let userId = loggedInUser.userId;
        try {
            if (userId === "guest") {
                setErrorAlert("משתמש לא מחובר");
                return;
            }
            const res = await toggleLikePost(userId, postId);
            setPost(prev => ({ ...prev, likes: res.data.likes }));

            setLikedPosts(prev => ({ ...prev, [postId]: res.data.liked }));
        } catch (err) {
            console.error("failed to like post", err);
            setErrorAlert(err.response.data.message || "שגיאה");
        }
    };

    if (!post) {
        return <div className="profilePage" id='noUserLogged'>
            <img src={display_loading} className='noPostDisplay' alt="תצוגה לא זמינה" />
            <strong>תצוגה נטענת...</strong>
        </div>
    }

    return (
        <div className='singlePost_body'>
            {showFavoritePostAlert && (
                <div className="favorite-alert-wrapper" onClick={handleCloseFavoritePostAlert}>
                    <div className="overlay-background"></div>
                    <FavoritePostAlert onClose={handleCloseFavoritePostAlert} />
                </div>
            )}

            {errorAlert && <DynamicErrorAlert errorText={errorAlert} />}

            <div className="grid-item" id='single_post' key={post._id}>
                <div className="top_post">
                    <div className="userName_txt" id="categoryPart">
                        <img src={categoryIcon} className="categoryIcon" alt="קטגורייה" />
                        <p className="category_txt">{post.category}</p>
                    </div>
                    <div className="userName_txt">
                        <p id="userName_txt">{post.userId?.userName}</p>
                        <div onClick={() => fetchToProfile(post.userId?._id)}>
                            {post.userId?.profilePicture ? (
                                <img src={post.userId.profilePicture} className="profile_Picture" alt="תמונת פרופיל" />
                            ) : (
                                <div className="avatar-fallback" id="avatar-fallback_feed">
                                    {(post.userId?.userName || 'אורח').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <p className="postingDate_txt">לפני {timeAgo(post.postingDate)}</p>
                <p className={`item-content ${!post.imagePost && post.content.length <= 100 ? "noImageInPost" : ""}`}
                    style={{ backgroundColor: post.backgroundColor }}>
                    {post.content}</p>
                {post.imagePost && post.imagePost.trim() !== "" && (
                    post.imagePost.endsWith('.mp4') ? (
                        <video className="post-image" src={post.imagePost} autoPlay loop playsInline controls />
                    ) : (
                        <img src={post.imagePost} className="post-image" alt="תמונת פוסט" />
                    )
                )}

                <div className="item-likes-comments">
                    <p tabIndex="0" className="comments" onClick={() => toggleComments(post._id)}>
                        <span>{post.comments.length} תגובות</span>
                        <img src={commentIcon}
                            alt="תגובות"
                            className="comment-icon" />
                    </p>
                    <p className="favorite">
                        <span>מועדף</span>
                        <img src={starIcon}
                            alt="מועדפים"
                            className="star-icon"
                            onClick={() => addPostToFavoritePosts(post._id, loggedInUser.userId)} />
                    </p>
                    <p className="likes">
                        <span>{post.likes?.length || 0} לייקים</span>
                        <img
                            src={likedPosts[post._id] ? fill_likeIcon : empty_likeIcon}
                            alt="לייקים"
                            className="like-icon"
                            onClick={() => toggleLike(post._id)}
                        />
                    </p>
                </div>

                {post.showComments && (
                    <>
                        <div id="border-top"></div>
                        <div className="addComment">
                            <button className="send-comment-btn" onClick={addCommentToPost}><FaPaperPlane /></button>
                            <input
                                type="text"
                                placeholder="הוסף תגובה..."
                                value={comment}
                                className="comment-input"
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <div onClick={() => fetchToProfile(loggedInUser.userId)}>
                                {loggedInUser.profilePictureUser ? (
                                    <img src={loggedInUser.profilePictureUser} className="userUrlInCommentInput" alt="תמונת פרופיל" />
                                ) : (
                                    <div className="avatar-fallback" id="avatar-fallback_inSinglePost">
                                        {(loggedInUser.userName || 'אורח').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {post.comments.map((comment) => (
                            <div className="comment" key={comment._id}>
                                <div className="comment-header">
                                    <p className="comment-avatar" />
                                    <div className="comment-details">
                                        <span className="comment-date">לפני {timeAgo(comment.commentDate)}</span>
                                        <div className="userDeatails_comment">
                                            <span className="comment-author">{comment.userId?.userName}</span>
                                            <div onClick={() => fetchToProfile(comment.userId?._id)}>
                                                {comment.userId?.profilePicture ? (
                                                    <img src={comment.userId.profilePicture} className="userUrlInComment" alt="תמונת פרופיל" />
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
        </div>
    );
};
