import React from 'react';
import "../styles/FollowAlert.css";
import handshake from "../files/icons/handshake.png"



export const FollowAlert = ({ onClose, followedUserName }) => {

    function getRandomMessage() {
        const messages = [
            "החיבור נוצר – עכשיו מתחילים לעבוד יחד",
            "התחלת לעקוב אחרי חבר – וזה רק ההתחלה!",
            "שניים טובים מהאחד",
            "עם חברים כאלה, כל הישג אפשרי",
            "כל הישג טוב מתחיל מסביבה נכונה",
            "חיבור חדש נרשם – תנו לזה לרוץ!",
            "חבר היום – שותף להישגים מחר",
            "מהיום תראו אחד את הדרך של השני. כי השראה באה מחיבורים אמיתיים"
        ];

        const index = Math.floor(Math.random() * messages.length);
        return messages[index];
    }

    return (
        <div className="follow-overlay">
            <div className="follow-modal">
                <button className="follow-close" onClick={onClose}>×</button>
                <p className="follow-description">
                    <strong>את/ה עוקב/ת עכשיו אחרי {followedUserName}!</strong><br />
                    {getRandomMessage()} <img src={handshake} className="gemIconInProfile" id='gemSize' /><br />
                </p>
            </div>
        </div>
    );
};