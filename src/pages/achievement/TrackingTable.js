import { useEffect, useState } from "react";
import "../../styles/achievement/TrackingTable.css";
import { useUserContext } from "../../contexts/UserContext";
import { getAchievementByUser, updateTrackingTable } from "../../routes/AchievementAPI";
import { useParams } from "react-router-dom";
import { Typewriter } from 'react-simple-typewriter';
import fire from "../../files/icons/fire.png"
import ice_cube from "../../files/icons/ice_cube.png"



export const TrackingTable = () => {
    const [achievement, setAchievement] = useState(null);
    const { user } = useUserContext();
    const token = user.tokenUser;
    const { achievementId } = useParams();
    const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];


    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await getAchievementByUser(token, achievementId);
                setAchievement(res.data.achievement);
            } catch (err) {
                console.error("failed to get achievement", err);
            }
        };
        fetchTables();
    }, [token, achievementId]);


    const updateTodayInTable = async (isMarkedToday) => {
        try {
            await updateTrackingTable(achievementId, isMarkedToday);
            const res = await getAchievementByUser(token, achievementId);
            setAchievement(res.data.achievement);
            console.log("Cell in table updated successfully");
        }
        catch (err) {
            console.error("failed to update table", err);
        }
    };

    const divideToWeeks = (array) => {
        if (!Array.isArray(array))
            return [];
        const dividedWeeks = [];
        for (let i = 0; i < array.length; i += 7) {
            dividedWeeks.push(array.slice(i, i + 7))
        }
        return dividedWeeks;
    };

    const getDaysLeft = (array) => {
        if (!Array.isArray(array) || array.length === 0)
            return null;

        const today = new Date();
        const lastDay = new Date(array[array.length - 1].day);

        const diffInTime = lastDay.getTime() - today.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

        return diffInDays >= 0 ? diffInDays : 0;
    };


    return (
        <div className="trackingTablePage">
            {achievement ? (
                <div className="achievement-table">
                    <div className="achievementCard">
                        <p className="achievementText">
                            <Typewriter
                                words={[
                                    `🎯 המטרה שלי: \n ${achievement.description}`,
                                    `📅 נותרו ${getDaysLeft(achievement.trackingTable)} ימים לסיום`,
                                    `🍁 קטגוריה: \n ${achievement.category}`
                                ]}
                                loop={''}
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

                        <div className="scrollContainer">
                            <div className="weekDaysHeader">
                                {daysOfWeek.map((day, i) => (
                                    <div key={i} className="dayHeader">{day}</div>
                                ))}
                            </div>

                            <div className="trackingGrid">
                                {divideToWeeks(achievement.trackingTable).map((week, weekIndex) => (
                                    <div key={weekIndex} className="weekRow">
                                        {week.map((day, dayIndex) => {
                                            const isToday = new Date(day.day).toDateString() === new Date().toDateString();
                                            const isBeforeToday = new Date(day.day) < new Date(new Date().setHours(0, 0, 0, 0));

                                            return (
                                                <div
                                                    key={dayIndex}
                                                    className={`dayCell pastel${(dayIndex % 7) + 1}
        ${isToday ? "todayCell" : ""}
        ${isBeforeToday ? "pastDay" : ""}
        ${day.isMarkedToday ? "marked" : ""}
        ${day.isCompleted ? "completed" : ""}`}
                                                    title={new Date(day.day).toLocaleDateString()}
                                                    onClick={() => {
                                                        if (isToday) {
                                                            updateTodayInTable(!day.isMarkedToday);
                                                        }
                                                    }}
                                                >
                                                    {new Date(day.day).getDate()}
                                                    {/* אייקון לפי מצב */}
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
            ) : (
                <p>טבלה נטענת..</p>
            )}
        </div>
    );
};
