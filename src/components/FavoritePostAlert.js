import "../styles/FavoritePostAlert.css";
import favoritPost from "../files/icons/favoritPost.gif";


export const FavoritePostAlert = ({ onClose }) => {
    return (
        <div className="favorite-overlay">
            <div className="favorite-modal">
                <button className="favorite-close" onClick={onClose}>×</button>
                <div className="favorite-description">
                    <strong>הפוסט נוסף למועדפים</strong>
                    <span className="favorite-subtext">
                        תוכל/י לצפות בו בפרופיל שלך
                        <img src={favoritPost} className="favoritePostIcon" alt="פוסט מועדף" />
                    </span>
                </div>
            </div>
        </div>
    );
};
