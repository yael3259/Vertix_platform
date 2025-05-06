import React, { useState, useEffect } from "react";
import "../styles/Feed.css";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../routes/PostAPI";
import { getRandomUsers } from "../routes/UserAPI";
import comment from "../files/icons/comment.png";
import like from "../files/icons/like.png";
import clicked_like from "../files/icons/clicked_like.png";
import star from "../files/icons/star.png";
import category from "../files/icons/category.png";
import { FaPaperPlane } from 'react-icons/fa';
import { useUserContext } from '../contexts/UserContext';



export const Feed = () => {
    const [arr, setArr] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [randomUsers, setRandomUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const { user } = useUserContext();


    useEffect(() => {
        loadPosts(page, searchText);
        loadRandomUsers();
    }, [page, searchText]);


    const loadPosts = (currentPage, searchText = '') => {
        setLoading(true);
        getAllPosts(currentPage, 15, searchText)
            .then((res) => {
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
                                    <img src={category} className="categoryIcon" />
                                    <p className="category_txt">{item.category}</p>
                                </div>
                                <div className="userName_txt">
                                    <p>שם משתמש</p>
                                    <img src="https://cdn-icons-png.freepik.com/256/12522/12522481.png?ga=GA1.1.1754982332.1740749915&semt=ais_hybrid" className="profile_Picture" />

                                    {/* <img
                                        src={user.profilePictureUser && user.profilePictureUser.trim() !== "" ? user.profilePictureUser : "https://path.to/default-image.png"}
                                        className="profile_Picture"
                                    /> */}
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
                                    <img src={like} alt="like icon" className="like-icon" />
                                    <span>{item.likes} לייקים</span>
                                </p>
                                <p className="favorite">
                                    מועדף
                                    <img src={star} alt="star icon" className="star-icon" />
                                </p>
                                <p tabIndex="0" className="comments"
                                    onClick={() => toggleComments(item._id)}>
                                    <img src={comment} alt="comment icon" className="comment-icon" />
                                    <span> {item.comments.length} תגובות</span>
                                </p>
                            </div>

                            {item.showComments && (
                                <>
                                    <div id="border-top"></div>
                                    <div className="addComment">
                                        <button className="send-comment-btn"><FaPaperPlane /></button>
                                        <input
                                            type="text"
                                            placeholder="הוסף תגובה..."
                                            className="comment-input"
                                        />
                                        <img src={user.profilePictureUser} className="userUrlInComments" />
                                    </div>

                                    {item.comments.map((comment) => (
                                        <div className="comment" key={comment._id}>
                                            <div className="comment-header">
                                                <p className="comment-avatar" />
                                                <div className="comment-details">
                                                    <span className="comment-date">לפני {(timeAgo(comment.commentDate))}</span>
                                                    <div className="userDeatails_comment">
                                                        <span className="comment-author">yael</span>
                                                        <img
                                                            src={"https://cdn-icons-png.freepik.com/256/12522/12522481.png?ga=GA1.1.1754982332.1740749915&semt=ais_hybrid"}
                                                            alt=""
                                                            className="comment-author"
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
