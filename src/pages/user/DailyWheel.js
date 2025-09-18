import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import "../../styles/user/DailyWheel.css";
import { updateUserPoints } from "../../routes/UserAPI";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";



export const DailyWheel = () => {
    const [angle, setAngle] = useState(0);
    const [reward, setReward] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();
    const { user } = useUserContext();
    const userId = user.userId;

    const REWARDS = [
        { id: "points-25", label: `+25 נקודות`, description: "בונוס נקודות קטן", emoji: "🪙 " },
        { id: "points-50", label: "+50 נקודות", description: "בונוס נקודות גדול", emoji: "⭐ " },
        { id: "one-more-spin", label: "סיבוב נוסף", description: "סובב/י שוב את הגלגל", emoji: "❓ " },
        { id: "points-75", label: `+75 נקודות`, description: "בונוס נקודות ענק", emoji: "💰 " },
        { id: "points-25", label: `+25 נקודות`, description: "בונוס נקודות קטן", emoji: "🪙 " },
        { id: "one-more-spin", label: "סיבוב נוסף", description: "סובב/י שוב את הגלגל", emoji: "❓ " },
        { id: "emoji-fire", label: "אימוג'י", description: "אימוג'י להבה נוסף לתמונת הפרופיל שלך", emoji: "🔥 " },
        { id: "points-25", label: `+25 נקודות`, description: "בונוס נקודות קטן", emoji: "🪙 " },
        { id: "points-100", label: "+100 נקודות", description: "בונוס נדיר!", emoji: "💎 " }
    ];

    const radius = 150;
    const center = 160;

    const createSlicePath = (index, total) => {
        const sliceAngle = 360 / total;
        const startAngle = (sliceAngle * index - 90) * (Math.PI / 180);
        const endAngle = (sliceAngle * (index + 1) - 90) * (Math.PI / 180);

        const x1 = center + radius * Math.cos(startAngle);
        const y1 = center + radius * Math.sin(startAngle);

        const x2 = center + radius * Math.cos(endAngle);
        const y2 = center + radius * Math.sin(endAngle);

        return `M${center},${center} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`;
    };

    const spin = () => {
        if (spinning) return;

        setSpinning(true);
        const isSpin = localStorage.getItem("lastSpin");

        if (isSpin) {
            const lastSpinDate = new Date(isSpin);
            const today = new Date();
            if (
                lastSpinDate.getFullYear() === today.getFullYear() &&
                lastSpinDate.getMonth() === today.getMonth() &&
                lastSpinDate.getDate() === today.getDate()
            ) {
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 3000);
                return;
            }
        }

        const idx = Math.floor(Math.random() * REWARDS.length);
        const slice = 360 / REWARDS.length;
        const target = 360 * 5 + (idx * slice + slice / 2) - 90;

        setAngle(target);

        setTimeout(() => {
            const selectedReward = REWARDS[idx];
            setReward(selectedReward);

            if (selectedReward.id === "one-more-spin") {
                setSpinning(false);
                return;
            }
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setSpinning(false);

            localStorage.setItem("lastSpin", new Date().toISOString());
        }, 5000);
    };

    const applyReward = async (reward) => {
        if (reward.id === "one-more-spin") {
            return;
        }

        if (reward.id === "emoji-fire") {
            const date = new Date();
            const today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

            const data = {
                emoji: reward.emoji,
                day: today
            };

            localStorage.setItem(`${user.userId}_fireEmoji`, JSON.stringify(data));
            navigate(`/profile/${user.userId}`);
            return;
        }

        const pointsMap = {
            "points-25": 25,
            "points-50": 50,
            "points-75": 75,
            "points-100": 100
        };

        const points = pointsMap[reward.id];

        try {
            await updateUserPoints(userId, points);
            navigate(`/profile/${userId}`);
        } catch (err) {
            console.log("failed", err);
        }
    };

    return (
        <div className="wheel-page">
            {showMessage && <div className="spin-message">הסיבוב היומי שלך כבר נוצל! מחר תוכל/י לסובב שוב</div>}

            <h2 className="DailyWheelTitle">גלגל מזל יומי</h2>
            <div className="wheel-instruction">
                ✨ סובב/י את הרולטה עכשיו וגלה/י איזה פרס ממתין לך ✨
            </div>
            <div className="wheelAndResult-wrapper">
                <div className="wheel-container">
                    <motion.svg
                        width={320}
                        height={320}
                        viewBox="0 0 320 320"
                        animate={{ rotate: angle }}
                        transition={{ duration: 5, ease: "easeOut" }}
                        style={{ transformOrigin: "50% 50%" }}
                    >
                        {REWARDS.map((r, i) => (
                            <path
                                key={`${r.id}-${i}`}
                                d={createSlicePath(i, REWARDS.length)}
                                fill={`var(--c${i})`}
                            />
                        ))}

                        {REWARDS.map((r, i) => {
                            const sliceAngle = 360 / REWARDS.length;
                            // חישוב מיקום הטקסט בתוך הסלייס
                            const midAngleDeg = i * sliceAngle + sliceAngle / 2;
                            const midAngleRad = (midAngleDeg - 90) * (Math.PI / 180);
                            const x = center + (radius / 2) * Math.cos(midAngleRad);
                            const y = center + (radius / 2) * Math.sin(midAngleRad);
                            const dx = center - x;
                            const dy = center - y;
                            const rotation = Math.atan2(dy, dx) * (180 / Math.PI);

                            return (
                                <text
                                    key={`${r.id}-label-${i}`}
                                    x={x}
                                    y={y}
                                    fill="white"
                                    fontSize="18"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    transform={`rotate(${rotation}, ${x}, ${y})`}
                                >
                                    {r.label}
                                </text>
                            );
                        })}
                    </motion.svg>

                    <div className="pointer"></div>
                </div>

                <div className="spinButtonAndResult">
                    <button onClick={spin} disabled={spinning} className="spin-btn">
                        סובב/י את הגלגל
                    </button>

                    <AnimatePresence>
                        {reward && (
                            <div className="resultCard">
                                <motion.div
                                    className="reward-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="reward-label">{reward.label}</div>
                                    <div className="reward-emoji">{reward.emoji}</div>
                                    <div className="reward-desc">{reward.description}</div>
                                    {reward.id !== "one-more-spin" &&
                                        <button onClick={() => applyReward(reward)}>קבל/י פרס</button>}
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};