import { useEffect, useState } from "react";
import "../../styles/achievement/TrackingTable.css";
import { useUserContext } from "../../contexts/UserContext";
import { getAchievementByUser, getBoostByUser, updateTrackingTableAchievement, updateTrackingTableBoost } from "../../routes/AchievementAPI";
import { useParams } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import fire from "../../files/icons/fire.png";
import ice_cube from "../../files/icons/ice_cube.png";
import tableCompleted from "../../files/icons/tableCompleted.gif";
import failedBoost from "../../files/icons/failedBoost.gif";
import { EarningPointsAlert } from "../../components/EarningPointsAlert";



export const TrackingTable = () => {
    const [item, setItem] = useState(null);
    const [type, setType] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const { user } = useUserContext();
    const token = user.tokenUser;
    const { itemId } = useParams();
    const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    const [isTableActive, setIsTableActive] = useState(true);
    const [showPointsAlert, setShowPointsAlert] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resAchievement = await getAchievementByUser(token, itemId);
                setItem(resAchievement.data.achievement);
                setType("achievement");
                if (resAchievement.data.achievement.statusTable === "completed") {
                    setIsCompleted(true);
                }
            } catch (err1) {
                console.warn("Not an achievement. Trying boost");

                try {
                    const resBoost = await getBoostByUser(token, itemId);
                    setItem(resBoost.data.boost);
                    setType("boost");

                    if (resBoost.data.boost.statusTable === "completed") {
                        setIsCompleted(true);
                    }

                    if (resBoost.data.boost.statusTable === "failed") {
                        setIsFailed(true);
                        setIsTableActive(false);
                    } else if (resBoost.data.boost.isActive === false && resBoost.data.boost.statusTable !== "completed") {
                        setIsFailed(true);
                        setIsTableActive(false);
                    }

                }
                catch (err2) {
                    console.error("Item not found in either boosts or achievements");
                }
            }
        };

        fetchData();
    }, [token, itemId]);

    const updateTodayInAchievementTable = async (isMarkedToday) => {
        if (isCompleted || isFailed) {
            console.log("Cannot update a completed or failed boost/achievement.");
            return;
        }

        try {
            if (type === "achievement") {
                const res = await updateTrackingTableAchievement(itemId, isMarkedToday);
                setItem(res.data);
                if (isMarkedToday === true) {
                    setShowPointsAlert(true);
                }
            }

            else if (type === "boost") {
                const res = await updateTrackingTableBoost(itemId, isMarkedToday);
                console.log(res.data)
                setItem(res.data);
                if (isMarkedToday === true) {
                    setShowPointsAlert(true);
                }
            }
            console.log("הטבלה עודכנה בהצלחה");

        } catch (err) {
            console.error("failed to update table", err);
        }
    };

    const divideToWeeks = (array) => {
        if (!Array.isArray(array)) return [];
        const weeks = [];
        for (let i = 0; i < array.length; i += 7) {
            weeks.push(array.slice(i, i + 7));
        }
        return weeks;
    };

    const getDaysLeft = (array) => {
        if (!Array.isArray(array) || array.length === 0) return null;
        const today = new Date();
        const lastDay = new Date(array[array.length - 1].day);
        const diffInTime = lastDay.getTime() - today.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
        return diffInDays >= 0 ? diffInDays : 0;
    };

    const handleClosePointsAlert = () => {
        setShowPointsAlert(false);
    };

    if (!user) return <p>משתמש לא מחובר</p>;
    if (!item || !type) return <p>טוען...</p>;

    return (
        <div className="trackingTablePage">
            {showPointsAlert && <div className="overlay-background" onClick={() => {
                setShowPointsAlert(false);
            }}></div>}
            {showPointsAlert && <EarningPointsAlert onClose={handleClosePointsAlert} type={type} />}

            <div className="achievement-table">
                <div className="achievementCard">
                    <p className="achievementText">
                        <Typewriter
                            words={[
                                type === "boost" ? "⚡ בוסט ⚡\n כיף שהצטרפת! זה הזמן לבדוק כמה רחוק את/ה באמת מסוגל/ת להגיע." : "",
                                `🎯 המטרה שלי: \n ${item.description}`,
                                `📅 נותרו ${getDaysLeft(item.trackingTable)} ימים לסיום`,
                                `🍁 קטגוריה: \n ${item.category}`,
                            ]}
                            loop={""}
                            cursor
                            cursorStyle="|"
                            typeSpeed={50}
                            deleteSpeed={0}
                            delaySpeed={3000}
                        />
                    </p>
                </div>

                <div className="tableCard">
                    <h3>טבלת מעקב</h3>
                    {isCompleted && (
                        <>
                            <div className="goldenCelebration" />
                            <img src={tableCompleted} alt="trophy" className="trophyGifFixed" />
                            <p className="completionText">כל הכבוד! ההישג הושלם בהצלחה!</p>
                        </>
                    )}

                    {isFailed && !isCompleted && (
                        <>
                            <div className="failedOverlay" />
                            <img src={failedBoost} alt="failed" className="failedStampGif" />
                            <p className="failedText">פספסת יום. נסה/י שוב בשבוע הבא</p>
                        </>
                    )}

                    <div className="scrollContainer">
                        <div className="weekDaysHeader">
                            {daysOfWeek.map((day, i) => (
                                <div key={i} className="dayHeader">{day}</div>
                            ))}
                        </div>

                        <div className="trackingGrid">
                            {divideToWeeks(item.trackingTable).map((week, weekIndex) => (
                                <div key={weekIndex} className="weekRow">
                                    {week.map((day, dayIndex) => {
                                        const isToday =
                                            new Date(day.day).toDateString() === new Date().toDateString();
                                        const isBeforeToday =
                                            new Date(day.day) < new Date(new Date().setHours(0, 0, 0, 0));

                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`dayCell pastel${(dayIndex % 7) + 1}
                                                    ${isToday ? "todayCell" : ""}
                                                    ${isBeforeToday ? "pastDay" : ""}
                                                    ${day.isMarkedToday ? "marked" : ""}
                                                    ${day.isCompleted ? "completed" : ""}
                                                    ${isFailed ? "disabledCell" : ""} `}
                                                id={isCompleted ? "achievementCompletedStyle" : ""}
                                                title={new Date(day.day).toLocaleDateString()}
                                                onClick={() => {
                                                    // **מניעת קליק אם הטבלה לא פעילה**
                                                    if (isToday && isTableActive) updateTodayInAchievementTable(!day.isMarkedToday);
                                                }}
                                            >
                                                {new Date(day.day).getDate()}
                                                {day.isMarkedToday ? (
                                                    <img src={fire} alt="marked" className="icons_in_cell" />
                                                ) : (
                                                    isBeforeToday && (
                                                        <img src={ice_cube} alt="not-marked" className="icons_in_cell" />
                                                    )
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};