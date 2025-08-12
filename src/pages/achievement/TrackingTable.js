import { useEffect, useState } from "react";
import "../../styles/achievement/TrackingTable.css";
import { useUserContext } from "../../contexts/UserContext";
import { getAchievementByUser, getBoostByUser, updateTrackingTableAchievement, updateTrackingTableBoost } from "../../routes/AchievementAPI";
import { useParams, NavLink } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import fire from "../../files/icons/fire.png";
import ice_cube from "../../files/icons/ice_cube.png";
import tableCompleted from "../../files/icons/tableCompleted.gif";
import failedBoost from "../../files/icons/failedBoost.gif";
import errorInDisplay from "../../files/icons/errorInDisplay.png";
import { EarningPointsAlert } from "../../components/EarningPointsAlert";
import { DynamicErrorAlert } from '../../components/DynamicErrorAlert';



export const TrackingTable = () => {
    const [item, setItem] = useState(null);
    const [type, setType] = useState(null);
    const [errorAlert, setErrorAlert] = useState(null);
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

    useEffect(() => {
        if (errorAlert) {
            const timer = setTimeout(() => setErrorAlert(null), 5500);
            return () => clearTimeout(timer);
        }
    }, [errorAlert]);

    const updateTodayInAchievementTable = async (isMarkedToday) => {
        if (isCompleted || isFailed) {
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
                setItem(res.data);
                if (isMarkedToday === true) {
                    setShowPointsAlert(true);
                }
            }
        } catch (err) {
            console.error("failed to update table", err);
            setErrorAlert(err.response.data.message || "שגיאה");
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

    if (!item || !type) {
        return <div className="trackingTablePage" id='noUserLogged'>
            <img src={errorInDisplay} className="no-display-icon" alt="תצוגה לא זמינה" />
            <strong>שגיאה</strong>
            <p>נסה/י להתחבר שוב <NavLink to="/login" id='linkToLogin'>כאן</NavLink> כדי לסמן ולצפות בהישגים</p>
        </div>
    }

    return (
        <div className="trackingTablePage">
            {showPointsAlert && <div className="overlay-background" onClick={() => {
                setShowPointsAlert(false);
            }}></div>}

            {showPointsAlert && <EarningPointsAlert onClose={handleClosePointsAlert} type={type} />}
            {errorAlert && <DynamicErrorAlert errorText={errorAlert} />}

            <div className="achievement-table">
                <div className="achievementCard">
                    <p className="achievementText">
                        <Typewriter
                            words={[
                                type === "boost" ? "⚡ בוסט ⚡\n כיף שהצטרפת! זה הזמן לבדוק כמה רחוק את/ה באמת מסוגל/ת להגיע." : "\nהישג הוא ההוכחה שכשאת/ה מאמין/ה באמת, גם הדברים הכי גדולים מתחילים בצעד קטן",
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
                            <img src={tableCompleted} alt="גביע זהב" className="trophyGifFixed" />
                            <p className="completionText">כל הכבוד! ההישג הושלם בהצלחה!</p>
                        </>
                    )}

                    {isFailed && !isCompleted && (
                        <>
                            <div className="failedOverlay" />
                            <img src={failedBoost} alt="שעון חול" className="failedStampGif" />
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
                                                    <img src={fire} alt="אש" className="icons_in_cell" />
                                                ) : (
                                                    isBeforeToday && (
                                                        <img src={ice_cube} alt="קרח" className="icons_in_cell" />
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