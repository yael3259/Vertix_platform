import "../styles/LeaderBoard.css";
import { getAllUsers } from "../routes/UserAPI";
import { useEffect, useState } from "react";
import { getOneUser } from "../routes/UserAPI";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { he } from 'date-fns/locale';
import goldMedal from "../files/icons/gold-medal.png";
import silverMedal from "../files/icons/silver-medal.png";
import bronzeMedal from "../files/icons/bronze-medal.png";
import gem from "../files/icons/gem.png";
import { useUserContext } from "../contexts/UserContext";



export const LeaderBoard = () => {
    const [arrUsers, setArrUsers] = useState([]);
    const [timeLeftText, setTimeLeftText] = useState('');
    const { user: loggedInUser } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllUsers();
        updateTimeUntilNextTag();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const res = await getAllUsers();
            const sorted = res.data.sort((a, b) => b.points - a.points);
            setArrUsers(sorted);

        } catch (err) {
            console.error("failed to fetch users", err);
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

    const updateTimeUntilNextTag = () => {
        const now = new Date();
        const day = now.getDay(); // 0 = יום ראשון
        const hour = now.getHours();

        let daysUntilSunday = (7 - day) % 7;
        if (day === 0 && hour < 19) {
            daysUntilSunday = 0;
        } else if (day === 0 && hour >= 19) {
            daysUntilSunday = 7;
        }

        const nextSundayAt19 = new Date(now);
        nextSundayAt19.setDate(now.getDate() + daysUntilSunday);
        nextSundayAt19.setHours(19, 0, 0, 0);

        const formatted = formatDistanceToNow(nextSundayAt19, {
            addSuffix: true,
            locale: he
        });

        setTimeLeftText(`המדליות לטופ 3 יחולקו ${formatted}`);
    };

    return (
        <div className="leaderboardForm">
            <div className="leaderboard-container">
                <p className="board_title">לוח המובילים</p>
                {timeLeftText && <p className="timeLeftToTags">{timeLeftText}</p>}
                <div className="leaderboard-list">
                    {arrUsers.map((user, i) => (
                        <div key={user._id} className={`leaderboard-item rank-${i}`} id={user._id === loggedInUser.userId ? 'currentUserInList' : ''} onClick={() => fetchToProfile(user._id)}>
                            <div className="userSection">
                                {user.profilePicture ? (
                                    <img
                                        className="userPicInBoard"
                                        src={user.profilePicture}
                                        alt="תמונת פרופיל"
                                        loading="lazy" />
                                ) : (
                                    <div className="avatar-fallback" id="avatar-fallback_inBoard">
                                        {(user.userName || 'אורח').charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="nameAndPoints">
                                    <p className="username_inBoard">{user.userName}</p>
                                    <div className="points_con">
                                        <img src={gem} className="gemIcon" alt="יהלום" />
                                        <p className="points_inBoard">{user.points ? user.points : 0} נקודות</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rank-badge">{getMedal(i)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export const getMedal = (index) => {
    switch (index) {
        case 0:
            return <img src={goldMedal} className="top3" alt="מדליית זהב" />;
        case 1:
            return <img src={silverMedal} className="top3" alt="מדליית כסף" />;
        case 2:
            return <img src={bronzeMedal} className="top3" alt="מדליית ארד" />;
        default:
            return `${index + 1}`;
    }
};