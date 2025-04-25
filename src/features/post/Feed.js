import React, { useState, useEffect } from "react";
import "./Feed.css";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "./postAPI";
import { getRandomUsers } from "../user/userAPI";
import { AddPostForm } from "./AddPost";
import comment from "./files/comment.png";
import like from "./files/like.png";
import star from "./files/star.png";
import category from "./files/category.png";



export const Feed = () => {
    const [arr, setArr] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [randomUsers, setRandomUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadPosts(page, searchText);
        loadRandomUsers();
    }, [page, searchText]);


    const loadPosts = (currentPage, searchText = '') => {
        setLoading(true);
        getAllPosts(currentPage, 15, searchText)
            .then((res) => {
                if (currentPage === 1) {
                    setArr(res.data.reverse());
                } else {
                    setArr((prevArr) => {
                        const newPosts = res.data.filter(post => !prevArr.some(existingPost => existingPost._id === post._id));
                        return [...prevArr, ...newPosts.reverse()];
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
        setArr(prevArr => prevArr.map(post => {
            if (post._id === postId) {
                return { ...post, showComments: !post.showComments };
            }
            return post;
        }));
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
                    {/* {loading ? (
                        <p className="loading">...טוען פוסטים</p>
                    ) : ( */}
                    {arr.map((item) => (
                        <div className="grid-item" key={item._id} >
                            {/* <div className="choosenColorByUser" style={{ backgroundColor: item.backgroundColor }}> */}
                            <div className="top_post">
                                <div className="userName_txt">
                                    <img src={category} className="categoryIcon" />
                                    <p className="category_txt">{item.category}</p>
                                </div>
                                <div className="userName_txt">
                                    <p>שם משתמש</p>
                                    <img src="https://cdn-icons-png.freepik.com/256/12522/12522481.png?ga=GA1.1.1754982332.1740749915&semt=ais_hybrid" className="profile_Picture" />

                                    {/* <img
                                        src={user.profilePicture && user.profilePicture.trim() !== "" ? user.profilePicture : "https://path.to/default-image.png"}
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
                            {/* </div> */}

                            <div className="item-likes-comments">
                                <p>
                                    לייקים {item.likes}
                                    <img src={like} alt="like icon" className="like-icon" />
                                </p>
                                <p>
                                    מועדף
                                    <img src={star} alt="star icon" className="star-icon" />
                                </p>
                                <p tabIndex="0"
                                    onClick={() => toggleComments(item._id)}>
                                    תגובות {item.comments.length}
                                    <img src={comment} alt="Comment icon" className="comment-icon" />
                                </p>
                            </div>

                            {item.showComments && item.comments.map((comment) => (
                                <div className="comment" key={comment._id}>
                                    <div className="comment-header">
                                        <p className="comment-avatar" />
                                        <div className="comment-details">
                                            <span className="comment-date">לפני {(timeAgo(comment.commentDate))}</span>
                                            <div className="userDeatails_comment">
                                                <span className="comment-author">yael</span>
                                                <img src={"https://cdn-icons-png.freepik.com/256/12522/12522481.png?ga=GA1.1.1754982332.1740749915&semt=ais_hybrid"} alt="" className="comment-author" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="comment-text">{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                    {/* )} */}
                    <div className="load-more">
                        <button onClick={() => setPage(page + 1)} disabled={loading}>טען עוד</button>
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
                                    {/* <img src={user.profilePicture || "https://cdn-icons-png.freepik.com/256/12522/12522481.png"} className="profile_Picture" /> */}
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
