import React, { useState, useEffect } from "react";
import "../styles/Feed.css";
import { useNavigate } from "react-router-dom";
import { getAllPosts, addComment } from "../routes/PostAPI";
import { getRandomUsers } from "../routes/UserAPI";
import commentIcon from "../files/icons/commentIcon.png";
import likeIcon from "../files/icons/likeIcon.png";
import clicked_likeIcon from "../files/icons/clicked_likeIcon.png";
import starIcon from "../files/icons/starIcon.png";
import categoryIcon from "../files/icons/categoryIcon.png";
import empty_likeIcon from "../files/icons/empty_likeIcon.png";
import fill_likeIcon from "../files/icons/fill_likeIcon.png";
import { FaPaperPlane } from 'react-icons/fa';
import { useUserContext } from '../contexts/UserContext';



export const Feed = () => {
    const [arr, setArr] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [randomUsers, setRandomUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [comment, setComment] = useState('');
    // const [likeUrl, setLikeUrl] = useState('');
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [likedPosts, setLikedPosts] = useState({});



    useEffect(() => {
        loadPosts(page, searchText);
        loadRandomUsers();
    }, [page, searchText]);


    const loadPosts = (currentPage, searchText = '') => {
        setLoading(true);

        getAllPosts(currentPage, 15, searchText)
            .then((res) => {
                console.log(res.data);
                const postsWithFlag = res.data.map(post => ({
                    ...post,
                    showComments: false
                }));

                const sortedPosts = postsWithFlag.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));

                if (currentPage === 1) {
                    setArr(sortedPosts);
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

        } catch (err) {
            console.log('error adding comment', err);
        }
    };

    const toggleLike  = async (postId) => {
        setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId]}));
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

    const linkToAddPostForm = () => {
        navigate("/addPost");
    }

    return (
        <div className="feed_page">
            <div className="feed_layout">
                <div className="left">
                    <p>הצגת פוסטים לפי</p>
                    <p>תאריך</p>
                    <p>קטגוריות</p>
                    <p>משתמש</p>
                </div>
                <div className="feed_part" >
                    <div className="addpost_feed" onClick={() => { linkToAddPostForm() }}>צור פוסט חדש</div>

                    {arr.map((item) => (
                        <div className="grid-item" key={item._id} >
                            <div className="top_post">
                                <div className="userName_txt" id="categoryPart">
                                    <img src={categoryIcon} className="categoryIcon" />
                                    <p className="category_txt">{item.category}</p>
                                </div>
                                <div className="userName_txt">
                                    <p id="userName_txt">{item.userId?.userName}</p>
                                    <img src={item.userId?.profilePicture ||
                                        "https://cdn-icons-png.freepik.com/256/12522/12522481.png?ga=GA1.1.1754982332.1740749915&semt=ais_hybrid"
                                    } className="profile_Picture" />
                                </div>
                            </div>
                            <p className="postingDate_txt">לפני {timeAgo(item.postingDate)}</p>
                            <p className="item-content" style={{ backgroundColor: item.backgroundColor }}>{item.content}</p>
                            {item.imagePost && item.imagePost.trim() !== "" && (
                                item.imagePost.endsWith('.mp4') ? (
                                    <video
                                        className="post-image"
                                        src={item.imagePost}
                                        autoPlay
                                        loop
                                        playsInline
                                        controls
                                    />
                                ) : (
                                    <img src={item.imagePost} className="post-image" />
                                )
                            )}

                            <div className="item-likes-comments">
                                <p className="likes">
                                    {/* <img src={fill_likeIcon} alt="like icon" className="like-icon" onClick={() => Clicked_like} /> */}
                                    <img
                                        src={likedPosts[item._id] ? fill_likeIcon : empty_likeIcon}
                                        alt="like icon"
                                        className="like-icon"
                                        onClick={() => toggleLike(item._id)}
                                    />
                                    <span>{item.likes} לייקים</span>
                                </p>
                                <p className="favorite">
                                    מועדף
                                    <img src={starIcon} alt="star icon" className="star-icon" />
                                </p>
                                <p tabIndex="0" className="comments"
                                    onClick={() => toggleComments(item._id)}>
                                    <img src={commentIcon} alt="comment icon" className="comment-icon" />
                                    <span> {item.comments.length} תגובות</span>
                                </p>
                            </div>

                            {item.showComments && (
                                <>
                                    <div id="border-top"></div>
                                    <div className="addComment">
                                        <button className="send-comment-btn" onClick={() => addCommentToPost(item._id, comment)}><FaPaperPlane /></button>
                                        <input
                                            type="text"
                                            placeholder="הוסף תגובה..."
                                            value={comment}
                                            className="comment-input"
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <img src={user.profilePictureUser} className="userUrlInCommentInput" />
                                    </div>

                                    {item.comments.map((comment) => (
                                        <div className="comment" key={comment._id}>
                                            <div className="comment-header">
                                                <p className="comment-avatar" />
                                                <div className="comment-details">
                                                    <span className="comment-date">לפני {(timeAgo(comment.commentDate))}</span>
                                                    <div className="userDeatails_comment">
                                                        <span className="comment-author">{comment.userId?.userName}</span>
                                                        <img
                                                            // src={"https://cdn-icons-png.freepik.com/256/12522/12522481.png?ga=GA1.1.1754982332.1740749915&semt=ais_hybrid"}
                                                            src={comment.userId?.profilePicture} className="userUrlInComment"
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
                    ))}

                    <div className="load-more">
                        <button onClick={LoadMorePosts} disabled={loading} className="load-button">
                            {loading ? <div className="spinner" /> : "טען עוד"}
                        </button>
                    </div>
                </div>
                <div className="right">
                    <p className="right-title">הוסף חברים חדשים</p>
                    <div className="random-users">
                        {randomUsers.length > 0 ? (
                            randomUsers.map((user, index) => (
                                <div key={index} className="random-user">
                                    <button className="add-friend-btn">+</button>
                                    <p className="name_to_connect">{user.userName}</p>
                                    <img
                                        src={user.profilePicture}
                                        className="profile_Picture"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://cdn-icons-png.freepik.com/256/12522/12522481.png";
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>טוען משתמשים</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
