import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, addComment,addToFavoritePosts } from '../../routes/PostAPI';
import { getOneUser } from '../../routes/UserAPI';
import { useUserContext } from '../../contexts/UserContext';
import commentIcon from "../../files/icons/commentIcon.png";
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
    const { user } = useUserContext();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [likedPosts, setLikedPosts] = useState({});

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await getPostById(postId);
                setPost({ ...res.data, showComments: false });
            } catch (err) {
                console.error("failed to get post", err);
            }
        };
        fetchPost();
    }, [postId]);

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
            await getOneUser(userId); // אפשר למחוק את זה אם אין צורך בנתונים
            navigate(`/profile/${userId}`);
        } catch (err) {
            console.log("Error fetching user", err);
        }
    };

    const toggleComments = () => {
        setPost(prev => ({ ...prev, showComments: !prev.showComments }));
    };

    const addCommentToPost = async () => {
        if (!comment.trim()) return;
        try {
            const res = await addComment(post._id, comment, user.userId);
            const newComment = res.data;
            setPost(prev => ({
                ...prev,
                comments: [...prev.comments, newComment]
            }));
            setComment('');
        } catch (err) {
            console.log('error adding comment', err);
        }
    };

    const addPostToFavoritePosts = async (postId, userId) => {
        try {
            let res = await addToFavoritePosts(postId, userId);
            console.log("success", res.data);
        }
        catch (err) {
            console.log("faild to add post to favorites", err);
        }
    }

    const toggleLike = () => {
        setLikedPosts(prev => ({ ...prev, [post._id]: !prev[post._id] }));
    };

    if (!post) return <div>טוען פוסט...</div>;

    return (
        <div className="grid-item" id='single_post' key={post._id}>
            <div className="top_post">
                <div className="userName_txt" id="categoryPart">
                    <img src={categoryIcon} className="categoryIcon" />
                    <p className="category_txt">{post.category}</p>
                </div>
                <div className="userName_txt">
                    <p id="userName_txt">{post.userId?.userName}</p>
                    <img
                        src={post.userId?.profilePicture || "https://cdn-icons-png.freepik.com/256/12522/12522481.png"}
                        className="profile_Picture"
                        onClick={() => fetchToProfile(post.userId._id)}
                    />
                </div>
            </div>

            <p className="postingDate_txt">לפני {timeAgo(post.postingDate)}</p>
            <p className="item-content" style={{ backgroundColor: post.backgroundColor }}>{post.content}</p>

            {post.imagePost && post.imagePost.trim() !== "" && (
                post.imagePost.endsWith('.mp4') ? (
                    <video className="post-image" src={post.imagePost} autoPlay loop playsInline controls />
                ) : (
                    <img src={post.imagePost} className="post-image" />
                )
            )}

            <div className="item-likes-comments">
                <p tabIndex="0" className="comments" onClick={() => toggleComments(post._id)}>
                    <span>{post.comments.length} תגובות</span>
                    <img src={commentIcon} alt="comment icon" className="comment-icon" />
                </p>
                <p className="favorite">
                    <span>מועדף</span>
                    <img src={starIcon} className="star-icon" onClick={() => addPostToFavoritePosts(post._id, user.userId)} />
                </p>
                <p className="likes">
                    <span>{post.likes} לייקים</span>
                    <img
                        src={likedPosts[post._id] ? fill_likeIcon : empty_likeIcon}
                        alt="like icon"
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
                        <img
                            src={user.profilePictureUser}
                            className="userUrlInCommentInput"
                            onClick={() => fetchToProfile(user.userId)}
                        />
                    </div>

                    {post.comments.map((comment) => (
                        <div className="comment" key={comment._id}>
                            <div className="comment-header">
                                <p className="comment-avatar" />
                                <div className="comment-details">
                                    <span className="comment-date">לפני {timeAgo(comment.commentDate)}</span>
                                    <div className="userDeatails_comment">
                                        <span className="comment-author">{comment.userId?.userName}</span>
                                        <img
                                            src={comment.userId?.profilePicture}
                                            className="userUrlInComment"
                                            onClick={() => fetchToProfile(comment.userId._id)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};
