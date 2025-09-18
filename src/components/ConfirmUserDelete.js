import "../styles/ConfirmUserDelete.css";

export const ConfirmUserDelete = ({ user, onDelete, onClose }) => {
    let userName = user.userName;
    let userId = user._id;

    return (
        <div className="overlayDeleteUser">
            <div className="confirm-box">
                <p>{userName} ת/ימחק לצמיתות מהמערכת</p>
                <div className="optionsButtons">
                    <button className="deleteUser" onClick={() => onDelete(userId)}>אישור</button>
                    <button className="cancelDeleteUser" onClick={onClose}>ביטול</button>
                </div>
            </div>
        </div>
    );
};
