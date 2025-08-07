import { useEffect, useState } from "react";
import "../../styles/user/NetworkList.css";
import { useUserContext } from "../../contexts/UserContext";
import { getFollowing, getOneUser, removeFriendFromNetwork } from "../../routes/UserAPI";
import { useParams, useNavigate } from "react-router-dom";
import { DynamicErrorAlert } from '../../components/DynamicErrorAlert';



export const NetworkList = () => {
    const [followingList, setFollowingList] = useState([]);
    const [errorAlert, setErrorAlert] = useState(null);
    const { user: loggedInUser } = useUserContext();
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            getFollowingList(userId);
        }
    }, [userId]);

    const getFollowingList = async (id) => {
        try {
            const res = await getFollowing(id);
            setFollowingList(res.data.following || []);
        } catch (err) {
            console.error("Error fetching following list", err);
        }
    }

    const fetchToProfile = async (userId) => {
        try {
            let res = await getOneUser(userId);
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

    return (
        <div className="following-page">
            { errorAlert && <DynamicErrorAlert errorText={errorAlert} /> }

            <div className="following-container">
                <h2 className="following-title">החברים שאני עוקב/ת אחריהם</h2>
                {followingList.length === 0 ? (
                    <p className="following-empty">אין לך עדיין חברים</p>
                ) : (
                    <div className="following-list">
                        {followingList.map((friend) => (
                            <div key={friend._id} className="following-card">
                                <div onClick={() => fetchToProfile(friend?._id)}>
                                    {friend.profilePicture ? (
                                        <img src={friend.profilePicture} className="following-avatar" />
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
