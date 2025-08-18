import { useEffect, useState } from "react";
import "../../styles/user/NetworkList.css";
import { useUserContext } from "../../contexts/UserContext";
import { getFollowing, getOneUser, removeFriendFromNetwork } from "../../routes/UserAPI";
import { useParams, useNavigate } from "react-router-dom";
import { DynamicErrorAlert } from '../../components/DynamicErrorAlert';
import noFriends from "../../files/icons/noFriends.png";



export const NetworkList = () => {
    const [followingList, setFollowingList] = useState([]);
    const [errorAlert, setErrorAlert] = useState(null);
    const { user: loggedInUser } = useUserContext();
    const { userId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            getFollowingList(userId);
        }
    }, [userId]);

    useEffect(() => {
        if (errorAlert) {
            const timer = setTimeout(() => setErrorAlert(null), 5500);
            return () => clearTimeout(timer);
        }
    }, [errorAlert]);

    const getFollowingList = async (id) => {
        try {
            const res = await getFollowing(id);
            setFollowingList(res.data.following || []);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching following list", err);
        }
    }

    const fetchToProfile = async (userId) => {
        try {
            await getOneUser(userId);
            navigate(`/profile/${userId}`);
        }
        catch (err) {
            console.error("Error fetching user", err);
        }
    }

    const removeFollow = async (idOfFriend) => {
        const userId = loggedInUser.userId;

        try {
            await removeFriendFromNetwork(userId, idOfFriend);
            setFollowingList((prev) => prev.filter(friend => friend._id !== idOfFriend));
        } catch (err) {
            console.error("failed removing this user from network", err);
            setErrorAlert(err.response.data.message || "שגיאה");
        }
    }

    if (isLoading) {
        return <div className='loading-spinner' />
    }

    return (
        <div className="following-page">
            {errorAlert && <DynamicErrorAlert errorText={errorAlert} />}

            <div className="following-container">
                <h2 className="following-title">רשימת החברים</h2>
                {followingList.length === 0 ? (
                    <div id='noFriendsExists'>
                        <img src={noFriends} className="no-user-icon" alt="אין חברים" />
                        <strong>עדיין אין חברים</strong>
                    </div>
                ) : (
                    <div className="following-list">
                        {followingList.map((friend) => (
                            <div key={friend._id} className="following-card">
                                <div onClick={() => fetchToProfile(friend?._id)}>
                                    {friend.profilePicture ? (
                                        <img src={friend.profilePicture} className="following-avatar" alt="תמונת פרופיל" />
                                    ) : (
                                        <div className="avatar-fallback" id="avatar-fallback_network">
                                            {(friend.userName || 'אורח').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="following-info">
                                    <h3>{friend.userName}</h3>
                                    <p>{friend.nickname}</p>
                                </div>
                                {userId === loggedInUser.userId &&
                                    <button className="unfollow-btn" onClick={() => removeFollow(friend._id)}>הסרת מעקב</button>
                                }
                            </div>
                        )).reverse()}
                    </div>
                )}
            </div>
        </div>
    );
};
