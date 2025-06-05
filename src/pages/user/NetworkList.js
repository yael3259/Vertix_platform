// import { useEffect, useState } from "react";
// import "../../styles/user/NetworkList.css";
// import { useUserContext } from "../../contexts/UserContext";
// import { getFollowing } from "../../routes/UserAPI";
// import { useParams } from "react-router-dom";


// export const NetworkList = () => {
//     const [followingList, setFollowingList] = useState([]);
//     const [userNetwork, setUserNetwork] = useState(null);
//     const { user: loggedInUser } = useUserContext();
//     const { userId } = useParams();

//     useEffect(() => {
//         if (user?.userId) {
//             getFollowingList();
//         }
//     }, [user]);

//     const getFollowingList = async () => {
//         try {
//             const res = await getFollowing(user.userId);
//             setFollowingList(res.data.following || []);
//         } catch (err) {
//             console.error("Error fetching following list", err);
//         }
//     };

//     return (
//         <div className="following-page">
//             <div className="following-container">
//                 <h2 className="following-title">החברים שאני עוקב/ת אחריהם</h2>
//                 {followingList.length === 0 ? (
//                     <p className="following-empty">אין לך עדיין חברים</p>
//                 ) : (
//                     <div className="following-list">
//                         {followingList.map((friend) => (
//                             <div key={friend._id} className="following-card">
//                                 <img src={friend.profilePicture} className="following-avatar" />
//                                 <div className="following-info">
//                                     <h3>{friend.userName}</h3>
//                                     <p>{friend.nickname}</p>
//                                 </div>
//                                 <button className="unfollow-btn">הסרת מעקב</button>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };


import { useEffect, useState } from "react";
import "../../styles/user/NetworkList.css";
import { useUserContext } from "../../contexts/UserContext";
import { getFollowing } from "../../routes/UserAPI";
import { useParams } from "react-router-dom";


export const NetworkList = () => {
    const [followingList, setFollowingList] = useState([]);
    const [userNetwork, setUserNetwork] = useState(null);
    const { user: loggedInUser } = useUserContext();
    const { userId } = useParams();

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
    };

    return (
        <div className="following-page">
            <div className="following-container">
                <h2 className="following-title">החברים שאני עוקב/ת אחריהם</h2>
                {followingList.length === 0 ? (
                    <p className="following-empty">אין לך עדיין חברים</p>
                ) : (
                    <div className="following-list">
                        {followingList.map((friend) => (
                            <div key={friend._id} className="following-card">
                                <img src={friend.profilePicture} className="following-avatar" />
                                <div className="following-info">
                                    <h3>{friend.userName}</h3>
                                    <p>{friend.nickname}</p>
                                </div>
                                {userId === loggedInUser.userId &&
                                    <button className="unfollow-btn">הסרת מעקב</button>
                                }
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
